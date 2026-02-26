export const protectedRoutes = [
  "/profile",
  "/checkout",
  "/cart",
  "/wishlist",
];

export const authRoutes = ["/login", "/signup"];

export const publicRoutes = ["/", "/about", "/shop"];

const urls = {
  home: "/",
  shop: "/shop",
  shopDetails: "/shop/:id",
  cart: "/cart",
  checkout: "/checkout",
  wishlist: "/wishlist",
  privacyPolicy: "/privacy-policy",
  faq: "/faq",
  contactUs: "/contact-us",
  profile: "/profile",
};

export default urls;
