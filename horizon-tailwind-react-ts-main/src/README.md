# Project Structure

```
src/
├── api/                    # API service layer - Network requests and data transformations
├── assets/                 # Static assets (images, fonts, etc.)
├── components/            
│   ├── common/            # Shared components (Loader, ErrorBoundary, etc.)
│   ├── forms/             # Form components (InputField, SwitchField, etc.)
│   ├── layout/            # Layout components (Navbar, Sidebar, Footer)
│   └── ui/                # UI components (buttons, cards, icons)
├── config/                 # Application configuration
├── contexts/              # React contexts (Auth, Theme)
├── hooks/                 # Custom hooks
├── layouts/               # Page layouts (Admin, Auth)
├── routes/                # Route definitions and configuration
├── services/              # Business logic services
├── styles/                # Global styles and themes
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions and helpers
└── views/                 # Page components
    ├── admin/             # Admin pages
    └── auth/              # Authentication pages
```

## Directory Organization

### Components Structure
```
components/
├── common/               # Shared components
│   ├── ErrorBoundary/
│   ├── Loader/
│   └── Portal/
├── forms/               # Form components
│   ├── InputField/
│   ├── SelectField/
│   └── SwitchField/
├── layout/             # Layout components
│   ├── Footer/
│   ├── Navbar/
│   └── Sidebar/
└── ui/                # UI components
    ├── Button/
    ├── Card/
    └── icons/
```

### Views Structure
```
views/
├── admin/
│   ├── dashboard/
│   ├── users/
│   ├── permissions/
│   └── settings/
└── auth/
    ├── login/
    ├── register/
    └── forgot-password/
```

## Best Practices

1. **Component Organization**
   - Each component should have its own directory
   - Include index.ts for clean exports
   - Keep components focused and 
   single-responsibility
   - Use Typetype safety

2. **Code Structure**
   - Maintain consistent file naming (PascalCase for components)
   - Group related functionality together
   - Use absolute imports for better maintainability
   - Keep business logic in services layer

3. **State Management**
   - Use contexts for global state
   - Keep component state local when possible
   - Implement proper type definitions

4. **Styling**
   - Use TailwindCSS classes consistently
   - Keep custom CSS minimal
   - Follow Material Design principles
   - Maintain dark mode compatibility

5. **Performance**
   - Implement lazy loading for routes
   - Use memo and useCallback where appropriate
   - Optimize bundle size
   - Implement proper error boundaries

6. **Security**
   - Implement proper authentication checks
   - Use permission management for routes
   - Sanitize user inputs
   - Handle sensitive data properly

## File Naming Conventions

- React Components: PascalCase (e.g., `ButtonComponent.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase with type suffix (e.g., `UserType.ts`)
- Constants: UPPERCASE (e.g., `API_ENDPOINTS.ts`)

## Import Order

1. External dependencies
2. Internal modules
3. Components
4. Hooks
5. Types
6. Styles

Example:
```typescript
// External
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Internal
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/date';

// Components
import { Button } from '@/components/ui';

// Types
import { UserType } from '@/types';

// Styles
import './styles.css';