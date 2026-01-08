'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Divider } from '@heroui/divider';
import { Spinner } from '@heroui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import { NexusLogo } from '@/components/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { login, resetPassword, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redireciona se já estiver logado
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Mostra loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Se já está logado, não renderiza nada (vai redirecionar)
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      const error = err as FirebaseError;
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/user-not-found':
          setError('User not found');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        default:
          setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);

    try {
      await resetPassword(resetEmail);
      setResetMessage('Recovery email sent! Check your inbox.');
      setResetEmail('');
    } catch (err) {
      const error = err as FirebaseError;
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
          setError('User not found');
          break;
        default:
          setError('Failed to send email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen">
        {/* Left Side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute top-10 left-10" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="2"/>
              <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="2"/>
            </svg>
            <svg className="absolute top-40 right-20" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2"/>
            </svg>
            <div className="absolute top-20 right-40 grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rounded-full" />
              ))}
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <div className="mb-8">
              <NexusLogo fill="white" size={60} />
            </div>
            <h1 className="text-5xl font-bold mb-6">Reset Password</h1>
            <p className="text-xl text-purple-100 leading-relaxed max-w-md">
              Enter your email and we'll send you instructions to reset your password.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
                <p className="text-gray-500 dark:text-gray-400">Enter your email below</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="bg-danger-50 dark:bg-danger-900/20 text-danger border border-danger-200 dark:border-danger-800 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {resetMessage && (
                  <div className="bg-success-50 dark:bg-success-900/20 text-success border border-success-200 dark:border-success-800 p-3 rounded-lg text-sm">
                    {resetMessage}
                  </div>
                )}

                <Input
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  variant="flat"
                  classNames={{
                    input: "text-base",
                    inputWrapper: "bg-gray-100 dark:bg-gray-700 border-0"
                  }}
                  size="lg"
                />

                <Button
                  type="submit"
                  className="w-full bg-[#6D28D9] text-white font-semibold hover:bg-[#5B21B6] transition-colors"
                  isLoading={loading}
                  size="lg"
                  radius="full"
                >
                  Send Email
                </Button>

                <Button
                  variant="light"
                  fullWidth
                  size="lg"
                  className="text-gray-600 dark:text-gray-400"
                  onPress={() => {
                    setShowForgotPassword(false);
                    setError('');
                    setResetMessage('');
                  }}
                >
                  Back to Login
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute top-10 left-10" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="2"/>
            <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="2"/>
          </svg>
          <svg className="absolute top-40 right-20" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2"/>
          </svg>
          <div className="absolute top-20 right-40 grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full" />
            ))}
          </div>
          <svg className="absolute bottom-40 left-20" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="13" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <NexusLogo fill="white" size={60} />
          </div>
          <h1 className="text-5xl font-bold mb-6">Welcome back!</h1>
          <p className="text-xl text-purple-100 leading-relaxed max-w-md">
            You can sign in to access with your existing account.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
              <p className="text-gray-500 dark:text-gray-400">Enter your credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger-50 dark:bg-danger-900/20 text-danger border border-danger-200 dark:border-danger-800 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                type="email"
                label="Username or email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="flat"
                classNames={{
                  input: "text-base",
                  inputWrapper: "bg-gray-100 dark:bg-gray-700 border-0"
                }}
                size="lg"
                startContent={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="flat"
                classNames={{
                  input: "text-base",
                  inputWrapper: "bg-gray-100 dark:bg-gray-700 border-0"
                }}
                size="lg"
                startContent={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6D28D9] text-white font-semibold hover:bg-[#5B21B6] transition-colors"
                isLoading={loading}
                size="lg"
                radius="full"
              >
                Sign In
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">New here? </span>
                <Link href="/signup" className="text-[#6D28D9] hover:text-[#5B21B6] font-semibold">
                  Create an Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
