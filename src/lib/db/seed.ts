import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { FILTER_CATEGORIES } from "../constants";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function seedFiltersAndBrand() {
  const gendersData = [
    { label: "Men", slug: "men" },
    { label: "Women", slug: "women" },
    { label: "Kids", slug: "kids" },
  ];
  for (const g of gendersData) {
    await db
      .insert(schema.genders)
      .values(g)
      .onConflictDoNothing({ target: schema.genders.slug });
  }

  const colorsData = [
    { name: "Black", slug: "black", hexCode: "#000000" },
    { name: "White", slug: "white", hexCode: "#FFFFFF" },
    { name: "Red", slug: "red", hexCode: "#FF0000" },
    { name: "Blue", slug: "blue", hexCode: "#0000FF" },
    { name: "Green", slug: "green", hexCode: "#00FF00" },
    { name: "Grey", slug: "grey", hexCode: "#808080" },
  ];
  for (const c of colorsData) {
    await db
      .insert(schema.colors)
      .values(c)
      .onConflictDoNothing({ target: schema.colors.slug });
  }

  const sizesData = FILTER_CATEGORIES.SIZE_LABELS.map(
    (name: string, i: number) => ({
      name,
      slug: name.toLowerCase(),
      sortOrder: i,
    })
  );
  for (const s of sizesData) {
    await db
      .insert(schema.sizes)
      .values(s)
      .onConflictDoNothing({ target: schema.sizes.slug });
  }

  const brand = {
    name: "Nike",
    slug: "nike",
    logoUrl: null as unknown as string | null,
  };
  await db
    .insert(schema.brands)
    .values(brand)
    .onConflictDoNothing({ target: schema.brands.slug });
}

async function seedCategoriesAndCollections() {
  const categories = [
    { name: "Running", slug: "running" },
    { name: "Basketball", slug: "basketball" },
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Training", slug: "training" },
  ];
  for (const c of categories) {
    await db
      .insert(schema.categories)
      .values(c)
      .onConflictDoNothing({ target: schema.categories.slug });
  }

  const collections = [
    { name: "Summer 25", slug: "summer-25" },
    { name: "Essentials", slug: "essentials" },
  ];
  for (const col of collections) {
    await db
      .insert(schema.collections)
      .values(col)
      .onConflictDoNothing({ target: schema.collections.slug });
  }
}

async function pickIds() {
  const [brand] = await db
    .select()
    .from(schema.brands)
    .where(eq(schema.brands.slug, "nike"));
  const cats = await db.select().from(schema.categories);
  const gens = await db.select().from(schema.genders);
  const cols = await db.select().from(schema.colors);
  const sizes = await db.select().from(schema.sizes);
  return { brand, cats, gens, cols, sizes };
}

