"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  ChefHat,
  Users,
  UtensilsCrossed,
  Banknote,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const pillars = [
    {
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      title: "100% Home Cooked",
      description:
        "Every meal is prepared by verified neighborhood home chefs with wholesome, fresh kitchen ingredients and heirloom recipes.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: "Uncompromising Hygiene",
      description:
        "All home kitchens undergo strict hygiene and quality vetting. Zero artificial preservatives, food colors, or reused cooking oils.",
    },
    {
      icon: <Users className="w-8 h-8 text-amber-500" />,
      title: "Empowering Local Chefs",
      description:
        "We empower talented homemakers, seasoned grandmothers, and culinary creators to build sustainable micro-enterprises right from home.",
    },
    {
      icon: <Banknote className="w-8 h-8 text-blue-500" />,
      title: "Cash on Delivery",
      description:
        "Hassle-free, transparent transactions. Pay with cash or scan UPI upon doorstep delivery only after your food arrives fresh.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Browse Neighborhood Chefs",
      description: "Discover verified local home kitchens creating authentic regional specialties near you.",
    },
    {
      number: "02",
      title: "Cooked Fresh on Order",
      description: "The home chef receives your order and prepares your dishes from scratch with love.",
    },
    {
      number: "03",
      title: "Local Swift Delivery",
      description: "Our dedicated delivery partners pick up the piping hot meal and deliver straight to your doorstep.",
    },
    {
      number: "04",
      title: "Pay Cash on Delivery",
      description: "Inspect your fresh meal and pay comfortably using Cash on Delivery (COD) or UPI.",
    },
  ];

  const faqs = [
    {
      q: "How does Homie Foods ensure food safety and cleanliness?",
      a: "Every home chef undergoes a multi-point verification process, kitchen inspection, and must adhere to our strict clean-kitchen guidelines.",
    },
    {
      q: "What payment methods are supported?",
      a: "We currently support exclusive Cash on Delivery (COD). You can pay our delivery partner with cash or scan their UPI QR code upon arrival.",
    },
    {
      q: "Can I pre-order for family events or large dinners?",
      a: "Yes! You can connect with chefs in advance through our platform for party menus, catering boxes, or custom spice requests.",
    },
  ];

  return (
    <div className="min-h-screen bg-amber-950 text-white">
      {/* HERO SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-amber-900 to-amber-950">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Bringing the Warmth of <br />
              <span className="text-yellow-400">Home Cooked Food</span> to Your Doorstep
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-amber-200/90 max-w-3xl mx-auto font-light leading-relaxed">
              We started Homie Foods with a simple mission: to connect passionate neighborhood home cooks with people craving wholesome, preservative-free, authentic homemade meals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION / STORY HIGHLIGHT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/15 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Our Purpose</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 leading-snug">
              Why We Believe in the Power of Home Chefs
            </h2>
            <p className="text-amber-100 text-sm mt-4 leading-relaxed">
              Commercial restaurants often rely on mass preparation, artificial enhancers, and frozen ingredients. At Homie Foods, every meal tells a story of cultural heritage, carefully balanced spices, and healthy home-style cooking.
            </p>
            <p className="text-amber-100 text-sm mt-3 leading-relaxed">
              By ordering from Homie Foods, you not only enjoy healthy food made with genuine care, but you also directly support local homemakers and culinary artists within your community.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-amber-300">
              <div className="flex items-center space-x-1 bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-700/50">
                <UtensilsCrossed size={14} />
                <span>Cooked to order</span>
              </div>
              <div className="flex items-center space-x-1 bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-700/50">
                <Clock size={14} />
                <span>Delivered hot & fresh</span>
              </div>
              <div className="flex items-center space-x-1 bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-700/50">
                <Banknote size={14} />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400/30">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80"
                alt="Home cooking with love"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE PILLARS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Our Food & Community Promise</h2>
          <p className="text-amber-200 text-sm mt-2 max-w-xl mx-auto">
            Built on transparency, authentic flavors, and community empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 hover:border-yellow-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4">{pillar.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-gray-300 text-xs leading-relaxed">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-amber-900/40 border-y border-amber-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Homie Foods Works</h2>
            <p className="text-amber-200 text-sm mt-2">From neighborhood stove to your dining table in 4 easy steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-extrabold text-yellow-400/50 block mb-2">{step.number}</span>
                  <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-amber-200 text-sm mt-1">Got questions? We have answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <h3 className="text-base font-bold text-yellow-300 mb-2">{faq.q}</h3>
              <p className="text-gray-200 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-gray-950 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Ready to Taste Authentic Homemade Goodness?
          </h2>
          <p className="text-base font-medium max-w-2xl mx-auto mb-8 text-gray-900">
            Explore freshly cooked dishes from verified home chefs near you, with guaranteed Cash on Delivery.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="bg-black hover:bg-gray-900 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg inline-flex items-center justify-center space-x-2"
            >
              <span>Explore Menu</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/pwu"
              className="bg-white hover:bg-gray-100 text-gray-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg inline-flex items-center justify-center space-x-2"
            >
              <span>Become a Partner</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;