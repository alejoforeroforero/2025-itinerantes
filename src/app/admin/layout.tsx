import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin">
      <h1 className="text-center mt-4">SECCIÓN DE ADMINISTRACIÓN</h1>
      <header className="flex flex-row justify-center align-center">
        <Link className="link-nav" href="/admin">
          Resumen
        </Link>
        <Link className="link-nav" href="/admin/categorias">
          Categorías
        </Link>
        <Link className="link-nav" href="/admin/productos">
          Productos
        </Link>
      </header>
      <main className="mt-4">{children}</main>
    </div>
  );
}
