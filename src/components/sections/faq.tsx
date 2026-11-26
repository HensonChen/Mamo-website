type FaqItem = { question: string; answer: string };

/**
 * Native <details> accordion in a white card: keyboard accessible and works
 * without client JavaScript. The shared `name` makes the browser keep one
 * question open at a time, and the first one starts open. The yellow circle
 * shows + when closed and a minus when open (see globals.css).
 */
export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="mx-auto max-w-[53.75rem] rounded-[2rem] bg-white px-5 py-2 sm:px-8">
      {faqs.map((faq, index) => (
        <details
          key={faq.question}
          name="faq"
          open={index === 0}
          className={`px-1 sm:px-2 ${index === 0 ? "" : "border-t border-line"}`}
        >
          <summary className="flex min-h-[3.75rem] cursor-pointer items-center justify-between gap-5 rounded-lg py-5 text-left text-lg font-bold leading-snug text-teal sm:py-6 sm:text-[1.375rem]">
            <span>{faq.question}</span>
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sun text-[1.625rem] font-bold leading-none text-teal"
            >
              <span className="faq-plus">+</span>
              <span className="faq-minus">&minus;</span>
            </span>
          </summary>
          <p className="mb-6 text-lg leading-relaxed text-teal-soft sm:mb-[1.625rem] sm:mr-[3.75rem] sm:text-xl sm:leading-[1.6]">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
