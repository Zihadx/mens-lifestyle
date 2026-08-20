import { createClient } from "@/lib/supabase/server";

type ProductImage = {
  image_url: string;
  is_primary: boolean;
  sort_order: number;
};

// The name of the Supabase Storage bucket that holds your "products/" folder.
// Check: Supabase Dashboard -> Storage -> bucket name (e.g. "zyqo-images").
const BUCKET_NAME = "zyqo";

export default async function ProductGrid() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*, product_images(image_url, is_primary, sort_order)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Converts a stored relative path (e.g. "products/t-shirt.jpg")
  // into a full public Supabase Storage URL.
  const toPublicUrl = (path?: string | null) => {
    if (!path) return null;
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <section className="border-t border-border bg-background py-16">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Shop
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              All products
            </h2>
          </div>

          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            {products?.length ?? 0} products
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load products.
          </div>
        )}

        {/* Products */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              // product_images comes back as an array of joined rows;
              // sort by sort_order so index 0 is always the primary image.
              const sortedImages = ((product.product_images ?? []) as ProductImage[])
                .slice()
                .sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order)
                .map((img: ProductImage) => img.image_url);

              const images =
                sortedImages.length > 0
                  ? sortedImages
                  : product.thumbnail_url
                    ? [product.thumbnail_url]
                    : [];

              const primaryImage = toPublicUrl(images[0]);
              const hoverImage = toPublicUrl(images[1] ?? images[0]);

              const hasDiscount =
                product.compare_at_price &&
                Number(product.compare_at_price) > Number(product.price);

              return (
                <article
                  key={product.id}
                  className="group relative flex flex-col bg-background"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    {primaryImage && (
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="absolute inset-0 size-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                    )}

                    {hoverImage && (
                      <img
                        src={hoverImage}
                        alt={`${product.name} alternate view`}
                        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}

                    {!primaryImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          No image
                        </span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                      {hasDiscount ? (
                        <span className="bg-foreground px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-background">
                          Sale
                        </span>
                      ) : (
                        <span />
                      )}

                      {product.is_featured && (
                        <span className="bg-amber-400 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-black">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      {product.brand}
                    </p>

                    <h3 className="mt-1.5 line-clamp-1 text-sm font-medium tracking-tight text-foreground">
                      {product.name}
                    </h3>

                    {product.short_description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {product.short_description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          ৳{Number(product.price).toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="font-mono text-[10px] text-muted-foreground line-through">
                            ৳{Number(product.compare_at_price).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {product.rating > 0 && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          ★ {Number(product.rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-border py-20 text-center">
            <p className="text-sm text-muted-foreground">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
}