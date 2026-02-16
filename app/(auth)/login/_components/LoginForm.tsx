'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Toggle } from '@/components/atoms/Toggle';
import { useAuthStore } from '@/stores/auth';
import { loginAction } from '@/lib/auth/actions';
import { loginSchema, type LoginFormData } from '@/lib/validation/schemas';

const REMEMBERED_LOGIN_KEY = 'portal_remembered_login';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  // Always start false so server and client match (avoid hydration mismatch).
  // Restore from localStorage in useEffect after mount.
  const [rememberMe, setRememberMe] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const { setUser, setInitialized } = useAuthStore();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

  // Restore remembered email/phone and "remember me" from localStorage after mount (client-only).
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBERED_LOGIN_KEY);
    if (saved) {
      setValue('emailOrPhone', saved);
      const id = requestAnimationFrame(() => setRememberMe(true));
      return () => cancelAnimationFrame(id);
    }
  }, [setValue]);

  // Show error / success from URL params
  const urlError = searchParams.get('error');
  const urlReset = searchParams.get('reset'); // 'success' after password reset
  const redirectTo = searchParams.get('redirect');

  const onSubmit = async (data: LoginFormData) => {
    setBackendError(null);
    setIsPending(true);

    const result = await loginAction(data.emailOrPhone, data.password);

    setIsPending(false);

    if (result?.success) {
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_LOGIN_KEY, data.emailOrPhone);
      } else {
        localStorage.removeItem(REMEMBERED_LOGIN_KEY);
      }

      // Populate auth store immediately so Sidebar shows all nav items
      if (result.user) {
        setUser(result.user);
        setInitialized(true);
      }

      router.push(redirectTo || '/');
      router.refresh();
    } else if (result?.error) {
      setBackendError(result.error);
    }
  };

  const errorMessage =
    backendError ||
    (urlError === 'unauthorized'
      ? 'Tài khoản của bạn không có quyền truy cập Portal.'
      : null);

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Success message (e.g. after password reset) */}
      {urlReset === 'success' && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      <Controller
        name="emailOrPhone"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Email hoặc số điện thoại"
            type="text"
            placeholder="admin@naleesports.com"
            leftIcon="mail-outline"
            error={errors.emailOrPhone?.message}
            disabled={isPending}
            autoComplete="username"
          />
        )}
      />
      <div>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconClick={() => setShowPassword((v) => !v)}
              error={errors.password?.message}
              disabled={isPending}
              autoComplete="current-password"
            />
          )}
        />
        <button
          type="button"
          className="text-faint hover:text-muted mt-1 text-xs"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-muted flex items-center gap-2 text-sm">
          <Toggle checked={rememberMe} onChange={setRememberMe} />
          Ghi nhớ tôi
        </label>
        <button
          type="button"
          className="text-primary hover:text-primary-light text-sm transition-colors"
          onClick={() => router.push('/forgot-password')}
        >
          Quên mật khẩu?
        </button>
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        iconLeft="log-in-outline"
        disabled={isPending}
      >
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  );
}
