import { Container, SectionHeading } from "@/components/ui";
import type { Variant } from "@/content/variants";

/** Check and dash cells are read as "Yes" and "No" by a screen reader. */
function Cell({ text }: { text: string }) {
  if (text === "\u2713") {
    return (
      <>
        <span aria-hidden="true">{text}</span>
        <span className="sr-only">Yes</span>
      </>
    );
  }
  if (text === "\u2013") {
    return (
      <>
        <span aria-hidden="true">{text}</span>
        <span className="sr-only">No</span>
      </>
    );
  }
  return <>{text}</>;
}

const cell = "px-3 py-4 text-base md:px-5 md:py-[1.125rem] md:text-xl";

/**
 * Comparison table. The table keeps a minimum width and scrolls sideways on a
 * phone, with the row labels pinned on the left so every row stays readable.
 */
export function Compare({ compare }: { compare: Variant["compare"] }) {
  const lastRow = compare.rows.length - 1;
  return (
    <section aria-labelledby="compare-heading" className="pb-16 pt-6 md:pb-20 lg:pb-[6.5rem] lg:pt-10">
      <Container>
        <SectionHeading id="compare-heading">{compare.heading}</SectionHeading>
        <div className="relative overflow-x-auto rounded-[2rem] bg-white p-2 md:p-4">
          <table className="w-full min-w-[40rem] border-separate border-spacing-0">
            <thead>
              <tr>
                <td className={`sticky left-0 z-10 bg-white ${cell} text-center`}>
                  <span className="sr-only">What you get</span>
                </td>
                <th scope="col" className={`rounded-t-[2rem] bg-teal font-bold text-white ${cell} text-center`}>
                  Mamo
                </th>
                {compare.others.map((name) => (
                  <th key={name} scope="col" className={`font-bold text-teal ${cell} text-center`}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.rows.map((row, rowIndex) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 w-[22%] border-t border-line bg-white text-left font-bold text-teal ${cell}`}
                  >
                    {row.label}
                  </th>
                  {row.cells.map((text, cellIndex) =>
                    cellIndex === 0 ? (
                      <td
                        key={cellIndex}
                        className={`border-t border-white/20 bg-teal font-bold text-white ${cell} text-center ${
                          rowIndex === lastRow ? "rounded-b-[2rem]" : ""
                        }`}
                      >
                        <Cell text={text} />
                      </td>
                    ) : (
                      <td key={cellIndex} className={`border-t border-line text-teal ${cell} text-center`}>
                        <Cell text={text} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
