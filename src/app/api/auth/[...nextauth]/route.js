import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
 async authorize(credentials) {
  try {
    const res = await fetch(`https://attendancesystem-server-joov.onrender.com/api/login`, {
    // const res = await fetch(`https://attendancesystem-server-joov.onrender.com/api/login`, {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } 
    catch { return null; }

    if (!res.ok || data.status !== "success") {
      return null; // failed login
    }

    return {
      id: data.data.user.id,
      name: data.data.user.name,
      email: data.data.user.email,
      role: data.data.user.role,
      token: data.token,
    };
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}

    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
