import { dbConnect, DEMO_MODE } from "./db";
import { Product } from "./models";
import { demoProducts, type DemoProduct } from "./demo-data";

/**
 * Product data access layer. In DEMO_MODE returns the static catalog;
 * with MongoDB it seeds the demo catalog once, then serves live data.
 */

export type ProductDTO = DemoProduct;

function toDTO(p: {
  _id: unknown;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  stock: number;
  featured: boolean;
}): ProductDTO {
  return {
    _id: String(p._id),
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    emoji: p.emoji,
    stock: p.stock,
    featured: p.featured,
  };
}

export async function seedIfEmpty() {
  if (DEMO_MODE) return;
  await dbConnect();
  const count = await Product.estimatedDocumentCount();
  if (count === 0) {
    await Product.insertMany(demoProducts.map(({ _id, ...rest }) => rest));
  }
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  if (DEMO_MODE) return demoProducts;
  try {
    await seedIfEmpty();
    const docs = await Product.find().sort({ featured: -1, createdAt: -1 }).lean();
    return docs.map(toDTO);
  } catch {
    return demoProducts; // DB unreachable → never break the storefront
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  if (DEMO_MODE) return demoProducts.find((p) => p.slug === slug) ?? null;
  try {
    await seedIfEmpty();
    const doc = await Product.findOne({ slug }).lean();
    return doc ? toDTO(doc) : null;
  } catch {
    return demoProducts.find((p) => p.slug === slug) ?? null;
  }
}
