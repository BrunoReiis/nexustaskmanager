import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Nexus Task Manager",
  description: "Entre na sua conta",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
