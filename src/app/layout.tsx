import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import MobileNavbar from "./components/ui/MobileNavbar";
import Footer from "./components/layout/Footer";

/*======== FONTS ========*/
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const OpenSans = Open_Sans({
  variable: "--font-openSans",
  subsets: ["latin"],
});

/*======== METADATA ========*/
export const metadata: Metadata = {
  title: "CineRadar",
  description:
    "CineRadar is a library of movies and series, where the user can browse through thousands of movies/tv series, add them to Favorites and see all the crucial details about a specific movie/tvSeries!",
  authors: [
    {
      name: "Gabriele Prestano",
      url: "www.linkedin.com/in/gabriele-prestano-70a346357",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${OpenSans.variable} antialiased`}
      >
        <Header />
        <main className="container px-3 mx-auto max-w-7xl">
          {children}
          <MobileNavbar />
        </main>
        <Footer />
      </body>
    </html>
  );
}
