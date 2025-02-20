# Shared Shopping List

A collaborative shopping list application that allows families and groups to manage their shopping lists in real-time. Built with Next.js, TypeScript, and modern web technologies.

## Features

- Real-time collaborative shopping lists
- User authentication with Clerk
- Premium features with Stripe integration
- Responsive design with Tailwind CSS
- State management with Redux Toolkit
- Database management with Prisma and PostgreSQL

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account for authentication
- Stripe account for payments

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables
3. Install dependencies:
   ```bash
   npm install
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sharedlist?schema=public"

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── lists/            # List management pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
│   ├── prisma.ts         # Prisma client
│   └── redux/            # Redux store and slices
├── prisma/               # Database schema and migrations
└── public/               # Static files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.