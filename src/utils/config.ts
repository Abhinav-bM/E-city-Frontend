export const API_ENDPOINT =
  typeof window !== "undefined"
    ? "/api"
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
