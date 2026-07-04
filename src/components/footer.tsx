export function Footer() {
  return (
    <footer className="border-t border-line/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} NexusMart — a full-stack demo by{" "}
          <a
            href="https://manashjyoti-bora.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent2 hover:underline"
          >
            Manashjyoti Bora
          </a>
        </p>
        <p className="font-mono">Next.js · MongoDB · JWT · Zod</p>
      </div>
    </footer>
  );
}
