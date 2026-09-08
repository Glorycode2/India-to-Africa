"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function removeItem(id) {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function increase(id) {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function decrease(id) {
    const updated = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price_usd * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold">India to Africa</a>
        <a href="/products" className="text-sm hover:underline">Back to Products</a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Cart</h1>

        {cart.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">Your cart is empty</p>
            <a href="/products" className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
              Browse Products
            </a>
          </div>
        )}

        {cart.length > 0 && (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex gap-4 items-center">
                <img
                  src={item.image_url || "/placeholder.png"}
                  alt={item.name}
                  className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-orange-600 font-bold mt-1">${item.price_usd}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => decrease(item.id)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 font-bold">-</button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => increase(item.id)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 font-bold">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
              </div>
            ))}

            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Products total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Shipping</span>
                <span>calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 mt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <a href="/checkout" className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-xl mt-6 font-medium">
                Place Order Request
              </a>
              <p className="text-xs text-gray-400 text-center mt-3">
                No payment needed now. We will contact you within 24 hours.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}