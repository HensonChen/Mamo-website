import { Icon } from "@/components/icons";
import { PhoneScreen } from "@/components/phone/screen";
import { Container } from "@/components/ui";
import type { AnswerTile, Variant } from "@/content/variants";

/** The control families set: from "Mom decides, I'm told" to "I approve first". Drawn once, never interactive. */
function AutonomyDial() {
  return (
    <div
      role="img"
      aria-label="A dial with three settings, from Mom decides and I'm told, to I approve first"
      className="mt-5"
    >
      <div aria-hidden="true" className="relative mx-3 h-2 rounded-full bg-line">
        <span className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-azure" />
        {[0, 50, 100].map((left) => (
          <span
            key={left}
            className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-azure bg-white"
            style={{ left: `${left}%` }}
          />
        ))}
        <span className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure ring-4 ring-halo" />
      </div>
      <p aria-hidden="true" className="mt-3 flex justify-between gap-3 text-base font-bold text-ink-soft">
        <span>Mom decides, I&apos;m told</span>
        <span className="text-right">I approve first</span>
      </p>
    </div>
  );
}

function Tile({ tile, variant }: { tile: AnswerTile; variant: Variant }) {
  const safety = tile.safety === true;
  return (
    <li
      className={`flex flex-col rounded-[20px] border-2 p-6 ${
        safety ? "border-ok-line bg-ok-bg" : "border-line bg-white"
      }`}
      data-safety={safety ? "true" : undefined}
    >
      <span
        className={`flex size-14 items-center justify-center rounded-full text-white ${
          safety ? "bg-ok" : "bg-azure"
        }`}
      >
        <Icon name={tile.icon} className="size-7" />
      </span>
      <h3 className="mt-4 text-2xl font-bold leading-snug text-ink">{tile.question}</h3>
      <p className="mt-2 text-xl leading-relaxed text-ink-soft">{tile.answer}</p>
      {tile.dial ? <AutonomyDial /> : null}
      {tile.screen ? (
        <div className="mt-6 flex justify-center">
          <PhoneScreen id={tile.screen} copy={variant.screenCopy} className="[--s:0.5]" />
        </div>
      ) : null}
    </li>
  );
}

/** Three tiles: a question people have, and a short answer, with icons rather than paragraphs. */
export function Answers({ variant }: { variant: Variant }) {
  return (
    <section aria-labelledby="answers-heading" className="py-14 sm:py-20">
      <Container>
        <h2 id="answers-heading" className="sr-only">
          Short answers
        </h2>
        <ul className="grid gap-5 lg:grid-cols-3 lg:items-start lg:gap-6">
          {variant.answers.map((tile) => (
            <Tile key={tile.question} tile={tile} variant={variant} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
