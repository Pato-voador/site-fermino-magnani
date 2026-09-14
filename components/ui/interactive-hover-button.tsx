import { ArrowRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type InteractiveHoverButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

/**
 * Magic UI / Dillion Verma — Interactive Hover Button (MIT).
 * https://21st.dev/@dillionverma/components/interactive-hover-button
 * The original animation is retained; an anchor keeps the donation destination.
 */
export function InteractiveHoverButton({
  children,
  className = "",
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <a className={`interactive-hover-button ${className}`.trim()} {...props}>
      <span className="interactive-hover-button__default" aria-hidden="true">
        {children}
      </span>
      <span className="interactive-hover-button__hover" aria-hidden="true">
        <span>{children}</span>
        <ArrowRight aria-hidden="true" size={24} />
      </span>
      <span className="interactive-hover-button__dot" aria-hidden="true" />
      <span className="sr-only">{children}</span>
    </a>
  );
}
