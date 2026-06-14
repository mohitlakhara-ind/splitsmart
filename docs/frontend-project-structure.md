# Frontend Project Structure (React + Expo)

This document outlines the proposed folder and file structure for the Splitwiser frontend application, specifically tailored for a **React Native project using Expo**. This structure aims for modularity, scalability, and maintainability.

## Root Directory

The root directory of the Expo project (`splitwiser-app` or similar) would typically contain:

```
/splitwiser-app/
|-- /assets                     # Static assets (images, fonts, etc.)
|   |-- /images
|   |-- /fonts
|   `-- icon.png                # App icon
|   `-- splash.png              # Splash screen
|-- /src                        # Main application source code (often named 'app' or 'src')
|   |-- /api                    # API service integrations
|   |   |-- authApi.js
|   |   |-- userApi.js
|   |   |-- groupApi.js
|   |   |-- expenseApi.js
|   |   `-- apiClient.js        # Axios or fetch client setup
|   |-- /components             # Reusable UI components (dumb components)
|   |   |-- /common             # Generic, widely used components (Button, Input, Card, ListItem)
|   |   |   |-- Button.jsx
|   |   |   |-- InputField.jsx
|   |   |   |-- Card.jsx
|   |   |   `-- ...
|   |   |-- /auth               # Components specific to authentication (LoginForm, SignupForm)
|   |   |-- /dashboard          # Components for the main dashboard/overview
|   |   |-- /expenses           # Components related to expense management (ExpenseForm, ExpenseList)
|   |   |-- /groups             # Components related to group management (GroupCard, GroupCreateForm)
|   |   `-- /user               # Components for user profile, settings
|   |-- /config                 # Application configuration
|   |   |-- apiEndpoints.js     # Centralized API endpoint definitions
|   |   `-- theme.js            # Global styling variables (colors, fonts, spacing)
|   |-- /constants              # Application-wide constants (e.g., route names, action types)
|   |   |-- navigation.js
|   |   `-- index.js
|   |-- /contexts               # React Context API for global state management
|   |   |-- AuthContext.js
|   |   |-- GroupContext.js
|   |   `-- NotificationContext.js
|   |-- /hooks                  # Custom React hooks for reusable logic
|   |   |-- useAuth.js
|   |   |-- useApi.js           # Hook for making API calls
|   |   `-- useNotifications.js
|   |-- /navigation             # Navigation setup (React Navigation)
|   |   |-- AppNavigator.jsx    # Main navigator (stack, tabs, drawer)
|   |   |-- AuthNavigator.jsx   # Navigator for authentication screens
|   |   `-- index.js            # Entry point for navigation logic
|   |-- /screens                # Top-level components representing application screens
|   |   |-- AuthLoadingScreen.jsx # Screen to check auth state
|   |   |-- LoginScreen.jsx
|   |   |-- SignupScreen.jsx
|   |   |-- DashboardScreen.jsx
|   |   |-- ExpenseCreateScreen.jsx
|   |   |-- ExpenseDetailScreen.jsx
|   |   |-- GroupCreateScreen.jsx
|   |   |-- GroupDashboardScreen.jsx
|   |   |-- SettingsScreen.jsx
|   |   `-- UserProfileScreen.jsx
|   |-- /services               # Modules for handling business logic (can be part of /api or /hooks)
|   |   |-- authService.js      # Higher-level auth functions using authApi
|   |   |-- userService.js
|   |   |-- groupService.js
|   |   `-- expenseService.js
|   |-- /store                  # State management (e.g., Redux, Zustand - if Context API is not enough)
|   |   |-- /actions
|   |   |-- /reducers
|   |   `-- index.js
|   |-- /styles                 # Global and shared stylesheets (if not using inline/component-level styling primarily)
|   |   `-- global.js           # StyleSheet objects for global styles
|   |-- /utils                  # Utility functions, helpers
|   |   |-- dateFormatter.js
|   |   |-- formValidators.js
|   |   `-- helpers.js
|   |-- App.js                  # Root application component (entry point for Expo)
|
|-- .env                        # Environment variables (use with expo-constants)
|-- .eslintrc.js                # ESLint configuration
|-- .gitignore
|-- .prettierrc.js              # Prettier configuration
|-- app.json                    # Expo configuration file
|-- babel.config.js             # Babel configuration (often pre-configured by Expo)
|-- eas.json                    # EAS Build configuration (if using EAS)
|-- package.json                # Project dependencies and scripts
|-- README.md                   # Project overview and setup instructions
`-- tsconfig.json               # TypeScript configuration (if using TypeScript)

## Key Considerations for React + Expo

*   **Expo Specific Files**: `app.json` is crucial for configuring your Expo app (name, icon, splash screen, plugins, etc.). `eas.json` is for configuring EAS Build and Submit.
*   **Directory Naming**: The main source code directory is often just `src/` or `app/` in Expo projects.
*   **Navigation**: React Navigation is the standard choice for routing and navigation in React Native / Expo apps. The `/navigation` folder will house these configurations.
*   **Styling**: Styling in React Native is typically done using JavaScript objects and the `StyleSheet` API. Styles can be co-located with components, or a `/styles` directory can be used for more global/shared styles.
*   **Assets**: The `/assets` folder at the root is the standard place for images, fonts, etc., in an Expo project.
*   **No `public` folder or `index.html`**: Unlike web projects, React Native/Expo apps don't have a `public` folder or an `index.html` file. The entry point is `App.js`.
*   **State Management**: React Context (`/contexts`) is a good starting point. For more complex state, libraries like Redux or Zustand (`/store`) can be integrated.
*   **File Extensions**: `.js` or `.jsx` for JavaScript files. If using TypeScript, `.ts` or `.tsx`.
*   **Testing**: Test files (e.g., `*.test.js` or `*.spec.js`) are typically co-located with the source files in `__tests__` subdirectories or alongside the files they test.

This structure provides a solid foundation for building a scalable and maintainable mobile application for Splitwiser using React and Expo.
