import { useEffect, useState } from "react"

interface CelebrationProps {
  show: boolean
  onComplete?: () => void
}

export function Celebration({ show, onComplete }: CelebrationProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; emoji: string; delay: number }[]>([])

  useEffect(() => {
    if (show) {
      const emojis = ["⭐", "🎉", "✨", "🌟", "💰", "🎊", "👑"]
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 0.5,
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-3xl animate-celebration"
          style={{
            left: `${particle.x}%`,
            top: "-50px",
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  )
}
