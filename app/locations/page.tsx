// 'use client';

// import { useLanguage } from '@/contexts/language-context';
// import {
//   GoogleMap,
//   InfoWindow,
//   LoadScript,
//   Marker,
// } from '@react-google-maps/api';
// import {
//   ArrowLeft,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useRef, useState } from 'react';

// interface Location {
//   id: string;
//   name: string;
//   nameAr: string;
//   city: string;
//   cityAr: string;
//   address: string;
//   position: {
//     lat: number;
//     lng: number;
//   };
//   mapUrl: string;
//   note?: {
//     en: string;
//     ar: string;
//   };
// }

// // Cities data
// const cities = [
//   { id: 'makkah', name: 'Makkah', nameAr: 'مكة المكرمة' },
//   { id: 'madinah', name: 'Madinah', nameAr: 'المدينة المنورة' },
//   { id: 'jeddah', name: 'Jeddah', nameAr: 'جدة' },
// ];

// // Locations data from the Excel sheet
// const locations: Location[] = [
//   // Makkah Locations
//   {
//     id: '1',
//     name: 'Al-Masjid Al-Haram',
//     nameAr: 'المسجد الحرام',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Al-Haram District, Makkah',
//     position: { lat: 21.4225, lng: 39.8262 },
//     mapUrl: 'https://maps.app.goo.gl/Kuclq5uEs6CvSekgHA?g_st=iw',
//   },
//   {
//     id: '2',
//     name: 'Al-Haram',
//     nameAr: 'الحرم',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Makkah',
//     position: { lat: 21.4228, lng: 39.8261 },
//     mapUrl: 'https://maps.app.goo.gl/uJypVVGgHSAT15w8?g_st=iw',
//   },
//   {
//     id: '3',
//     name: 'Al-Kaaba',
//     nameAr: 'الكعبة',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Al-Haram, Makkah',
//     position: { lat: 21.4225, lng: 39.8262 },
//     mapUrl: 'https://maps.app.goo.gl/eaimWCcqPBSFU5zS7?g_st=iw',
//   },
//   {
//     id: '4',
//     name: 'Hira Cave',
//     nameAr: 'غار حراء',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Jabal An-Nur, Makkah',
//     position: { lat: 21.4581, lng: 39.8581 },
//     mapUrl: 'https://maps.app.goo.gl/Mmc24psqskX8Wcaw7?g_st=iw',
//     note: {
//       en: 'Mount Al-Nour, reaching a height of 642 meters, is one of the most important historical sites in Makkah, with the Cave of Hira at its peak. In this cave, Prophet Muhammad (peace be upon him) received his first divine revelation from Allah.',
//       ar: 'جبل النور الذي يبلغ ارتفاعه 642 متر يعتبر واحد من أهم المواقع التاريخية في مكة حيث يقع غار حراء في قمته. في هذا الغار، تلقى النبي محمد صلى الله عليه وسلم أول وحي من الله سبحانه وتعالى.',
//     },
//   },
//   {
//     id: '5',
//     name: 'Jabal Al-Nour',
//     nameAr: 'جبل النور',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Makkah',
//     position: { lat: 21.4581, lng: 39.8581 },
//     mapUrl: 'https://maps.app.goo.gl/tRX32o5gavDjL4k6?g_st=iw',
//     note: {
//       en: 'Mount Al-Nour, reaching a height of 642 meters, is one of the most important historical sites in Makkah, with the Cave of Hira at its peak. In this cave, Prophet Muhammad (peace be upon him) received his first divine revelation from Allah.',
//       ar: 'جبل النور الذي يبلغ ارتفاعه 642 متر يعتبر واحد من أهم المواقع التاريخية في مكة حيث يقع غار حراء في قمته. في هذا الغار، تلقى النبي محمد صلى الله عليه وسلم أول وحي من الله سبحانه وتعالى.',
//     },
//   },
//   {
//     id: '6',
//     name: 'Hira Cultural District',
//     nameAr: 'حي حراء الثقافي',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Hira District, Makkah',
//     position: { lat: 21.4572, lng: 39.8567 },
//     mapUrl: 'https://maps.app.goo.gl/n4APdMvhKqCPWN26?g_st=iw',
//     note: {
//       en: 'Hira Cultural District will be a cultural area featuring the story of divine revelation, information about the mountain and its terrain, and how Prophet Muhammad (peace be upon him) used to worship.',
//       ar: 'حي حراء الثقافي سيكون منطقة حضارية تضم قصة الوحي بعض معلومات عن الجبل والتضاريس وكيف كان يتعبد النبي صلى الله عليه وسلم',
//     },
//   },
//   {
//     id: '7',
//     name: 'Cave Thawr',
//     nameAr: 'غار ثور',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Jabal Thawr, Makkah',
//     position: { lat: 21.3772, lng: 39.8417 },
//     mapUrl: 'https://maps.app.goo.gl/yM4K55XUYoXusYY6?g_st=iw',
//     note: {
//       en: 'Cave Thawr is located on a mountain reaching 759 meters in height, with the cave being 3 meters below the peak. It holds great historical significance as the place where Prophet Muhammad and Abu Bakr took refuge during the migration (Hijra). It is mentioned in the Quran in Surah At-Tawbah. It is a small cave surrounded by large rocks. They stayed there for three days until the situation in Makkah calmed down. During this time, Asma bint Abu Bakr would bring them food, drink, and news.',
//       ar: 'غار ثور الموجود على جبل يبلغ ارتفاعه 759 متر. و يبعد ارتفاعه عن قمة الجبل 3 متراً. وله أهمية تاريخية كبيرة حيث أنه المكان الذي لجأ إليه النبي وأبو بكر في رحلة الهجرة. وقد ذكر في القرآن في سورة التوبة. وهو غار صغير يوجد حول فتحته صخور كبيرة. وقد بقيا فيه ثلاثة أيام حتى هدأت الأوضاع في مكة الرحمة. وكانت أسماء بنت أبي بكر رضي الله عنها تأتيهم بالطعام والشراب والأخبار في هذه المدة.',
//     },
//   },
//   {
//     id: '8',
//     name: 'Jabal Al-Rahmah',
//     nameAr: 'جبل الرحمة',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Arafat, Makkah',
//     position: { lat: 21.3547, lng: 39.9847 },
//     mapUrl: 'https://maps.app.goo.gl/9a36gQi2HXhLqHj99',
//     note: {
//       en: 'Jabal Al-Rahmah is a small mountain located in the northern part of Arafat, reaching about 65 meters in height. It has stairs built on its eastern side and consists of a large rock mass surrounded by smaller rocks. It has iron railings on all sides and is one of the sacred sites in Hajj and Umrah. Visitors and pilgrims during the Hajj season climb to its peak for supplication and prayer to Allah.',
//       ar: 'جبل الرحمة هو جبل صغير يقع بمنطقة عرفة من الجهة الشمال و يبلغ ارتفاعه نحو 65 متراً وقد أقيم عليه درج من الجهة الشرقية وهو عبارة عن كتلة صخرية كبيرة تحيط بها صخور صغيرة وقد أقيم عليه سياج حديدي من جميع الجهات وهو من المشاعر المقدسة في الحج والعمرة والزائرون والحجاج في موسم الحج يصعدون إلى قمته للدعاء والتضرع إلى الله تعالى.',
//     },
//   },
//   {
//     id: '9',
//     name: 'Mount Arafat',
//     nameAr: 'جبل عرفات',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Arafat, Makkah',
//     position: { lat: 21.3547, lng: 39.9847 },
//     mapUrl: 'https://maps.app.goo.gl/9a36gQi2HXhLqHj99',
//     note: {
//       en: 'Mount Arafat is located in the Arafat region east of Makkah and is one of the sacred sites of Hajj. Pilgrims gather here on the 9th day of Dhul Hijjah (Day of Arafah). It is called the Mountain of Mercy because it is a place of mercy and forgiveness, where pilgrims gather to supplicate and pray to Allah on the Day of Arafah.',
//       ar: 'جبل عرفات هو جبل يقع في منطقة عرفات شرق مكة المكرمة، وهو من المشاعر المقدسة في الحج، حيث يقف عليه الحجاج في اليوم التاسع من ذي الحجة (يوم عرفة). وقد سمي بجبل الرحمة لأنه موقع الرحمة والمغفرة، وهو المكان الذي يجتمع فيه الحجاج للدعاء والتضرع إلى الله في يوم عرفة.',
//     },
//   },
//   {
//     id: '10',
//     name: 'Al-Hudaybiyah',
//     nameAr: 'الحديبية',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Hudaybiyah, Makkah',
//     position: { lat: 21.4225, lng: 39.8262 },
//     mapUrl: 'https://maps.app.goo.gl/GKnLF6DZah4znnk8?g_st=iw',
//     note: {
//       en: 'The historical area where the Treaty of Hudaybiyah was concluded between the Muslims and Quraysh in the sixth year after Hijra.',
//       ar: 'المنطقة التاريخية التي تم فيها صلح الحديبية بين المسلمين وقريش في السنة السادسة من الهجرة.',
//     },
//   },
//   {
//     id: '11',
//     name: 'Masjid Al-Hudaybiyah',
//     nameAr: 'مسجد الحديبية',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Hudaybiyah, Makkah',
//     position: { lat: 21.4225, lng: 39.8262 },
//     mapUrl: 'https://maps.app.goo.gl/M7WpmLJqrmuzPVvt57g_st=iw',
//   },
//   {
//     id: '12',
//     name: 'Arafat',
//     nameAr: 'عرفات',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Arafat, Makkah',
//     position: { lat: 21.3547, lng: 39.9847 },
//     mapUrl: 'https://maps.app.goo.gl/W8U8VCreyM1nRUC7?g_st=iw',
//   },
//   {
//     id: '13',
//     name: 'Mina',
//     nameAr: 'منى',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Mina, Makkah',
//     position: { lat: 21.4133, lng: 39.8733 },
//     mapUrl: 'https://maps.app.goo.gl/B5rKBHBcNTGcsoj48?g_st=iw',
//   },
//   {
//     id: '14',
//     name: 'Muzdalifah',
//     nameAr: 'مزدلفة',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Muzdalifah, Makkah',
//     position: { lat: 21.3833, lng: 39.9167 },
//     mapUrl: 'https://maps.app.goo.gl/yHXrGu4mEb1wUxUr9?g_st=iw',
//   },
//   {
//     id: '15',
//     name: 'Jamarat',
//     nameAr: 'الجمرات',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Mina, Makkah',
//     position: { lat: 21.4133, lng: 39.8733 },
//     mapUrl: 'https://maps.app.goo.gl/AN3brrkHtuyPzAY9A?g_st=iw',
//   },
//   {
//     id: '16',
//     name: 'Jamarat Bridge',
//     nameAr: 'جسر الجمرات',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Mina, Makkah',
//     position: { lat: 21.4133, lng: 39.8733 },
//     mapUrl: 'https://maps.app.goo.gl/V4Wx9DfT3qZ3wmnQA?g_st=iw',
//   },
//   {
//     id: '17',
//     name: 'Jamarat Al-Aqabah',
//     nameAr: 'جمرة العقبة',
//     city: 'Makkah',
//     cityAr: 'مكة المكرمة',
//     address: 'Mina, Makkah',
//     position: { lat: 21.4133, lng: 39.8733 },
//     mapUrl: 'https://maps.app.goo.gl/S2ach14ahYjgkwMr8?g_st=iw',
//   },

