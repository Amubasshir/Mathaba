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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Location {
  id: string;
  name: string;
  nameAr: string;
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
  },
  {
    id: '9',
    name: 'Al Hudaybiyah',
    nameAr: 'الحديبية',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4333, lng: 39.6000 },
    mapUrl: 'https://maps.app.goo.gl/iGKnLF6DZah4znnk8?g_st=iw',
    category: 'Historical and Heritage Sites'
  },
  {
    id: '10',
    name: 'Al Hudaybiyah Mosque',
    nameAr: 'مسجد الحديبية',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4333, lng: 39.6000 },
    mapUrl: 'https://maps.app.goo.gl/M7WpmLJqnmuzPVxr5?g_st=iw',
    category: 'Mosque'
  },
  {
    id: '11',
    name: 'Sayeda Aisha Mosque',
    nameAr: 'مسجد السيدة عائشة',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4333, lng: 39.8000 },
    mapUrl: 'https://maps.app.goo.gl/n1ydRsPjcMNgN5y19?g_st=iw',
    category: 'Mosque'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Mosque'
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
    category: 'Mosque'
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
    category: 'Other'
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
    category: 'Other'
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
    category: 'Other'
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
    category: 'Other'
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
    category: 'Other'
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
    category: 'Mosque'
  },
  {
    id: '28',
    name: 'International Museum of the Prophet\'s Biography',
    nameAr: 'المعرض والمتحف الدولي للسيرة النبوية والحضارة الإسلامية‎',
    city: 'Makkah',
    cityAr: 'مكة المكرمة',
    address: '',
    position: { lat: 21.4225, lng: 39.8262 },
    mapUrl: 'https://maps.app.goo.gl/36S4mWp8XV2a2rr2A',
    category: 'Historical and Heritage Sites'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Train and Metro Stations'
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
    category: 'Airport'
  },
  {
    id: '42',
    name: 'Uhad Mountain',
    nameAr: 'جبل احد',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.5250, lng: 39.6619 },
    mapUrl: 'https://maps.app.goo.gl/KN4D2WUWuFzGdNfu5',
    category: 'Historical and Heritage Sites'
  },
  {
    id: '43',
    name: 'Uhad Mountain - Martyrs',
    nameAr: 'جبل احد سيد الشهداء',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.5250, lng: 39.6619 },
    mapUrl: 'https://maps.app.goo.gl/5uqRJnt44iBB1qR58',
    category: 'Historical and Heritage Sites'
  },
  {
    id: '44',
    name: 'King Fahd Glorious Quran Printing Complex',
    nameAr: 'مجمع الملك فهد لطباعة المصحف الشريف',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4900, lng: 39.5700 },
    mapUrl: 'https://maps.app.goo.gl/A2eLjJiYugjxTfo7A',
    category: 'Historical and Heritage Sites'
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
    category: 'Mosque'
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
    category: 'Mosque'
  },
  {
    id: '47',
    name: 'The Seven Mosques',
    nameAr: 'المساجد السبعة التاريخية',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4700, lng: 39.6100 },
    mapUrl: 'https://maps.app.goo.gl/Y82NB3PtE7hdj5ZV6',
    category: 'Mosque'
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
    category: 'Mosque'
  },
  {
    id: '49',
    name: 'Ghars well',
    nameAr: 'بئر غرس',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4700, lng: 39.6100 },
    mapUrl: 'https://maps.app.goo.gl/e6vpg5d72cvnc3VXA',
    category: 'Gardens, Parks, and Farms'
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
    category: 'Mosque'
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
    category: 'Mosque'
  },
  {
    id: '52',
    name: 'The International Fair and Museum of the Prophet\'s Biography and Islamic Civilization',
    nameAr: 'المعرض والمتحف الدولي للسيرة النبوية والحضارة الإسلامية',
    city: 'Madinah',
    cityAr: 'المدينة المنورة',
    address: '',
    position: { lat: 24.4675, lng: 39.6111 },
    mapUrl: 'https://maps.app.goo.gl/TDLySTDvaWa2XQvx6',
    category: 'Historical and Heritage Sites'
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
    category: 'Mosque'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Gardens, Parks, and Farms'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Gardens, Parks, and Farms'
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
    category: 'Historical and Heritage Sites'
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
    category: 'Other'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Shopping Mall'
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
    category: 'Airport'
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
    category: 'Airport'
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
    category: 'Train and Metro Stations'
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
    category: 'Train and Metro Stations'
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
    category: 'Airport'
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
    category: 'Airport'
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
    category: 'Historical and Heritage Sites'
  },
  ]


const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 240px)', // Adjusted for city selector
};

const defaultCenter = {
  lat: 21.4225,
  lng: 39.8233,
};

export default function LocationsPage() {
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
    const [swiperInstance, setSwiperInstance] = useState(null);

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

  
  const goToNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const goToPrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const swiperOptions = {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 16,
    grabCursor: false,
    watchSlidesProgress: true,
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
      }
    },
    onSwiper: (swiper) => {
      setSwiperInstance(swiper);
    },
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
                  <p className="text-sm">
                    {activeMarker?.address}
                  </p>
                  {/* {activeMarker.note && (
                    <p className="text-sm mt-1 text-gray-600">
                      {isArabic ? activeMarker.note.ar : activeMarker.note.en}
                    </p>
                  )} */}
                  {activeMarker.mapUrl && (
                    <a href={activeMarker.mapUrl} target='_blank'><p className="text-sm mt-1 text-blue-800">
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

      {/* Horizontal Scrollable Location Cards */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-6">
        <div className="relative">
          {showLeftScroll && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {showRightScroll && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              style={{ transform: 'translate(50%, -50%)' }}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 p-4 no-scrollbar scroll-smooth"
            onScroll={handleScroll}
          >
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className={`flex-none w-full md:w-[280px] p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200
                  ${
                    selectedLocation?.id === location.id
                      ? 'bg-[#F3F0FF] border border-[#6b6291]'
                      : 'bg-white hover:shadow-lg'
                  }`}
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
            ))}
          </div>
        </div>
      </div> */}





      {/* Swiper Location Slider */}
     
      {/* Swiper Location Slider */}
      <div className="fixed bottom-0 left-0 right-0 bg-white  shadow-lg">
        <div className="relative px-6 py-4">
          {/* Custom Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 border border-gray-200"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Swiper Container */}
          <div className="ms-0 md:ms-6 me-4 md:me-12 p-4">
            <Swiper {...swiperOptions}>
              {filteredLocations.map((location) => (
                <SwiperSlide key={location.id} className='pr-4 md:pr-0'>
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
