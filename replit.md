# Overview

Ahuyy is a modern wedding invitation web application featuring a luxurious glassmorphism design aesthetic. The application provides a romantic, iOS-style interface for wedding invitations with integrated RSVP functionality, guest messaging, and real-time data management through Google Sheets. The project combines elegant frontend animations with seamless backend data handling to create an immersive wedding experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a modern vanilla JavaScript architecture with a class-based approach for state management and component organization. The frontend implements:

- **Single Page Application (SPA)** design with dynamic content loading
- **Glassmorphism UI** with iOS-inspired design patterns using CSS variables and advanced styling
- **Responsive design** optimized for mobile-first experience
- **Progressive Web App (PWA)** capabilities with offline-ready features
- **Animation system** including preloaders, scroll animations, and interactive elements
- **Image gallery** with lightbox functionality and lazy loading
- **Real-time countdown** to wedding date with dynamic updates
- **Audio integration** for background music control

## Backend Architecture
The backend is built with Express.js using ES6 modules and implements:

- **RESTful API** endpoints for RSVP and message handling
- **Middleware configuration** for JSON parsing with 10MB limit and static file serving
- **Service account authentication** for secure Google Sheets integration
- **Error handling** with graceful fallbacks for missing configurations
- **Environment-based configuration** for deployment flexibility

## Data Storage Solution
The application uses Google Sheets as the primary data storage mechanism:

- **Google Sheets API v4** integration for real-time data synchronization
- **Service account authentication** using private key and client email credentials
- **Spreadsheet structure** with dedicated sheets for user data (myuser sheet referenced)
- **Real-time read/write operations** for RSVP responses and guest messages
- **No traditional database** - leveraging Google Sheets for simplicity and real-time collaboration

## Authentication & Authorization
The system implements service account authentication for Google Services:

- **Google Auth library** with OAuth 2.0 service account flow
- **Environment-based credentials** with secure private key handling
- **Scoped permissions** limited to Google Sheets API access
- **Credential validation** with connection testing on startup

## Deployment Architecture
The application is configured for multiple deployment platforms:

- **Vercel deployment** with serverless function configuration
- **Static asset serving** through Express.js for local development
- **Environment variable management** for secure credential handling
- **Port configuration** with fallback for different hosting environments

# External Dependencies

## Core Framework Dependencies
- **Express.js 4.18.2** - Web application framework for API endpoints and static serving
- **googleapis 126.0.1** - Official Google APIs client library for Sheets integration

## Development Dependencies
- **nodemon 3.0.1** - Development server with auto-restart functionality

## Frontend Dependencies (CDN-based)
- **Google Fonts** - Typography system using Manrope and Fraunces font families
- **Font Awesome 6.4.0** - Icon library for UI elements and interactive components

## Google Services Integration
- **Google Sheets API v4** - Primary data storage and management system
- **Google Auth Service** - Authentication for secure API access
- **Google Cloud Service Account** - Server-to-server authentication mechanism

## Hosting & Deployment Services
- **Vercel** - Primary deployment platform with serverless configuration
- **Node.js Runtime** - Server environment for Express.js application

## Browser APIs
- **Web Audio API** - Background music control and audio management
- **Intersection Observer API** - Scroll-based animations and lazy loading
- **localStorage** - Client-side state persistence for user preferences