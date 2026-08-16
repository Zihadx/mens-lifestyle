import { createClient } from "@/lib/supabase/server";

export default async function UiTesting() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("product-category")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch product categories:", error);
  }

  return (
    <section className="border-t border-border bg-background py-16">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Explore
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Shop by category
            </h2>
          </div>

          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            {categories?.length ?? 0} categories
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load categories.
          </div>
        )}

        {/* Categories */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.id}
                className="group relative min-h-70 overflow-hidden bg-background"
              >
                {/* Image */}
                {category.imageUrl && (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  {category.isFeatured && (
                    <span className="mb-2 inline-block font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
                      Featured
                    </span>
                  )}

                  <h3 className="text-lg font-medium tracking-tight">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/65">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/50">
                      {category.slug}
                    </span>

                    <span className="translate-x-0 text-xs text-white/70 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-border py-20 text-center">
            <p className="text-sm text-muted-foreground">
              No categories found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}