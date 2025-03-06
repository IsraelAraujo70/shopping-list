# Shared Shopping List

A shared shopping list application built with Next.js, Prisma, and Clerk.

## Features

- User authentication with Clerk
- Creation and management of shopping lists
- Adding items with estimated prices and quantities
- Automatic calculation of total estimated value
- Marking items as completed
- Families and list sharing
- Responsive and user-friendly interface

## Family and Sharing Functionality

### Families

- Creation of families to share shopping lists
- Adding members to the family using user ID
- Family member management (add/remove)
- View all family members

### List Sharing

- Sharing lists with individual users
- Sharing lists with all family members
- Viewing lists shared by other users
- Permission control (view/edit)
- Removing shares

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Hosting**: Vercel

## Project Structure

- `/app`: Application pages and routes
- `/components`: Reusable components
- `/lib`: Utilities and configurations
- `/prisma`: Database schema and migrations

## Data Models

### List
- id: String
- name: String
- userId: String
- familyId: String (optional)
- items: Item[]
- shares: ListShare[]

### Item
- id: String
- name: String
- estimatedPrice: Float (optional)
- quantity: Int
- completed: Boolean
- listId: String

### Family
- id: String
- name: String
- ownerId: String
- members: FamilyMember[]
- lists: List[]

### FamilyMember
- id: String
- userId: String
- familyId: String
- role: String (owner, member)

### ListShare
- id: String
- listId: String
- userId: String
- canEdit: Boolean

## How to Use

1. Create an account or log in
2. Create shopping lists on the main page
3. Add items to your lists
4. Create families and add members
5. Share your lists with family or friends
6. Access lists shared with you in the "Shared" section

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