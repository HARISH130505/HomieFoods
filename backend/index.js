const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or if in allowed list
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// MySQL Connection Pool for resilience and concurrency
let sslConfig = undefined;
const caPath = path.join(__dirname, 'ca.pem');
if (fs.existsSync(caPath)) {
  sslConfig = { ca: fs.readFileSync(caPath) };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'homiefoods',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(sslConfig ? { ssl: sslConfig } : {}),
});

// Initialize database tables if needed
const initDb = () => {
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      delivery_address TEXT NOT NULL,
      landmark VARCHAR(255),
      delivery_notes TEXT,
      total_amount DECIMAL(10, 2) NOT NULL,
      delivery_fee DECIMAL(10, 2) DEFAULT 30.00,
      payment_method VARCHAR(50) DEFAULT 'COD',
      payment_status VARCHAR(50) DEFAULT 'Pending on Delivery',
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      dish_id INT,
      dish_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  pool.query(createOrdersTable, (err) => {
    if (err) {
      console.warn('Orders table creation check failed (will fallback gracefully):', err.message);
    } else {
      console.log('✅ Orders table ready');
      pool.query(createOrderItemsTable, (itemErr) => {
        if (itemErr) console.warn('Order items table check warning:', itemErr.message);
        else console.log('✅ Order items table ready');
      });
    }
  });

  // Add location/coordinates columns one at a time (no IF NOT EXISTS — MySQL < 8.0 compatibility)
  const addColumn = (sql, label) => {
    pool.query(sql, (err) => {
      if (err && err.errno !== 1060) {
        // errno 1060 = ER_DUP_FIELDNAME: column already exists, safe to ignore
        console.warn(`⚠️ Could not add column "${label}":`, err.message);
      } else if (!err) {
        console.log(`✅ Column "${label}" added to restaurants`);
      }
    });
  };

  addColumn(`ALTER TABLE restaurants ADD COLUMN location VARCHAR(255) DEFAULT 'Chennai'`, 'location');
  addColumn(`ALTER TABLE restaurants ADD COLUMN latitude DECIMAL(10, 8) DEFAULT 13.0827`, 'latitude');
  addColumn(`ALTER TABLE restaurants ADD COLUMN longitude DECIMAL(11, 8) DEFAULT 80.2707`, 'longitude');
};

pool.getConnection((err, conn) => {
  if (err) {
    console.error('⚠️ Warning connecting to MySQL pool:', err.message);
  } else {
    console.log('✅ Connected to MySQL database pool');
    conn.release();
    initDb();
  }
});

// Basic root
app.get('/', (req, res) => res.send('HomieFoods backend running'));

// Create Chef + Restaurant
app.post('/chef', (req, res) => {
  const {
    chefName,
    kitchenName,
    specialty,
    experience,
    bio,
    chefImage,
    location = 'Chennai',
    latitude = 13.0827,
    longitude = 80.2707,
  } = req.body;

  const chefQuery = `INSERT INTO chefs (name, specialty, experience, bio, image) VALUES (?, ?, ?, ?, ?)`;
  pool.query(chefQuery, [chefName, specialty, experience, bio, chefImage], (err, chefResult) => {
    if (err) {
      console.error('Error inserting chef:', err);
      return res.status(500).json({ error: 'Failed to create chef' });
    }

    const chefId = chefResult.insertId;
    const restaurantQuery = `
      INSERT INTO restaurants (name, chef_id, cuisines, image, rating, delivery_time, distance, location, latitude, longitude) 
      VALUES (?, ?, ?, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600', 4.8, 30, 2, ?, ?, ?)
    `;

    pool.query(
      restaurantQuery,
      [kitchenName, chefId, specialty, location, Number(latitude) || 13.0827, Number(longitude) || 80.2707],
      (err, restaurantResult) => {
        if (err) {
          console.error('Error inserting restaurant:', err);
          // Fallback if columns are not yet altered
          const fallbackQuery = `INSERT INTO restaurants (name, chef_id, cuisines, image, rating, delivery_time, distance) VALUES (?, ?, ?, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600', 4.8, 30, 2)`;
          pool.query(fallbackQuery, [kitchenName, chefId, specialty], (fallbackErr, fbResult) => {
            if (fallbackErr) return res.status(500).json({ error: 'Failed to create restaurant' });
            return res.status(201).json({
              message: 'Chef and restaurant created successfully',
              chef: { id: chefId, name: chefName, image: chefImage, specialty, experience, bio },
              restaurant: { id: fbResult.insertId, name: kitchenName, cuisines: specialty, location, latitude, longitude },
            });
          });
          return;
        }

        return res.status(201).json({
          message: 'Chef and restaurant created successfully',
          chef: { id: chefId, name: chefName, image: chefImage, specialty, experience, bio },
          restaurant: { id: restaurantResult.insertId, name: kitchenName, cuisines: specialty, location, latitude, longitude },
        });
      }
    );
  });
});

// Add a Dish
app.post('/dishes', (req, res) => {
  const { name, description, image, price, restaurantId } = req.body;
  const dishQuery = `INSERT INTO menu_items (name, description, image, price, restaurant_id) VALUES (?, ?, ?, ?, ?)`;
  pool.query(dishQuery, [name, description, image, price, restaurantId], (err, result) => {
    if (err) {
      console.error('Error inserting dish:', err);
      return res.status(500).json({ error: "Couldn't add dish" });
    }
    res.status(201).json({ message: 'Dish added', dishId: result.insertId });
  });
});

