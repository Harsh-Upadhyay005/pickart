import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface session {
        user: {
            role: string,
            id: string,
        } & DefaultSession["user"];

        }

        interface User {
            role: string;
        }
    }