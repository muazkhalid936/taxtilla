import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
      <Link href={ROUTES.LOGIN} className="text-blue-500 hover:underline">
        Go to Login
      </Link>
    </main>
  );
}
