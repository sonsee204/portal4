'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Toggle } from '@/components/atoms/Toggle';
import { useAuthStore } from '@/stores/auth';
import { loginSchema, type LoginFormData } from '@/lib/validation/schemas';
import { loginAction } from '@/lib/auth/actions';
import { AUTH, ERRORS } from '@/lib/strings';

const REMEMBERED_LOGIN_KEY = 'portal_remembered_login';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
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

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBERED_LOGIN_KEY);
    if (saved) {
      setValue('emailOrPhone', saved);
      const id = requestAnimationFrame(() => setRememberMe(true));
      return () => cancelAnimationFrame(id);
    }
  }, [setValue]);

  const urlError = searchParams.get('error');
  const urlReset = searchParams.get('reset');
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

      if (result.user) {
        setUser(result.user);
        setInitialized(true);
      }

      // Đợi cookie được ghi xong rồi mới chuyển trang
      setTimeout(() => {
        router.push(redirectTo || '/');
        router.refresh();
      }, 50);
    } else if (result?.error) {
      setBackendError(result.error);
    }
  };

  const errorMessage =
    backendError || (urlError === 'unauthorized' ? ERRORS.UNAUTHORIZED : null);

  return (
    <motion.form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Success message (e.g. after password reset) */}
      {urlReset === 'success' && (
        <motion.div
          variants={staggerItem}
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
        >
          {AUTH.LOGIN.PASSWORD_RESET_SUCCESS}
        </motion.div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={staggerItem}>
        <Controller
          name="emailOrPhone"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label={AUTH.LOGIN.LABEL_EMAIL_OR_PHONE}
              type="text"
              placeholder="admin@naleesports.com"
              leftIcon="mail-outline"
              error={errors.emailOrPhone?.message}
              disabled={isPending}
              autoComplete="username"
            />
          )}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label={AUTH.LOGIN.LABEL_PASSWORD}
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
          {showPassword ? AUTH.LOGIN.HIDE_PASSWORD : AUTH.LOGIN.SHOW_PASSWORD}
        </button>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="flex items-center justify-between"
      >
        <label className="text-muted flex items-center gap-2 text-sm">
          <Toggle checked={rememberMe} onChange={setRememberMe} />
          {AUTH.LOGIN.REMEMBER_ME}
        </label>
        <button
          type="button"
          className="text-primary hover:text-primary-light text-sm transition-colors"
          onClick={() => router.push('/forgot-password')}
        >
          {AUTH.LOGIN.FORGOT_PASSWORD_LINK}
        </button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          iconLeft="log-in-outline"
          disabled={isPending}
        >
          {isPending ? AUTH.LOGIN.LOADING : AUTH.LOGIN.BUTTON}
        </Button>
      </motion.div>
    </motion.form>
  );
}
