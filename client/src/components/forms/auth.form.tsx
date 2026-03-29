'use client';
import React, { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Auth } from '@/api/protected/auth.api';
import { EyeIcon, EyeOffIcon, MailIcon } from 'lucide-react';
import { AuthFormData } from './interfaces/shared-form.interface';
import { showToastSuccess, showToastError } from '@/utils/toast-config';

const AuthForm = () => {
  const router = useRouter();
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const initialFormData: AuthFormData = {
    email: '',
    password: '',
  };
  const [formData, setFormData] = useState<AuthFormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Auth(formData);
      setError('');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: response.user.id,
          username: response.user.username,
        }),
      );
      router.replace('/dashboard');
      showToastSuccess('Success Login', response.message, 'top-right');
      window.location.reload();
    } catch (error: unknown) {
      showToastError('Login Failed', extractErrorMessage(error), 'top-right');
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <>
      <Card className="w-full p-6 shadow-xl  bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl  border border-blue-200/30 dark:border-blue-800/40">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center text-white">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {/* email */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="email" className="text-black dark:text-white">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pe-9 bg-white dark:bg-black dark:text-white"
                />
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                  <MailIcon size={16} aria-hidden="true" />
                </div>
              </div>
            </div>
            {/* password */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="password" className="text-black dark:text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id={id}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  type={isVisible ? 'text' : 'password'}
                  className="bg-white dark:bg-black dark:text-white pe-9"
                />
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? 'Hide password' : 'Show password'}
                  aria-pressed={isVisible}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOffIcon size={16} aria-hidden="true" />
                  ) : (
                    <EyeIcon size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* buttons */}
            <Button
              type="submit"
              className="w-full mt-2 
             bg-primary text-darkblue hover:bg-slate-300 
             dark:bg-primary dark:text-cream dark:hover:bg-darkblue cursor-pointer"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AuthForm;
