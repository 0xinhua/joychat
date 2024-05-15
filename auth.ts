import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import type { Adapter } from 'next-auth/adapters'
import { SupabaseAdapter } from "@auth/supabase-adapter"

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

// toLowerCase email from env
const allowedEmails = (process.env.ALLOWED_EMAILS ?? '').toLowerCase().split(',')

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    GitHub,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  // adapter: process.env.NODE_ENV === 'production' ? SupabaseAdapter({
  //   url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  // }) as Adapter : undefined,
  //@ts-ignore
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.avatar_url || profile.picture
      }
      return token
    },
    session: ({ session, token, user }) => {

      if (session?.user && token?.sub) {
        session.user.id = String(token.sub)
      }
      return session
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      console.log('email', user, allowedEmails)
      // add a whitelist
      if (user.email && allowedEmails.includes(user.email.toLowerCase())) {
        return isAllowedToSignIn
      } else {
        return false
      }
    },
    redirect: async (params: { url: string; baseUrl: string; }) => {
      return Promise.resolve(params.url)
    }
  },
  pages: {
    signIn: '/sign-in', // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
    error: '/apply',
  }
})
