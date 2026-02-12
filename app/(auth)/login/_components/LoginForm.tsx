'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Toggle } from '@/components/atoms/Toggle';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <Input
        label="Email"
        type="email"
        placeholder="admin@hitritech.com"
        leftIcon="mail-outline"
      />
      <Input
        label="Mật khẩu"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        leftIcon="lock-closed-outline"
        rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <Toggle checked={false} onChange={() => {}} />
          Ghi nhớ tôi
        </label>
        <button
          type="button"
          className="text-primary hover:text-primary-light text-sm transition-colors"
        >
          Quên mật khẩu?
        </button>
      </div>
      <Button className="w-full" size="lg" iconLeft="log-in-outline">
        Đăng nhập
      </Button>
    </form>
  );
}
