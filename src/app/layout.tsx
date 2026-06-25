import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz Rush: สุนทรภู่",
  description: "ทดสอบความรู้เกี่ยวกับสุนทรภู่ กวีเอกของโลก — 20 ข้อ ภายใน 15 วินาที",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="font-[var(--font-thai)]">{children}</body>
    </html>
  );
}
