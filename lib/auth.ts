import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!user) return null

        const passwordValid = await bcrypt.compare(credentials.password, user.password)
        if (!passwordValid) return null

        const headers = req?.headers as Record<string, string> | undefined
        const forwardedFor = headers?.["x-forwarded-for"]
        await prisma.loginEvent.create({
          data: {
            userId: user.id,
            ipAddress: forwardedFor ? forwardedFor.split(",")[0].trim() : null,
            userAgent: headers?.["user-agent"] ?? null,
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
          company: user.company ?? undefined,
          emailVerified: user.emailVerified,
          totpEnabled: user.totpEnabled,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.company = (user as any).company
        token.emailVerified = (user as any).emailVerified
        token.totpEnabled = (user as any).totpEnabled
      }
      if (trigger === "update" && session) {
        if (session.emailVerified !== undefined) token.emailVerified = session.emailVerified
        if (session.totpEnabled !== undefined) token.totpEnabled = session.totpEnabled
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        ;(session.user as any).company = token.company as string | undefined
        session.user.emailVerified = token.emailVerified as boolean
        session.user.totpEnabled = token.totpEnabled as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
}