async function seedProductsWithVariantsAndImages() {
  const shoesSrcDir = path.join(process.cwd(), "public", "shoes");

  const { brand, cats, gens, cols, sizes } = await pickIds();
  if (
    !brand ||
    cats.length === 0 ||
    gens.length === 0 ||
    cols.length === 0 ||
    sizes.length === 0
  ) {
    throw new Error("Missing seed prerequisites.");
  }

  const shoeFiles = await fs.readdir(shoesSrcDir);
  const selected = shoeFiles
    .filter((f) => /(shoe|sneaker|trending)/i.test(f))
    .slice(0, 15);

  // Create 15 unique product names with distinct characteristics
  const productData = [
    {
      name: "Nike Air Max 270",
      description: "Max Air cushioning for all-day comfort and style.",
    },
    {
      name: "Nike Air Force 1 '07",
      description:
        "The radiance lives on in the Air Force 1 '07, the basketball original.",
    },
    {
      name: "Nike Dunk Low",
      description:
        "The Nike Dunk Low delivers bold style and comfort for everyday wear.",
    },
    {
      name: "Nike Blazer Mid '77",
      description: "The Nike Blazer Mid '77 delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 90",
      description: "The Nike Air Max 90 stays true to its OG running roots.",
    },
    {
      name: "Nike React Element 55",
      description: "The Nike React Element 55 delivers bold style and comfort.",
    },
    {
      name: "Nike Air VaporMax Plus",
      description:
        "The Nike Air VaporMax Plus delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 97",
      description: "The Nike Air Max 97 delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 95",
      description: "The Nike Air Max 95 delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 98",
      description: "The Nike Air Max 98 delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 96",
      description: "The Nike Air Max 96 delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 94",
      description: "The Nike Air Max 94 delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 93",
      description: "The Nike Air Max 93 delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 92",
      description: "The Nike Air Max 92 delivers bold style and comfort.",
    },
    {
      name: "Nike Air Max 91",
      description: "The Nike Air Max 91 delivers bold style and comfort.",
    },
  ];

  for (let i = 0; i < productData.length; i++) {
    const { name, description } = productData[i];
    const category = cats[Math.floor(Math.random() * cats.length)];
    const gender = gens[Math.floor(Math.random() * gens.length)];

    const product = {
      name,
      description,
      categoryId: category.id,
      genderId: gender.id,
      brandId: brand.id,
      isPublished: true,
    } satisfies schema.InsertProduct;

    const [created] = await db
      .insert(schema.products)
      .values(product)
      .returning();

    const variantCount = 2 + Math.floor(Math.random() * 3); // 2-4 variants
    const chosenColors = [...cols]
      .sort(() => 0.5 - Math.random())
      .slice(0, variantCount);

    for (const color of chosenColors) {
      const chosenSizes = [...sizes]
        .sort(() => 0.5 - Math.random())
        .slice(2, 5);
      for (const size of chosenSizes) {
        const price = (80 + Math.floor(Math.random() * 100)).toFixed(2);
        const sale =
          Math.random() > 0.6 ? (Number(price) - 10).toFixed(2) : null;
        const variant = {
          productId: created.id,
          sku: `${slugify(name)}-${color.slug}-${size.slug}`.slice(0, 90),
          price,
          salePrice: sale ?? undefined,
          colorId: color.id,
          sizeId: size.id,
          inStock: 5 + Math.floor(Math.random() * 20),
          weight: 0.75,
          dimensions: { length: 30, width: 12, height: 10 },
        } satisfies schema.InsertVariant;
        const [v] = await db
          .insert(schema.productVariants)
          .values(variant)
          .returning();

        // Attach 1-2 images per variant
        for (let k = 0; k < 2; k++) {
          // Use the product index to ensure each product gets a unique image
          const imageIndex = i % selected.length;
          const imageFileName = selected[imageIndex];

          await db.insert(schema.productImages).values({
            productId: created.id,
            variantId: v.id,
            url: `/shoes/${imageFileName}`,
            sortOrder: k,
            isPrimary: k === 0,
          });
        }
      }
    }

    // Set default variant
    const [firstVariant] = await db
      .select()
      .from(schema.productVariants)
      .where(eq(schema.productVariants.productId, created.id))
      .limit(1);
    if (firstVariant) {
      await db
        .update(schema.products)
        .set({ defaultVariantId: firstVariant.id })
        .where(eq(schema.products.id, created.id));
    }
  }
}

async function clearExistingData() {
  console.log("🧹 Clearing existing data...");
  await db.delete(schema.productImages);
  await db.delete(schema.productVariants);
  await db.delete(schema.products);
  await db.delete(schema.collections);
  await db.delete(schema.categories);
  await db.delete(schema.sizes);
  await db.delete(schema.colors);
  await db.delete(schema.genders);
  await db.delete(schema.brands);
}

async function main() {
  await clearExistingData();
  console.log("🌱 Seeding filters and brand...");
  await seedFiltersAndBrand();
  console.log("🌱 Seeding categories and collections...");
  await seedCategoriesAndCollections();
  console.log("🌱 Seeding products, variants, and images...");
  await seedProductsWithVariantsAndImages();
  console.log("✅ Seed complete");
}

main().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
