import { lazy } from 'react';

// Lazy loading components
const MainDashboard = lazy(() => import('views/admin/default'));
const AdminAccount = lazy(() => import('views/admin/marketplace'));
const Profile = lazy(() => import('views/admin/profile'));
const DataTables = lazy(() => import('views/admin/tables'));
const SignIn = lazy(() => import('views/auth/SignIn'));
const PermissionPage = lazy(() => import('views/admin/permission/permission'));
const RolePage = lazy(() => import('views/admin/role/role'));
const QuestionPage = lazy(() => import('views/admin/question/questions'));
const DiscussionManagement = lazy(() => import('views/admin/forum/forum'));
const LearningResults = lazy(() => import('views/admin/learning/learning.results'));

// Types
export type UserRole = 'SUPER_ADMIN' | 'DOMAIN_ADMIN';

export interface RouteConfig {
  name: string;
  layout: string;
  path: string;
  icon: string;
  component: React.LazyExoticComponent<any>;
  roles?: UserRole[];
  secondary?: boolean;
  permission?: {
    module: string;
    resource?: string;
  };
  hidden?: boolean;
}

// Route configurations grouped by layout
export const adminRoutes: RouteConfig[] = [
  {
    name: "HomePage",
    layout: "/admin",
    path: "default",
    icon: "home",
    component: MainDashboard,
  },
  {
    name: "Admins",
    layout: "/admin",
    path: "account",
    icon: "admin",
    component: AdminAccount,
    permission: {
      module: "SYSTEM_MANAGEMENT"
    }
  },
  {
    name: "Users",
    layout: "/admin",
    path: "user",
    icon: "users",
    component: DataTables,
  },
  {
    name: "Courses",
    layout: "/admin",
    path: "courses",
    icon: "courses",
    component: Profile,
    permission: {
      module: "CONTENT_MANAGEMENT"
    }
  },
  {
    name: "Permission",
    layout: "/admin",
    path: "permission",
    icon: "permission",
    component: PermissionPage,
    permission: {
      module: "SYSTEM_MANAGEMENT"
    }
  },
  {
    name: "Role",
    layout: "/admin",
    path: "role",
    icon: "role",
    component: RolePage,
    permission: {
      module: "SYSTEM_MANAGEMENT"
    }
  },
  {
    name: "Question",
    layout: "/admin",
    path: "question",
    icon: "quiz",
    component: QuestionPage,
    permission: {
      module: "CONTENT_MANAGEMENT"
    }
  },
  {
    name: "Forum",
    layout: "/admin",
    path: "forum",
    icon: "forum",
    component: DiscussionManagement,
  },
  {
    name: "Result",
    layout: "/admin",
    path: "learning",
    icon: "quiz",
    component: LearningResults,
  }
];

export const authRoutes: RouteConfig[] = [
  {
    name: "Sign in",
    layout: "/auth",
    path: "sign-in",
    icon: "login",
    component: SignIn,
    hidden: true,
  }
];

// Helper functions
export const getAuthorizedRoutes = (userRole: UserRole) => {
  const allRoutes = [...adminRoutes, ...authRoutes];
  return allRoutes.filter(route => {
    if (!route.roles) return true;
    return route.roles.includes(userRole);
  });
};

export const getRoutesByLayout = (layout: string) => {
  const allRoutes = [...adminRoutes, ...authRoutes];
  return allRoutes.filter(route => route.layout === layout);
};

export const getRouteByPath = (path: string) => {
  const allRoutes = [...adminRoutes, ...authRoutes];
  return allRoutes.find(route => route.path === path);
};

export default {
  adminRoutes,
  authRoutes,
  getAuthorizedRoutes,
  getRoutesByLayout,
  getRouteByPath
};