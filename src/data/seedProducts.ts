import { Product } from '@/types'

export const seedProducts: Product[] = [
  {
    id: 'p1',
    name: 'جوراب ساق بلند کلاسیک',
    description: 'جوراب ساق بلند کلاسیک با کیفیت بالا و نخ پنبه اصل. مناسب برای استفاده روزمره و رسمی. طراحی شیک و ماندگاری بالا در شستشو.',
    price: 85000,
    stockQuantity: 15,
    imageUrls: [
      'https://picsum.photos/seed/sock1/400/400',
      'https://picsum.photos/seed/sock1b/400/400',
    ],
    category: ['ساق بلند'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'جوراب اسپرت ورزشی',
    description: 'جوراب اسپرت ورزشی با فناوری جذب رطوبت و تهویه مناسب. ایده‌آل برای ورزش و فعالیت‌های بدنی. محافظت عالی از پا در حین حرکت.',
    price: 65000,
    stockQuantity: 20,
    imageUrls: [
      'https://picsum.photos/seed/sock2/400/400',
      'https://picsum.photos/seed/sock2b/400/400',
    ],
    category: ['اسپرت'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    name: 'جوراب طرح دار فانتزی',
    description: 'جوراب فانتزی با طرح‌های خاص و رنگ‌های شاد. مناسب برای کسانی که به دنبال تنوع و جذابیت در استایل خود هستند.',
    price: 45000,
    stockQuantity: 10,
    imageUrls: [
      'https://picsum.photos/seed/sock3/400/400',
      'https://picsum.photos/seed/sock3b/400/400',
    ],
    category: ['فانتزی'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    name: 'جوراب ساق کوتاه روزمره',
    description: 'جوراب ساق کوتاه سبک و راحت برای استفاده روزمره. مناسب برای کفش‌های اسپرت و کتانی. تنفس پذیری بالا و رطوبت گیر عالی.',
    price: 35000,
    stockQuantity: 25,
    imageUrls: [
      'https://picsum.photos/seed/sock4/400/400',
      'https://picsum.photos/seed/sock4b/400/400',
    ],
    category: ['ساق کوتاه'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    name: 'جوراب زمستانی پشمی',
    description: 'جوراب زمستانی پشمی فوق‌العاده گرم و نرم. مناسب برای روزهای سرد زمستان. عایق حرارتی عالی و محافظت از پا در برابر سرما.',
    price: 95000,
    stockQuantity: 8,
    imageUrls: [
      'https://picsum.photos/seed/sock5/400/400',
      'https://picsum.photos/seed/sock5b/400/400',
    ],
    category: ['زمستانی'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p6',
    name: 'جوراب مجلسی ابریشمی',
    description: 'جوراب مجلسی ابریشمی با ظاهری لوکس و شیک. مناسب برای مراسم رسمی و مهمانی‌ها. جنس نرم و لطیف با دوام بالا.',
    price: 120000,
    stockQuantity: 5,
    imageUrls: [
      'https://picsum.photos/seed/sock6/400/400',
      'https://picsum.photos/seed/sock6b/400/400',
    ],
    category: ['مجلسی'],
    createdAt: new Date().toISOString(),
  },
]
