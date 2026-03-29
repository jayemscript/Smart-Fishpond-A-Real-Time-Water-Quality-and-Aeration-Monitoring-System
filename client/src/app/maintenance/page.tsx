import MaintenancePage from '@/components/customs/maintenance';
import type { Metadata } from 'next';

export const metadata = {
  title: 'Maintenance | ',
  description:
    'The system is currently under maintenance. Please check back later.',
};

export default function Maintenance() {
  return <MaintenancePage />;
}
