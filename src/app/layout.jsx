import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SocketProvider } from "@/context/SocketContext";
import NotificationListener from "@/components/NotificationListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Attendance System",
  description: "MERN Attendance App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SocketProvider>
            <NotificationListener />
            {children}
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}
