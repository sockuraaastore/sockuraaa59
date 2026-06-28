import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function AboutView() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <Heart size={28} className="text-pink" />
        <h1 className="text-3xl font-black text-dark">درباره ما</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-pink-100 shadow-lg p-8"
      >
        <h2
          className="text-2xl font-black text-dark mb-6 text-center"
          style={{ fontFamily: 'Vazirmatn, sans-serif' }}
        >
          داستان ساکورآ ؛ قدم‌هایی در رنگ خوشبختی
        </h2>

        <div className="space-y-4 text-dark-300 leading-relaxed text-justify" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
          <p>
            در ساکورآ (sockuraaa) ما باور داریم که جوراب صرفاً یک پوشاک ساده نیست، بلکه بیانگر روح منحصربه‌فرد، خلاقیت و سبک هر فرد است.
          </p>
          <p>
            جرقه اولیه ساکورآ با شور و اشتیاق برای تزریق رنگ و انرژی به روتین‌های روزانه شما روشن شد؛ چون ما باور داریم که هر تغییر بزرگی از اولین قدم‌ها آغاز می‌شود.
          </p>
          <p>
            هدف ما فروش جوراب فراتر می‌رود؛ ما می‌خواهیم با ارائه بالاترین کیفیت، نرمی بی‌نظیر و طرح‌هایی که لبخند را بر لبان شما می‌نشاند، حس خوب و آرامش واقعی را به پاهایتان هدیه دهیم.
          </p>
          <p>
            از مدل‌های فانتزی و جسورانه گرفته تا استایل‌های کلاسیک و شیک، هر جفت جوراب در ساکورآ با دقت و عشق انتخاب شده تا همراهی مطمئن برای قدم‌هایتان باشد.
          </p>
          <p>
            از اینکه به خانواده بزرگ ساکورآ پیوستید و اجازه دادید بخشی از مسیر و استایل روزانه شما باشیم، صمیمانه سپاسگزاریم!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
