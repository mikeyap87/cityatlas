import type { AnchorHTMLAttributes, ReactNode } from "react";
import { navigate } from "../app/router";

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
}

export function AppLink({ to, children, onClick, ...props }: AppLinkProps) {
  return (
    <a
      href={to}
      onClick={(event) => {
        if (!event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
          event.preventDefault();
          navigate(to);
        }
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
