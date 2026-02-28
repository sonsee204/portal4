import { Suspense } from 'react';
import { ForgotPasswordForm } from './_components/ForgotPasswordForm';
import { AUTH } from '@/lib/strings';

export default function ForgotPasswordPage() {
  return (
    <>
      {/* Title — visible on lg where brand panel hides the logo area */}
      <div className="mb-6 hidden text-center lg:block">
        <h2 className="text-heading text-xl font-bold">
          {AUTH.FORGOT_PASSWORD.TITLE}
        </h2>
        <p className="mt-1 text-sm text-faint">
          {AUTH.FORGOT_PASSWORD.SUBTITLE}
        </p>
      </div>

      {/* Title for mobile — below the logo rendered by layout */}
      <div className="mb-6 text-center lg:hidden">
        <p className="text-sm text-faint">{AUTH.FORGOT_PASSWORD.SUBTITLE}</p>
      </div>

      <Suspense fallback={null}>
        <ForgotPasswordForm />
      </Suspense>
    </>
  );
}
