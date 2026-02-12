import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="neon-text text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-lg text-slate-400">
        Trang bạn tìm không tồn tại.
      </p>
      <Link href="/" className="mt-6">
        <Button>Về Dashboard</Button>
      </Link>
    </div>
  );
}
