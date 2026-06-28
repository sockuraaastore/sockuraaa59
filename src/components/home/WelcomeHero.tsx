import React from 'react'

function SockSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" fill="currentColor" className={className}>
      <rect x="6" y="0" width="20" height="6" rx="2" opacity="0.4" />
      <rect x="8" y="6" width="16" height="30" rx="1" />
      <path d="M8 36 L8 44 C8 50 12 54 18 54 L30 54 C34 54 36 50 36 46 L36 40 C36 36 34 34 30 34 L24 34 L24 36 L30 36 C32 36 34 38 34 40 L34 44 C34 46 32 48 30 48 L20 48 C14 48 12 44 12 40 L12 36 Z" />
      <rect x="8" y="30" width="16" height="6" opacity="0.25" />
    </svg>
  )
}

const socks = [
  { x: '3%', y: '5%', size: 52, rotate: -25, delay: 0, shade: 'text-gray-300' },
  { x: '8%', y: '45%', size: 48, rotate: 15, delay: 0.6, shade: 'text-gray-400' },
  { x: '2%', y: '78%', size: 56, rotate: -10, delay: 1.2, shade: 'text-gray-200' },
  { x: '15%', y: '20%', size: 44, rotate: 30, delay: 0.3, shade: 'text-gray-300' },
  { x: '12%', y: '65%', size: 50, rotate: -20, delay: 0.9, shade: 'text-gray-400' },
  { x: '85%', y: '8%', size: 50, rotate: 20, delay: 0.4, shade: 'text-gray-400' },
  { x: '90%', y: '40%', size: 54, rotate: -18, delay: 0.8, shade: 'text-gray-200' },
  { x: '82%', y: '70%', size: 46, rotate: 25, delay: 1.1, shade: 'text-gray-300' },
  { x: '78%', y: '15%', size: 42, rotate: -30, delay: 0.2, shade: 'text-gray-400' },
  { x: '92%', y: '85%', size: 48, rotate: 12, delay: 1.4, shade: 'text-gray-300' },
]

export default function WelcomeHero() {
  return (
    <>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(-25deg)} 50%{transform:translateY(-14px) rotate(-25deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(15deg)} 50%{transform:translateY(-14px) rotate(15deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) rotate(-10deg)} 50%{transform:translateY(-14px) rotate(-10deg)} }
        @keyframes float4 { 0%,100%{transform:translateY(0) rotate(30deg)} 50%{transform:translateY(-14px) rotate(30deg)} }
        @keyframes float5 { 0%,100%{transform:translateY(0) rotate(-20deg)} 50%{transform:translateY(-14px) rotate(-20deg)} }
        @keyframes float6 { 0%,100%{transform:translateY(0) rotate(20deg)} 50%{transform:translateY(-14px) rotate(20deg)} }
        @keyframes float7 { 0%,100%{transform:translateY(0) rotate(-18deg)} 50%{transform:translateY(-14px) rotate(-18deg)} }
        @keyframes float8 { 0%,100%{transform:translateY(0) rotate(25deg)} 50%{transform:translateY(-14px) rotate(25deg)} }
        @keyframes float9 { 0%,100%{transform:translateY(0) rotate(-30deg)} 50%{transform:translateY(-14px) rotate(-30deg)} }
        @keyframes float10 { 0%,100%{transform:translateY(0) rotate(12deg)} 50%{transform:translateY(-14px) rotate(12deg)} }
        .sock-0{animation:float1 3.2s ease-in-out 0s infinite}
        .sock-1{animation:float2 3.5s ease-in-out .6s infinite}
        .sock-2{animation:float3 2.8s ease-in-out 1.2s infinite}
        .sock-3{animation:float4 3.4s ease-in-out .3s infinite}
        .sock-4{animation:float5 3.1s ease-in-out .9s infinite}
        .sock-5{animation:float6 3.3s ease-in-out .4s infinite}
        .sock-6{animation:float7 2.9s ease-in-out .8s infinite}
        .sock-7{animation:float8 3.6s ease-in-out 1.1s infinite}
        .sock-8{animation:float9 3.0s ease-in-out .2s infinite}
        .sock-9{animation:float10 3.4s ease-in-out 1.4s infinite}
      `}</style>
      <div className="relative overflow-hidden group py-10 px-6 md:px-12 min-h-[320px]">
        {socks.map((sock, i) => (
          <div
            key={i}
            className={`sock-${i} absolute transition-colors duration-500 ${sock.shade} group-hover:text-pink-400`}
            style={{ left: sock.x, top: sock.y, width: sock.size, height: sock.size * 1.5 }}
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
