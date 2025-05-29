'use client';

import { useLanguage } from '@/contexts/language-context';
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Location {
  id: string;
  name: string;
  nameAr: string;
  desAr: string;
  desEn: string;
  city: string;
  cityAr: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  mapUrl: string;
  note?: {
    en: string;
    ar: string;
  };
  category?: string;
}

// Cities data
const cities = [
  { id: 'makkah', name: 'Makkah', nameAr: 'مكة المكرمة' },
  { id: 'madinah', name: 'Madinah', nameAr: 'المدينة المنورة' },
  { id: 'jeddah', name: 'Jeddah', nameAr: 'جدة' },
];

// Locations data from the Excel sheet

const locations: Location[] = [
  // Makkah Locations
  {
    id: '1',
    name: 'Al-Masjid Al-Haram',
    nameAr: 'المسجد الحرام',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: 'Al-Haram District, Makkah',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/Kudq5uEs6CvSekgHA?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: '',
    desEn: '',
  },
  {
    id: '2',
    name: 'Al Haram',
    nameAr: 'الحرم',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: 'Makkah',
    position: { lat: 21.4228, lng: 39.8261 },
    mapUrl: 'https://maps.app.goo.gl/uJjypVVGgHSATt5w8?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'المسجد الحرام',
    desEn: 'Masjid Al Haram',
  },
  {
    id: '3',
    name: 'Alkaaba',
    nameAr: 'الكعبة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/eaimWCcqPBSFU5zS7?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'الكعبة',
    desEn: 'Alkaaba',
  },
  {
    id: '4',
    name: 'Al Hiraa Cave',
    nameAr: 'غار حراء',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4581, lng: 39.8597 },
    mapUrl: 'https://maps.app.goo.gl/Wmc24psqskX8Wcaw7?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'غار حراء',
    desEn: 'Al Hiraa Cave',
  },
  {
    id: '5',
    name: 'Al Noor Mountain',
    nameAr: 'جبل النور',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4581, lng: 39.8597 },
    mapUrl: 'https://maps.app.goo.gl/ftRX32o5gavDjL4k6?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'جبل النور',
    desEn:
      'Mount Al-Nour, at an altitude of approximately 640 meters, is one of the most spiritual sites to visit in Mecca. The Cave of Hira, located at the summit of the mountain, is where the Prophet Muhammad (peace and blessings be upon him) received the verses of the Holy Quran, making it a spiritual site that attracts visitors to ascend and meditate.',
  },
  {
    id: '6',
    name: 'Hira Cultural District',
    nameAr: 'حي حراء الثقافي',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4581, lng: 39.8597 },
    mapUrl: 'https://maps.app.goo.gl/n4APdviVhKqCPWN26?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'حي حراء الثقافي',
    desEn:
      'Hira Cultural District is a cultural and tourist landmark, located next to Mount Hira. It tells the story of the revelation and provides information about the mountain and the cave and their historical significance. It contributes to enriching the cognitive and cultural experience of visitors through its various components. Components of Hira Cultural District: • Revelation Exhibition • Holy Quran Museum • The path to the cave • The cultural library • Visitors Center • Commercial facilities • Hira Park and a range of other services. Visiting hours for the Revelation Exhibition and Holy Quran Museum: Saturday to Thursday, from 8:00 AM to 1:00 AM.',
  },
  {
    id: '7',
    name: 'Thawr Cave',
    nameAr: 'غار ثور',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4333, lng: 39.8667 },
    mapUrl: 'https://maps.app.goo.gl/yrM4K55XUYoXusYY6?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'غار ثور',
    desEn: 'Thawr Cave',
  },
  {
    id: '8',
    name: 'Al Rahma Mountain',
    nameAr: 'جبل الرحمة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.3528, lng: 39.9842 },
    mapUrl: 'https://maps.app.goo.gl/9a36gQi2HXhLqHj99',
    category: 'Historical and Heritage Sites',
    desAr: 'جبل الرحمة',
    desEn:
      'Jabal al-Rahmah is a small mountain compared to the surrounding mountains, its height does not exceed thirty meters. At the top of it is a modern marker that was built to be a four-meter high landmark. It is located to the north of the Plain of Arafat and outside the boundaries of the landmarks of the Sacred Sanctuary. It is a difficult mountain to climb, so stairs were built to lead you to the top, reaching more than 91 steps. The name “Jabal al-Rahmah” has become prevalent, and this is how Muslims know it, believing in the promise of Allah Almighty to His faithful servants among the pilgrims of forgiveness, pleasure, and mercy. Its old name before Islam was “Jabal Alal.”',
  },
  {
    id: '9',
    name: 'Al Hudaybiyah',
    nameAr: 'الحديبية',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4333, lng: 39.6 },
    mapUrl: 'https://maps.app.goo.gl/iGKnLF6DZah4znnk8?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'الحديبية',
    desEn:
      'Al-Hudaybiyyah is located 22 km west of the Grand Mosque and is known today as Al-Shumaisi. The Messenger of Allah (peace and blessings be upon him) and 1,400 of his companions settled there on their way to Mecca to perform Umrah in the sixth year of the Hijra. The Quraysh prevented them from entering Mecca. The site also witnessed the Pledge of Ridwan, when rumors spread that Uthman ibn Affan, the Prophet envoy to negotiate with the Quraysh, had been killed. His companions pledged allegiance to him to fight the Quraysh, and this is what Allah, the Almighty, revealed in this regard: {Indeed, Allah was pleased with the believers when they swore allegiance to you, [O Muhammad], under the tree. And He knew what was in their hearts, so He sent down tranquility upon them and rewarded them with an imminent conquest.} Negotiations took place at Hudaybiyyah between the Prophet (peace and blessings be upon him) and the Quraysh, which ended with the Treaty of Hudaybiyyah. The Prophet (peace and blessings be upon him) and the Companions shaved their heads, slaughtered their sacrificial animals, and returned to Medina that year.',
  },
  {
    id: '10',
    name: 'Al Hudaybiyah Mosque',
    nameAr: 'مسجد الحديبية',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4333, lng: 39.6 },
    mapUrl: 'https://maps.app.goo.gl/M7WpmLJqnmuzPVxr5?g_st=iw',
    category: 'Mosque',
    desAr: 'مسجد الحديبية',
    desEn: '',
  },
  {
    id: '11',
    name: 'Sayeda Aisha Mosque',
    nameAr: 'مسجد السيدة عائشة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4333, lng: 39.8 },
    mapUrl: 'https://maps.app.goo.gl/n1ydRsPjcMNgN5y19?g_st=iw',
    category: 'Mosque',
    desAr: 'مسجد السيدة عائشة',
    desEn:
      'The Mosque of Sayyida Aisha (may Allah be pleased with her) is one of the mosques in Makkah Al-Mukarramah. It is located 7 km from the Grand Mosque, outside the boundaries of the Sacred Mosque. It gained its fame from being built on the spot where the Mother of the Believers, Aisha bint Abu Bakr, entered ihram for Umrah during the Farewell Pilgrimage in the year 9 AH.',
  },
  {
    id: '12',
    name: 'Arafat',
    nameAr: 'عرفات',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.3528, lng: 39.9842 },
    mapUrl: 'https://maps.app.goo.gl/W8U8VCreyM1nJRUC7?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'عرفات ',
    desEn: 'Arafat',
  },
  {
    id: '13',
    name: 'Mina',
    nameAr: 'منى',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4133, lng: 39.8933 },
    mapUrl: 'https://maps.app.goo.gl/B5rKBHBcNTGcsoj48?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'منى',
    desEn: 'Mina',
  },
  {
    id: '14',
    name: 'Muzdalifah',
    nameAr: 'مزدلفة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.3833, lng: 39.9333 },
    mapUrl: 'https://maps.app.goo.gl/yHXrGu4mEb1wUxUn9?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'مزدلفة ',
    desEn: 'Muzdalifah',
  },
  {
    id: '15',
    name: 'Jamarat',
    nameAr: 'الجمرات',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4233, lng: 39.8667 },
    mapUrl: 'https://maps.app.goo.gl/AN3brrkHtuyPzAY9A?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'الجمرات ',
    desEn: 'Jamarat',
  },
  {
    id: '16',
    name: 'Jamarat Bridge',
    nameAr: 'جسر الجمرات',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4233, lng: 39.8667 },
    mapUrl: 'https://maps.app.goo.gl/V4Wx9DfT3qZ3wmnQA?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: '',
    desEn: '',
  },
  {
    id: '17',
    name: 'Small Jamarah',
    nameAr: 'الجمرة الصغرى',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4233, lng: 39.8667 },
    mapUrl: 'https://maps.app.goo.gl/LRqBbJUAZZEH8o8E7?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'الجمرة الصغرى',
    desEn: 'Small Jamarah',
  },
  {
    id: '18',
    name: 'Middle Jamarah',
    nameAr: 'الجمرة الوسطى',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4233, lng: 39.8667 },
    mapUrl: 'https://maps.app.goo.gl/jmwAfcb7QZHdLPpu7?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'الجمرة الوسطى',
    desEn: 'Middle Jamarah',
  },
  {
    id: '19',
    name: 'Large Jamarah',
    nameAr: 'الجمرة الكبرى',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4233, lng: 39.8667 },
    mapUrl: 'https://maps.app.goo.gl/S2ach14ahYjgkwMr8?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'الجمرة الكبرى',
    desEn: 'Large Jamarah',
  },
  {
    id: '20',
    name: 'Namirah Mosque',
    nameAr: 'مسجد نمرة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.3528, lng: 39.9842 },
    mapUrl: 'https://maps.app.goo.gl/1DtKKGodmse3JCgF7?g_st=iw',
    category: 'Mosque',
    desAr: 'مسجد نمرة',
    desEn:
      'Namirah Mosque is one of the most important landmarks in Arafat. Tens of thousands of pilgrims to the Sacred House perform the Dhuhr and Asr prayers together and shorten them on the Day of Arafat, following the example of the Prophet Muhammad, may the best prayers and peace be upon him.',
  },
  {
    id: '21',
    name: 'AlKhaif Mosque',
    nameAr: 'مسجد الخيف',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4133, lng: 39.8933 },
    mapUrl: 'https://maps.app.goo.gl/9tufKyXT2sHRJMLH6?g_st=iw',
    category: 'Mosque',
    desAr: 'مسجد الخيف',
    desEn:
      'With the opening of the Kha and the sukoon of the Ya, and it was named Al-Khaif in relation to the Khaif of Bani Kinanah on the southern slope of Mount Mina near the Small Jamarat, and Al-Khaif in the language is what descends from the thickness of the mountain and rises above the watercourse. The Al-Khaif Mosque was and still is the focus of attention and care of the leadership of the Kingdom, because of its historical status linked to the Mina ritual. It was expanded and reconstructed in the year 1407 AH corresponding to 1987 at a cost of ninety million riyals.',
  },
  {
    id: '22',
    name: 'AlBir Charity Association',
    nameAr: 'جمعية البر بمكة المكرمة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/oC97EFJQVJmNfii3A?g_st=iw',
    category: 'Other',
    desAr: 'جمعية البر بمكة المكرمة',
    desEn: '',
  },
  {
    id: '23',
    name: 'Zamzam Charity Association',
    nameAr: 'جميعة زمزم',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/8y5A5XeYgEn8WukT6?g_st=iw',
    category: 'Other',
    desAr: 'جميعة زمزم',
    desEn: '',
  },
  {
    id: '24',
    name: 'Hadiya Hajj and Muetamar Charity Association',
    nameAr: 'جمعية هدية الحاج والمعتمر',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/6mPwkRDy7DJcUdqV8?g_st=iw',
    category: 'Other',
    desAr: 'جمعية هدية الحاج والمعتمر',
    desEn: '',
  },
  {
    id: '25',
    name: 'Mathabh for Consulting and Research',
    nameAr: 'شركة مثابة للدراسات والاستشارات والأبحاث',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/B7NfDZ4pnGYH4ir57',
    category: 'Other',
    desAr: 'شركة مثابة للدراسات والاستشارات والأبحاث',
    desEn:
      'We are a specialized scientific entity that emerged from the heart of Umm Al-Qura University. As a non-profit research institute located in the heart of Makkah, we focus on studying and analyzing the administrative, economic, and regulatory aspects of the Hajj, Umrah, and Ziyarah systems. Our aim is to develop and promote well-researched ideas through collective expertise, offering diverse and mature advice to decision-makers in the government, private, and charitable sectors. We are committed to building partnerships with all relevant parties, demonstrating dedication, discipline, professionalism, and integrity in our work, while fostering a strong team spirit',
  },
  {
    id: '26',
    name: 'Ummul Al Qura University',
    nameAr: 'جامعة ام القرى',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/B7NfDZ4pnGYH4ir57',
    category: 'Other',
    desAr: 'جامعة ام القرى',
    desEn:
      'Umm al-Qura University (UQU; Arabic: جامعة أم القرى, romanized: Jāmiʿah ʾUmm al-Qurā, lit. Mother of All Settlements is a public university in Mecca, Saudi Arabia. The university was established as the College of Sharia (Islamic law) in 1949 during the reign of King Abdulaziz ibn Saud before being joined by new colleges and renamed as Umm al-Qura through a royal decree in 1981',
  },
  {
    id: '27',
    name: 'Mosque',
    nameAr: 'جامع عاشئة الراجحي',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/EUgu4idhaPV7DfQ28',
    category: 'Mosque',
    desAr: 'جامع عاشئة الراجحي',
    desEn: '',
  },
  {
    id: '28',
    name: "International Museum of the Prophet's Biography",
    nameAr: 'المعرض والمتحف الدولي للسيرة النبوية والحضارة الإسلامية‎',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/36S4mWp8XV2a2rr2A',
    category: 'Historical and Heritage Sites',
    desAr: 'المعرض والمتحف الدولي للسيرة النبوية والحضارة الإسلامية‎',
    desEn:
      'The Seerah Museum in Mecca offers interactive displays on the Prophet life in 7 languages, using modern technology, under the Muslim World League’s supervision.',
  },
  {
    id: '29',
    name: 'Hijaz Mall',
    nameAr: 'الحجاز مول',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/tQqArRQXbk1MEMmE9',
    category: 'Shopping Mall',
    desAr: 'الحجاز مول',
    desEn:
      'The two levels of the 18,000 square meter mall are home to 250 stores selling national and international brands. While you shop for apparel or other items at various stores or browse books at Jarir Bookstore, your kids can have fun at Funland, the family amusement center. Taste some wonderful food by going to the food court. Enjoy shopping at the Al Hijaz Mall for expensive goods. While you shop, let the kids play in the grassy area. After your shopping trip, stop by one of the eateries for a meal.',
  },
  {
    id: '30',
    name: 'Makkah Mall',
    nameAr: 'مكة مول سينومي مكة مول',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/iAQrmiiJyVuUzx3Q8',
    category: 'Shopping Mall',
    desAr: 'مكة مول سينومي مكة مول ',
    desEn: '',
  },
  {
    id: '31',
    name: 'Abraj Al-Bait Shopping Center',
    nameAr: 'أسواق أبراج البيت',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/3hTum6vj5sfTG9Uz9',
    category: 'Shopping Mall',
    desAr: '',
    desEn: '',
  },
  {
    id: '32',
    name: 'Jabal Omar',
    nameAr: 'جبل عمر',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/sYnu22gFHjS5Rhc18',
    category: 'Shopping Mall',
    desAr: '',
    desEn: '',
  },
  {
    id: '33',
    name: 'Al Utayibiyah Market',
    nameAr: 'أسواق العتيبية',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/z2T3aSJL1VVUADAw9',
    category: 'Shopping Mall',
    desAr: '',
    desEn: '',
  },
  {
    id: '34',
    name: 'Al Aziziah Market',
    nameAr: 'أسواق العزيزية',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/3f2uf85zDaPW3xmT7',
    category: 'Shopping Mall',
    desAr: '',
    desEn: '',
  },
  {
    id: '35',
    name: 'Al Diyafah Mall',
    nameAr: 'الضيافة مول',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/qZ2XxK4cYEStuCa28',
    category: 'Shopping Mall',
    desAr: 'الضيافة مول ',
    desEn:
      'Souk Aldiyafa is considered one of the most famous shopping destinations in the holy city of Makkah. Located on Al-Hajoun Street in the Al-Zahir District, it stands as one of the best shopping centers in city. What distinguishesSouk Aldiyafa, besides its strategic location, is that it houses a large collection of tenants from well-known brands, offering a variety of goods from the finest labels, whether local or international. Additionally, Souk Aldiyafa is characterized by its modern architectural design, making it a major attraction for many visitors.',
  },
  {
    id: '36',
    name: 'Salam Commercial Market',
    nameAr: 'سوق السلام التجاري',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/tCFaHnbDrdy5fQkM6',
    category: 'Shopping Mall',
    desAr: 'سوق السلام التجاري ',
    desEn: '',
  },
  {
    id: '37',
    name: 'Makkah Clock Tower',
    nameAr: 'برج الساعة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/bcPBzzLmJgdgs9AAA',
    category: 'Shopping Mall',
    desAr: ' برج الساعة',
    desEn: 'Towers of the Clock',
  },
  {
    id: '38',
    name: 'Makkah Hotel',
    nameAr: 'فندق وابراج شركة مكة ، شركة مكة للانشاء والتعمير',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/gi1sFXJtwxARwkHq5',
    category: 'Shopping Mall',
    desAr: 'فندق وابراج شركة مكة ، شركة مكة للانشاء والتعمير ',
    desEn:
      'As the closest hotel to the Holy Haram, the 5-star Makkah Towers situates in a prime central spot in Makkah, Saudi Arabia, just a few steps away from the Holy Mosque.Getting here from King Abdul Aziz International Airport is easy – and only one hour away by car. Join us at our hotel, perched in an ideal location next to the most sacred place on Earth.Major Makkah attractions can be found just outside of our luxury hotel, including the Kaaba, Holy Haram, and the Zamzam Well. Other important Islamic holy sites less than five miles away are the Jabal al-Nour, Cave of Heraa and Makkah Museum. For more places to see, you’ll also find a favorite shopping mall and local supermarket, as well as a variety of international restaurants and lounges.',
  },
  {
    id: '39',
    name: 'Mecca Commercial Housing Center',
    nameAr: 'مركز شركة مكة السكني التجاري',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/KCmxRRVMrpmogrse6',
    category: 'Shopping Mall',
    desAr: 'مركز شركة مكة السكني التجاري ',
    desEn: '',
  },
  {
    id: '40',
    name: 'Makkah Haramain Train Station',
    nameAr: 'محطة القطار بمكة - محطة قطار الحرمين بمكة المكرمة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/EoQT66o7rb515Jjx7',
    category: 'Train and Metro Stations',
    desAr: '',
    desEn: '',
  },

  // Madinah Locations
  {
    id: '41',
    name: 'Prince Muhammad Bin Abdulaziz Airport Madinah',
    nameAr: 'مطار الأمير محمد بن عبدالعزيز بالمدينة المنورة',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.5444, lng: 39.6989 },
    mapUrl: 'https://maps.app.goo.gl/oAujBqnhsVR2x2t27',
    category: 'Airport',
    desAr: 'مطار الأمير محمد بن عبدالعزيز بالمدينة المنورة ',
    desEn:
      'Prince Mohammed Bin Abdulaziz International Airport (PMIA) is located in the holy city of Medina, Saudi Arabia. The airport is well- connected to the city center and other important destinations through a modern road network. The main access to the airport is via the Madinah- Qassim Expressway, which links it to the north and south of the region.',
  },
  {
    id: '42',
    name: 'Uhad Mountain',
    nameAr: 'جبل احد',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.525, lng: 39.6619 },
    mapUrl: 'https://maps.app.goo.gl/KN4D2WUWuFzGdNfu5',
    category: 'Historical and Heritage Sites',
    desAr: 'جبل احد',
    desEn:
      ' is a mountain north of Medina, in the Hejazi region of Saudi Arabia. It is 1,077 m (3,533 ft) high and 7.5 km (4.7 miles) long. It was the site of the second battle between the Islamic prophet Muhammad and the polytheists of his tribe of Quraysh. The Battle of Uhud was fought on 19 March, 625 CE, between a force from the small Muslim community of Medina and a force from Mecca, in north-western Arabia.',
  },
  {
    id: '43',
    name: 'Uhad Mountain - Martyrs',
    nameAr: 'جبل احد سيد الشهداء',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.525, lng: 39.6619 },
    mapUrl: 'https://maps.app.goo.gl/5uqRJnt44iBB1qR58',
    category: 'Historical and Heritage Sites',
    desAr: 'المدينة المنورة',
    desEn:
      'Located at the foot of Mount Uhud, Uhud Martyrs Cemetery is where 85 martyred soldiers from the Battle of Uhud are buried; the most notable would be the Prophet uncle, Hamza ibn Abdul Muttalib.',
  },
  {
    id: '44',
    name: 'King Fahd Glorious Quran Printing Complex',
    nameAr: 'مجمع الملك فهد لطباعة المصحف الشريف',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.49, lng: 39.57 },
    mapUrl: 'https://maps.app.goo.gl/A2eLjJiYugjxTfo7A',
    category: 'Historical and Heritage Sites',
    desAr: 'مجمع الملك فهد لطباعة المصحف الشريف ',
    desEn: '',
  },
  {
    id: '45',
    name: 'Masjid al-Qiblatayn',
    nameAr: 'مسجد القبلتين',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4842, lng: 39.5786 },
    mapUrl: 'https://maps.app.goo.gl/PE7BbVJXG8B3Htvn6',
    category: 'Mosque',
    desAr: 'المدينة المنورة',
    desEn:
      'Built by Sawad ibn Ghanam ibn Kaab in 623 CE, Masjid Al Qiblatayn is situated in The Blessed City of Madinah and is one of the most important mosques in Islamic history. Masjid Al Qiblatayn translates to Mosque of the two Qiblas and is believed to be the Mosque where The Blessed Prophet (Peace and Blessings Be Upon Him) received the revelation to change the Qibla (direction of prayer) from Jerusalem to Makkahh. The mosque is located in the northwestern part of Madinah, approximately 3 km from the Prophet’s Mosque.',
  },
  {
    id: '46',
    name: 'Masjid Quba',
    nameAr: 'مسجد قباء',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4397, lng: 39.6189 },
    mapUrl: 'https://maps.app.goo.gl/Ci7URE4xD7dq6cGx7',
    category: 'Mosque',
    desAr: 'مسجد قباء ',
    desEn:
      'Masjid Quba (Arabic: مسجد قباء) was the first mosque to be built by the Prophet ﷺ after his arrival in Madinah from Makkah. It is situated approximately 3.25 kilometres from Masjid Nabawi. For those who arrive in Madinah before or after performing Hajj or Umrah, a visit to Masjid Quba carries profound significance and promises great spiritual reward. This visit serves as a means of connecting with the memories of the Prophet’s ﷺ blessed Hijrah (migration) and his relentless efforts to spread the message of Islam. Furthermore, as stated by the Prophet ﷺ, praying in the mosque gives the same reward as performing Umrah.',
  },
  {
    id: '47',
    name: 'The Seven Mosques',
    nameAr: 'المساجد السبعة التاريخية',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.47, lng: 39.61 },
    mapUrl: 'https://maps.app.goo.gl/Y82NB3PtE7hdj5ZV6',
    category: 'Mosque',
    desAr: 'المساجد السبعة التاريخية',
    desEn:
      'The Seven Mosques (Arabic: المساجد السبعة, romanized: al-Masājid al-Sabʿa) is a complex of six small historic and often visited mosques in the city of Medina, Saudi Arabia. Despite only consisting of six mosques, the complex is called seven because some think it originally consisted of seven mosques.[1][2] Another reason for the name is that many visitors usually visit Masjid Al-Qiblatayn among these mosques on their visit to Medina, making it seven.[2][3] Some also consider Masjid al-Khandaq to be among one of those seven mosques',
  },
  {
    id: '48',
    name: 'Dhul Hulaifah',
    nameAr: 'ذو الحليفة - ابيار علي الميقات',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4333, lng: 39.5667 },
    mapUrl: 'https://maps.app.goo.gl/NUUTnFhQhtLdUhnd9',
    category: 'Mosque',
    desAr: 'ذو الحليفة - ابيار علي  الميقات',
    desEn: '',
  },
  {
    id: '49',
    name: 'Ghars well',
    nameAr: 'بئر غرس',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.47, lng: 39.61 },
    mapUrl: 'https://maps.app.goo.gl/e6vpg5d72cvnc3VXA',
    category: 'Gardens, Parks, and Farms',
    desAr: 'بئر غرس',
    desEn: '',
  },
  {
    id: '50',
    name: 'Mosque of Al-Ghamama',
    nameAr: 'مسجد الغمامة',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/fX4Gy2WeUy7tce3XA',
    category: 'Mosque',
    desAr: 'مسجد الغمامة',
    desEn:
      'Mosque of Al-Ghamamah (Arabic: مسجد الغمامة) is a mosque, located in Medina, Saudi Arabia. The mosque is located at 500 m (1,600 ft) west of As-Salam door of Al-Masjid an-Nabawi',
  },
  {
    id: '51',
    name: 'Masjid Abu Bakr Siddeeq RA',
    nameAr: 'مسجد سيدنا أبو بكر الصديق',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/XXJPCGHYmDvWunrw8',
    category: 'Mosque',
    desAr: 'مسجد سيدنا أبو بكر الصديق ',
    desEn:
      'It is a prophetic prayer ground, 150 meters away from the courtyards of the Prophet’s Mosque. The prophet (ﷺ) performed Eid prayer on this site, a practice followed by his first successor, Abu Bakr As-Siddiq, after whom the mosque was named later.',
  },
  {
    id: '52',
    name: "The International Fair and Museum of the Prophet's Biography and Islamic Civilization",
    nameAr: 'المعرض والمتحف الدولي للسيرة النبوية والحضارة الإسلامية',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/TDLySTDvaWa2XQvx6',
    category: 'Historical and Heritage Sites',
    desAr: 'المعرض والمتحف الدولي للسيرة النبوية والحضارة الإسلامية',
    desEn: '',
  },
  {
    id: '53',
    name: 'Bilal Ibn Rabah Mosque',
    nameAr: 'مسجد بلال بن رباح',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/mzJrtDQJgqUyVg7U6',
    category: 'Mosque',
    desAr: 'مسجد بلال بن رباح',
    desEn: '',
  },
  {
    id: '54',
    name: 'Al Baqi Cemetery',
    nameAr: 'البقيع',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/qJmp93ARTymUsxHE8',
    category: 'Historical and Heritage Sites',
    desAr: 'البقيع',
    desEn: '',
  },
  {
    id: '55',
    name: 'Quba walkway',
    nameAr: 'ممشى قباء',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4397, lng: 39.6189 },
    mapUrl: 'https://maps.app.goo.gl/biQ5ygUAG3YwJGvA6',
    category: 'Historical and Heritage Sites',
    desAr: 'ممشى قباء ',
    desEn: '',
  },
  {
    id: '56',
    name: 'As Safiyyah Museum & Park',
    nameAr: 'متحف وبستان الصافية',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/CKwDihumXFoaqeSw6',
    category: 'Gardens, Parks, and Farms',
    desAr: 'متحف وبستان الصافية',
    desEn:
      'Located in Madinah, As Safiyyah Museum and Park offers visitors a unique cultural escape where learning and leisure go hand in hand. At the heart of the park is the Creation Museum, which takes guests on a thought-provoking journey through the story of creation. Surrounding the museum, the expansive cultural park features landscaped gardens, flowing waterways, and tranquil walking paths, inviting families and travelers to slow down and explore.Beyond its educational and natural offerings, the destination includes a variety of local shops, restaurants, and cafés, making it an ideal stop for an afternoon of discovery and relaxation.',
  },
  {
    id: '57',
    name: 'Al Masjid an Nabawi',
    nameAr: 'المسجد النبوي',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/SbPLRoCWq6F2NSkw9',
    category: 'Historical and Heritage Sites',
    desAr: 'المسجد النبوي',
    desEn:
      'In Madinah, the Prophet Mosque emanates the essence of the Prophet message and the enduring legacy of his Prophethood. Hearts are irresistibly drawn to it, yearning to visit the Prophet may Allah salah and salam be upon him, send salam upon him, reflect on its rich historical landmarks, and deeply sense the events and fragrant narratives of Prophethood.',
  },
  {
    id: '58',
    name: 'Rawdah Rasool (The Green Dome)',
    nameAr: 'القبة الخضراء بالمسجد النبوي',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/W5y5Yw7yN6rg4hS86',
    category: 'Historical and Heritage Sites',
    desAr: 'القبة الخضراء بالمسجد النبوي',
    desEn: '',
  },
  {
    id: '59',
    name: 'Blessed Valley of Aqeeq',
    nameAr: 'وادي العقيق المبارك بالمدينة المنورة',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/cq48DpAFCKqo8eMU8',
    category: 'Gardens, Parks, and Farms',
    desAr: 'وادي العقيق المبارك بالمدينة المنورة ',
    desEn: '',
  },
  {
    id: '60',
    name: 'Quba Avenue',
    nameAr: 'جادة قباء',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4397, lng: 39.6189 },
    mapUrl: 'https://maps.app.goo.gl/6mecxyRLWCGSdJJC8',
    category: 'Historical and Heritage Sites',
    desAr: 'جادة قباء ',
    desEn:
      'To revive the Prophet Sunnah of easily reaching the Quba Mosque from Al-Masjid An-Nabawy and vice versa by transforming the Quba Road, which is crowded with cars, into a safe avenue designated for pedestrains, while creating squares and urban residential compounds, and developing stores and residential buildings along the avenue to improve its visual identity.',
  },
  {
    id: '61',
    name: 'Islamic University of Madinah',
    nameAr: 'الجامعة الإسلامية بالمدينة المنورة',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/Wht4JfSkVg8v5FBUA',
    category: 'Other',
    desAr: 'الجامعة الإسلامية بالمدينة المنورة',
    desEn:
      'The Islamic University of Madinah (Arabic: الجامعة الإسلامية بالمدينة المنورة) is a public Islamic university in Medina, Saudi Arabia. Established by King Saud bin Abdulaziz in 1961,[1] Sayy’id Abul Ala Maududi had played a significant role of establishing and running of Islamic University of Madinah, Saudi Arabia. This institute is said to have been associated with Salafism, while claiming to have exported Salafi-inclined theologians around the world.[2][3][4][5][6] Others disagree and state that the institution is objective and scientific, being detached to any singular ideology.[7] It received institutional academic accreditation without exceptions from the National Commission for Academic Accreditation and Assessment in April 2017',
  },
  {
    id: '62',
    name: 'Al Rashid Mega Mall',
    nameAr: 'الراشد ميغا مول',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/16NSM9mGcVgnicnv8',
    category: 'Shopping Mall',
    desAr: 'الراشد ميغا مول',
    desEn:
      'A commercial complex which is considered one of the most famous of its kind in Madinah. It embraces both domestic and international brands. Stores offer a variety of shopping options, and allows its visitors to spend the most enjoyable moments in game rooms, fun centers and international restaurants',
  },
  {
    id: '63',
    name: 'Cenomi Al Noor Mall',
    nameAr: 'سينومي النور مول',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/mfvzJuUp3QQGYDuM7',
    category: 'Shopping Mall',
    desAr: 'سينومي النور مول ',
    desEn: '',
  },
  {
    id: '64',
    name: 'hifaa mall',
    nameAr: 'هيفاء مول',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/a6VzshPYzhEtSaMH7',
    category: 'Shopping Mall',
    desAr: 'هيفاء مول ',
    desEn: '',
  },

  // Jeddah Locations
  {
    id: '65',
    name: 'King Abdulaziz International Airport',
    nameAr: 'مطار الملك عبد العزيز الدولي',
    city: 'Jeddah',
    cityAr: 'جدة',
    address: '',
    position: { lat: 21.6796, lng: 39.1565 },
    mapUrl: 'https://maps.app.goo.gl/gZDyxoiBbbiea7nh8?g_st=iw',
    category: 'Airport',
    desAr: 'مطار الملك عبد العزيز الدولي',
    desEn: 'King Abdulaziz International Airport',
  },
  {
    id: '66',
    name: 'King Abdulaziz International Airport - Hajj Terminal',
    nameAr: 'مطار جدة الملك عبدالعزيز - صالة الحجاج',
    city: 'Jeddah',
    cityAr: 'جدة',
    address: '',
    position: { lat: 21.6796, lng: 39.1565 },
    mapUrl: 'https://maps.app.goo.gl/5apoXyLHRya4BesbA',
    category: 'Airport',
    desAr: 'مطار جدة الملك عبدالعزيز - صالة الحجاج ',
    desEn: 'King Abdulaziz International Airport - Hajj Terminal',
  },
  {
    id: '67',
    name: 'Haramain Train Station - Jeddah Airport',
    nameAr: 'محطة قطار الحرمين - مطار جدة - مطار الملك عبدالعزيز',
    city: 'Jeddah',
    cityAr: 'جدة',
    address: '',
    position: { lat: 21.6796, lng: 39.1565 },
    mapUrl: 'https://maps.app.goo.gl/6MzPuu5PHFsahJYm6',
    category: 'Train and Metro Stations',
    desAr: 'محطة قطار الحرمين - مطار جدة - مطار الملك عبدالعزيز',
    desEn:
      'Airport - Jeddah railway station is an integrated structure within the Main Airport Terminal Building located at King Abdulaziz International Airport.The Railway station consists of a Transport Hub connecting the new terminal with highspeed rail networks, Busses, Shuttles, taxis and car parking.The station has been designed to accommodate large capacities of travelers especially during Hajj and Ramadan seasons with the highest level of services to satisfy their needs.',
  },
  {
    id: '68',
    name: 'Haramain Train Station - Jeddah Highway',
    nameAr: 'محطة قطار الحرمين - جدة - الطريق السريع',
    city: 'Jeddah',
    cityAr: 'جدة',
    address: '',
    position: { lat: 21.5433, lng: 39.1728 },
    mapUrl: 'https://maps.app.goo.gl/2GRxGGZX7EszpLjE7',
    category: 'Train and Metro Stations',
    desAr: 'محطة قطار الحرمين - جدة - الطريق السريع',
    desEn:
      'Al-Sulimaniyah - Jeddah Railway station is located at An Nassim District, 20 Km away from King Abdulaziz International Airport, Jeddah, Saudi Arabia.Jeddah is also known as the Bride of the Red Sea. It is located in the middle of the eastern coast of the red sea, and is viewed as the capital of tourism in Saudi Arabia that is witnessing unprecedented growth. Hence, why silver colored patterns were used in the architectural design of the Haramain train station that portrays the beautiful sunlight’s reflection on the beautiful red sea.',
  },
  {
    id: '69',
    name: 'King Abdulaziz International Airport - Terminal 1',
    nameAr: 'مطار جدة الملك عبدالعزيز - صالة رقم 1',
    city: 'Jeddah',
    cityAr: 'جدة',
    address: '',
    position: { lat: 21.6796, lng: 39.1565 },
    mapUrl: 'https://maps.app.goo.gl/9jdkvAiQjShiXaxb9?g_st=iw',
    category: 'Airport',
    desAr: 'مطار جدة الملك عبدالعزيز - صالة رقم 1',
    desEn: 'King Abdulaziz International Airport - Terminal 1',
  },
  {
    id: '70',
    name: 'King Abdulaziz International Airport - North Terminal',
    nameAr: 'مطار جدة الملك عبدالعزيز - الصالة الشمالية',
    city: 'Jeddah',
    cityAr: 'جدة',
    address: '',
    position: { lat: 21.6796, lng: 39.1565 },
    mapUrl: 'https://maps.app.goo.gl/kwFrCDqYNoPNApzQ6?g_st=iw',
    category: 'Airport',
    desAr: 'مطار جدة الملك عبدالعزيز - الصالة الشمالية ',
    desEn: 'King Abdulaziz International Airport - North Terminal',
  },
  {
    id: '71',
    name: 'Masjid Al Haram',
    nameAr: 'المسجد الحرام',
    city: 'Jeddah',
    cityAr: 'جدة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/Kudq5uEs6CvSekgHA?g_st=iw',
    category: 'Historical and Heritage Sites',
    desAr: 'المسجد الحرام',
    desEn: 'Masjid Al Haram',
  },
];

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 240px)', // Adjusted for city selector
};

