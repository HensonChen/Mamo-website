import { Icon } from "@/components/icons";

type FaqItem = { question: string; answer: string };

/** Native <details> accordion with divider lines: keyboard accessible, no client JavaScript. */
export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="border-t border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group border-b border-line py-5">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-6 rounded-lg text-left text-xl font-bold text-ink sm:text-[1.375rem]">
            <span>{faq.question}</span>
            <Icon name="chevron" className="details-chevron size-7 shrink-0 text-pine transition-transform" />
          </summary>
          <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-ink-soft sm:text-xl">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
