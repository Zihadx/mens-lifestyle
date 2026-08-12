import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { contentService } from "@/features/settings/services/content.service";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const content = await contentService.get();

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 font-display text-3xl font-medium tracking-tight">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible>
        {content.faq.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
