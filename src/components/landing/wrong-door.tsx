import Link from "next/link";
import type { DoorPart } from "@/content/variants";

/**
 * The "Not you?" line under every form. A visitor who landed on the wrong
 * page can reach the one that fits, with a plain link that needs no script.
 */
export function WrongDoor({ parts }: { parts: DoorPart[] }) {
  return (
    <p className="text-ink-soft" data-testid="wrong-door">
      {parts.map((part, index) =>
        part.href ? (
          <Link
            key={index}
            href={part.href}
            className="font-bold text-azure-deep underline decoration-2 underline-offset-4 hover:text-azure"
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
