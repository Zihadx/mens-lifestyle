import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Product } from "@/types/product";

const FAQ = [
  { q: "How long does delivery take?", a: "1–2 business days inside Dhaka, 3–5 business days outside Dhaka." },
  { q: "Can I pay on delivery?", a: "Yes — Cash on Delivery is available nationwide, along with bKash, Nagad, Rocket, and card payments." },
  { q: "What's the return policy?", a: "Unworn items with tags attached can be exchanged within 7 days of delivery." },
];

export function ProductInfoAccordion({ product }: { product: Product }) {
  return (
    <Accordion type="single" collapsible defaultValue="description" className="w-full">
      <AccordionItem value="description">
        <AccordionTrigger>Description</AccordionTrigger>
        <AccordionContent>{product.description}</AccordionContent>
      </AccordionItem>

      <AccordionItem value="materials">
        <AccordionTrigger>Materials &amp; Care</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">
            <strong className="text-foreground">Materials:</strong> {product.materials.join(", ")}
          </p>
          <ul className="list-inside list-disc space-y-1">
            {product.careInstructions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="specifications">
        <AccordionTrigger>Specifications</AccordionTrigger>
        <AccordionContent>
          <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
            <dt className="text-foreground">SKU</dt>
            <dd>{product.sku}</dd>
            <dt className="text-foreground">Brand</dt>
            <dd>{product.brand}</dd>
            <dt className="text-foreground">Available Sizes</dt>
            <dd>{product.sizes.join(", ")}</dd>
            <dt className="text-foreground">Available Colors</dt>
            <dd>{product.colors.map((c) => c.name).join(", ")}</dd>
          </dl>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq">
        <AccordionTrigger>FAQ</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <div key={item.q}>
                <p className="font-medium text-foreground">{item.q}</p>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
