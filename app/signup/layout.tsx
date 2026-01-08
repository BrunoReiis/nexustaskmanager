import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro - Nexus Task Manager",
  description: "Crie sua conta gratuitamente",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