const defaultCenter = {
  lat: 21.4225,
  lng: 39.8233,
};

export default function LocationFullComponent() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [activeMarker, setActiveMarker] = useState<Location | null>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  // Filter locations based on selected city
  const filteredLocations = locations.filter(
    (location) => location.city === selectedCity.name
  );

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftScroll(container.scrollLeft > 0);
    setShowRightScroll(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  // Calculate map center based on selected city's locations
  const getCityCenter = () => {
    if (selectedLocation) return selectedLocation.position;
    if (filteredLocations.length === 0) return defaultCenter;

    const lats = filteredLocations.map((loc) => loc.position.lat);
    const lngs = filteredLocations.map((loc) => loc.position.lng);
    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  };

  const swiperOptions = {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      640: {
        slidesPerView: 4,
        spaceBetween: 12,
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 6,
        spaceBetween: 24,
      },
    },
    // onSwiper: (swiper) => {
    //   setSwiperInstance(swiper);
    // },
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header with Back Button and City Selector */}
      <div className="sticky top-0 z-50 p-4 bg-white shadow-sm flex items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>{isArabic ? 'رجوع' : 'Go back'}</span>
        </button>

        {/* City Selector Dropdown - Centered */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
            >
              <span>{isArabic ? selectedCity.nameAr : selectedCity.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-lg border"
                style={{ zIndex: 9999 }}
              >
                {cities.map((city) => (
                  <button
                    key={city.id}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSelectedCity(city);
                      setIsDropdownOpen(false);
                      setSelectedLocation(null);
                      setActiveMarker(null);
                    }}
                  >
                    {isArabic ? city.nameAr : city.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="flex-1 relative overflow-hidden">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={getCityCenter()}
            zoom={13}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: true,
            }}
          >
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                position={location.position}
                onClick={() => {
                  setActiveMarker(location);
                  setSelectedLocation(location);
                }}
              />
            ))}
            {activeMarker && (
              <InfoWindow
                position={activeMarker.position}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {isArabic ? activeMarker.nameAr : activeMarker.name}
                  </h3>
                  <p className="text-sm">
                    {isArabic ? activeMarker.cityAr : activeMarker.city}
                  </p>
                  <p className="text-sm mb-1">{activeMarker?.address}</p>
                  <p className="text-sm ">{(isArabic ? activeMarker.desAr : activeMarker.desEn)}</p>
                  {/* {activeMarker.note && (
                    <p className="text-sm mt-1 text-gray-600">
                      {isArabic ? activeMarker.note.ar : activeMarker.note.en}
                    </p>
                  )} */}
                  {activeMarker.mapUrl && (
                    <a href={activeMarker.mapUrl} target="_blank">
                      <p className="text-sm mt-1 text-blue-800">
                        View on Google Maps
                      </p>
                    </a>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Swiper Location Slider */}

      {/* Swiper Location Slider */}
      <div className="fixed bottom-0 left-0 right-0 bg-white  shadow-lg">
        <div className="relative px-6 py-4">
          {/* Custom Navigation Buttons */}
          <button
            // onClick={goToPrev}
            className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 border border-gray-200 swiper-button-prev-2"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <button
            // onClick={goToNext}
            className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 border border-gray-200 swiper-button-next-2"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Swiper Container */}
          <div className="ms-0 md:ms-6 me-0 md:me-12 p-2 md:p-4" dir="ltr">
            <Swiper
              {...swiperOptions}
              navigation={{
                prevEl: '.swiper-button-prev-2',
                nextEl: '.swiper-button-next-2',
              }}
              loop={true}
              className="mySwiper [&>div]:py-3 [&>div]:px-3 !pr-[20px] md:!pr-[16px]"
              freeMode={true}
              dir="ltr"
            >
              {filteredLocations.map((location) => (
                <SwiperSlide key={location.id} className="" dir="ltr">
                  <div
                    className={`w-full p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 h-full border min-h-28
                      ${
                        selectedLocation?.id === location.id
                          ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-[#6b6291] shadow-lg transform scale-105'
                          : 'bg-white hover:shadow-xl hover:transform hover:scale-102 border-gray-200 hover:border-gray-300'
                      }`}
                    // onClick={() => handleLocationClick(location)}
                    onClick={() => {
                      setSelectedLocation(location);
                      setActiveMarker(location);
                    }}
                  >
                    <h3 className="font-semibold text-base mb-1">
                      {isArabic ? location.nameAr : location.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">
                      {isArabic ? location.cityAr : location.address}
                    </p>
                    {location.note && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {isArabic ? location.note.ar : location.note.en}
                      </p>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