// Get All Restaurants + Chefs with Real Locations
app.get('/restaurants', (req, res) => {
  const query = `
    SELECT r.*,
           c.id AS chef_id, c.name AS chef_name, c.image AS chef_image, c.specialty
    FROM restaurants r
    JOIN chefs c ON r.chef_id = c.id
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching restaurants:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const formatted = results.map((row) => ({
      id: row.id,
      name: row.name,
      cuisines: row.cuisines,
      image: row.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600',
      rating: row.rating || 4.8,
      deliveryTime: row.delivery_time || 30,
      distance: row.distance || 2,
      location: row.location || 'Chennai',
      latitude: row.latitude ? Number(row.latitude) : 13.0827,
      longitude: row.longitude ? Number(row.longitude) : 80.2707,
      chef: {
        id: row.chef_id,
        name: row.chef_name,
        image: row.chef_image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200',
        specialty: row.specialty,
      },
    }));
    res.json(formatted);
  });
});

// Get single restaurant + menu
app.get('/restaurants/:id', (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const query = `
    SELECT r.*, c.id AS chef_id, c.name AS chef_name, c.specialty, c.experience, c.bio, c.image AS chef_image
    FROM restaurants r
    JOIN chefs c ON r.chef_id = c.id
    WHERE r.id = ?
  `;
  pool.query(query, [restaurantId], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!results.length) return res.status(404).json({ error: 'Restaurant not found' });
    const restaurant = results[0];
    const menuQuery = `SELECT * FROM menu_items WHERE restaurant_id = ?`;
    pool.query(menuQuery, [restaurantId], (menuErr, menuItems) => {
      if (menuErr) return res.status(500).json({ error: 'Failed to fetch menu items' });
      res.json({
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
        rating: restaurant.rating || 4.8,
        deliveryTime: restaurant.delivery_time || 30,
        distance: restaurant.distance || 2,
        chef: {
          id: restaurant.chef_id,
          name: restaurant.chef_name,
          image: restaurant.chef_image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200',
          specialty: restaurant.specialty,
          experience: restaurant.experience,
          bio: restaurant.bio,
        },
        menu: menuItems,
      });
    });
  });
});

// Get All Dishes with Restaurant and Chef Info
app.get('/dishes', (req, res) => {
  const query = `
    SELECT m.id, m.name, m.description, m.image, m.price, r.name AS restaurant, r.rating, c.name AS chef_name
    FROM menu_items m
    JOIN restaurants r ON m.restaurant_id = r.id
    JOIN chefs c ON r.chef_id = c.id
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching dishes:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Create Cash on Delivery (COD) Order
app.post('/orders', (req, res) => {
  const {
    customerName,
    customerPhone,
    deliveryAddress,
    landmark,
    deliveryNotes,
    items = [],
    totalAmount,
    deliveryFee = 30,
  } = req.body;

  if (!customerName || !customerPhone || !deliveryAddress || !items.length) {
    return res.status(400).json({
      error: 'Missing required order details (Name, Phone, Address, Items)',
    });
  }

  const orderQuery = `
    INSERT INTO orders (customer_name, customer_phone, delivery_address, landmark, delivery_notes, total_amount, delivery_fee, payment_method, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'COD', 'pending')
  `;

  pool.query(
    orderQuery,
    [customerName, customerPhone, deliveryAddress, landmark || '', deliveryNotes || '', totalAmount, deliveryFee],
    (err, orderResult) => {
      if (err) {
        console.error('Error placing order:', err);
        return res.status(500).json({ error: 'Failed to place order in database' });
      }

      const orderId = orderResult.insertId;

      // Insert line items
      const itemValues = items.map((item) => [
        orderId,
        item.id || null,
        item.name,
        item.quantity || 1,
        item.price,
      ]);

      const itemsQuery = `INSERT INTO order_items (order_id, dish_id, dish_name, quantity, price) VALUES ?`;
      pool.query(itemsQuery, [itemValues], (itemErr) => {
        if (itemErr) {
          console.warn('Error inserting order items (order header recorded):', itemErr);
        }

        return res.status(201).json({
          message: 'Order placed successfully with Cash on Delivery (COD)',
          orderId,
          customerName,
          totalAmount,
          paymentMethod: 'Cash on Delivery (COD)',
          status: 'pending',
          estimatedDelivery: '30-45 mins',
        });
      });
    }
  );
});

// Get all orders (for Delivery partner & Kitchen tracking)
app.get('/orders', (req, res) => {
  const ordersQuery = `
    SELECT o.*, 
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'name', oi.dish_name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        )
        FROM order_items oi
        WHERE oi.order_id = o.id
      ) AS items
    FROM orders o
    ORDER BY o.created_at DESC
  `;

  pool.query(ordersQuery, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    const formatted = results.map((order) => {
      let parsedItems = [];
      if (typeof order.items === 'string') {
        try {
          parsedItems = JSON.parse(order.items);
        } catch (e) {
          parsedItems = [];
        }
      } else if (Array.isArray(order.items)) {
        parsedItems = order.items;
      }

      return {
        id: order.id.toString(),
        customer: order.customer_name,
        phone: order.customer_phone,
        address: order.delivery_address,
        landmark: order.landmark,
        notes: order.delivery_notes,
        total: Number(order.total_amount),
        deliveryFee: Number(order.delivery_fee),
        paymentMethod: order.payment_method,
        status: order.status,
        createdAt: order.created_at,
        items: parsedItems.filter(Boolean).map((i) => `${i.quantity}x ${i.name}`),
        itemDetails: parsedItems,
      };
    });

    res.json(formatted);
  });
});

// Update order status (accept, deliver, etc.)
app.put('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const query = `UPDATE orders SET status = ? WHERE id = ?`;
  pool.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Failed to update order status' });
    }
    res.json({ message: `Order #${id} status updated to ${status}`, status });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HomieFoods server running on http://localhost:${PORT}`);
});