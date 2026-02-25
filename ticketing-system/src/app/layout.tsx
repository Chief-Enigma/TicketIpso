import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";
import styles from "./layout.module.css";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketSystem",
  description: "Webbasiertes Ticketing-System für Support-Anfragen",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const sessionUser = session.user;

  const user = sessionUser
    ? await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { email: true, name: true, role: true },
      })
    : null;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar user={user} />
        <main className={styles.main}>
          <div className={`container ${styles.page}`}>{children}</div>
        </main>
      </body>
    </html>
  );
}
