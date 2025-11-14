type PaymentPageProps = {
  searchParams?: { items?: string };
};

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) {
    throw new Error("Kunne ikke hente produkt");
  }
  return res.json();
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const itemsParam = searchParams?.items || "";
  const ids =
    itemsParam.length > 0
      ? itemsParam.split(",").map((id) => Number(id))
      : [];

  const products =
    ids.length > 0 ? await Promise.all(ids.map((id) => getProduct(id))) : [];

  const total = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Fake betalingsside</h1>

        {products.length === 0 ? (
          <p>Du har ingen produkter i kurven.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {products.map((p) => (
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
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-lg">{total} kr.</span>
            </div>

            <button className="w-full rounded-md bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700 mt-4">
              Fake betal nu
            </button>
          </>
        )}
      </div>
    </main>
  );
}