//   // Jeddah Locations
//   {
//     id: '18',
//     name: 'King Abdulaziz International Airport',
//     nameAr: 'مطار الملك عبد العزيز الدولي',
//     city: 'Jeddah',
//     cityAr: 'جدة',
//     address: 'Jeddah',
//     position: { lat: 21.6827, lng: 39.1748 },
//     mapUrl: 'https://maps.app.goo.gl/gZDyxoiBbbiea7rh8?g_st=iw',
//   },
//   {
//     id: '19',
//     name: 'Hajj Terminal - King Abdulaziz Airport',
//     nameAr: 'مطار جدة الملك عبدالعزيز - صالة الحجاج',
//     city: 'Jeddah',
//     cityAr: 'جدة',
//     address: 'Jeddah Airport',
//     position: { lat: 21.6827, lng: 39.1748 },
//     mapUrl: 'https://maps.app.goo.gl/NwyjonGQ2QooSUBo9?g_st=iw',
//   },

//   // Madinah Locations
//   {
//     id: '20',
//     name: 'Prince Mohammad Bin Abdulaziz International Airport',
//     nameAr: 'مطار الأمير محمد بن عبدالعزيز بالمدينة المنورة',
//     city: 'Madinah',
//     cityAr: 'المدينة المنورة',
//     address: 'Madinah',
//     position: { lat: 24.55, lng: 39.705 },
//     mapUrl: 'https://maps.app.goo.gl/oAuBqrhsVR2x2i27',
//   },
//   {
//     id: '21',
//     name: 'Al-Masjid an-Nabawi',
//     nameAr: 'المسجد النبوي',
//     city: 'Madinah',
//     cityAr: 'المدينة المنورة',
//     address: 'Madinah',
//     position: { lat: 24.4672, lng: 39.6112 },
//     mapUrl: 'https://maps.app.goo.gl/SbPLRoCWq6F2NSkw9',
//   },
//   {
//     id: '22',
//     name: 'Quba Mosque',
//     nameAr: 'مسجد قباء',
//     city: 'Madinah',
//     cityAr: 'المدينة المنورة',
//     address: 'Quba, Madinah',
//     position: { lat: 24.4397, lng: 39.6157 },
//     mapUrl: 'https://maps.app.goo.gl/qJmp93ARTymUsxHE8',
//   },
//   {
//     id: '23',
//     name: 'Al-Baqi Cemetery',
//     nameAr: 'البقيع',
//     city: 'Madinah',
//     cityAr: 'المدينة المنورة',
//     address: 'Madinah',
//     position: { lat: 24.4677, lng: 39.6117 },
//     mapUrl: 'https://maps.app.goo.gl/biQ5vgUAG3YwJGvA6',
//   },
//   {
//     id: '24',
//     name: 'Mount Uhud',
//     nameAr: 'جبل أحد',
//     city: 'Madinah',
//     cityAr: 'المدينة المنورة',
//     address: 'Madinah',
//     position: { lat: 24.5175, lng: 39.6158 },
//     mapUrl: 'https://maps.app.goo.gl/KN4D2WUWuFzGdNfu5',
//   },
// ];

