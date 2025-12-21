export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Coins with soft glow */}
      <div className="absolute top-20 left-[10%] animate-float" style={{ animationDelay: "0s" }}>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(255, 200, 80, 0.4) 0%, rgba(255, 200, 80, 0.15) 100%)",
            boxShadow: "0 8px 32px rgba(255, 200, 80, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          💰
        </div>
      </div>
      <div className="absolute top-40 right-[15%] animate-float" style={{ animationDelay: "1s" }}>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{
            background: "linear-gradient(135deg, rgba(255, 200, 80, 0.4) 0%, rgba(255, 200, 80, 0.15) 100%)",
            boxShadow: "0 8px 32px rgba(255, 200, 80, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          ⭐
        </div>
      </div>
      <div className="absolute bottom-32 left-[20%] animate-float-slow" style={{ animationDelay: "0.5s" }}>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{
            background: "linear-gradient(135deg, rgba(255, 184, 77, 0.4) 0%, rgba(255, 184, 77, 0.15) 100%)",
            boxShadow: "0 8px 32px rgba(255, 184, 77, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          🍀
        </div>
      </div>

      {/* Decorative icons with soft glow */}
      <div className="absolute top-32 right-[8%] animate-float-slow" style={{ animationDelay: "2s" }}>
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(168, 213, 247, 0.5) 0%, rgba(168, 213, 247, 0.2) 100%)",
            boxShadow: "0 8px 32px rgba(96, 181, 244, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          🚀
        </div>
      </div>
      <div className="absolute top-[60%] left-[5%] animate-float" style={{ animationDelay: "1.5s" }}>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{
            background: "linear-gradient(135deg, rgba(255, 182, 193, 0.5) 0%, rgba(255, 182, 193, 0.2) 100%)",
            boxShadow: "0 8px 32px rgba(255, 182, 193, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          👑
        </div>
      </div>
      <div className="absolute bottom-48 right-[12%] animate-float-slow" style={{ animationDelay: "0.8s" }}>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(168, 230, 207, 0.5) 0%, rgba(168, 230, 207, 0.2) 100%)",
            boxShadow: "0 8px 32px rgba(168, 230, 207, 0.25), inset 0 0 20px rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          🎁
        </div>
      </div>
      <div className="absolute top-[45%] right-[5%] animate-float" style={{ animationDelay: "2.5s" }}>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{
            background: "linear-gradient(135deg, rgba(255, 200, 80, 0.4) 0%, rgba(255, 200, 80, 0.15) 100%)",
            boxShadow: "0 8px 32px rgba(255, 200, 80, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          🌱
        </div>
      </div>

      {/* Large avatar circle - mascot with soft glow */}
      <div className="absolute bottom-20 left-8 animate-bounce-gentle hidden md:flex">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(96, 181, 244, 0.5) 0%, rgba(96, 181, 244, 0.25) 100%)",
            boxShadow: "0 12px 40px rgba(96, 181, 244, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(6px)",
            border: "2px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <span className="text-4xl">🤖</span>
        </div>
      </div>

      {/* Top right decorative circle with soft gradient */}
      <div 
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full"
        style={{
          background: "linear-gradient(135deg, rgba(168, 213, 247, 0.4) 0%, rgba(96, 181, 244, 0.15) 100%)",
          boxShadow: "0 0 60px rgba(96, 181, 244, 0.2)",
        }}
      />
    </div>
  )
}
