'use client';

import { Logo } from '@/components/atoms/Logo';
import { IonIcon } from '@/components/atoms/IonIcon';
import { LoginForm } from './_components/LoginForm';

export default function LoginPage() {
  return (
    <div className="bg-bg-dark relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/20 absolute -top-40 -left-40 h-96 w-96 animate-pulse rounded-full blur-[120px]" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 animate-pulse rounded-full bg-blue-500/15 blur-[120px] [animation-delay:1s]" />
        <div className="bg-primary/10 absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-[80px] [animation-delay:2s]" />
      </div>

      {/* Circuit pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glass card */}
      <div className="glass-card relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Logo variant="full" />
          <p className="mt-2 text-sm text-slate-500">
            Hệ thống quản trị thể thao
          </p>
        </div>

        <LoginForm />

        {/* Footer */}
        <div className="border-surface-border mt-8 border-t pt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="neon-glow h-2 w-2 rounded-full bg-emerald-500" />
              System Online
            </span>
            <span className="text-surface-border">•</span>
            <span>Version 2.0.1</span>
            <span className="text-surface-border">•</span>
            <span className="flex items-center gap-1">
              <IonIcon name="shield-checkmark-outline" size="xs" />
              SSL Secured
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
