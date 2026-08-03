import type { IconifyIcon } from "@iconify/types";

/**
 * Renders an Iconify icon definition (e.g. from `@iconify-icons/lucide`) as an
 * inline SVG, so the device never has to reach a CDN for icons.
 */
export function Icon({ icon, size = "1.5em" }: { icon: IconifyIcon; size?: string }) {
  const width = icon.width ?? 24;
  const height = icon.height ?? 24;
  const left = icon.left ?? 0;
  const top = icon.top ?? 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${left} ${top} ${width} ${height}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
