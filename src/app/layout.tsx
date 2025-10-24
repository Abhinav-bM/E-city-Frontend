import React from "react";
import StoreProvider from "./store-provider";

export const metadata = {
  title: "Ecity",
  description: "Ecity - Your one-stop solution for all your e-commerce needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
