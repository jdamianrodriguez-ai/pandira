import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Inter, Playfair_Display } from "next/font/google";
export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata = {
  title: "Pandira",
  description: "Tu biblioteca multimedia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-black text-white antialiased font-sans">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}