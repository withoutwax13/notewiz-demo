import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/utils/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NoteWiz Demo",
  description: "NoteWiz for demonstration of concept purposes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
