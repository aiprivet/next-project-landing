import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";

const ttCommonsPro = localFont({
  src: [
    { path: "../fonts/tt-commons-pro-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/tt-commons-pro-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/tt-commons-pro-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/tt-commons-pro-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/tt-commons-pro-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-tt-commons",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cнэпбилд — платформа для создания маркетинговых материалов на основе дизайн-системы",
  description:
    "Подключите дизайн-систему к Cнэпбилду, чтобы каждый участник команды мог создавать профессиональные материалы в фирменном стиле за минуты, а не дни.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={ttCommonsPro.variable}>
      <body className={ttCommonsPro.className}>{children}</body>
    </html>
  );
}
