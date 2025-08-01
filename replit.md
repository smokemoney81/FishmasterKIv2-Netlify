# Overview

FishMasterKI is a comprehensive fishing companion application that helps anglers discover fishing spots, identify fish species, log catches, and access fishing tips. The application features a mobile-first design with an interactive interface for fishing enthusiasts to track their fishing activities and improve their skills.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a React-based frontend with TypeScript, built using Vite for fast development and optimized production builds. The UI is constructed with shadcn/ui components and Radix UI primitives for accessibility and consistency. Styling is handled through Tailwind CSS with a custom ocean-inspired color scheme. Client-side routing is managed by Wouter for a lightweight navigation solution.

## Backend Architecture
The backend is built with Express.js and TypeScript, serving as a REST API. The server implements a modular architecture with separate route handlers for different resource types (users, species, fishing spots, catches, tips, weather). An in-memory storage implementation provides development functionality with a clear interface for future database integration.

## Database Design
The application uses Drizzle ORM with PostgreSQL (Neon Database) for data persistence. The schema defines core entities including users, fish species, fishing spots, catches, tips, and weather data. All tables use UUID primary keys and include proper relationships with foreign key constraints.

## State Management
React Query (TanStack Query) handles all server state management, providing caching, background updates, and optimistic updates. Local component state is managed through React hooks for UI interactions and form handling.

## File Upload System
The application integrates with Google Cloud Storage for file uploads using Uppy.js for the frontend interface. A custom object storage service handles file management with ACL (Access Control List) policies for fine-grained permission control. The system supports both direct uploads and presigned URL workflows.

## Authentication & Authorization
The application includes a basic user system with profile management. The object storage system implements a flexible ACL framework supporting various access group types (user lists, email domains, group membership, subscriptions) with configurable permissions.

## Mobile-First Design
The frontend is designed with a mobile-first approach, featuring a bottom navigation bar, responsive layouts, and touch-friendly interactions. The UI adapts seamlessly between mobile and desktop viewports.

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL database hosting service
- **Drizzle ORM**: Type-safe database ORM for PostgreSQL operations

## Cloud Storage
- **Google Cloud Storage**: Object storage for user-uploaded files (fish photos, profile images)
- **Replit Object Storage Integration**: Custom integration for seamless file uploads in Replit environment

## UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## File Upload
- **Uppy.js**: Modern file uploader with dashboard UI, drag-and-drop support, and cloud storage integration
- **React Hook Form**: Form state management and validation

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

## Weather Integration
- Basic weather data structure is implemented, ready for integration with weather APIs for fishing forecasts

The application is structured to easily accommodate additional features like real-time chat, advanced mapping integration, social features, and AI-powered fish identification services.