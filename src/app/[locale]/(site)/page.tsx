export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen">
      {/* Hero placeholder – will be replaced with cinematic hero section */}
      <section className="flex flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold gradient-text">
          Golden Health KSA
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl">
          Premium Cosmetic Solutions — Importing the world&apos;s finest formulas
          for the Saudi market
        </p>
        <div className="flex gap-4 mt-4">
          <button className="gradient-emerald text-onyx font-semibold px-8 py-3 rounded-full transition-transform hover:scale-105">
            Explore Our Services
          </button>
          <button className="glass text-text-primary font-semibold px-8 py-3 rounded-full transition-colors hover:border-emerald/30">
            View Track Record
          </button>
        </div>
      </section>
    </main>
  );
}
