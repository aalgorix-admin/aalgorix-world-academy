import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Aalgorix World Academy",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
