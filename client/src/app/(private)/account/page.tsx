import React from 'react';
import AccountPageContent from '@/components/pages/account-page.content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account | ',
  description: 'Account Informations',
};

export default function AccountPage() {
  return (
    <div>
      <AccountPageContent />
    </div>
  );
}
