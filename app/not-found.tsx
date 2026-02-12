import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Trang bạn tìm không tồn tại.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-gray-900 px-6 py-2 text-white hover:bg-gray-800"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
