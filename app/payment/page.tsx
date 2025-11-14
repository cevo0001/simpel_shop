"use client";

import { useCartStore } from "../../lib/cartStore";
import Link from "next/link";

export default function PaymentPage() {
  const { items, removeItem, clear } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Indkøbskurv / Fake betaling</h1>

        {items.length === 0 ? (
          <div className="space-y-3">
            <p>Du har ingen produkter i kurven.</p>
            <Link
              href="/products"
              className="inline-block text-sm underline"
            >
              ← Gå tilbage til produkterne
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-sm text-slate-500">{p.price} kr.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(p.id)}
                    className="text-xs sm:text-sm rounded-md px-3 py-1 bg-red-500 text-white hover:bg-red-600"
                  >
                    Fjern
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-lg">{total} kr.</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 rounded-md bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700">
                Fake betal nu
              </button>
              <button
                onClick={clear}
                className="flex-1 rounded-md bg-slate-300 text-slate-800 py-3 font-semibold hover:bg-slate-400"
              >
                Tøm kurv
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
