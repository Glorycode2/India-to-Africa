"use client";

import { useEffect, useState } from "react";

const SHIPPING = {
  "Niger": 22,
  "Nigeria": 19,
  "Ghana": 20,
  "Senegal": 24,
  "Mali": 25,
  "Other": 30,
};

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Niger",
    city: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price_usd * item.quantity, 0);
  const shipping = SHIPPING[form.country] || 30;
  const service = parseFloat((subtotal * 0.1).toFixed(2));
  const total = (subtotal + shipping + service).toFixed(2);

  async function handleSubmit() {
    if (!form.name || !form.email || !form.address) {
      alert("Please fill in your name, email and address");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    localStorage.removeItem("cart");
    setDone(true);
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Received!</h1>
          <p className="text-gray-600 mb-6">
            Thank you {form.name}. We will contact you at {form.email} within 24 hours to confirm your order.
          </p>
          <a href="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold">India to Africa</a>
        <a href="/cart" className="text-sm hover:underline">Back to Cart</a>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Complete Your Order</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-lg mb-4">Your Details</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Full name</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Email address</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Phone number</label>
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Country</label>
              <select value={form.country} onChange={(e) => update("country", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
                {Object.keys(SHIPPING).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Full address</label>
              <textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Special notes (optional)</label>
              <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.price_usd * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping to {form.country}</span>
                  <span>${shipping}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service fee (10%)</span>
                  <span>${service}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
              <div className="mt-4 bg-orange-50 rounded-lg p-3">
                <p className="text-sm text-orange-800">
                  Estimated delivery to {form.country}: 14-21 days
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Payment collected after we confirm availability
                </p>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={submitting} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-colors">
              {submitting ? "Placing order..." : "Place Order Request"}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              We will contact you within 24 hours to confirm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}