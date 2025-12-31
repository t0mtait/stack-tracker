import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeInit } from "../.flowbite-react/init";
import Auth0ProviderWrapper from "../components/Auth0ProviderWrapper";
import "./globals.css";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "800"],
});

export const metadata: Metadata = {
  title: "Stack Tracker",
  description: "Track and manage your supplement stacks with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
        <ThemeInit />
        <Auth0ProviderWrapper>
          {children}
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}
