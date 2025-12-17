import { Scene } from "@/components/Scene";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] py-8 px-4">
      <div className="max-w-md mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-[var(--primary)] mb-2 tracking-tight">
          🎍 Osechi 2026 🐍
        </h1>
        <p className="text-[var(--secondary-foreground)] text-sm font-medium">
          Sharehouse New Year Potluck
        </p>
      </div>

      <Scene />

      <footer className="mt-12 text-center text-xs text-gray-400">
        <p>Made with ❤️ for the Sharehouse</p>
      </footer>
    </main>
  );
}
