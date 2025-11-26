# Portfolio Platform - Project Documentation

## Overview

A GitHub-imported portfolio template platform built in Replit enabling users to browse and preview six distinct portfolio templates. Users can create custom portfolios using an interactive builder, input personal details, and store them in a Supabase database with unique slug-based URLs. The platform supports public sharing of portfolios (e.g., `/portfolio/username`) and now includes an authentication system for user account management and personalized dashboards.

**Business Vision & Market Potential:** This platform aims to provide a streamlined, customizable solution for professionals and creatives to showcase their work online. By offering diverse, high-quality templates and an intuitive builder, it targets individuals seeking a quick, professional online presence without requiring coding skills. Future enhancements will focus on analytics, custom domains, and advanced customization to capture a broader market.

## User Preferences

- Design aesthetic: Neo-Brutalist Minimalist (clean, modern)
- Color scheme: High contrast (white/black/spring green)
- Animation style: Smooth, purposeful animations (not excessive)
- Content focus: Professional portfolio functionality
- Accessibility: Clean, readable typography

## System Architecture

The platform is built with React 19.2 and TypeScript for the frontend, styled using Tailwind CSS with custom animations and Framer Motion for smooth transitions. The backend leverages Supabase (PostgreSQL) for database management and Clerk for authentication. Vite 6.2 is used as the build tool, and Lucide React provides UI icons. Three.js is included for potential 3D graphics.

**UI/UX Decisions:**
- **Neo-Brutalist Minimalist (Template 1):** Features a white background, black text, spring green accents, hard offset shadows, clean sans-serif typography, and smooth transitions.
- **Cyberpunk DevFolio (Template 2):** Designed with a deep void black/midnight blue background, off-white/silver primary text, neon cyan/purple/matrix green accents. It incorporates Orbitron and JetBrains Mono fonts, glassmorphism panels, scanline overlays, terminal-style typing, glitch effects, neon glows, and particle network animations. Sections include HUD navigation, a terminal-style hero, system specs, holographic service cards, and a command-line contact form.

**Technical Implementations:**
- **Template System:** Supports 6 distinct templates with interactive previews, demo data, and responsive design.
- **Portfolio Builder:** A multi-tab form with real-time validation, image upload, and state management for basic info, services, projects, and social media.
- **Supabase Integration:** Handles secure database connection, CRUD operations for portfolios, slug availability checking, and row-level security.
- **URL Routing:** Implements slug-based URLs (`/portfolio/[slug]`) with validation and duplicate prevention.
- **Authentication:** Integrates Clerk for sign-up/sign-in, user session management, and syncing user profiles with Supabase. Authenticated users have a "My Portfolios" dashboard.

**Feature Specifications:**
- **Templates:** Includes "Neo-Brutalist Minimalist" and "Cyberpunk DevFolio" with distinct visual and interactive elements.
- **Builder:** Dedicated builder for each template (e.g., `DevFolioBuilder.tsx` for Cyberpunk) allowing specific customizations like skill proficiency, stats, and themed icon selections.
- **Portfolio Display:** Publicly viewable portfolios at `/portfolio/[slug]` are fully responsive and beautifully display all user-provided data.

## External Dependencies

- **Database:** Supabase (PostgreSQL) for all data storage, including user profiles and portfolio content.
- **Authentication:** Clerk (`@clerk/clerk-react`) for user authentication, session management, and user data synchronization.
- **Styling & Animation:** Tailwind CSS, Framer Motion, and Lucide React (for icons).
- **3D Graphics (Optional):** Three.js.
- **Environment Variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`.