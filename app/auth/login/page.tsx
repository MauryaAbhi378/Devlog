import { Metadata } from "next";
import LoginForm from "./login";

export const metadata: Metadata = {
  title: 'Devlog | Login',
  description: 'Login to your Devlog account',
}

export default function LoginPage() {
  return <LoginForm />;
}
