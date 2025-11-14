"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("alle");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://dummyjson.com/products");
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Fejl ved hentning af produkter", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["alle", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "alle" || p.category === selectedCategory;
      const matchesSearch =
        search.trim().length === 0 ||
        p.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  function toggleCart(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const itemsParam = selectedIds.join(",");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produkter</h1>
            <p className="text-slate-600 text-sm">
              Vælg produkter, filtrér på kategori og gå til fake betalingsside.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <input
              type="text"
              placeholder="Søg efter produkt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm w-full sm:w-64"
            />
            <div className="flex flex-wrap gap-2 justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full border px-3 py-1 text-xs sm:text-sm ${
                    selectedCategory === cat
                      ? "bg-black text-white"
                      : "bg-white hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="flex justify-between items-center border-y py-3 text-sm">
          <p className="text-slate-600">
            Viser {filteredProducts.length} ud af {products.length} produkter
          </p>
          <div className="flex items-center gap-3">
            <p className="text-slate-700">
              Kurv:{" "}
              <span className="font-semibold">{selectedIds.length} varer</span>
            </p>
            <Link
              href={
                selectedIds.length > 0 ? `/payment?items=${itemsParam}` : "#"
              }
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                selectedIds.length > 0
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
              aria-disabled={selectedIds.length === 0}
            >
              Gå til betaling
            </Link>
          </div>
        </section>

        {loading ? (
          <p>Henter produkter...</p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const isInCart = selectedIds.includes(product.id);
              return (
                <article
                  key={product.id}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition flex flex-col"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded"
                  />
                  <div className="mt-3 space-y-1 flex-1">
                    <h2 className="font-semibold line-clamp-2">
                      {product.title}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {product.category}
                    </p>
                    <p className="font-bold">{product.price} kr.</p>
                  </div>
                  <div className="mt-3 flex justify-between items-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-xs sm:text-sm underline"
                    >
                      Se detaljer
                    </Link>
                    <button
                      onClick={() => toggleCart(product.id)}
                      className={`text-xs sm:text-sm rounded-md px-3 py-1 ${
                        isInCart
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-black text-white hover:bg-slate-800"
                      }`}
                    >
                      {isInCart ? "Fjern fra kurv" : "Læg i kurv"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
