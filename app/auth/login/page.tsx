import { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./login";
import LoginLoading from "./loading";

export const metadata: Metadata = {
  title: 'Devlog | Login',
  description: 'Login to your Devlog account',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
