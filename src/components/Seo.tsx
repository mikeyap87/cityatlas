import { useLayoutEffect } from "react";
import type { CityAtlasData } from "../types";
import { canShowHostedAdmin, canShowHostedPrivatePreview, siteConfig } from "../config/site";
import { buildJsonLd, getRouteMeta, getRobotsDirectives, resolveBaseUrl } from "../lib/seo";

const runtimeEnv = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ??
  {}) as Record<string, string | undefined>;

function upsertMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    if (property) element.setAttribute("property", name);
    else element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}


export function SeoManager({ path, data }: { path: string; data: CityAtlasData }) {
  useLayoutEffect(() => {
    const metaOptions = {
      adminVisible: path === "/admin" && canShowHostedAdmin(),
      privatePreviewVisible:
        path === "/private-preview/date-night" && canShowHostedPrivatePreview(),
    };
    const meta = getRouteMeta(path, data, metaOptions);
    const baseUrl = resolveBaseUrl({
      publicBaseUrl: runtimeEnv.VITE_CITYATLAS_PUBLIC_BASE_URL,
      runtimeOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
      hostname: typeof window !== "undefined" ? window.location.hostname : undefined,
    }).replace(/\/$/, "");
    document.title = meta.title;
    upsertMeta("description", meta.description);
    upsertMeta("robots", getRobotsDirectives(path));
    upsertMeta("og:title", meta.title, true);
    upsertMeta("og:description", meta.description, true);
    upsertMeta("og:type", meta.type, true);
    upsertMeta("og:image", `${baseUrl}${meta.imagePath ?? siteConfig.media.hero}`, true);
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("og:url", `${baseUrl}${path}`, true);
    upsertLink("canonical", `${baseUrl}${path}`);

    let script = document.getElementById("cityatlas-jsonld") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "cityatlas-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(buildJsonLd(path, data, baseUrl, metaOptions));
  }, [data, path]);

  return null;
}
