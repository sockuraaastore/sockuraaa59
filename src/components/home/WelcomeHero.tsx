import React from 'react'

export default function WelcomeHero() {
  return (
    <div className="text-center py-8 px-4">
      <h2 className="text-2xl md:text-3xl font-black text-dark mb-6">
        Welcome to the colorful world of socks
      </h2>
      <div className="relative inline-block cursor-pointer group">
        <img
          src="/sock-color.jpg"
          alt="Colorful socks"
          className="w-full max-w-md rounded-2xl shadow-xl"
        />
        <img
          src="/sock-bw.jpg"
          alt="Black and white socks"
          className="absolute inset-0 w-full max-w-md rounded-2xl shadow-xl transition-opacity duration-1000 group-hover:opacity-0"
        />
      </div>
    </div>
  )
}
