import { Scene } from "@/components/Scene";

export default function Home() {
  return (
    <main className="min-h-screen py-4 px-4">
      <div className="max-w-md mx-auto mb-4 text-center">
        <h1 className="text-4xl font-bold text-primary mb-1 tracking-tight">
          🎍 Osechi 2026 🐴
        </h1>
        <p className="text-secondary-foreground text-sm font-medium">
          Sharehouse New Year Potluck
        </p>
      </div>

      <Scene />

      <footer className="mt-4 text-center text-xs text-gray-400">
        <p>Made with ❤️ for the Sharehouse</p>
      </footer>
    </main>
  );
}
