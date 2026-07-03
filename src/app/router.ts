import { startTransition, useEffect, useState } from "react";

export function getCurrentPath() {
  if (window.location.protocol === "file:") {
    const previewRoute = new URLSearchParams(window.location.search).get("route");
    if (previewRoute?.startsWith("/")) {
      return previewRoute;
    }
  }

  return window.location.pathname || "/";
}

export function navigate(path: string) {
  if (window.location.protocol === "file:") {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("route", path);
    window.history.pushState({}, "", nextUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function usePathname() {
  const [path, setPath] = useState(() => getCurrentPath());

  useEffect(() => {
    const onPopState = () => {
      startTransition(() => {
        setPath(getCurrentPath());
      });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return path;
}
