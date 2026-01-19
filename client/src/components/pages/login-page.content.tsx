import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/forms/auth.form';
import ClearLocalStorage from '@/components/customs/clear-localstorage';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Wind, Bell } from 'lucide-react';

const LoginPageContent = async () => {
  const cookieStore = await cookies();

  const authToken = cookieStore.get('_auth_token_')?.value;
  // const passkeyToken = cookieStore.get('_passkey_token_')?.value;
  const sessionId = cookieStore.get('sessionId')?.value;

  if (authToken && sessionId) {
    redirect('/dashboard');
  }

  // if (authToken && passkeyToken && sessionId) {
  //   redirect('/dashboard');
  // }

  // if (authToken && !passkeyToken) {
  //   redirect('/passkey');
  // }

  return (
    <div className="flex min-h-screen">
      <ClearLocalStorage />

      {/* Left side - branding and info (no background image) */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-12 text-white relative overflow-hidden bg-background">
        {/* Content */}
        <div className="space-y-8 animate-fadeIn relative z-0">
          {/* Logo and header */}
          <div className="flex items-center gap-4">
            <img
              src="/images/hrm-logo.png"
              alt="smart pond Logo"
              className="w-16 h-16 rounded-lg border-2 border-white/40 shadow-md"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                Pond Watch
              </h1>
              <p className="text-lg text-gray-600 dark:text-primary font-medium drop-shadow-sm">
                A Real-Time Water Quality and Aeration Monitoring System
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-200 max-w-md drop-shadow-md leading-relaxed">
            Manage and monitor your fishpond efficiently with Smart Fishpond, a
            real-time system that tracks water quality and controls aeration to
            maintain optimal conditions for aquatic life.
          </p>

          {/* Feature Cards */}
          <div className="space-y-4">
            <Card className="bg-chart-5/10 dark:bg-chart-5/20 border border-blue-400/20 rounded-2xl hover:bg-blue-500/20 transition">
              <CardContent className="p-3 flex items-start gap-4">
                <div className="p-2 bg-blue-600/30 rounded-lg">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Real-Time Water Monitoring
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    Continuously track water quality parameters like
                    temperature, pH, and turbidity to ensure optimal fish
                    health.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-chart-5/10 dark:bg-chart-5/20 border border-blue-400/20 rounded-2xl hover:bg-blue-500/20 transition">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2 bg-blue-600/30 rounded-lg">
                  <Wind className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Aeration Control
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    Automatically manage aerators to maintain proper oxygen
                    levels for a healthy aquatic environment.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-chart-5/10 dark:bg-chart-5/20 border border-blue-400/20 rounded-2xl hover:bg-blue-500/20 transition">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2 bg-blue-600/30 rounded-lg">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Alerts & Notifications
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    Receive instant alerts for critical water quality changes or
                    equipment issues to take timely action.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right side - login form with background image */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-10 relative overflow-hidden">
        {/* Background image */}
        <img
          src="/images/login-bg.png"
          alt="HRM Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/60 dark:bg-background/70 z-1" />

        {/* Login form container */}
        <div className="w-full max-w-md relative z-2">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold "> Pond Watch Login</h2>
            <p className="text-sm  mt-2">
              Access your account to manage and monitor.
            </p>
          </div>

          {/* Form */}
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPageContent;
