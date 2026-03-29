// app/(public)/login/page.tsx
import LoginPageContent from '@/components/pages/login-page.content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | ',
  description: 'Sign in to access the ',
};

export default async function LoginPage() {
  return <LoginPageContent />;
}
