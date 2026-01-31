# Hotel Dashboard

A modern, full-featured hotel management dashboard built with Next.js 16, React 19, and TypeScript. This application demonstrates best practices in frontend architecture, type-safe patterns, and modern UI/UX design.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

## Screenshots

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="800"/>
</p>

<p align="center">
  <img src="docs/screenshots/bookings.png" alt="Bookings" width="800"/>
</p>

<p align="center">
  <img src="docs/screenshots/booking-dialog.png" alt="New Booking Dialog" width="800"/>
</p>

## Features

- **Dashboard Overview** - Real-time statistics, revenue charts, and recent activities
- **Booking Management** - Full CRUD operations with multi-step booking wizard
- **Guest Profiles** - Detailed guest information with booking history
- **Reviews Management** - Guest reviews with filtering and sorting
- **Messaging System** - In-app communication with guests
- **Responsive Design** - Optimized for desktop and tablet screens

## Tech Stack

### Core
- **Next.js 16** with App Router and Turbopack
- **React 19** with latest features
- **TypeScript** for full type safety

### State & Data
- **TanStack Query** for server state management
- **neverthrow** for type-safe error handling with Result types
- **ts-pattern** for exhaustive pattern matching

### UI & Styling
- **Tailwind CSS 4** for utility-first styling
- **Radix UI** for accessible, unstyled components
- **Lucide Icons** for consistent iconography
- **Recharts** for data visualization
- **Sonner** for toast notifications

### Testing
- **Vitest** for unit and integration tests
- **React Testing Library** for component testing
- **MSW (Mock Service Worker)** for API mocking
- Security tests for XSS, CSRF, and authentication

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hotel-dashboard.git
cd hotel-dashboard

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:security` | Run security-focused tests |
| `npm run test:components` | Run component tests |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── bookings/          # Booking management
│   ├── messages/          # Messaging system
│   ├── reviews/           # Reviews management
│   └── page.tsx           # Dashboard home
├── components/
│   ├── bookings/          # Booking-related components
│   ├── dashboard/         # Dashboard widgets
│   ├── layout/            # Layout components (Sidebar, Header)
│   └── ui/                # Reusable UI components
├── data/                   # Mock data and data utilities
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and patterns
├── mocks/                  # MSW handlers
├── types/                  # TypeScript type definitions
└── __tests__/             # Test files
```

## Architecture Highlights

### Type-Safe Error Handling

Using `neverthrow` for explicit error handling:

```typescript
const result = await api.bookings.getById(id)
result.match(
  (booking) => setBooking(booking),
  (error) => showError(error.message)
)
```

### Exhaustive Pattern Matching

Using `ts-pattern` for type-safe conditionals:

```typescript
const statusConfig = match(status)
  .with('confirmed', () => ({ color: 'green', label: 'Confirmed' }))
  .with('pending', () => ({ color: 'yellow', label: 'Pending' }))
  .with('cancelled', () => ({ color: 'red', label: 'Cancelled' }))
  .exhaustive()
```

### Component-Based Architecture

Modular, reusable components following React best practices with proper separation of concerns.

## Testing

The project includes comprehensive tests:

- **Component Tests** - UI component behavior
- **Security Tests** - XSS prevention, CSRF protection, authentication
- **Integration Tests** - API interactions with MSW

Run all tests:

```bash
npm run test
```

## Deployment

Deploy easily to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hotel-dashboard)

Or build and deploy manually:

```bash
npm run build
npm run start
```

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

---

Built with ❤️ by Breno Pereira
