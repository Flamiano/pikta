import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "PikTà",
  description: "Your Premier Photo Booth Experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
