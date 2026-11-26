import type { BlobSpec } from "@/content/variants";

const colors = { sun: "bg-sun", blush: "bg-blush" } as const;

/**
 * A decorative colored pebble behind a drawing. Position and size are
 * percentages of the picture box, so it keeps its place at every width.
 * `centered` means `left` is the blob's middle, not its edge.
 */
export function Blob({ spec, centered = false }: { spec: BlobSpec; centered?: boolean }) {
  const rotate = spec.rotate ? ` rotate(${spec.rotate}deg)` : "";
  return (
    <div
      aria-hidden="true"
      className={`absolute ${spec.shape} ${colors[spec.color]}`}
      style={{
        left: spec.left,
        top: spec.top,
        width: spec.width,
        height: spec.height,
        transform: `${centered ? "translateX(-50%)" : ""}${rotate}` || undefined,
      }}
    />
  );
}
