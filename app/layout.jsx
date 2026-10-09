import { Geist } from "next/font/google";
import "./globals.css";
import AdminBar from "./components/AdminBar";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "AfriBazaar",
  description: "Achetez en Inde, recevez en Afrique | Shop in India, delivered to Africa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
        <AdminBar />
      </body>
    </html>
  );
}