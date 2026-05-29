import Image from "next/image";

export const BRAND_LOGO_LIGHT_SRC = "/brand/awa-logo.svg";
export const BRAND_LOGO_DARK_SRC = "/brand/awa-logo-dark.png";

const BRAND_LOGO_WIDTH = 150;
const BRAND_LOGO_HEIGHT = 40;

const brandLogoImageClassName = "h-8 w-auto sm:h-10";

export function AwaBrandLogo({ className }: { className?: string }) {
  const wrapperClassName = `relative inline-flex shrink-0 items-center ${className ?? ""}`.trim();

  return (
    <span
      className={wrapperClassName}
      style={{ width: BRAND_LOGO_WIDTH, height: BRAND_LOGO_HEIGHT }}
    >
      <Image
        src={BRAND_LOGO_LIGHT_SRC}
        alt="Aalgorix World Academy Logo"
        width={BRAND_LOGO_WIDTH}
        height={BRAND_LOGO_HEIGHT}
        priority
        className={`${brandLogoImageClassName} dark:hidden`}
      />
      <Image
        src={BRAND_LOGO_DARK_SRC}
        alt="Aalgorix World Academy Logo"
        width={BRAND_LOGO_WIDTH}
        height={BRAND_LOGO_HEIGHT}
        priority
        className={`${brandLogoImageClassName} hidden dark:block`}
      />
    </span>
  );
}
