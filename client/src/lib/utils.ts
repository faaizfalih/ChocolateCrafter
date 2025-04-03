import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getTimeRemaining(targetTime: Date): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const now = new Date();
  const diff = targetTime.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: "00", minutes: "00", seconds: "00" };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
}

export function getDeliveryTime(): Date {
  const now = new Date();
  const cutoffTime = new Date();
  cutoffTime.setHours(16, 0, 0, 0); // 4 PM

  if (now >= cutoffTime) {
    // If current time is after 4 PM, set cutoff to tomorrow 4 PM
    cutoffTime.setDate(cutoffTime.getDate() + 1);
  }

  return cutoffTime;
}

export function getImageUrl(path: string): string {
  console.log("Original image path:", path);
  
  // Safety check: If path is undefined or null, return a default image path
  if (!path) {
    console.log("Image path is undefined or null, using default");
    return '/assets/General Photo1.jpg';
  }
  
  // If the path already has a prefix, use it directly
  if (path.startsWith("/") || path.startsWith("http") || path.startsWith("data:")) {
    console.log("Using path as-is:", path);
    return path;
  }
  
  // For dynamically uploaded files (usually contain timestamp from multer)
  if (path.includes("-") && /\d{13}-/.test(path)) { // Timestamp pattern from multer upload
    const attachedPath = `/attached_assets/${path}`;
    console.log("Using attached_assets path for uploaded file:", attachedPath);
    return attachedPath;
  }
  
  // For matcha specifically, use attached_assets
  if (path.toLowerCase().includes("matcha")) {
    const attachedPath = `/attached_assets/${path}`;
    console.log("Using matcha path:", attachedPath);
    return attachedPath;
  }
  
  // For other images, try assets directory
  const assetsPath = `/assets/${path}`;
  console.log("Using assets path:", assetsPath);
  return assetsPath;
}
