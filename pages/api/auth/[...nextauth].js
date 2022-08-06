import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import instance from "../../../servee";

const credentialInstance = CredentialsProvider({
  async authorize(credentials) {
    try {
      // console.log("wwww");
      const { email, pass } = credentials;
      const resGetUser = await instance.post("/user/login", {
        email,
        password: pass,
      });

      console.log(resGetUser);
      const user = resGetUser.data.data.result;
      return user;
    } catch (error) {
      throw error.response.data;
    }
  },
});

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [credentialInstance],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});
