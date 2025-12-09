// src/utils/route-constants.ts
export const publicRoutes = [
  '/',
  '/login',
  '/passkey',
  '/forbidden',
  //   "/register",
  //   "/register-verify",
  //   "/register-complete",
  //   "/reset-password",
  //   "/reset-password-verify",
  //   "/reset-password-complete",
  '/help',
  '/explore',
  '/creators',
  '/about',
];

export const privateRoutes = [
  '/admin/users',
  '/admin/roles',
  '/admin/permissions',
  '/admin/audit-logs',
  '/notifications',
  '/dashboard',
  '/profile',
  '/account',
  '/chat-bot',
  // new
  '/temperature-monitoring',
  '/turbidity-monitoring',
  '/ph-water-monitoring',
  '/water-level-monitoring',
];

const allRoutes = [
  { label: 'Chat Bot', value: '/chat-bot' },
  { label: 'Dashboard', value: '/dashboard' },
  { label: 'Account Profile', value: '/profile' },
  { label: 'Account Information', value: '/account' },
  { label: 'Notifications', value: '/notifications' },
  { label: 'Temperature Monitoring', value: '/temperature-monitoring' },
  { label: 'Turbidity Monitoring', value: '/turbidity-monitoring' },
  { label: 'pH Water Monitoring', value: '/ph-water-monitoring' },
  { label: 'Water Level Monitoring', value: '/water-level-monitoring' },
];
const adminRoutes = [
  {
    label: 'Admin - Users',
    value: '/admin/users',
  },
  {
    label: 'Admin - Roles',
    value: '/admin/roles',
  },
  {
    label: 'Admin - Permissions',
    value: '/admin/permissions',
  },
  {
    label: 'Admin - System Audit Logs',
    value: '/admin/audit-logs',
  },
];

export const routesByCategory = {
  all: allRoutes,
  administrator: [...allRoutes, ...adminRoutes],
  researcher: [...allRoutes, ...adminRoutes],
  fishpond_operator: [...allRoutes],
  monitoring_manager: [...allRoutes, ...adminRoutes],

  // Add more categories as needed
};

// Helper to get routes for a specific category
export const getRoutesByCategory = (
  category: keyof typeof routesByCategory,
) => {
  return routesByCategory[category] || [];
};

// Helper to get all route values (for default selection)
export const getAllRouteValues = () => {
  return Object.values(routesByCategory)
    .flat()
    .map((r) => r.value);
};

// Type for route items
export type RouteItem = {
  label: string;
  value: string;
};

// Type for category keys
export type RouteCategory = keyof typeof routesByCategory;
