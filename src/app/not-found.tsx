import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-[var(--primary)]">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Página no encontrada
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--primary)] hover:bg-[var(--accent)] transition-colors duration-200"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 