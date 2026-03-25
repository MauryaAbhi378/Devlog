import { Metadata } from "next";
import SignUpForm from "./signUp";

export const metadata: Metadata = {
  title: 'Devlog | Sign Up',
  description: 'Create a new Devlog account',
}

export default function SignUpPage() {
  return <SignUpForm />;
}
