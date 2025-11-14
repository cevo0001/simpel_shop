import Link from "next/link";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  category: string;
};

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) {
    throw new Error("Kunne ikke hente produktet");
  }
  return res.json();
}

type ProductPageProps = {
  params: { id: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <Link href="/products" className="text-sm underline">
          ← Tilbage til produktsiden
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-80 object-cover rounded"
          />

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-slate-600">{product.description}</p>
            <p className="text-xl font-bold">{product.price} kr.</p>
            <p className="text-sm text-slate-500">
              Kategori: {product.category}
            </p>

            <button className="rounded-md bg-black text-white px-4 py-2 hover:bg-slate-800">
              Læg i kurv (dummy)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
