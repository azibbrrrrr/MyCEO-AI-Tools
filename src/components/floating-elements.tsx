export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Coins */}
      <div className="absolute top-20 left-[10%] animate-float" style={{ animationDelay: "0s" }}>
        <div className="w-12 h-12 rounded-full bg-[var(--golden-yellow)] shadow-[var(--shadow-float)] flex items-center justify-center text-2xl">
          💰
        </div>
      </div>
      <div className="absolute top-40 right-[15%] animate-float" style={{ animationDelay: "1s" }}>
        <div className="w-10 h-10 rounded-full bg-[var(--golden-yellow)] shadow-[var(--shadow-float)] flex items-center justify-center text-xl">
          ⭐
        </div>
      </div>
      <div className="absolute bottom-32 left-[20%] animate-float-slow" style={{ animationDelay: "0.5s" }}>
        <div className="w-8 h-8 rounded-full bg-[var(--sunshine-orange)] shadow-[var(--shadow-float)] flex items-center justify-center text-lg">
          🎯
        </div>
      </div>

      {/* Decorative icons */}
      <div className="absolute top-32 right-[8%] animate-float-slow" style={{ animationDelay: "2s" }}>
        <div className="w-14 h-14 rounded-2xl bg-[var(--sky-blue-light)] shadow-[var(--shadow-float)] flex items-center justify-center text-2xl">
          🚀
        </div>
      </div>
      <div className="absolute top-[60%] left-[5%] animate-float" style={{ animationDelay: "1.5s" }}>
        <div className="w-10 h-10 rounded-xl bg-[var(--coral-pink)] shadow-[var(--shadow-float)] flex items-center justify-center text-xl">
          👑
        </div>
      </div>
      <div className="absolute bottom-48 right-[12%] animate-float-slow" style={{ animationDelay: "0.8s" }}>
        <div className="w-12 h-12 rounded-full bg-[var(--mint-green)] shadow-[var(--shadow-float)] flex items-center justify-center text-2xl">
          🎁
        </div>
      </div>
      <div className="absolute top-[45%] right-[5%] animate-float" style={{ animationDelay: "2.5s" }}>
        <div className="w-8 h-8 rounded-lg bg-[var(--golden-yellow)] shadow-[var(--shadow-float)] flex items-center justify-center text-lg">
          🌱
        </div>
      </div>

      {/* Large avatar circle - mascot */}
      <div className="absolute bottom-20 left-8 animate-bounce-gentle hidden md:flex">
        <div className="w-24 h-24 rounded-full bg-[var(--sky-blue)] shadow-[var(--shadow-float)] flex items-center justify-center border-4 border-white">
          <span className="text-4xl">🤖</span>
        </div>
      </div>

      {/* Top right decorative circle */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--sky-blue-light)] to-[var(--sky-blue)] opacity-60" />
    </div>
  )
}
