"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
  return (
    <SessionProvider>
      {" "}
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </SessionProvider>
  );
}
