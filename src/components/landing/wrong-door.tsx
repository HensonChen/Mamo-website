import Link from "next/link";
import type { DoorPart } from "@/content/variants";

/**
 * The "Not you?" line at the bottom of each page, on the pine band. A visitor
 * who landed on the wrong page can reach the one that fits, with a plain link
 * that needs no script.
 */
export function WrongDoor({ parts }: { parts: DoorPart[] }) {
  return (
    <p data-testid="wrong-door">
      {parts.map((part, index) =>
        part.href ? (
          <Link
            key={index}
            href={part.href}
            className="font-bold text-paper underline decoration-2 underline-offset-4 hover:text-sage"
          >
            {part.text}
          </Link>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </p>
  );
}
