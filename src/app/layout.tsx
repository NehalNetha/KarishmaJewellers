import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./(components)/Nav";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./(components)/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karishma Jeweller",
  description: "AI jewellery detection app by Karishma Jeweller",
  icons: {
    icon: '/rlogo.svg',
    apple: '/rlogo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <UserProvider>
          <Nav />
          <Toaster position="top-center" />
          <main className="flex-grow">
            {children}
          </main>
        </UserProvider>
        <footer className="py-6 bg-white border-t border-gray-100 mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-gray-600 text-sm">
              Copyright KBYR 2025 | Made with ❤️ by <a href='https://500x.tech/' target='_blank' rel='noopener noreferrer'>500x</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}