import React from 'react'

function SockSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 80" fill="currentColor" className={className}>
      <path d="M20 8 C20 8 16 8 14 12 C12 16 12 24 12 32 L12 52 C12 56 14 60 18 62 L36 62 C44 62 52 58 54 50 L56 38 C58 30 56 24 50 22 L42 20 C38 18 36 14 36 10 L36 8 C36 8 28 8 20 8 Z" />
      <path d="M12 32 L56 32 L56 38 C58 30 56 24 50 22 L42 20 C38 18 36 14 36 10 L36 8 L20 8 C20 8 16 8 14 12 C12 16 12 24 12 32 Z" opacity="0.3" />
      <ellipse cx="36" cy="10" rx="10" ry="3" opacity="0.2" />
    </svg>
  )
}

const socks = [
  { side: 'left' as const, top: '10%', size: 32, rotate: -15, delay: 0 },
  { side: 'left' as const, top: '30%', size: 28, rotate: 10, delay: 0.5 },
  { side: 'left' as const, top: '55%', size: 36, rotate: -8, delay: 1 },
  { side: 'left' as const, top: '72%', size: 24, rotate: 20, delay: 1.5 },
  { side: 'left' as const, top: '88%', size: 30, rotate: -12, delay: 0.8 },
  { side: 'right' as const, top: '8%', size: 30, rotate: 12, delay: 0.3 },
  { side: 'right' as const, top: '28%', size: 34, rotate: -10, delay: 0.7 },
  { side: 'right' as const, top: '50%', size: 26, rotate: 18, delay: 1.2 },
  { side: 'right' as const, top: '70%', size: 32, rotate: -5, delay: 0.2 },
  { side: 'right' as const, top: '85%', size: 28, rotate: 15, delay: 0.9 },
]

export default function WelcomeHero() {
  return (
    <>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(-15deg)} 50%{transform:translateY(-12px) rotate(-15deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(10deg)} 50%{transform:translateY(-12px) rotate(10deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) rotate(-8deg)} 50%{transform:translateY(-12px) rotate(-8deg)} }
        @keyframes float4 { 0%,100%{transform:translateY(0) rotate(20deg)} 50%{transform:translateY(-12px) rotate(20deg)} }
        @keyframes float5 { 0%,100%{transform:translateY(0) rotate(-12deg)} 50%{transform:translateY(-12px) rotate(-12deg)} }
        @keyframes float6 { 0%,100%{transform:translateY(0) rotate(12deg)} 50%{transform:translateY(-12px) rotate(12deg)} }
        @keyframes float7 { 0%,100%{transform:translateY(0) rotate(-10deg)} 50%{transform:translateY(-12px) rotate(-10deg)} }
        @keyframes float8 { 0%,100%{transform:translateY(0) rotate(18deg)} 50%{transform:translateY(-12px) rotate(18deg)} }
        @keyframes float9 { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-12px) rotate(-5deg)} }
        @keyframes float10 { 0%,100%{transform:translateY(0) rotate(15deg)} 50%{transform:translateY(-12px) rotate(15deg)} }
        .sock-0{animation:float1 3s ease-in-out 0s infinite}
        .sock-1{animation:float2 3s ease-in-out .5s infinite}
        .sock-2{animation:float3 3s ease-in-out 1s infinite}
        .sock-3{animation:float4 3s ease-in-out 1.5s infinite}
        .sock-4{animation:float5 3s ease-in-out .8s infinite}
        .sock-5{animation:float6 3s ease-in-out .3s infinite}
        .sock-6{animation:float7 3s ease-in-out .7s infinite}
        .sock-7{animation:float8 3s ease-in-out 1.2s infinite}
        .sock-8{animation:float9 3s ease-in-out .2s infinite}
        .sock-9{animation:float10 3s ease-in-out .9s infinite}
      `}</style>
      <div className="relative overflow-hidden group py-10 px-6 md:px-12">
        {socks.map((sock, i) => (
          <div
            key={i}
            className={`sock-${i} absolute transition-colors duration-500 text-gray-300 group-hover:text-pink-300 ${
              sock.side === 'left' ? 'left-4 md:left-12' : 'right-4 md:right-12'
            }`}
            style={{ top: sock.top, width: sock.size, height: sock.size * 1.25 }}
          >
            <SockSVG className="w-full h-full" />
          </div>
        ))}

        <div className="relative z-10 flex flex-row-reverse items-center justify-center gap-8">
          <div className="relative inline-block cursor-pointer flex-shrink-0">
            <img
              src="/sock-color.jpg"
              alt="جوراب رنگارنگ"
              className="w-64 md:w-80 rounded-2xl shadow-xl"
            />
            <img
              src="/sock-bw.jpg"
              alt="جوراب سیاه و سفید"
              className="absolute inset-0 w-64 md:w-80 rounded-2xl shadow-xl transition-opacity duration-500 group-hover:opacity-0"
            />
          </div>
          <div className="text-right">
            <h2
              className="text-2xl md:text-4xl font-black leading-relaxed"
              style={{ fontFamily: 'Vazirmatn, sans-serif', color: '#1a1a2e' }}
            >
              به دنیای رنگارنگ
              <br />
              جوراب خوش آمدید
            </h2>
          </div>
        </div>
      </div>
    </>
  )
}
