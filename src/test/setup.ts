import "@testing-library/jest-dom";

const storageMap = new Map<string, string>();

const localStoragePolyfill = {
  getItem: (key: string) => (storageMap.has(key) ? storageMap.get(key)! : null),
  setItem: (key: string, value: string) => {
    storageMap.set(key, String(value));
  },
  removeItem: (key: string) => {
    storageMap.delete(key);
  },
  clear: () => {
    storageMap.clear();
  },
};

if (typeof window.localStorage?.getItem !== "function" || typeof window.localStorage?.setItem !== "function") {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: localStoragePolyfill,
  });
}

if (typeof globalThis.localStorage?.getItem !== "function" || typeof globalThis.localStorage?.setItem !== "function") {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: localStoragePolyfill,
  });
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
