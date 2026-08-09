import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getDeliveryEstimate } from "@/lib/business-logic";

const FAQ = [
  { q: "Do I need to pay anything now?", a: "No. Place your order and pay only when it's delivered to you — that's Cash on Delivery." },
  { q: "How long will delivery take?", a: `${getDeliveryEstimate("inside-dhaka")} inside Dhaka, ${getDeliveryEstimate("outside-dhaka")} outside Dhaka.` },
  { q: "What if I want to exchange the size?", a: "Unworn items with tags attached can be exchanged within 7 days of delivery." },
  { q: "Is this available in my area?", a: "We deliver nationwide across Bangladesh through our courier partners." },
];

export function LandingFAQ() {
  return (
    <section className="container max-w-2xl py-8">
      <h2 className="mb-5 text-center font-display text-2xl font-medium">Common Questions</h2>
      <Accordion type="single" collapsible>
        {FAQ.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
