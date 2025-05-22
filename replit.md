# Animes2u Community Platform

## Overview

Animes2u is a full-stack web application that serves as a community platform for anime enthusiasts. The platform allows users to browse, search, and filter anime content, with links to watch anime through Telegram channels. It features an admin dashboard for content management, user authentication, and a responsive UI optimized for both desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern client-server architecture with:

1. **Frontend**: React-based SPA (Single Page Application) with TypeScript
2. **Backend**: Express.js API server with TypeScript
3. **Database**: PostgreSQL with Drizzle ORM
4. **Styling**: Tailwind CSS with shadcn/ui components
5. **State Management**: React Query for server state management
6. **Routing**: Wouter for client-side routing
7. **Authentication**: Session-based authentication with express-session

This architecture was chosen to provide a smooth user experience with efficient data loading while maintaining a clear separation of concerns between the frontend and backend. The project uses TypeScript throughout to ensure type safety and improve developer experience.

## Key Components

### Backend Components

1. **Express Server** (`server/index.ts`): The main server entry point that sets up middleware, routes, and handles API requests.

2. **API Routes** (`server/routes.ts`): Defines all API endpoints for anime data, user authentication, and admin operations.

3. **Data Storage** (`server/storage.ts`): Implements data access logic with an interface pattern that allows for different storage backends.

4. **Database Schema** (`shared/schema.ts`): Defines the database schema using Drizzle ORM with tables for users and anime entries.

### Frontend Components

1. **Pages**:
   - `HomePage`: Main landing page displaying recommended, trending, and recently added anime
   - `AdminLogin`: Authentication page for admin users
   - `AdminDashboard`: Content management interface for administrators
   - `AnimeForm`: Form for adding/editing anime entries

2. **UI Components**:
   - `Navbar`: Main navigation component
   - `FeaturedCarousel`: Carousel for featured anime
   - `AnimeCard`: Card component for displaying anime information
   - `SearchBar`: Component for search and filtering functionality
   - `GenreBadge`, `StatusBadge`, `LanguageBadge`: Visual indicators for anime metadata

3. **Utility Components**:
   - `TelegramButton`: Button linking to Telegram channels
   - `ThemeToggle`: Component for switching between light and dark themes
   - `Pagination`: Component for paginating results

## Data Flow

The application follows a standard client-server data flow:

1. **API Requests**: The frontend makes requests to the backend API using React Query, which handles caching, loading states, and error handling.

2. **Authentication Flow**:
   - User submits login credentials to `/api/auth/login`
   - Server validates credentials and creates a session
   - Session cookie is stored in the browser
   - Protected routes check for valid session

3. **Anime Data Flow**:
   - On initial load, the client fetches recommended, trending, and recent anime
   - Search and filtering requests are sent to the server when the user interacts with filters
   - View counts are incremented when users click on anime entries

4. **Admin Operations**:
   - Admins can create, edit, and delete anime entries
   - Changes are immediately reflected in the UI after successful API operations

## External Dependencies

### Frontend Dependencies
- React for UI rendering
- Tailwind CSS for styling
- shadcn/ui components (based on Radix UI) for UI components
- React Query for data fetching and caching
- React Hook Form for form handling
- Zod for schema validation
- Wouter for routing

### Backend Dependencies
- Express for the HTTP server
- Drizzle ORM for database access
- express-session for session management
- PostgreSQL for data storage

### Shared Dependencies
- TypeScript for type checking
- Zod for schema validation and type generation

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Development Mode**:
   - Running `npm run dev` starts both the backend server and frontend development server
   - Vite handles hot module replacement for the frontend

2. **Production Build**:
   - `npm run build` compiles the frontend into static assets and the backend into a bundled Node.js application
   - The built assets are served from the `dist` directory

3. **Database**:
   - The application is configured to use Replit's PostgreSQL database
   - The schema is managed through Drizzle ORM with migrations

4. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Secret for session encryption

The application is designed to be easily deployable with minimal configuration, leveraging Replit's built-in database and hosting capabilities.