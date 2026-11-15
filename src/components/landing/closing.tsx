import { WrongDoor } from "@/components/landing/wrong-door";
import { FaqList } from "@/components/sections/faq";
import { Container } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist-form";
import type { Variant } from "@/content/variants";

/** Last section: the same signup again after the questions, so nobody has to scroll back up. */
export function Closing({ variant }: { variant: Variant }) {
  return (
    <section aria-labelledby="closing-heading" className="bg-halo py-14 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-6 lg:order-2">
          <WaitlistForm
            variant={variant}
            fields={variant.form.closingFields}
            placement="closing"
            heading={variant.form.closingHeading}
            footer={<WrongDoor parts={variant.doorLine} />}
          />
        </div>
        <div className="lg:col-span-6 lg:order-1">
          <h2 id="closing-heading" className="mb-5 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Questions people ask
          </h2>
          <FaqList faqs={variant.faqs} />
        </div>
      </Container>
    </section>
  );
}
