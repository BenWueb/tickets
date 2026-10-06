import type { Metadata } from "next";
import { GoogleSignIn } from "@/components/GoogleSignIn";

export const metadata: Metadata = {
  title: "Sign in — Show Tickets",
};

export default function SignInPage() {
  return <GoogleSignIn />;
}
