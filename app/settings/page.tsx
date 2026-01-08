'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Avatar } from '@heroui/avatar';
import { Spinner } from '@heroui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL || null,
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        photoURL: photoURL || null,
        updatedAt: new Date().toISOString(),
      });

      setSuccess('Profile updated successfully!');
      
      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-4xl">
          {/* Header */}
          <CardHeader className="flex items-start justify-between p-8 pb-4 border-b border-default-200">
            <div>
              <h1 className="text-2xl font-semibold">{displayName || user.email || 'User'}</h1>
              <p className="text-sm text-default-500 mt-1">Profile settings</p>
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.back()}
              className="text-default-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardBody className="p-8">
              {/* Messages */}
              {error && (
                <div className="mb-6 bg-danger-50 dark:bg-danger-900/20 text-danger border border-danger-200 dark:border-danger-800 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 bg-success-50 dark:bg-success-900/20 text-success border border-success-200 dark:border-success-800 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Avatar Section */}
              <div className="grid grid-cols-12 gap-8 mb-8 pb-8 border-b border-default-200">
                <div className="col-span-3"></div>
                
                <div className="col-span-9 flex items-center gap-6">
                  <div className="relative">
                    <Avatar
                      src={photoURL || undefined}
                      name={displayName || user.email || 'User'}
                      className="w-32 h-32 text-2xl"
                      style={{ borderColor: '#6D28D9', borderWidth: '2px' }}
                      isBordered
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Input
                      type="url"
                      placeholder="Enter photo URL"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      variant="flat"
                      size="sm"
                      classNames={{
                        input: "text-sm",
                      }}
                      description="Paste image URL"
                    />
                    <Button
                      size="sm"
                      variant="light"
                      style={{ color: '#6D28D9' }}
                      onPress={() => setPhotoURL('')}
                      className="w-fit"
                    >
                      Delete picture
                    </Button>
                  </div>
                </div>
              </div>

              {/* Personal Section */}
              <div className="grid grid-cols-12 gap-8 mb-8">
                <div className="col-span-3">
                  <h2 className="text-sm font-semibold mb-2">Personal</h2>
                  <p className="text-xs text-default-500">
                    These details can't be changed. Ask your supervisor to make any updates.
                  </p>
                </div>
                
                <div className="col-span-9 grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <Input
                    type="text"
                    label="First name"
                    placeholder="First name"
                    value={displayName.split(' ')[0] || ''}
                    onChange={(e) => {
                      const lastName = displayName.split(' ').slice(1).join(' ');
                      setDisplayName(lastName ? `${e.target.value} ${lastName}` : e.target.value);
                    }}
                    variant="flat"
                    classNames={{
                      input: "text-sm",
                      label: "text-xs",
                    }}
                  />
                  
                  {/* Last Name */}
                  <Input
                    type="text"
                    label="Last name"
                    placeholder="Last name"
                    value={displayName.split(' ').slice(1).join(' ') || ''}
                    onChange={(e) => {
                      const firstName = displayName.split(' ')[0] || '';
                      setDisplayName(`${firstName} ${e.target.value}`);
                    }}
                    variant="flat"
                    classNames={{
                      input: "text-sm",
                      label: "text-xs",
                    }}
                  />
                  
                  {/* Role */}
                  <Input
                    type="text"
                    label="Role"
                    placeholder="Your role"
                    value="User"
                    isReadOnly
                    variant="flat"
                    classNames={{
                      input: "text-sm",
                      label: "text-xs",
                    }}
                  />
                  
                  {/* Email */}
                  <Input
                    type="email"
                    label="Email"
                    value={user.email || ''}
                    isReadOnly
                    variant="flat"
                    classNames={{
                      input: "text-sm",
                      label: "text-xs",
                    }}
                  />
                </div>
              </div>
            </CardBody>

            <CardFooter className="flex justify-end gap-3 px-8 pb-8 pt-4 border-t border-default-200">
              <Button
                type="button"
                variant="flat"
                onPress={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: '#6D28D9', color: 'white' }}
                isLoading={loading}
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
