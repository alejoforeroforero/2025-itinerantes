
export default async function NamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  return (
    <div>
      <h1>Order ID page {id}</h1>
    </div>
  );
}