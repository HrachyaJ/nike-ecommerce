# Nike E-commerce App

A modern Next.js e-commerce application built with TypeScript, Tailwind CSS, Drizzle ORM, and Neon PostgreSQL.

## Features

- 🚀 **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for modern, responsive design
- 🗄️ **Drizzle ORM** for type-safe database operations
- 🐘 **Neon PostgreSQL** for serverless database
- 🔐 **Better Auth** for authentication (ready to implement)
- 📱 **Responsive design** with mobile-first approach
- 🎯 **Zustand** for state management
- ✨ **TypeScript** for type safety

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **State Management**: Zustand
- **Authentication**: Better Auth (ready to implement)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database account

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nike-ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the environment template and fill in your values:

```bash
cp env.example .env.local
```

Update `.env.local` with your database credentials:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

### 4. Set up the database

Generate the database schema:

```bash
npm run db:generate
```

Push the schema to your database:

```bash
npm run db:push
```

Seed the database with sample Nike products:

```bash
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The app includes a `products` table with the following structure:

- `id`: Primary key (auto-increment)
- `name`: Product name
- `description`: Product description
- `category`: Product category (Sneakers, Running, Basketball, etc.)
- `price`: Product price (decimal)
- `imageUrl`: Product image URL
- `brand`: Brand name
- `size`: Product size (optional)
- `color`: Product color (optional)
- `stockQuantity`: Available stock
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   │   └── products/   # Products API
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/          # React components
│   ├── ProductCard.tsx # Individual product display
│   └── ProductGrid.tsx # Products grid layout
├── db/                 # Database configuration
│   ├── index.ts        # Database connection
│   ├── schema.ts       # Database schema
│   └── seed.ts         # Sample data
└── store/              # State management
    └── useStore.ts     # Zustand store
```

## API Endpoints

- `GET /api/products` - Fetch all products

## Customization

### Adding New Products

1. Update the `sampleProducts` array in `src/db/seed.ts`
2. Run `npm run db:seed` to update the database

### Modifying the Schema

1. Update the schema in `src/db/schema.ts`
2. Run `npm run db:generate` to create migrations
3. Run `npm run db:push` to apply changes

### Styling

The app uses Tailwind CSS. Modify the classes in the components to change the appearance.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
