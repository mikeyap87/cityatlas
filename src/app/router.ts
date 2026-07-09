import { startTransition, useEffect, useState } from "react";

function getHashFromPath(path: string) {
  const hashIndex = path.indexOf("#");
  if (hashIndex === -1) return "";
  return path.slice(hashIndex);
}

function scrollToHashTarget(hash = window.location.hash, attempts = 0) {
  if (!hash.startsWith("#")) return false;
  const targetId = decodeURIComponent(hash.slice(1));
  if (!targetId) return false;

  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ block: "start", behavior: "smooth" });
    return true;
  }

  if (attempts >= 24) return false;
  window.requestAnimationFrame(() => {
    scrollToHashTarget(hash, attempts + 1);
  });
  return false;
}

function syncScrollWithLocation(path?: string) {
  const hash = path ? getHashFromPath(path) : window.location.hash;
  if (hash) {
    scrollToHashTarget(hash);
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

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
    syncScrollWithLocation(path);
    return;
  }

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  syncScrollWithLocation(path);
}

export function usePathname() {
  const [path, setPath] = useState(() => getCurrentPath());

  useEffect(() => {
    const onPopState = () => {
      startTransition(() => {
        setPath(getCurrentPath());
      });
      syncScrollWithLocation();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    syncScrollWithLocation();
  }, [path]);

  return path;
}
