import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function purifyForJSON(val: any, seen = new WeakSet()): any {
  if (val === null || val === undefined) {
    return val;
  }
  
  const t = typeof val;
  if (t !== "object" && t !== "function") {
    return val;
  }
  
  if (t === "function") {
    return "[Function]";
  }
  
  // Check if it's already seen (circular reference)
  if (seen.has(val)) {
    return "[Circular]";
  }
  
  // Guard DOM elements, window, and react fibers
  if (
    val.nodeType ||
    (typeof HTMLElement !== "undefined" && val instanceof HTMLElement) ||
    (typeof Window !== "undefined" && val instanceof Window) ||
    (val.constructor && val.constructor.name && (
      val.constructor.name.includes("HTML") || 
      val.constructor.name.includes("Fiber") ||
      val.constructor.name.includes("React") ||
      val.constructor.name === "Window" ||
      val.constructor.name.includes("Event") ||
      val.constructor.name === "SyntheticEvent"
    )) ||
    (val.$$typeof) // React elements
  ) {
    return "[DOM/React Element]";
  }
  
  seen.add(val);
  
  if (Array.isArray(val)) {
    return val.map(item => purifyForJSON(item, seen));
  }
  
  // Handle plain objects
  const purified: Record<string, any> = {};
  for (const key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) {
      // Avoid traversing React fiber or internal properties altogether to prevent browser crashes
      if (key.startsWith("__react") || key.startsWith("$$")) {
        purified[key] = "[Internal React]";
        continue;
      }
      purified[key] = purifyForJSON(val[key], seen);
    }
  }
  return purified;
}

export function safeStringify(obj: any): string {
  try {
    const purified = purifyForJSON(obj);
    return JSON.stringify(purified);
  } catch (e) {
    console.error("safeStringify failed:", e);
    return "[]";
  }
}

