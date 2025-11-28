// src/lib/sidebar.ts

import {
  LayoutDashboard,
  User,
  Briefcase,
  Star,
  MessageCircle,
  Bookmark,
  Calendar,
  Heart,
  Settings,
  Users,
  FileText,
  BarChart3,
  Shield,
  HandHelping,
  Building,
  Wallet,
} from 'lucide-react';
import { UserRole, SupporterType } from '@/types/auth';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
  supporterTypes?: SupporterType[];
}

export const sidebarItems: SidebarItem[] = [
  // === COMMON TO BOTH ===
   {
  title: 'My Analytics',
  href: '/my-analytics',
  icon: BarChart3,
  roles: ['participant', 'supporter'],
},

  // === PARTICIPANT ONLY ===
  // {
  //   title: 'Profile',
  //   href: '/profile',
  //   icon: User,
  //   roles: ['participant'],
  // },
  {
    title: 'Opportunities',
    href: '/opportunities',
    icon: Briefcase,
    roles: ['participant'],
  },
  // {
  //   title: 'Applications',
  //   href: '/applications',
  //   icon: FileText,
  //   roles: ['participant'],
  // },
  // {
  //   title: 'Portfolio',
  //   href: '/portfolio',
  //   icon: Star,
  //   roles: ['participant'],
  // },
  // {
  //   title: 'Bookmarks',
  //   href: '/bookmarks',
  //   icon: Bookmark,
  //   roles: ['participant'],
  // },
  {
    title: 'Events',
    href: '/events',
    icon: Calendar,
    roles: ['participant'],
  },
  {
    title: 'Messaging',
    href: '/messaging',
    icon: MessageCircle,
    roles: ['participant'],
  },

  // === SUPPORTER ONLY ===
  
  {
    title: 'Opportunities',
    href: '/opportunities',
    icon: Briefcase,
    roles: ['supporter'],
  },
  {
    title: 'Donations',
    href: '/donations',
    icon: Heart,
    roles: ['supporter'],
    supporterTypes: ['donor'],
  },
  // {
  //   title: 'Volunteer',
  //   href: '/volunteer',
  //   icon: HandHelping,
  //   roles: ['supporter'],
  //   supporterTypes: ['volunteer'],
  // },
  // {
  //   title: 'Talent Requests',
  //   href: '/match-requests',
  //   icon: Users,
  //   roles: ['supporter'],
  // },

  // === ADMIN ONLY ===
   {
    title: 'Analytics',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ["admin"],
  },

  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    roles: ['admin'],
  },
  // {
  //   title: 'Content Review',
  //   href: '/admin/review',
  //   icon: Shield,
  //   roles: ['admin'],
  // },
  {
    title: 'All Opportunities',
    href: '/admin/create-opportunity',
    icon: Briefcase,
    roles: ['admin'],
  },

  // === COMMON BOTTOM ===
  {
    title: 'Events',
    href: '/events',
    icon: Calendar,
    roles: ['supporter', 'admin'],
  },
  {
    title: 'Messaging',
    href: '/messaging',
    icon: MessageCircle,
    roles: ['supporter', 'admin'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  
];