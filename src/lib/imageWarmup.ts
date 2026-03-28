const warmedImageUrls = new Set<string>();

type WarmPriority = "auto" | "high";

function isWarmableImage(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim().length > 0;
}

export function warmImageUrl(url: string, priority: WarmPriority = "auto") {
  if (typeof window === "undefined" || !isWarmableImage(url) || warmedImageUrls.has(url)) {
    return;
  }

  warmedImageUrls.add(url);

  const image = new Image();
  const prioritizedImage = image as HTMLImageElement & { fetchPriority?: WarmPriority };

  prioritizedImage.decoding = "async";
  prioritizedImage.loading = "eager";
  prioritizedImage.fetchPriority = priority;
  prioritizedImage.src = url;
}

export function warmImageBatch(urls: Array<string | null | undefined>, eagerCount = 0) {
  const uniqueUrls = Array.from(new Set(urls.filter(isWarmableImage)));

  uniqueUrls.forEach((url, index) => {
    warmImageUrl(url, index < eagerCount ? "high" : "auto");
  });
}
