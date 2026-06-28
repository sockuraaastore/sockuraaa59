import React from 'react'

export default function WelcomeHero() {
  return (
    <div className="flex flex-row-reverse items-center justify-center gap-8 py-10 px-6 md:px-12">
      <div className="relative inline-block cursor-pointer group flex-shrink-0">
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
  )
}
