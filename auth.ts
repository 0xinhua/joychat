export const runtime = 'edge'

import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import type { Adapter } from 'next-auth/adapters'
import { SupabaseAdapter } from "@auth/supabase-adapter"

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string,
      plan: string,
      created_at: number,
    } & DefaultSession['user']
  }
}

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
  adapter: process.env.NODE_ENV === 'production' ? SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  }) as Adapter : undefined,
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
        session.user.id = process.env.NODE_ENV === 'production' ? String(token.sub) : process.env.MOCK_USERID as string
      }
      console.log('auth session => ', session, user)
      return session
    },
    authorized({ auth }) {
      return !!auth?.user 
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      console.log('email', user, email)
      return isAllowedToSignIn
    },
    redirect: async (params: { url: string; baseUrl: string; }) => {
      return Promise.resolve(params.url)
    }
  },
  pages: {
    signIn: '/login', // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
    error: '/apply',
  }
})
