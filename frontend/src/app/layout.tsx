import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getAuthSession } from "@/lib/nextauth";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "@/components/auth/Navigation";
import AuthProvider from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "42 Pong Game",
  description: "42 Pong Game",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const user = await getAuthSession();

  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navigation user={user} />
            <ToastProvider />

            <main className="container mx-auto flex-grow-1 px-2 my-4">
              {children}
            </main>

            <footer className="py-5">
              <div className="text-center fs-sm">
                Copyright © All rights reserved | 42 Transcendence Team
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
