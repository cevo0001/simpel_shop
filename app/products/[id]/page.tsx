"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "../../../lib/cartStore";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  category: string;
};

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { items: cartItems, addItem, removeItem } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) {
          throw new Error("Kunne ikke hente produktet");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Der opstod en fejl ved hentning af produktet.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <p>Henter produkt...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-4">
          <Link href="/products" className="text-sm underline">
            ← Tilbage til produktsiden
          </Link>
          <h1 className="text-2xl font-bold">Produktet kunne ikke findes</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </main>
    );
  }

  
  const currentProduct: Product = product;

  const isInCart = cartItems.some(
    (item) => item.id === currentProduct.id
  );

  function handleToggleCart() {
    if (isInCart) {
      removeItem(currentProduct.id);
    } else {
      addItem({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        thumbnail: currentProduct.thumbnail,
      });
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <Link href="/products" className="text-sm underline">
          ← Tilbage til produktsiden
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <img
            src={currentProduct.thumbnail}
            alt={currentProduct.title}
            className="w-full h-80 object-contain rounded"
          />

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{currentProduct.title}</h1>
            <p className="text-slate-600">{currentProduct.description}</p>
            <p className="text-xl font-bold">{currentProduct.price} kr.</p>
            <p className="text-sm text-slate-500">
              Kategori: {currentProduct.category}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleToggleCart}
                className={`rounded-md px-4 py-2 text-sm font-semibold ${
                  isInCart
                    ? "bg-red-900 text-white hover:bg-red-900"
                    : "bg-black text-white hover:bg-slate-800"
                }`}
              >
                {isInCart ? "Fjern fra kurv" : "Læg i kurv"}
              </button>

              <Link
                href="/payment"
                className="rounded-md bg-emerald-900 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700"
              >
                Gå til kurv
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
