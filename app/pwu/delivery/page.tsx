"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Clock,
  IndianRupee,
  Phone,
  Banknote,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { endpoints } from "@/lib/api";

interface OrderItem {
  id: string;
  customer: string;
  phone?: string;
  address: string;
  landmark?: string;
  notes?: string;
  items: string[];
  total: number;
  deliveryFee?: number;
  paymentMethod?: string;
  status: "pending" | "accepted" | "out_for_delivery" | "delivered" | string;
  createdAt?: string;
}

const fallbackOrders: OrderItem[] = [
  {
    id: "101",
    customer: "Harish Kumar",
    phone: "9876543210",
    address: "123 Main St, Madipakkam, Chennai",
    landmark: "Near Apollo Pharmacy",
    notes: "Please call upon arrival",
    items: ["2x Chicken Dum Biryani", "2x Butter Naan"],
    total: 470,
    deliveryFee: 30,
    paymentMethod: "Cash on Delivery (COD)",
    status: "pending",
  },
  {
    id: "102",
    customer: "Priya S.",
    phone: "9840123456",
    address: "Flat 4B, Green Acres, Velachery, Chennai",
    items: ["1x Paneer Butter Masala", "3x Phulka"],
    total: 210,
    deliveryFee: 30,
    paymentMethod: "Cash on Delivery (COD)",
    status: "accepted",
  },
];

const Delivery = () => {
  const [orders, setOrders] = useState<OrderItem[]>(fallbackOrders);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoints.orders);
      if (!res.ok) throw new Error("Could not fetch orders");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    } catch (err: any) {
      console.warn("Using local fallback orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    setUpdatingId(orderId);
    try {
      await fetch(endpoints.orderStatus(orderId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.warn("Status update fallback in local state:", err);
    } finally {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
      setUpdatingId(null);
    }
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const activeCount = orders.filter((o) => o.status === "accepted" || o.status === "out_for_delivery").length;
  const totalEarnings = orders
    .filter((o) => o.status === "delivered" || o.status === "accepted")
    .reduce((sum, o) => sum + (o.deliveryFee || 30), 0);

  return (
    <div className="min-h-screen bg-amber-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                Delivery Partner Hub
              </h1>
              <p className="text-amber-200 text-sm mt-1">
                Manage incoming Cash on Delivery (COD) dispatches & local delivery payouts
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all w-fit cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span>Refresh Orders</span>
            </button>
          </div>

          {/* METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Available Orders
                  </p>
                  <p className="text-3xl font-extrabold text-white mt-1">
                    {pendingCount}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                  <Package size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    Active Deliveries
                  </p>
                  <p className="text-3xl font-extrabold text-white mt-1">
                    {activeCount}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                  <Clock size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Delivery Earnings
                  </p>
                  <p className="text-3xl font-extrabold text-white mt-1 flex items-center">
                    <IndianRupee size={24} />
                    {totalEarnings || 60}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                  <IndianRupee size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* INCOMING ORDERS LIST */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <span>Neighborhood Order Stream</span>
              <span className="ml-3 text-xs bg-yellow-400 text-black px-2.5 py-0.5 rounded-full font-bold">
                {orders.length} Total
              </span>
            </h2>

            <div className="space-y-4">
              {orders.map((order) => {
                const isPending = order.status === "pending";
                const isAccepted = order.status === "accepted";
                const isDelivered = order.status === "delivered";

                return (
                  <motion.div
                    key={order.id}
                    layout
                    className="bg-white/5 border border-white/10 hover:border-amber-400/40 rounded-2xl p-5 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-bold text-base">
                            Order #{order.id}
                          </h3>
                          <span className="text-xs bg-amber-500/20 border border-amber-400/30 text-amber-300 px-2 py-0.5 rounded-full flex items-center">
                            <Banknote size={12} className="mr-1" /> COD Order
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 mt-0.5 font-medium">
                          Customer: <strong className="text-white">{order.customer}</strong>
                          {order.phone && ` • 📞 ${order.phone}`}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                            isPending
                              ? "bg-yellow-400 text-black"
                              : isAccepted
                              ? "bg-blue-500 text-white"
                              : "bg-emerald-500 text-white"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-300 space-y-1.5 mb-4">
                      <div className="flex items-start">
                        <MapPin size={15} className="mr-1.5 text-yellow-400 shrink-0 mt-0.5" />
                        <span>{order.address} {order.landmark && `(Landmark: ${order.landmark})`}</span>
                      </div>
                      <div className="flex items-start">
                        <Package size={15} className="mr-1.5 text-amber-300 shrink-0 mt-0.5" />
                        <span>
                          <strong>Items:</strong> {Array.isArray(order.items) ? order.items.join(", ") : order.items}
                        </span>
                      </div>
                      {order.notes && (
                        <div className="text-amber-200/80 italic pl-5">
                          Note: "{order.notes}"
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-white/10 gap-3">
                      <div>
                        <span className="text-xs text-gray-400">Cash to collect from customer:</span>
                        <div className="text-lg font-extrabold text-yellow-400 flex items-center">
                          <IndianRupee size={18} />
                          {order.total}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isPending && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order.id, "accepted")}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                          >
                            {updatingId === order.id ? "Accepting..." : "Accept Delivery"}
                          </motion.button>
                        )}
                        {isAccepted && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order.id, "delivered")}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center space-x-1"
                          >
                            <CheckCircle size={14} />
                            <span>Mark as Delivered & Collected</span>
                          </motion.button>
                        )}
                        {isDelivered && (
                          <span className="text-xs text-emerald-300 font-bold flex items-center">
                            <CheckCircle size={15} className="mr-1" /> Payment Collected & Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Delivery;