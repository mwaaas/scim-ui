import { DefaultSession } from "next-auth";

declare module "next-auth" {1
  interface Session {
    user: {
      id: string|any;
      image:string|any;
    } & DefaultSession["user"];
  };
}
