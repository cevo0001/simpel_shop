import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold">Velkommen til Simpel Shop</h1>
        <p className="text-slate-600">
          Her kan du finde en masse produkter - vi har alt hvad du står og mangler!
        </p>
        <Link
          href="/products"
          className="inline-block rounded-md px-6 py-3 bg-black text-white hover:bg-slate-800 transition"
        >
          Gå til produktsiden
        </Link>
      </div>
    </main>
  );
}
