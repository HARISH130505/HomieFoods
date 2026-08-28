"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  ChevronRight,
  LocateFixed,
  ChefHat,
  Search,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { endpoints } from "@/lib/api";

interface DBChef {
  id?: number;
  name: string;
  image: string;
  specialty: string;
}

interface DBRestaurant {
  id: number;
  name: string;
  cuisines: string;
  image: string;
  rating: number;
  deliveryTime: number | string;
  distance: number | string;
  chef: DBChef;
  location?: string;
  latitude?: number;
  longitude?: number;
}

interface KitchenItem {
  id: number;
  name: string;
  chef: string;
  chefImage: string;
  specialty: string;
  location: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  lat: number;
  lng: number;
  image: string;
}

const Map = () => {
  const [kitchens, setKitchens] = useState<KitchenItem[]>([]);
  const [selectedKitchen, setSelectedKitchen] = useState<KitchenItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [activeArea, setActiveArea] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDBKitchens = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(endpoints.restaurants);
      if (!res.ok) {
        throw new Error(`Failed to connect to database (HTTP ${res.status})`);
      }
      const data: DBRestaurant[] = await res.json();

      if (Array.isArray(data)) {
        const formatted: KitchenItem[] = data.map((item) => {
          const lat = Number(item.latitude) || 13.0827;
          const lng = Number(item.longitude) || 80.2707;
          const location = item.location || "Chennai";

          return {
            id: item.id,
            name: item.name,
            chef: item.chef?.name || "Home Chef",
            chefImage: item.chef?.image || item.image,
            specialty: item.chef?.specialty || item.cuisines || "Home-style Cuisine",
            location,
            rating: item.rating || 4.8,
            deliveryTime: `${item.deliveryTime || 30} mins`,
            distance: `${item.distance || 2} km`,
            lat,
            lng,
            image: item.image || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600",
          };
        });

        setKitchens(formatted);
        if (formatted.length > 0) {
          setSelectedKitchen(formatted[0]);
        } else {
          setSelectedKitchen(null);
        }
      } else {
        setKitchens([]);
        setSelectedKitchen(null);
      }
    } catch (err: any) {
      console.error("Error fetching database restaurants for Map:", err);
      setError(err.message || "Failed to load database kitchens");
      setKitchens([]);
      setSelectedKitchen(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDBKitchens();
  }, []);

  // Helper to build OpenStreetMap embed URL with dynamic bounds and marker
  const getMapUrl = (lat: number, lng: number) => {
    const delta = 0.015;
    const minLng = (lng - delta).toFixed(4);
    const minLat = (lat - delta).toFixed(4);
    const maxLng = (lng + delta).toFixed(4);
    const maxLat = (lat + delta).toFixed(4);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setIsLocating(false);
      },
      (geoErr) => {
        console.warn("Geolocation warning:", geoErr);
        setIsLocating(false);
        if (kitchens.length > 0) {
          setUserLocation({ lat: kitchens[0].lat, lng: kitchens[0].lng });
        }
      },
      { timeout: 8000 }
    );
  };

  // Derive unique locations directly from actual DB data
  const uniqueAreas = [
    "All",
    ...Array.from(
      new Set(
        kitchens
          .map((k) => k.location?.split(",")[0]?.trim())
          .filter(Boolean)
      )
    ),
  ];

  const filteredKitchens = kitchens.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.chef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea =
      activeArea === "All" ||
      k.location.toLowerCase().includes(activeArea.toLowerCase());

    return matchesSearch && matchesArea;
  });

  const activeLat = userLocation?.lat || selectedKitchen?.lat || 13.0827;
  const activeLng = userLocation?.lng || selectedKitchen?.lng || 80.2707;

  return (
    <section className="py-16 bg-amber-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Locate Home Chefs Near You
            </h2>
            <p className="text-amber-200 text-sm mt-1">
              Real-time map reflecting based on registered home kitchens
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDBKitchens}
              title="Refresh"
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            {/* LOCATE ME BUTTON */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLocateMe}
              className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-lg cursor-pointer"
            >
              <LocateFixed
                size={16}
                className={isLocating ? "animate-spin" : ""}
              />
              <span>{isLocating ? "Detecting GPS..." : "Find Kitchens Near Me"}</span>
            </motion.button>
          </div>
        </div>

        {/* AREA PILLS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {uniqueAreas.map((area) => (
              <button
                key={area}
                onClick={() => setActiveArea(area)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeArea === area
                  ? "bg-yellow-400 text-gray-950 shadow-md"
                  : "bg-white/10 text-amber-200 hover:bg-white/20 border border-white/10"
                  }`}
              >
                {area}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-300"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chef, kitchen, or cuisine..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="p-16 text-center bg-white/5 rounded-3xl border border-white/10 animate-pulse">
            <p className="text-amber-200 text-base font-semibold">
              Fetching registered kitchens from database...
            </p>
          </div>
        ) : error && kitchens.length === 0 ? (
          <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
            <AlertCircle size={36} className="mx-auto text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Database Sync Error</h3>
            <p className="text-amber-200 text-xs max-w-md mx-auto mb-4">{error}</p>
            <button
              onClick={fetchDBKitchens}
              className="bg-yellow-400 text-gray-950 px-4 py-2 rounded-xl text-xs font-bold"
            >
              Retry Connection
            </button>
          </div>
        ) : kitchens.length === 0 ? (
          /* EMPTY DATABASE STATE */
          <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10">
            <ChefHat size={40} className="mx-auto text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">No Kitchens in Database</h3>
            <p className="text-amber-200 text-sm max-w-md mx-auto mb-6">
              There are currently no kitchens registered in your database. Register your first chef profile to have it plotted live on this map!
            </p>
            <Link
              href="/pwu/chef"
              className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-lg"
            >
              <ChefHat size={16} />
              <span>Register as a Chef</span>
            </Link>
          </div>
        ) : (
          /* MAP & KITCHENS SPLIT CONTAINER */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* KITCHEN CARDS LIST (5 COLS) */}
            <div className="lg:col-span-5 space-y-3.5 max-h-[580px] overflow-y-auto p-2.5 sm:p-3.5 bg-black/15 rounded-3xl border border-white/10 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {filteredKitchens.length > 0 ? (
                  filteredKitchens.map((kitchen) => {
                    const isSelected = selectedKitchen?.id === kitchen.id;
                    return (
                      <motion.div
                        key={kitchen.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => {
                          setSelectedKitchen(kitchen);
                          setUserLocation(null);
                        }}
                        whileHover={{ y: -2 }}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                          isSelected
                            ? "bg-white text-gray-900 border-yellow-400 shadow-2xl ring-2 ring-yellow-400"
                            : "bg-white/10 text-white border-white/10 hover:bg-white/15 hover:border-white/25 hover:shadow-lg"
                        }`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <img
                            src={kitchen.image}
                            alt={kitchen.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400";
                            }}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-amber-200/40 shadow-sm bg-amber-950/40"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h3
                                className={`font-bold text-sm truncate ${isSelected ? "text-gray-900" : "text-white"
                                  }`}
                              >
                                {kitchen.name}
                              </h3>
                              <div className="flex items-center space-x-1 shrink-0">
                                <Star
                                  size={12}
                                  className="text-amber-500 fill-amber-500"
                                />
                                <span
                                  className={`text-xs font-bold ${isSelected ? "text-gray-800" : "text-amber-300"
                                    }`}
                                >
                                  {kitchen.rating}
                                </span>
                              </div>
                            </div>

                            <p
                              className={`text-xs font-medium flex items-center mt-0.5 ${isSelected ? "text-orange-600" : "text-amber-300"
                                }`}
                            >
                              <ChefHat size={13} className="mr-1 shrink-0" />
                              <span>Chef {kitchen.chef}</span>
                            </p>

                            <div className="flex items-center text-xs mt-1 text-gray-500 space-x-2">
                              <span
                                className={`flex items-center ${isSelected ? "text-gray-600" : "text-gray-300"
                                  }`}
                              >
                                <MapPin size={12} className="mr-0.5 text-yellow-500" />
                                {kitchen.location}
                              </span>
                              <span
                                className={`flex items-center ${isSelected ? "text-gray-600" : "text-gray-300"
                                  }`}
                              >
                                <Clock size={12} className="mr-0.5 text-blue-400" />
                                {kitchen.deliveryTime}
                              </span>
                            </div>

                            <p
                              className={`text-xs mt-1.5 truncate ${isSelected ? "text-gray-500" : "text-gray-400"
                                }`}
                            >
                              🍳 {kitchen.specialty}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 text-center bg-white/5 rounded-2xl border border-white/10"
                  >
                    <p className="text-amber-200 text-sm">
                      No kitchens found matching your search.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* INTERACTIVE MAP FRAME (7 COLS) */}
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 min-h-[420px] lg:min-h-[560px] bg-amber-950 flex flex-col">
              <iframe
                title="Neighborhood Kitchen Map"
                src={getMapUrl(activeLat, activeLng)}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "100%", flexGrow: 1 }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full min-h-[420px] lg:min-h-[560px]"
              />

              {/* OVERLAY BADGE ON MAP */}
              {selectedKitchen && (
                <div className="absolute top-4 left-4 right-4 sm:right-auto z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedKitchen.id}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="bg-black/85 backdrop-blur-md text-white p-4 rounded-2xl border border-white/20 shadow-2xl max-w-sm"
                    >
                      <h4 className="font-extrabold text-sm text-white mt-1.5 flex items-center">
                        <span>{selectedKitchen.name}</span>
                      </h4>
                      <p className="text-xs text-amber-200 mt-0.5 flex items-center">
                        <ChefHat size={13} className="mr-1 text-yellow-400" />
                        <span>Chef {selectedKitchen.chef}</span>
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        📍 {selectedKitchen.location} • ⏱️ {selectedKitchen.deliveryTime}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedKitchen.lat},${selectedKitchen.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-amber-300 hover:text-white font-medium bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Navigation size={12} />
                          <span>Directions</span>
                        </a>

                        <Link
                          href={`/chefmenu/${selectedKitchen.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-gray-950 bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-lg transition-colors"
                        >
                          <span>View Menu</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Map;