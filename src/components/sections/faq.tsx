import { Icon } from "@/components/icons";

type FaqItem = { question: string; answer: string };

/** Native <details> accordion: keyboard accessible, no client JavaScript. */
export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details key={faq.question} className="group rounded-[20px] border-2 border-line bg-white p-5">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-lg text-left text-xl font-bold text-ink">
            <span>{faq.question}</span>
            <Icon name="chevron" className="details-chevron size-7 shrink-0 text-azure-deep transition-transform" />
          </summary>
          <p className="mt-3 max-w-[62ch] text-xl leading-relaxed text-ink-soft">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
