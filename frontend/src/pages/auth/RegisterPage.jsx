import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';

import { authService } from '../../services/auth/auth.service';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      // Matches backend: registerValidation (fullName, email, password)
      const payload = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      await authService.register(payload);
      toast.success('Account created successfully');

      // Check auto-session cookie
      try {
        await checkAuth();
        navigate('/dashboard', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setServerError(backendErrors[0].msg);
      } else {
        setServerError(
          err.response?.data?.message || 'Failed to create account. Please check your details.'
        );
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c0e] px-6 py-12 selection:bg-white selection:text-zinc-950 font-sans">
      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center">
        
        {/* Header Block */}
        <div className="text-center w-full mb-8">
          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-white leading-tight">
            Create an account
          </h1>
          <p className="mt-2 text-[15px] text-zinc-400 font-normal">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Soft Error Banner */}
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="w-full mb-5 rounded-2xl bg-red-950/40 border border-red-900/50 px-4 py-3 text-center"
            >
              <p className="text-[14px] font-medium text-red-400">
                {serverError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3.5" noValidate>
          
          {/* Full Name (3-50 chars) */}
          <div>
            <input
              type="text"
              placeholder="Full name"
              aria-label="Full name"
              aria-invalid={!!errors.fullName}
              className={`w-full h-[52px] px-4 rounded-xl text-[15px] transition-all outline-none bg-[#18181b] text-zinc-100 placeholder:text-zinc-500 border ${
                errors.fullName
                  ? 'border-red-500/80 focus:ring-1 focus:ring-red-500'
                  : 'border-transparent focus:border-zinc-700 focus:bg-[#141416]'
              }`}
              {...register('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 3,
                  message: 'Full name must be between 3 and 50 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Full name must be between 3 and 50 characters',
                },
              })}
            />
            {errors.fullName && (
              <p className="mt-1.5 ml-2 text-[12px] font-medium text-red-400">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="name@work.com"
              aria-label="Work email"
              aria-invalid={!!errors.email}
              className={`w-full h-[52px] px-4 rounded-xl text-[15px] transition-all outline-none bg-[#18181b] text-zinc-100 placeholder:text-zinc-500 border ${
                errors.email
                  ? 'border-red-500/80 focus:ring-1 focus:ring-red-500'
                  : 'border-transparent focus:border-zinc-700 focus:bg-[#141416]'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1.5 ml-2 text-[12px] font-medium text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password with Show/Hide Toggle (min 8 chars) */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (minimum 8 characters)"
                aria-label="Password"
                aria-invalid={!!errors.password}
                className={`w-full h-[52px] pl-4 pr-12 rounded-xl text-[15px] transition-all outline-none bg-[#18181b] text-zinc-100 placeholder:text-zinc-500 border ${
                  errors.password
                    ? 'border-red-500/80 focus:ring-1 focus:ring-red-500'
                    : 'border-transparent focus:border-zinc-700 focus:bg-[#141416]'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 ml-2 text-[12px] font-medium text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Legal microcopy */}
          <p className="pt-2 pb-1 text-[12px] leading-relaxed text-zinc-500 text-left">
            By clicking &ldquo;Create account&rdquo;, you agree to our{' '}
            <Link to="/terms" className="text-zinc-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-zinc-400 hover:underline">
              Privacy Policy
            </Link>.
          </p>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[50px] rounded-full bg-white text-zinc-950 text-[15px] font-semibold transition-all hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin text-zinc-950" />
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative w-full my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-[#0c0c0e] px-4 text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
            or
          </span>
        </div>

        {/* Social SSO Buttons */}
        <div className="w-full space-y-2.5">
          <button
            type="button"
            className="w-full h-[50px] rounded-full border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-200 text-[14px] font-medium transition-all flex items-center justify-center space-x-3 cursor-pointer hover:bg-zinc-900/40 active:scale-[0.99]"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            className="w-full h-[50px] rounded-full border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-200 text-[14px] font-medium transition-all flex items-center justify-center space-x-3 cursor-pointer hover:bg-zinc-900/40 active:scale-[0.99]"
          >
            <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.03-.5 2.64-1.24z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

      </div>
    </div>
  );
}