import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [GitHub],
  //@ts-ignore
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.avatar_url || profile.picture
      }
      return token
    },
    session: ({ session, token }) => {
      if (session?.user && token?.id) {
        session.user.id = String(token.id)
      }
      return session
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      console.log('email',user)
      if (user.email === 'wuxinhua.cn@gmail.com') {
        return isAllowedToSignIn
      }
      return false
    },
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})