// const containerStyle = {
//   width: '100%',
//   height: 'calc(100vh - 240px)', // Adjusted for city selector
// };

// const defaultCenter = {
//   lat: 21.4225,
//   lng: 39.8233,
// };

// export default function LocationsPage() {
//   const [selectedCity, setSelectedCity] = useState(cities[0]);
//   const [selectedLocation, setSelectedLocation] = useState<Location | null>(
//     null
//   );
//   const [activeMarker, setActiveMarker] = useState<Location | null>(null);
//   const [showLeftScroll, setShowLeftScroll] = useState(false);
//   const [showRightScroll, setShowRightScroll] = useState(true);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const { language } = useLanguage();
//   const isArabic = language === 'ar';

//   // Filter locations based on selected city
//   const filteredLocations = locations.filter(
//     (location) => location.city === selectedCity.name
//   );

//   const scroll = (direction: 'left' | 'right') => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const scrollAmount = 300;
//     const newScrollLeft =
//       direction === 'left'
//         ? container.scrollLeft - scrollAmount
//         : container.scrollLeft + scrollAmount;

//     container.scrollTo({
//       left: newScrollLeft,
//       behavior: 'smooth',
//     });
//   };

//   const handleScroll = () => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     setShowLeftScroll(container.scrollLeft > 0);
//     setShowRightScroll(
//       container.scrollLeft < container.scrollWidth - container.clientWidth
//     );
//   };

