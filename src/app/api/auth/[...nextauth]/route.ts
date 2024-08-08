import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email", placeholder: "test@test.com" },
                contrasenia: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials?.email,
                            contrasenia: credentials?.contrasenia,
                        }),
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!res.ok) {
                    throw new Error('Credenciales inválidas');
                }

                const user = await res.json();

                if (user.error) throw user;

                return user;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = token as any;
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
});

export { handler as GET, handler as POST };
