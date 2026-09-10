import type { Metadata } from "next";
import "./globals.css";
import "./lar.css";
import "./redesign.css";
import "./motion.css";

export const metadata: Metadata = {
  title: "Lar da Criança Fermino Magnani | Cuidado, educação e parceria",
  description: "Conheça o Lar da Criança Fermino Magnani, em Santa Cruz do Rio Pardo. Saiba como apoiar, propor parcerias e consultar eventos e documentos públicos.",
  robots: { index: false, follow: false },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/images/logo-lar.jpg",
    shortcut: "/images/logo-lar.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
