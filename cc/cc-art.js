/* ==========================================================
   Chilton Bridge School - Cultural Calendar art
   Everything on /cc/ is drawn here, in code:
     B5CCArt.icon(name, fill, detail)   a 48x48 picture
     B5CCArt.pattern(kind, a, b)        a background tile (CSS)
     B5CCArt.poster(week)               the takeover art for a week
     B5CCArt.box(week)                  the mystery box
     B5CCArt.stamp(week)                a passport stamp
   Icons use two colours: "F" is the shape, "D" is the detail
   cut into it. Draw both the same colour for a silhouette.
   Plain ASCII only.
   ========================================================== */
(function(){
"use strict";

var R = 'stroke-linecap="round" stroke-linejoin="round"';
function sk(c, w){ return 'fill="none" stroke="' + c + '" stroke-width="' + w + '" ' + R; }

/* ---------- icons drawn from shapes ---------- */
var I = {
  anchor: '<circle cx="24" cy="9" r="4.5" ' + sk("F",4) + '/><path d="M24 14v29M15 20h18" ' + sk("F",4) + '/><path d="M7 28q2 15 17 15t17-15" ' + sk("F",4) + '/><path d="M3 30l4-4 4 4M37 30l4-4 4 4" ' + sk("F",3) + '/>',
  apple: '<path d="M24 15c-4-3-15-3-17 6s4 24 11 24c3 0 4-1 6-1s3 1 6 1c7 0 13-15 11-24s-13-9-17-6z" fill="F"/><path d="M24 15q0-6 5-9" ' + sk("F",3) + '/><path d="M26 10q6-6 12-2q-6 6-12 2z" fill="F"/><ellipse cx="15" cy="23" rx="2.5" ry="4.5" fill="D" opacity=".55"/>',
  ball: '<circle cx="24" cy="24" r="20" fill="F"/><path d="M24 16l8 6-3 9h-10l-3-9z" fill="D"/><path d="M24 4v12M32 22l11-4M29 31l7 9M19 31l-7 9M16 22l-11-4" ' + sk("D",2.5) + '/>',
  balloon: '<ellipse cx="24" cy="19" rx="14" ry="16" fill="F"/><path d="M21 35h6l-3 4z" fill="F"/><path d="M24 39q-5 4 0 8" ' + sk("F",2.5) + '/><ellipse cx="18" cy="13" rx="3" ry="5" fill="D" opacity=".55"/>',
  ballot: '<rect x="14" y="3" width="20" height="24" rx="2" fill="D" stroke="F" stroke-width="3"/><path d="M18 15l4 4 8-9" ' + sk("F",3.5) + '/><rect x="5" y="23" width="38" height="21" rx="3" fill="F"/><rect x="11" y="27" width="26" height="3.5" rx="1.75" fill="D"/>',
  bin: '<rect x="10" y="14" width="28" height="31" rx="3" fill="F"/><rect x="6" y="8" width="36" height="5" rx="2" fill="F"/><rect x="19" y="3" width="10" height="5" rx="1.5" fill="F"/><path d="M18 20v19M24 20v19M30 20v19" ' + sk("D",2.5) + '/>',
  book: '<path d="M24 12q-8-6-21-4v31q13-2 21 4z" fill="F"/><path d="M24 12q8-6 21-4v31q-13-2-21 4z" fill="F"/><path d="M24 12v31M8 16q7-1 12 2M8 23q7-1 12 2M28 18q5-3 12-2M28 25q5-3 12-2" ' + sk("D",2) + '/>',
  bottle: '<rect x="19" y="2" width="10" height="5" rx="1.5" fill="F"/><path d="M19 8h10v5l5 6v24a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V19l5-6z" fill="F"/><rect x="14" y="24" width="20" height="10" fill="D" opacity=".6"/>',
  brain: '<path d="M24 8c-3-4-10-4-12 1-5 0-9 5-7 10-3 3-2 10 2 12 0 6 6 9 10 6 2 3 6 4 7 1z" fill="F"/><path d="M24 8c3-4 10-4 12 1 5 0 9 5 7 10 3 3 2 10-2 12 0 6-6 9-10 6-2 3-6 4-7 1z" fill="F"/><path d="M24 9v30M15 18q5 2 5 7M33 18q-5 2-5 7M13 30q4-2 7 0M35 30q-4-2-7 0" ' + sk("D",2.5) + '/>',
  bridge: '<path d="M3 34h42M3 41h42" ' + sk("F",4) + '/><path d="M5 34q19-28 38 0" ' + sk("F",4) + '/><path d="M14 34v-10M24 34v-15M34 34v-10" ' + sk("F",3) + '/>',
  calendar: '<rect x="6" y="9" width="36" height="34" rx="4" fill="F"/><rect x="10" y="19" width="28" height="20" rx="2" fill="D"/><rect x="13" y="22" width="6" height="6" rx="1" fill="F"/><rect x="21" y="22" width="6" height="6" rx="1" fill="F"/><rect x="29" y="22" width="6" height="6" rx="1" fill="F"/><rect x="13" y="30" width="6" height="6" rx="1" fill="F"/><rect x="21" y="30" width="6" height="6" rx="1" fill="F"/><rect x="14" y="4" width="4" height="9" rx="2" fill="F"/><rect x="30" y="4" width="4" height="9" rx="2" fill="F"/>',
  camera: '<rect x="3" y="14" width="42" height="27" rx="5" fill="F"/><path d="M15 15l4-7h10l4 7z" fill="F"/><circle cx="24" cy="27" r="10" fill="D"/><circle cx="24" cy="27" r="6" fill="F"/><circle cx="37" cy="20" r="2" fill="D"/>',
  car: '<path d="M5 31l5-11q2-4 6-4h16q4 0 6 4l5 11v8H5z" fill="F"/><path d="M13 27l3-7h16l3 7z" fill="D"/><circle cx="14" cy="39" r="5.5" fill="F" stroke="D" stroke-width="2.5"/><circle cx="34" cy="39" r="5.5" fill="F" stroke="D" stroke-width="2.5"/>',
  card: '<rect x="3" y="9" width="42" height="30" rx="4" fill="F"/><circle cx="15" cy="21" r="5.5" fill="D"/><path d="M7 34q8-10 16 0z" fill="D"/><path d="M28 18h12M28 24h10M28 30h8" ' + sk("D",3) + '/>',
  chart: '<path d="M5 43h38" ' + sk("F",3.5) + '/><rect x="8" y="27" width="8" height="14" rx="1.5" fill="F"/><rect x="20" y="17" width="8" height="24" rx="1.5" fill="F"/><rect x="32" y="7" width="8" height="34" rx="1.5" fill="F"/>',
  chefhat: '<path d="M14 31c-9-1-11-13-2-15 1-8 10-11 12-6 3-5 12-2 13 6 9 2 7 14-2 15z" fill="F"/><rect x="14" y="30" width="20" height="12" rx="2" fill="F"/><path d="M15 34h18M20 23v6M28 23v6" ' + sk("D",2) + '/>',
  clipboard: '<rect x="8" y="8" width="32" height="37" rx="4" fill="F"/><rect x="16" y="4" width="16" height="8" rx="3" fill="F" stroke="D" stroke-width="2.5"/><path d="M15 22l3 3 5-6M27 22h7M15 34l3 3 5-6M27 34h7" ' + sk("D",3) + '/>',
  clock: '<circle cx="24" cy="24" r="20" fill="F"/><path d="M24 11v14l9 5" ' + sk("D",4) + '/><circle cx="24" cy="24" r="2.5" fill="D"/>',
  coin: '<circle cx="24" cy="24" r="20" fill="F"/><circle cx="24" cy="24" r="14.5" ' + sk("D",2.5) + '/><path d="M29 18q-1-4-5-4q-5 0-4 6v12h10M17 26h10M17 32h4" ' + sk("D",3) + '/>',
  compass: '<circle cx="24" cy="24" r="20" fill="F"/><circle cx="24" cy="24" r="15" fill="D"/><path d="M24 11l5 13h-10z" fill="F"/><path d="M24 37l-5-13h10z" fill="F" opacity=".45"/>',
  cross: '<path d="M18 5h12v13h13v12H30v13H18V30H5V18h13z" fill="F"/>',
  cup: '<path d="M7 19h28v8a14 14 0 0 1-28 0z" fill="F"/><path d="M35 21h3a6 6 0 0 1 0 12h-5" ' + sk("F",3.5) + '/><path d="M3 44h36" ' + sk("F",4) + '/><path d="M15 6q-3 4 0 8M23 6q-3 4 0 8" ' + sk("F",2.5) + '/>',
  dice: '<rect x="6" y="6" width="36" height="36" rx="8" fill="F"/><circle cx="15" cy="15" r="3.5" fill="D"/><circle cx="33" cy="15" r="3.5" fill="D"/><circle cx="24" cy="24" r="3.5" fill="D"/><circle cx="15" cy="33" r="3.5" fill="D"/><circle cx="33" cy="33" r="3.5" fill="D"/>',
  diya: '<path d="M4 28q20 18 40 0q-2-5-20-5t-20 5z" fill="F"/><path d="M40 26l7-4-3 7z" fill="F"/><path d="M24 2q9 10 0 19q-9-9 0-19z" fill="F"/><path d="M24 10q4 5 0 9q-4-4 0-9z" fill="D"/><path d="M10 31q14 8 28 0" ' + sk("D",2) + '/>',
  door: '<path d="M10 44V8q0-4 4-4h20q4 0 4 4v36z" fill="F"/><rect x="15" y="9" width="18" height="12" rx="2" ' + sk("D",2) + '/><rect x="15" y="25" width="18" height="14" rx="2" ' + sk("D",2) + '/><circle cx="31" cy="31" r="2.5" fill="F" stroke="D" stroke-width="2"/><path d="M5 44h38" ' + sk("F",3.5) + '/>',
  dragon: '<path d="M5 31q2-13 15-15l4-9 4 9q10 0 14 7l3 7-11 2-4 7H12z" fill="F"/><path d="M20 16l-4-8 6 4M30 16l2-9 2 10" fill="F"/><circle cx="31" cy="22" r="2.5" fill="D"/><path d="M38 31h5M12 39q-6 0-9 4" ' + sk("F",3) + '/><path d="M14 26q4 3 9 1" ' + sk("D",2) + '/>',
  dumbbell: '<rect x="3" y="16" width="6" height="16" rx="2" fill="F"/><rect x="9" y="11" width="7" height="26" rx="2" fill="F"/><rect x="32" y="11" width="7" height="26" rx="2" fill="F"/><rect x="39" y="16" width="6" height="16" rx="2" fill="F"/><rect x="16" y="21" width="16" height="6" fill="F"/>',
  film: '<rect x="5" y="19" width="38" height="24" rx="3" fill="F"/><path d="M5 13l35-7 2 8-35 7z" fill="F"/><path d="M14 11l4 7M23 9l4 7M32 7l4 7" ' + sk("D",3) + '/><path d="M12 27h24M12 34h16" ' + sk("D",2.5) + '/>',
  fish: '<path d="M5 24q15-17 31 0q-16 17-31 0z" fill="F"/><path d="M34 24l11-10v20z" fill="F"/><circle cx="15" cy="22" r="2.6" fill="D"/><path d="M22 18q3 6 0 12" ' + sk("D",2) + '/>',
  flask: '<path d="M16 5h16" ' + sk("F",4) + '/><path d="M19 5h10v13l12 20q2 7-5 7H12q-7 0-5-7l12-20z" fill="F"/><path d="M11 31h26" ' + sk("D",2.5) + '/><circle cx="20" cy="37" r="2.2" fill="D"/><circle cx="28" cy="35" r="1.6" fill="D"/>',
  gift: '<path d="M24 17q-12-13-15-4q2 6 15 4zM24 17q12-13 15-4q-2 6-15 4z" fill="F"/><rect x="5" y="17" width="38" height="9" rx="2" fill="F"/><rect x="8" y="27" width="32" height="17" rx="2" fill="F"/><path d="M24 17v27M5 26.5h38" ' + sk("D",3) + '/>',
  glass: '<path d="M11 5h26l-4 38H15z" fill="F"/><path d="M14 18h20" ' + sk("D",2.5) + '/><path d="M16 24l2 14" ' + sk("D",2) + ' opacity=".6"/>',
  globe: '<circle cx="24" cy="24" r="20" fill="F"/><path d="M4 24h40M24 4q-11 20 0 40M24 4q11 20 0 40M8 13h32M8 35h32" ' + sk("D",2.2) + '/>',
  hand: '<rect x="14" y="10" width="6" height="22" rx="3" fill="F"/><rect x="20" y="5" width="6" height="24" rx="3" fill="F"/><rect x="26" y="7" width="6" height="22" rx="3" fill="F"/><rect x="32" y="12" width="6" height="19" rx="3" fill="F"/><rect x="14" y="22" width="24" height="21" rx="9" fill="F"/><rect x="4" y="22" width="6.5" height="17" rx="3.2" fill="F" transform="rotate(-38 7 30)"/><path d="M20 30v-6M26 29v-6M32 30v-5" ' + sk("D",1.8) + ' opacity=".5"/>',
  hands: '<path d="M24 22c-4-7-13-4-11 3 1 5 11 10 11 10s10-5 11-10c2-7-7-10-11-3z" fill="F"/><path d="M3 30q9 0 14 8h14q5-8 14-8v7q-7 0-10 7H13q-3-7-10-7z" fill="F"/>',
  hardhat: '<path d="M6 34q0-19 18-19t18 19z" fill="F"/><rect x="2" y="33" width="44" height="6" rx="3" fill="F"/><rect x="21" y="11" width="6" height="11" rx="2" fill="F"/><path d="M14 32q0-9 6-13M34 32q0-9-6-13" ' + sk("D",2) + '/>',
  headset: '<path d="M8 28v-4a16 16 0 0 1 32 0v4" ' + sk("F",4) + '/><rect x="4" y="26" width="10" height="14" rx="3" fill="F"/><rect x="34" y="26" width="10" height="14" rx="3" fill="F"/><path d="M39 40q0 6-10 6" ' + sk("F",3) + '/><circle cx="27" cy="46" r="2.5" fill="F"/>',
  heart: '<path d="M24 43S4 31 4 17A10.5 10.5 0 0 1 24 12a10.5 10.5 0 0 1 20 5c0 14-20 26-20 26z" fill="F"/><path d="M12 15q3-4 7-2" ' + sk("D",2.5) + ' opacity=".6"/>',
  helmet: '<path d="M8 32q0-21 16-21t16 21z" fill="F"/><path d="M2 32h44l-4 7H6z" fill="F"/><path d="M24 11v21" ' + sk("D",2.5) + '/><path d="M24 17l5 4-5 7-5-7z" fill="D"/>',
  horse: '<path d="M14 44l2-14q-7-4-7-11l7-7 2-7 4 7q11 0 15 11l4 21z" fill="F"/><circle cx="20" cy="18" r="2.4" fill="D"/><path d="M22 10q7 3 9 12q2 8 6 22" ' + sk("D",2.2) + ' opacity=".55"/><circle cx="12" cy="22" r="1.4" fill="D"/>',
  key: '<circle cx="14" cy="24" r="10" fill="F"/><circle cx="14" cy="24" r="3.8" fill="D"/><path d="M23 24h20M37 24v7M43 24v9" ' + sk("F",5) + '/>',
  lantern: '<path d="M24 3v5M24 42v4" ' + sk("F",2.5) + '/><rect x="17" y="7" width="14" height="5" rx="1.5" fill="F"/><ellipse cx="24" cy="25" rx="16" ry="14" fill="F"/><rect x="17" y="37" width="14" height="5" rx="1.5" fill="F"/><path d="M24 12v26M16 13q-6 12 0 24M32 13q6 12 0 24" ' + sk("D",2) + '/>',
  laptop: '<rect x="7" y="9" width="34" height="24" rx="3" fill="F"/><rect x="11" y="13" width="26" height="16" rx="1.5" fill="D"/><path d="M2 36h44l-3 6H5z" fill="F"/>',
  leaf: '<path d="M7 41Q7 9 41 7q0 34-34 34z" fill="F"/><path d="M9 39L33 15M20 28h-7M27 21v-7" ' + sk("D",2.5) + '/>',
  letter: '<rect x="4" y="11" width="40" height="28" rx="3" fill="F"/><path d="M5 13l19 15 19-15" ' + sk("D",3) + '/>',
  list: '<rect x="8" y="4" width="32" height="41" rx="4" fill="F"/><path d="M14 14l2 2 4-4M24 14h10M14 25l2 2 4-4M24 25h10M14 36l2 2 4-4M24 36h7" ' + sk("D",2.6) + '/>',
  map: '<path d="M3 10l13-5 16 6 13-5v32l-13 5-16-6-13 5z" fill="F"/><path d="M16 5v32M32 11v32" ' + sk("D",2) + '/><path d="M8 30q6-10 12-4t14-8" ' + sk("D",2.2) + ' stroke-dasharray="3 3"/>',
  mask: '<path d="M7 7h28v15a14 14 0 0 1-28 0z" fill="F"/><path d="M12 16q3-3 6 0M24 16q3-3 6 0" ' + sk("D",3) + '/><path d="M14 25q7 8 14 0" ' + sk("D",3) + '/><path d="M33 26h9v8a9 9 0 0 1-12 8" ' + sk("F",3.5) + '/>',
  megaphone: '<path d="M5 19h9l23-12v34L14 29H5z" fill="F"/><rect x="9" y="28" width="7" height="13" rx="2" fill="F"/><path d="M41 15q5 9 0 18" ' + sk("F",3) + '/><path d="M14 20v8" ' + sk("D",2) + '/>',
  mic: '<rect x="17" y="3" width="14" height="25" rx="7" fill="F"/><path d="M21 10h6M21 16h6" ' + sk("D",2) + '/><path d="M10 22a14 14 0 0 0 28 0" ' + sk("F",3.5) + '/><path d="M24 36v8M17 45h14" ' + sk("F",3.5) + '/>',
  moon: '<path d="M30 5a19 19 0 1 0 13 31A16 16 0 0 1 30 5z" fill="F"/><circle cx="20" cy="22" r="3" fill="D" opacity=".45"/><circle cx="26" cy="33" r="2" fill="D" opacity=".45"/>',
  mountain: '<path d="M2 43L18 14l8 12 6-8 14 25z" fill="F"/><path d="M13 23l5-9 5 7-3 3-3-2z" fill="D"/>',
  museum: '<path d="M3 17L24 5l21 12z" fill="F"/><rect x="3" y="38" width="42" height="6" rx="1" fill="F"/><rect x="7" y="20" width="5" height="16" fill="F"/><rect x="16" y="20" width="5" height="16" fill="F"/><rect x="27" y="20" width="5" height="16" fill="F"/><rect x="36" y="20" width="5" height="16" fill="F"/><circle cx="24" cy="12" r="2.2" fill="D"/>',
  music: '<path d="M18 35V11l23-6v25" ' + sk("F",4) + '/><path d="M18 17l23-6" ' + sk("F",4) + '/><ellipse cx="12" cy="36" rx="7" ry="5.5" fill="F"/><ellipse cx="35" cy="31" rx="7" ry="5.5" fill="F"/>',
  nose: '<path d="M4 22q8-3 12 2M44 22q-8-3-12 2" ' + sk("F",2.5) + '/><circle cx="24" cy="26" r="15" fill="F"/><ellipse cx="18" cy="20" rx="4.5" ry="3" fill="D" opacity=".7"/>',
  padlock: '<path d="M15 22v-6a9 9 0 0 1 18 0v6" ' + sk("F",4.5) + '/><rect x="8" y="21" width="32" height="23" rx="4" fill="F"/><circle cx="24" cy="30" r="3.8" fill="D"/><rect x="22.4" y="31" width="3.2" height="8" rx="1" fill="D"/>',
  palette: '<path d="M24 4C12 4 4 13 4 24s9 20 19 20c4 0 5-3 3-6s0-6 4-6h6c6 0 9-4 9-9C45 12 37 4 24 4z" fill="F"/><circle cx="13" cy="21" r="3.5" fill="D"/><circle cx="19" cy="12" r="3.5" fill="D"/><circle cx="29" cy="11" r="3.5" fill="D"/><circle cx="37" cy="19" r="3.5" fill="D"/><circle cx="14" cy="32" r="3.5" fill="D"/>',
  paw: '<ellipse cx="24" cy="32" rx="11" ry="9.5" fill="F"/><circle cx="11" cy="20" r="5" fill="F"/><circle cx="19" cy="11" r="5" fill="F"/><circle cx="29" cy="11" r="5" fill="F"/><circle cx="37" cy="20" r="5" fill="F"/>',
  pencil: '<path d="M7 41l4-12L32 8l8 8-21 21z" fill="F"/><path d="M7 41l4-12 8 8z" fill="D"/><path d="M7 41l2-5 3 3z" fill="F"/><path d="M28 12l8 8" ' + sk("D",2.5) + '/>',
  people: '<circle cx="17" cy="14" r="7" fill="F"/><circle cx="33" cy="17" r="5.5" fill="F"/><path d="M4 42q0-15 13-15t13 15z" fill="F"/><path d="M27 42q0-13 6-13t12 13z" fill="F"/>',
  phone: '<rect x="12" y="3" width="24" height="42" rx="5" fill="F"/><rect x="15" y="8" width="18" height="28" rx="1.5" fill="D"/><circle cx="24" cy="40.5" r="2.2" fill="D"/>',
  pi: '<path d="M7 15q3-5 9-5h25" ' + sk("F",5) + '/><path d="M18 10q0 22-7 33M32 10q-2 22 2 29q3 5 8 0" ' + sk("F",5) + '/>',
  plane: '<path d="M45 5L3 22l15 6 4 15 7-11 10 6z" fill="F"/><path d="M18 28L45 5 22 33" ' + sk("D",2) + '/>',
  poppy: '<circle cx="17" cy="17" r="10" fill="F"/><circle cx="31" cy="17" r="10" fill="F"/><circle cx="17" cy="30" r="10" fill="F"/><circle cx="31" cy="30" r="10" fill="F"/><circle cx="24" cy="23.5" r="5.5" fill="D"/><path d="M24 39v8" ' + sk("F",3) + '/>',
  puzzle: '<path d="M8 14h10a5 5 0 1 1 9 0h10v10a5 5 0 1 1 0 9v10H27a5 5 0 1 0-9 0H8V33a5 5 0 1 0 0-9z" fill="F"/>',
  rainbow: '<path d="M5 38a19 19 0 0 1 38 0" ' + sk("F",5) + '/><path d="M12 38a12 12 0 0 1 24 0" ' + sk("F",5) + ' opacity=".75"/><path d="M19 38a5 5 0 0 1 10 0" ' + sk("F",5) + ' opacity=".5"/>',
  robot: '<path d="M24 14V8" ' + sk("F",3) + '/><circle cx="24" cy="6" r="3" fill="F"/><rect x="9" y="14" width="30" height="23" rx="6" fill="F"/><circle cx="18" cy="24" r="3.8" fill="D"/><circle cx="30" cy="24" r="3.8" fill="D"/><path d="M18 31h12" ' + sk("D",2.5) + '/><rect x="16" y="38" width="16" height="7" rx="2" fill="F"/><rect x="4" y="20" width="4" height="11" rx="2" fill="F"/><rect x="40" y="20" width="4" height="11" rx="2" fill="F"/>',
  rocket: '<path d="M24 3q13 11 8 31H16q-5-20 8-31z" fill="F"/><circle cx="24" cy="18" r="4.8" fill="D"/><path d="M16 25l-8 11 9-2zM32 25l8 11-9-2z" fill="F"/><path d="M19 36q5 12 10 0z" fill="F"/>',
  rose: '<circle cx="24" cy="17" r="13" fill="F"/><path d="M24 10q7 0 7 7t-7 7q-6 0-6-6q0-4 4-4" ' + sk("D",2.5) + '/><path d="M24 30v15" ' + sk("F",3.5) + '/><path d="M24 39q-10-1-11-8q9 0 11 8zM24 36q9-1 10-7q-8 0-10 7z" fill="F"/>',
  sankofa: '<path d="M24 43L9 28Q3 21 7 14q6-8 14-2l3 3 3-3q8-6 14 2 4 7-2 14z" ' + sk("F",4.5) + '/><path d="M24 17q-8 0-8 7t8 4" ' + sk("F",3.5) + '/><path d="M24 17q8 0 8 7t-8 4" ' + sk("F",3.5) + '/><circle cx="24" cy="36" r="2.6" fill="F"/>',
  satellite: '<g transform="rotate(-35 24 24)"><rect x="19" y="16" width="10" height="16" rx="2" fill="F"/><rect x="2" y="19" width="14" height="10" rx="1" fill="F"/><rect x="32" y="19" width="14" height="10" rx="1" fill="F"/><path d="M16 24h3M29 24h3M9 19v10M39 19v10" ' + sk("D",1.8) + '/></g><path d="M30 36q6 1 8-5M33 40q9 1 11-8" ' + sk("F",2.5) + '/>',
  scales: '<path d="M24 6v34M14 43h20M7 12h34" ' + sk("F",3.5) + '/><path d="M7 12l-6 14h12zM41 12l-6 14h12z" ' + sk("F",2.2) + '/><path d="M1 26a6 4 0 0 0 12 0zM35 26a6 4 0 0 0 12 0z" fill="F"/><circle cx="24" cy="6" r="3" fill="F"/>',
  scissors: '<circle cx="12" cy="37" r="6.5" ' + sk("F",4) + '/><circle cx="36" cy="37" r="6.5" ' + sk("F",4) + '/><path d="M16 32L36 5M32 32L12 5" ' + sk("F",4.5) + '/>',
  search: '<circle cx="20" cy="20" r="13" ' + sk("F",5) + '/><path d="M30 30l13 13" ' + sk("F",6.5) + '/><path d="M14 16q2-4 6-4" ' + sk("F",2.5) + ' opacity=".6"/>',
  shield: '<path d="M24 3l18 6v13q0 15-18 23Q6 37 6 22V9z" fill="F"/><path d="M15 24l6 6 11-13" ' + sk("D",4) + '/>',
  shoe: '<path d="M3 38V24q3-9 9-11l5 6q8 7 18 7q10 1 11 9v3z" fill="F"/><rect x="2" y="36" width="45" height="7" rx="3.5" fill="F"/><path d="M3 37h43" ' + sk("D",2) + '/><path d="M14 21l4-3M18 25l4-3M23 28l4-3" ' + sk("D",2.5) + '/>',
  sign: '<rect x="22" y="3" width="4" height="42" rx="1.5" fill="F"/><path d="M7 9h29l6 6-6 6H7z" fill="F"/><path d="M41 25H12l-6 6 6 6h29z" fill="F"/><path d="M12 15h18M17 31h18" ' + sk("D",2.5) + '/>',
  smile: '<circle cx="24" cy="24" r="20" fill="F"/><circle cx="17" cy="19" r="2.8" fill="D"/><circle cx="31" cy="19" r="2.8" fill="D"/><path d="M14 28q10 10 20 0" ' + sk("D",3.5) + '/>',
  speech: '<path d="M7 7h34q4 0 4 4v20q0 4-4 4H22l-10 9v-9H7q-4 0-4-4V11q0-4 4-4z" fill="F"/><circle cx="15" cy="21" r="2.8" fill="D"/><circle cx="24" cy="21" r="2.8" fill="D"/><circle cx="33" cy="21" r="2.8" fill="D"/>',
  swap: '<path d="M7 16h31l-7-7M41 32H10l7 7" ' + sk("F",5) + '/>',
  telescope: '<path d="M5 25l27-12 4 9-27 12z" fill="F"/><path d="M35 10l7-3 4 9-7 3z" fill="F"/><path d="M22 27l-8 17M22 27l8 17M22 27v16" ' + sk("F",3) + '/><circle cx="22" cy="27" r="2.6" fill="D"/>',
  toolbox: '<path d="M16 19v-6h16v6" ' + sk("F",4) + '/><rect x="3" y="18" width="42" height="25" rx="3" fill="F"/><rect x="3" y="26" width="42" height="3.5" fill="D"/><rect x="20" y="23" width="8" height="9" rx="1.5" fill="F" stroke="D" stroke-width="2"/>',
  torch: '<path d="M15 20L6 2h36l-9 18z" fill="F" opacity=".4"/><rect x="11" y="19" width="26" height="8" rx="2" fill="F"/><path d="M14 27h20l-4 18H18z" fill="F"/><rect x="21" y="32" width="6" height="4" rx="1" fill="D"/>',
  train: '<rect x="8" y="5" width="32" height="31" rx="6" fill="F"/><rect x="12" y="10" width="24" height="12" rx="2" fill="D"/><circle cx="16" cy="29" r="2.6" fill="D"/><circle cx="32" cy="29" r="2.6" fill="D"/><path d="M14 36l-5 9M34 36l5 9" ' + sk("F",3.5) + '/>',
  tree: '<path d="M24 2L10 20h7L7 32h8L4 42h40L33 32h8L31 20h7z" fill="F"/><rect x="21" y="40" width="6" height="7" fill="F"/><circle cx="20" cy="27" r="2" fill="D"/><circle cx="29" cy="35" r="2" fill="D"/><circle cx="26" cy="17" r="2" fill="D"/>',
  wave: '<path d="M3 30q6-18 20-14q-10 4-6 12q4 6 12 2q6-4 4-10q8 6 12 18q-6-4-10-2q-14 10-32-6z" fill="F"/><path d="M3 40q5-4 10 0t10 0 10 0 10 0" ' + sk("F",3.5) + '/>',
  whistle: '<path d="M5 21h19v-6h6v6h5a10 10 0 1 1-10 10H11q-6 0-6-6z" fill="F"/><circle cx="35" cy="31" r="4" fill="D"/><circle cx="9" cy="17" r="3" ' + sk("F",2.5) + '/>',
  wrench: '<path d="M31 5a11 11 0 0 0-10 15L5 36a4.5 4.5 0 0 0 7 7l16-16a11 11 0 0 0 15-10l-7 4-5-5 4-7a11 11 0 0 0-4-4z" fill="F"/><circle cx="9" cy="39" r="2" fill="D"/>'
};

/* ---------- icons worked out with a bit of maths ---------- */
function pts(n, r1, r2, cx, cy, rot){
  var s = "", i, a, r;
  for(i = 0; i < n * 2; i++){
    a = (rot || -Math.PI / 2) + i * Math.PI / n; r = i % 2 ? r2 : r1;
    s += (i ? "L" : "M") + (cx + Math.cos(a) * r).toFixed(1) + " " + (cy + Math.sin(a) * r).toFixed(1);
  }
  return s + "z";
}
I.star = '<path d="' + pts(5, 21, 9, 24, 25) + '" fill="F"/><circle cx="24" cy="25" r="3.5" fill="D" opacity=".5"/>';
I.gear = (function(){
  var s = "", i, a, n = 8;
  for(i = 0; i < n; i++){
    a = i * 360 / n;
    s += '<rect x="20" y="2" width="8" height="10" rx="2" fill="F" transform="rotate(' + a + ' 24 24)"/>';
  }
  return s + '<circle cx="24" cy="24" r="15" fill="F"/><circle cx="24" cy="24" r="6" fill="D"/>';
})();
I.sun = (function(){
  var s = '<circle cx="24" cy="24" r="10" fill="F"/>', i, a;
  for(i = 0; i < 8; i++){
    a = i * Math.PI / 4;
    s += '<path d="M' + (24 + Math.cos(a) * 15).toFixed(1) + ' ' + (24 + Math.sin(a) * 15).toFixed(1) + 'L' + (24 + Math.cos(a) * 21).toFixed(1) + ' ' + (24 + Math.sin(a) * 21).toFixed(1) + '" ' + sk("F",4) + '/>';
  }
  return s;
})();
I.flower = (function(){
  var s = "", i, a;
  for(i = 0; i < 10; i++){
    a = i * Math.PI / 5;
    s += '<circle cx="' + (24 + Math.cos(a) * 12).toFixed(1) + '" cy="' + (24 + Math.sin(a) * 12).toFixed(1) + '" r="7" fill="F"/>';
  }
  return s + '<circle cx="24" cy="24" r="8" fill="D"/><circle cx="24" cy="24" r="4" fill="F"/>';
})();
I.rangoli = (function(){
  var s = "", i;
  for(i = 0; i < 8; i++){
    s += '<path d="M24 24q-5-10 0-21q5 11 0 21z" fill="F" transform="rotate(' + (i * 45) + ' 24 24)"/>';
  }
  for(i = 0; i < 8; i++){
    s += '<circle cx="24" cy="6" r="2.2" fill="F" transform="rotate(' + (i * 45 + 22.5) + ' 24 24)"/>';
  }
  return s + '<circle cx="24" cy="24" r="8" fill="D"/><circle cx="24" cy="24" r="4.5" fill="F"/>';
})();
I.firework = (function(){
  var s = "", i, a;
  for(i = 0; i < 10; i++){
    a = i * Math.PI / 5;
    s += '<path d="M' + (24 + Math.cos(a) * 6).toFixed(1) + ' ' + (22 + Math.sin(a) * 6).toFixed(1) + 'L' + (24 + Math.cos(a) * 16).toFixed(1) + ' ' + (22 + Math.sin(a) * 16).toFixed(1) + '" ' + sk("F",3.5) + '/>';
    s += '<circle cx="' + (24 + Math.cos(a + .3) * 20).toFixed(1) + '" cy="' + (22 + Math.sin(a + .3) * 20).toFixed(1) + '" r="1.8" fill="F"/>';
  }
  return s + '<circle cx="24" cy="22" r="3" fill="F"/>';
})();

function paint(svgInner, f, d){
  return svgInner.replace(/"F"/g, '"' + f + '"').replace(/"D"/g, '"' + (d || f) + '"');
}
function icon(name, f, d, cls){
  var inner = I[name] || I.star;
  return '<svg class="' + (cls || "ico") + '" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + paint(inner, f || "currentColor", d || "#ffffff") + '</svg>';
}

/* ---------- small helpers ---------- */
function hashOf(s){ var h = 2166136261, i; for(i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed){ var t = seed >>> 0; return function(){ t += 0x6D2B79F5; var r = Math.imul(t ^ t >>> 15, 1 | t); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
function uri(svg){ return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")'; }

/* ---------- background patterns ---------- */
function pattern(kind, a, b){
  var s;
  switch(kind){
    case "dots":
      s = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="16" cy="16" r="5" fill="' + a + '"/><circle cx="48" cy="48" r="3.5" fill="' + b + '"/></svg>';
      return { image: uri(s), size: "64px 64px", drift: "64px 64px" };
    case "stripes":
      return { image: "repeating-linear-gradient(135deg," + a + " 0 18px,transparent 18px 52px)", size: "auto", drift: "148px 0" };
    case "rays":
      return { image: "repeating-conic-gradient(from 0deg at 78% 58%," + a + " 0 7deg,transparent 7deg 20deg)", size: "auto", drift: "" };
    case "grid":
      s = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M48 0H0V48" fill="none" stroke="' + a + '" stroke-width="2"/><circle cx="0" cy="0" r="3" fill="' + b + '"/></svg>';
      return { image: uri(s), size: "48px 48px", drift: "48px 48px" };
    case "waves":
      s = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><path d="M0 20q15-14 30 0t30 0 30 0 30 0" fill="none" stroke="' + a + '" stroke-width="5" stroke-linecap="round"/></svg>';
      return { image: uri(s), size: "120px 40px", drift: "120px 0" };
    case "snow":
      s = '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><circle cx="12" cy="10" r="3" fill="' + a + '"/><circle cx="56" cy="34" r="4" fill="' + a + '"/><circle cx="30" cy="66" r="2.5" fill="' + b + '"/><circle cx="76" cy="78" r="3" fill="' + a + '"/></svg>';
      return { image: uri(s), size: "90px 90px", drift: "20px 90px" };
    case "stars":
      s = '<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110"><path d="M20 10l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="' + a + '"/><circle cx="70" cy="40" r="1.8" fill="' + a + '"/><path d="M80 78l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill="' + b + '"/><circle cx="34" cy="86" r="1.4" fill="' + a + '"/></svg>';
      return { image: uri(s), size: "110px 110px", drift: "110px 0" };
    default: /* confetti */
      var r = rng(7), i, out = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">';
      for(i = 0; i < 12; i++){
        var x = (r() * 160).toFixed(0), y = (r() * 160).toFixed(0), rot = (r() * 180).toFixed(0), c = i % 2 ? a : b;
        out += i % 3 ? '<rect x="' + x + '" y="' + y + '" width="12" height="5" rx="2" fill="' + c + '" transform="rotate(' + rot + ' ' + x + ' ' + y + ')"/>' : '<circle cx="' + x + '" cy="' + y + '" r="3.5" fill="' + c + '"/>';
      }
      return { image: uri(out + '</svg>'), size: "160px 160px", drift: "0 160px" };
  }
}

/* ---------- the generic poster: big motif, sunburst, floaters ---------- */
function poster(w){
  var L = w.look, r = rng(hashOf(w.id)), floats = "", i;
  var tries = w.try.map(function(t){ return t[0]; });
  for(i = 0; i < 6; i++){
    var name = tries[i % tries.length], x = 52 + r() * 46, y = 6 + r() * 78, s = 34 + r() * 30, d = (14 + r() * 10).toFixed(1), dl = (-r() * 14).toFixed(1);
    floats += '<div class="pf" style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;width:' + s.toFixed(0) + 'px;animation-duration:' + d + 's;animation-delay:' + dl + 's">' + icon(name, i % 2 ? L.pop : L.pop2, L.bg, "pfi") + '</div>';
  }
  var big = L.motif === "rainbow" ? rainbowBig() : icon(L.motif, L.pop, L.bg2, "pbig");
  return '<div class="pburst"></div>' + floats + '<div class="pmotif"><div class="pshadow">' + icon(L.motif, "rgba(0,0,0,.28)", "rgba(0,0,0,.28)", "pbig") + '</div>' + big + '</div>';
}
function rainbowBig(){
  var cols = ["#e40303","#ff8c00","#ffed00","#008026","#004dff","#750787"], s = '<svg class="pbig" viewBox="0 0 48 48" aria-hidden="true">', i;
  for(i = 0; i < 6; i++){ var rr = 21 - i * 3.2; s += '<path d="M' + (24 - rr).toFixed(1) + ' 40a' + rr.toFixed(1) + ' ' + rr.toFixed(1) + ' 0 0 1 ' + (rr * 2).toFixed(1) + ' 0" fill="none" stroke="' + cols[i] + '" stroke-width="3.4"/>'; }
  return s + '</svg>';
}

/* ---------- Festivals of Light: the hand drawn scene ----------
   Diwali: diyas along the front, a rangoli on the ground, sky lanterns.
   Day of the Dead: papel picado bunting and a marigold garland.
   Bonfire Night: a bonfire, and fireworks (drawn live on a canvas). */
function festivals(L){
  var W = 1200, H = 640, s = "", i, r = rng(42);
  var night = "#0b0620", flag = ["#ff4f81","#ffb627","#2ec4b6","#ff7a1a","#a86bff","#ffe066"];
  s += '<svg class="scene" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" focusable="false">';
  s += '<defs>' +
    '<radialGradient id="fGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffb627" stop-opacity=".75"/><stop offset="1" stop-color="#ffb627" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="fFire" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#ff7a1a" stop-opacity=".8"/><stop offset="1" stop-color="#ff4f81" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="fMoon" cx="50%" cy="50%" r="50%"><stop offset=".55" stop-color="#ffe9b0"/><stop offset=".6" stop-color="#ffe9b0" stop-opacity=".25"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient>' +
    '</defs>';
  /* moon */
  s += '<circle cx="1010" cy="120" r="120" fill="url(#fMoon)"/>';
  /* sky lanterns: rise and sway */
  for(i = 0; i < 7; i++){
    var lx = 560 + r() * 600, ld = (16 + r() * 12).toFixed(1), ldl = (-r() * 28).toFixed(1), ls = (0.6 + r() * 0.7).toFixed(2);
    s += '<g class="skyl" style="animation-duration:' + ld + 's;animation-delay:' + ldl + 's"><g transform="translate(' + lx.toFixed(0) + ' 700) scale(' + ls + ')">' +
      '<circle cx="0" cy="0" r="46" fill="url(#fGlow)"/>' +
      '<path d="M-16 -22h32l-6 40h-20z" fill="#ffb627"/><path d="M-16 -22h32l-2 8h-28z" fill="#ff7a1a"/><rect x="-8" y="16" width="16" height="5" rx="2" fill="#ff4f81"/>' +
      '</g></g>';
  }
  /* houses: one flat street of silhouettes with lit windows */
  var hx = 300, base = 560;
  while(hx < W + 40){
    var hw = 90 + r() * 70, hh = 120 + r() * 110, roof = r();
    s += '<g>';
    if(roof < 0.45) s += '<path d="M' + hx.toFixed(0) + ' ' + (base - hh).toFixed(0) + 'l' + (hw / 2).toFixed(0) + ' -' + (36 + r() * 20).toFixed(0) + 'l' + (hw / 2).toFixed(0) + ' ' + (36).toFixed(0) + 'z" fill="' + night + '"/>';
    else if(roof < 0.6) s += '<path d="M' + (hx + hw * 0.2).toFixed(0) + ' ' + (base - hh).toFixed(0) + 'q' + (hw * 0.3).toFixed(0) + ' -70 ' + (hw * 0.6).toFixed(0) + ' 0z" fill="' + night + '"/><rect x="' + (hx + hw / 2 - 3).toFixed(0) + '" y="' + (base - hh - 82).toFixed(0) + '" width="6" height="16" fill="' + night + '"/>';
    s += '<rect x="' + hx.toFixed(0) + '" y="' + (base - hh).toFixed(0) + '" width="' + hw.toFixed(0) + '" height="' + (hh + 90).toFixed(0) + '" fill="' + night + '"/>';
    var wy, wx;
    for(wy = base - hh + 22; wy < base - 30; wy += 42){
      for(wx = hx + 14; wx < hx + hw - 26; wx += 34){
        if(r() < 0.55) s += '<rect class="' + (r() < 0.3 ? "win flick" : "win") + '" x="' + wx.toFixed(0) + '" y="' + wy.toFixed(0) + '" width="16" height="22" rx="3" fill="#ffcf5c" style="animation-delay:' + (-r() * 6).toFixed(1) + 's"/>';
      }
    }
    s += '</g>';
    hx += hw + 4;
  }
  /* papel picado bunting: two strings */
  function bunting(x1, y1, x2, y2, sag, n, size){
    var out = '<path d="M' + x1 + ' ' + y1 + 'Q' + ((x1 + x2) / 2) + ' ' + (Math.max(y1, y2) + sag) + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="#fff7e6" stroke-width="2" opacity=".7"/>';
    var k;
    for(k = 1; k < n; k++){
      var t = k / n, mx = (x1 + x2) / 2, my = Math.max(y1, y2) + sag;
      var x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
      var y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
      var c = flag[k % flag.length], fw = size, fh = size * 1.25;
      out += '<g class="flag" style="animation-delay:' + (-k * 0.37).toFixed(2) + 's" transform="translate(' + x.toFixed(0) + ' ' + y.toFixed(0) + ')">' +
        '<path d="M' + (-fw / 2) + ' 0h' + fw + 'v' + fh + 'l-' + (fw / 6) + ' -' + (fh / 8) + 'l-' + (fw / 6) + ' ' + (fh / 8) + 'l-' + (fw / 6) + ' -' + (fh / 8) + 'l-' + (fw / 6) + ' ' + (fh / 8) + 'l-' + (fw / 6) + ' -' + (fh / 8) + 'l-' + (fw / 6) + ' ' + (fh / 8) + 'z" fill="' + c + '"/>' +
        '<circle cx="0" cy="' + (fh * 0.42).toFixed(1) + '" r="' + (fw * 0.16).toFixed(1) + '" fill="' + night + '" opacity=".55"/>' +
        '<path d="M' + (-fw * 0.3).toFixed(1) + ' ' + (fh * 0.16).toFixed(1) + 'l' + (fw * 0.08).toFixed(1) + ' ' + (fw * 0.1).toFixed(1) + 'l' + (fw * 0.08).toFixed(1) + ' -' + (fw * 0.1).toFixed(1) + 'M' + (fw * 0.14).toFixed(1) + ' ' + (fh * 0.16).toFixed(1) + 'l' + (fw * 0.08).toFixed(1) + ' ' + (fw * 0.1).toFixed(1) + 'l' + (fw * 0.08).toFixed(1) + ' -' + (fw * 0.1).toFixed(1) + '" fill="none" stroke="' + night + '" stroke-width="2.4" opacity=".55"/>' +
        '<path d="M' + (-fw * 0.3).toFixed(1) + ' ' + (fh * 0.74).toFixed(1) + 'h' + (fw * 0.6).toFixed(1) + '" stroke="' + night + '" stroke-width="2.4" stroke-dasharray="4 4" opacity=".55"/>' +
        '</g>';
    }
    return out;
  }
  s += bunting(420, 300, 1220, 240, 80, 13, 34);
  s += bunting(560, 170, 1220, 110, 60, 10, 26);
  /* marigold garland along the front of the houses */
  var gx;
  s += '<g class="garland">';
  for(gx = 330; gx < W + 20; gx += 15){
    var gy = 470 + Math.sin(gx / 46) * 14;
    s += '<circle cx="' + gx + '" cy="' + gy.toFixed(1) + '" r="9" fill="' + (gx % 30 ? "#ff8c1a" : "#ffc233") + '"/>';
  }
  s += '</g>';
  /* ground */
  s += '<path d="M0 560h' + W + 'v80H0z" fill="#07030f"/>';
  /* rangoli on the ground, squashed into perspective */
  s += '<g transform="translate(820 600) scale(1 .34)"><g class="rangoli">';
  var rc = ["#ff4f81","#ffb627","#2ec4b6","#a86bff"];
  for(i = 0; i < 16; i++) s += '<path d="M0 0q-22-60 0-150q22 90 0 150z" fill="' + rc[i % 4] + '" transform="rotate(' + (i * 22.5) + ')"/>';
  for(i = 0; i < 16; i++) s += '<circle cx="0" cy="-170" r="10" fill="' + rc[(i + 1) % 4] + '" transform="rotate(' + (i * 22.5 + 11.25) + ')"/>';
  s += '<circle r="52" fill="#fff7e6"/><circle r="38" fill="#ff4f81"/><circle r="20" fill="#ffb627"/></g></g>';
  /* bonfire */
  s += '<g transform="translate(1090 560)"><ellipse cx="0" cy="-60" rx="150" ry="140" fill="url(#fFire)"/>' +
    '<path d="M-70 0l70-30 70 30M-60-14l120 10" stroke="#3b1d0a" stroke-width="14" stroke-linecap="round"/>' +
    '<g class="fire"><path d="M-50-8q-10-60 30-100q-8 40 14 56q4-40 30-70q-4 60 26 104z" fill="#ff7a1a"/>' +
    '<path d="M-28-8q-4-40 18-62q0 28 12 36q4-22 16-34q2 40 6 60z" fill="#ffc233"/></g></g>';
  /* diyas along the front edge */
  for(i = 0; i < 9; i++){
    var dx = 380 + i * 92 + (i % 2) * 8, dy = 616;
    s += '<g transform="translate(' + dx + ' ' + dy + ')">' +
      '<circle cx="0" cy="-30" r="34" fill="url(#fGlow)"/>' +
      '<path d="M-24 -8q24 22 48 0q-3-6-24-6t-24 6z" fill="#c2410c"/><path d="M-22 -8q22 8 44 0" stroke="#ffb627" stroke-width="3" fill="none"/>' +
      '<g class="flame" style="animation-delay:' + (-i * 0.29).toFixed(2) + 's"><path d="M0 -44q12 14 0 30q-12 -16 0 -30z" fill="#ffb627"/><path d="M0 -34q5 8 0 18q-5-10 0-18z" fill="#fff7e6"/></g>' +
      '</g>';
  }
  s += '</svg>';
  return s;
}

/* Fireworks for the Festivals of Light scene: slow, soft blooms, no flashing.
   Returns a stop function. */
function fireworks(canvas, colours){
  var ctx = canvas.getContext("2d"), parts = [], raf = 0, last = 0, next = 600, dpr = Math.min(window.devicePixelRatio || 1, 2), alive = true;
  function size(){ canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; }
  size(); window.addEventListener("resize", size);
  function burst(){
    var w = canvas.width, h = canvas.height;
    var x = w * (0.5 + Math.random() * 0.45), y = h * (0.12 + Math.random() * 0.32), c = colours[(Math.random() * colours.length) | 0], n = 46, i;
    for(i = 0; i < n; i++){
      var a = i / n * Math.PI * 2, sp = (1.2 + Math.random() * 0.8) * dpr;
      parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: 90 + Math.random() * 40, c: c });
    }
  }
  function tick(t){
    if(!alive) return;
    var dt = Math.min(40, t - (last || t)); last = t; next -= dt;
    if(next <= 0){ burst(); next = 2200 + Math.random() * 1600; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    parts = parts.filter(function(p){
      p.life += dt / 16; p.x += p.vx * dt / 16; p.y += p.vy * dt / 16; p.vy += 0.012 * dpr * dt / 16; p.vx *= 0.99; p.vy *= 0.99;
      var k = p.life / p.max; if(k >= 1) return false;
      var alpha = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85;
      ctx.globalAlpha = alpha * 0.85; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.4 * dpr, 0, Math.PI * 2); ctx.fill();
      return true;
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return function(){ alive = false; cancelAnimationFrame(raf); window.removeEventListener("resize", size); ctx.clearRect(0, 0, canvas.width, canvas.height); };
}

/* ---------- the mystery box ---------- */
function lumOf(hex){
  var h = String(hex).replace("#", ""); if(h.length !== 6) return 1;
  var c = [0, 2, 4].map(function(i){ var v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function box(w){
  /* the box needs a colour the dark question marks show up on */
  var L0 = w.look, pick = [L0.pop, L0.pop2, "#ffd166"].filter(function(c){ return lumOf(c) > 0.18; });
  var L = { pop: pick[0] || "#ffd166", pop2: pick[1] || "#ff4f81" };
  return '<svg class="mbox" viewBox="0 0 200 190" aria-hidden="true" focusable="false">' +
    '<ellipse cx="100" cy="178" rx="78" ry="9" fill="rgba(0,0,0,.28)"/>' +
    '<g class="mbody"><rect x="30" y="78" width="140" height="96" rx="8" fill="' + L.pop + '" stroke="#0a2f38" stroke-width="5"/>' +
    '<rect x="88" y="78" width="24" height="96" fill="#fffdf8" stroke="#0a2f38" stroke-width="5"/>' +
    '<text x="58" y="146" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="54" fill="#0a2f38">?</text>' +
    '<text x="124" y="146" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="54" fill="#0a2f38">?</text></g>' +
    '<g class="mlid"><rect x="22" y="56" width="156" height="30" rx="7" fill="' + L.pop2 + '" stroke="#0a2f38" stroke-width="5"/>' +
    '<rect x="86" y="56" width="28" height="30" fill="#fffdf8" stroke="#0a2f38" stroke-width="5"/>' +
    '<path d="M100 56q-40-46-52-16q8 18 52 16zM100 56q40-46 52-16q-8 18-52 16z" fill="#fffdf8" stroke="#0a2f38" stroke-width="5" stroke-linejoin="round"/></g>' +
    '</svg>';
}

/* ---------- a passport stamp ---------- */
function stamp(w, size){
  var L = w.look, ink = L.bg === "#fdf0d5" || L.bg === "#fefae0" || L.bg === "#caf0f8" ? L.pop : L.bg;
  var rot = (hashOf(w.id) % 30) - 15, id = "st" + (hashOf(w.id) % 100000);
  return '<svg class="stamp" viewBox="0 0 100 100" style="width:' + (size || 64) + 'px;transform:rotate(' + rot + 'deg)" aria-hidden="true" focusable="false">' +
    '<defs><path id="' + id + '" d="M50 50m-33 0a33 33 0 1 1 66 0a33 33 0 1 1-66 0"/></defs>' +
    '<circle cx="50" cy="50" r="45" fill="#fffdf8" fill-opacity=".9" stroke="' + ink + '" stroke-width="5"/>' +
    '<circle cx="50" cy="50" r="24" fill="none" stroke="' + ink + '" stroke-width="2.5"/>' +
    '<text font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="10.5" letter-spacing="1.5" fill="' + ink + '"><textPath href="#' + id + '">CULTURAL CALENDAR * 2026/27 *</textPath></text>' +
    '<g transform="translate(34 34) scale(.67)">' + paint(I[L.motif] || I.star, ink, "#fffdf8") + '</g>' +
    '</svg>';
}

/* ---------- the Chilton Bridge mark: a bridge in an orange circle ---------- */
function mark(){
  return '<svg class="cbsmark" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="23" fill="#ef7724"/>' +
    '<path d="M6 31h36" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M8 31q16-22 32 0" fill="none" stroke="#fff" stroke-width="2.6"/>' +
    '<path d="M13 31v-7M18 31v-11M24 31v-13M30 31v-11M35 31v-7" stroke="#fff" stroke-width="1.8"/><path d="M11 35h26" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>';
}

function inner(name, f, d){ return paint(I[name] || I.star, f, d || f); }

window.B5CCArt = { icon: icon, inner: inner, names: Object.keys(I), pattern: pattern, poster: poster, festivals: festivals, fireworks: fireworks, box: box, stamp: stamp, mark: mark, rng: rng, hash: hashOf };
})();
