import { db } from './index';
import { products } from './schema';

const sampleProducts = [
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers unrivaled, all-day comfort. The shoe\'s design draws inspiration from Air Max icons, showcasing Nike\'s greatest innovation with its large window and fresh array of colors.',
    category: 'Sneakers',
    price: 150.00,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    brand: 'Nike',
    size: 'US 10',
    color: 'Black/White',
    stockQuantity: 25,
  },
  {
    name: 'Nike Zoom Pegasus 38',
    description: 'The Nike Zoom Pegasus 38 delivers more responsive cushioning than ever before. A wider forefoot provides a more accommodating fit, while the breathable upper keeps your feet cool and comfortable.',
    category: 'Running',
    price: 120.00,
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
    brand: 'Nike',
    size: 'US 9',
    color: 'Blue/White',
    stockQuantity: 30,
  },
  {
    name: 'Nike Air Jordan 1 Retro High',
    description: 'The Air Jordan 1 Retro High maintains the iconic look that Michael Jordan made famous. The shoe features a premium leather upper with classic Air Jordan branding.',
    category: 'Basketball',
    price: 170.00,
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop',
    brand: 'Nike',
    size: 'US 11',
    color: 'Red/Black',
    stockQuantity: 15,
  },
  {
    name: 'Nike Dri-FIT Training Shorts',
    description: 'The Nike Dri-FIT Training Shorts feature a lightweight, breathable fabric that wicks away sweat to help you stay dry and comfortable during your workout.',
    category: 'Apparel',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
    brand: 'Nike',
    size: 'M',
    color: 'Gray',
    stockQuantity: 40,
  },
  {
    name: 'Nike Metcon 6',
    description: 'The Nike Metcon 6 is designed for high-intensity training. It features a breathable upper and stable heel for lifting, with a flexible forefoot for dynamic movements.',
    category: 'Training',
    price: 130.00,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773d7e3c?w=500&h=500&fit=crop',
    brand: 'Nike',
    size: 'US 10.5',
    color: 'Black/Red',
    stockQuantity: 20,
  },
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // Clear existing data
    await db.delete(products);
    
    // Insert sample products
    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);
    console.log('Sample products:', insertedProducts);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
