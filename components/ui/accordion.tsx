"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

type Item = { question: string; answer: string };

export function Faq({ items, idPrefix }: { items: readonly Item[]; idPrefix: string }) {
  return (
    <AccordionPrimitive.Root type="multiple" className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <AccordionPrimitive.Item key={`${idPrefix}-${i}`} value={`${idPrefix}-${i}`}>
          <AccordionPrimitive.Header asChild>
            <h3 className="text-[1.125rem] md:text-xl font-bold tracking-[-0.01em]">
              <AccordionPrimitive.Trigger className="group flex w-full items-start justify-between gap-6 py-5 text-left min-h-14">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-mint-soft text-teal-ink transition-transform duration-200 group-data-[state=open]:rotate-45 motion-reduce:transition-none"
                >
                  <Plus className="size-5" strokeWidth={2.5} />
                </span>
              </AccordionPrimitive.Trigger>
            </h3>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:hidden">
            <p className="pb-6 pr-12 font-sans text-slate leading-relaxed">{item.answer}</p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
