# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local and add your Neon PostgreSQL DATABASE_URL
# Example: DATABASE_URL="postgresql://username:password@host:port/database"
```

### 2. Database Setup
```bash
# Run the complete database setup (recommended)
npm run db:setup

# OR run each step individually:
npm run db:generate  # Generate schema
npm run db:push      # Push to database  
npm run db:seed      # Add sample products
```

### 3. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📋 What's Included

✅ **Next.js 15** with App Router  
✅ **TypeScript** for type safety  
✅ **Tailwind CSS** for styling  
✅ **Drizzle ORM** for database operations  
✅ **Neon PostgreSQL** integration  
✅ **Zustand** for state management  
✅ **Better Auth** ready to implement  
✅ **Sample Nike products** database  
✅ **Responsive design**  
✅ **API routes** for products  

## 🔧 Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:setup` - Complete database setup
- `npm run db:generate` - Generate database schema
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed with sample data

## 🌟 Features Ready to Use

- **Product Grid** - Displays all Nike products
- **Product Cards** - Individual product display
- **Responsive Layout** - Mobile-first design
- **Database Integration** - Real-time product data
- **State Management** - Zustand store for products
- **Error Handling** - Graceful error boundaries
- **Loading States** - Smooth user experience

## 🚀 Next Steps

1. **Customize Products** - Edit `src/db/seed.ts`
2. **Add Authentication** - Configure Better Auth
3. **Deploy** - Push to Vercel/Netlify
4. **Add Features** - Shopping cart, user accounts, etc.

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Need help?** Check the main [README.md](README.md) for detailed instructions!
