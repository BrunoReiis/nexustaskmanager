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

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, user, loading: authLoading } = useAuth();
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

    // Validações
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      router.push('/');
    } catch (err) {
      const error = err as FirebaseError;
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/operation-not-allowed':
          setError('Operation not allowed');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Use at least 6 characters');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-5xl font-bold mb-6">Join us today!</h1>
          <p className="text-xl text-purple-100 leading-relaxed max-w-md">
            Create your account and start managing your tasks efficiently.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign Up</h2>
              <p className="text-gray-500 dark:text-gray-400">Create your account for free</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-danger-50 dark:bg-danger-900/20 text-danger border border-danger-200 dark:border-danger-800 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                type="text"
                label="Full name"
                placeholder="John Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                type="email"
                label="Email"
                placeholder="your@email.com"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <Input
                type="password"
                label="Password"
                placeholder="Minimum 6 characters"
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

              <Input
                type="password"
                label="Confirm password"
                placeholder="Enter password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                variant="flat"
                classNames={{
                  input: "text-base",
                  inputWrapper: "bg-gray-100 dark:bg-gray-700 border-0"
                }}
                size="lg"
                startContent={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              <Button
                type="submit"
                className="w-full bg-[#6D28D9] text-white font-semibold hover:bg-[#5B21B6] transition-colors mt-6"
                isLoading={loading}
                size="lg"
                radius="full"
              >
                Create Account
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                <Link href="/login" className="text-[#6D28D9] hover:text-[#5B21B6] font-semibold">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