//   // Calculate map center based on selected city's locations
//   const getCityCenter = () => {
//     if (selectedLocation) return selectedLocation.position;
//     if (filteredLocations.length === 0) return defaultCenter;

//     const lats = filteredLocations.map((loc) => loc.position.lat);
//     const lngs = filteredLocations.map((loc) => loc.position.lng);
//     return {
//       lat: (Math.min(...lats) + Math.max(...lats)) / 2,
//       lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
//     };
//   };

//   return (
//     <div className="h-screen flex flex-col overflow-hidden">
//       {/* Header with Back Button and City Selector */}
//       <div className="sticky top-0 z-50 p-4 bg-white shadow-sm flex items-center">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center text-gray-600 hover:text-gray-900"
//         >
//           <ArrowLeft className="h-5 w-5 mr-2" />
//           <span>{isArabic ? 'رجوع' : 'Go back'}</span>
//         </button>

//         {/* City Selector Dropdown - Centered */}
//         <div className="absolute left-1/2 -translate-x-1/2">
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
//             >
//               <span>{isArabic ? selectedCity.nameAr : selectedCity.name}</span>
//               <ChevronDown className="h-4 w-4" />
//             </button>

//             {isDropdownOpen && (
//               <div
//                 className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-lg border"
//                 style={{ zIndex: 9999 }}
//               >
//                 {cities.map((city) => (
//                   <button
//                     key={city.id}
//                     className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
//                     onClick={() => {
//                       setSelectedCity(city);
//                       setIsDropdownOpen(false);
//                       setSelectedLocation(null);
//                       setActiveMarker(null);
//                     }}
//                   >
//                     {isArabic ? city.nameAr : city.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Google Maps Section */}
//       <div className="flex-1 relative overflow-hidden">
//         <LoadScript
//           googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
//         >
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={getCityCenter()}
//             zoom={13}
//             options={{
//               fullscreenControl: false,
//               streetViewControl: false,
//               mapTypeControl: false,
//               zoomControl: true,
//             }}
//           >
//             {filteredLocations.map((location) => (
//               <Marker
//                 key={location.id}
//                 position={location.position}
//                 onClick={() => {
//                   setActiveMarker(location);
//                   setSelectedLocation(location);
//                 }}
//               />
//             ))}
//             {activeMarker && (
//               <InfoWindow
//                 position={activeMarker.position}
//                 onCloseClick={() => setActiveMarker(null)}
//               >
//                 <div>
//                   <h3 className="font-semibold">
//                     {isArabic ? activeMarker.nameAr : activeMarker.name}
//                   </h3>
//                   <p className="text-sm">
//                     {isArabic ? activeMarker.cityAr : activeMarker.address}
//                   </p>
//                   {activeMarker.note && (
//                     <p className="text-sm mt-1 text-gray-600">
//                       {isArabic ? activeMarker.note.ar : activeMarker.note.en}
//                     </p>
//                   )}
//                 </div>
//               </InfoWindow>
//             )}
//           </GoogleMap>
//         </LoadScript>
//       </div>

