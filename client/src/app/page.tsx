// app/page.tsx (Home page)
// import LoginPageContent from '@/components/pages/login-page.content';
import HomeSection from '@/components/pages/home-page/home-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | RVTM AMS',
  description: 'Sign in to access the RVTM AMS system',
};

export default async function Home() {
  return <HomeSection />;
}