//       {/* Horizontal Scrollable Location Cards */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
//         <div className="relative">
//           {showLeftScroll && (
//             <button
//               onClick={() => scroll('left')}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
//               style={{ transform: 'translate(-50%, -50%)' }}
//             >
//               <ChevronLeft className="h-6 w-6 text-gray-600" />
//             </button>
//           )}

//           {showRightScroll && (
//             <button
//               onClick={() => scroll('right')}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
//               style={{ transform: 'translate(50%, -50%)' }}
//             >
//               <ChevronRight className="h-6 w-6 text-gray-600" />
//             </button>
//           )}

//           <div
//             ref={scrollContainerRef}
//             className="flex overflow-x-auto gap-4 p-4 no-scrollbar scroll-smooth"
//             onScroll={handleScroll}
//           >
//             {filteredLocations.map((location) => (
//               <div
//                 key={location.id}
//                 className={`flex-none w-[280px] p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200
//                   ${
//                     selectedLocation?.id === location.id
//                       ? 'bg-[#F3F0FF] border border-[#6b6291]'
//                       : 'bg-white hover:shadow-lg'
//                   }`}
//                 onClick={() => {
//                   setSelectedLocation(location);
//                   setActiveMarker(location);
//                 }}
//               >
//                 <h3 className="font-semibold text-base mb-1">
//                   {isArabic ? location.nameAr : location.name}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-2">
//                   {isArabic ? location.cityAr : location.address}
//                 </p>
//                 {location.note && (
//                   <p className="text-sm text-gray-600 mb-2 line-clamp-2">
//                     {isArabic ? location.note.ar : location.note.en}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import LocationFullComponent from '@/components/location/location';
import React from 'react';

const LocationsPage = () => {
    return (
        <>
         <LocationFullComponent />   
        </>
    );
};

export default LocationsPage;