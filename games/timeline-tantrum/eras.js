/* Era and map data. Add a new era or map here; the engine reads it by id. */
(function () {
  'use strict';

  window.B5ERAS = {
    pre: {
      id: 'pre',
      name: 'Prehistoric',
      team: 'Stone Snags',
      when: 'about 10,000 BC',
      tag: '#ffa04d',
      ui: '#ef7724',
      names: ['Ug', 'Bonk', 'Grub', 'Flint', 'Mossy', 'Pebbles', 'Thud', 'Ogg', 'Nubs',
              'Stomp', 'Twig', 'Bramble', 'Clunk', 'Grunt', 'Boulder', 'Dusty'],
      weapons: {
        lob:   { name: 'Sling Stone',  blurb: 'Booms where it lands. The wind pushes it about.' },
        bomb:  { name: 'Fizz Pot',     blurb: 'A bouncy clay pot. Pops after 3 seconds. Wind leaves it alone.' },
        shove: { name: 'Club Bonk',    blurb: 'Up close only. Sends them flying.' },
        dig:   { name: 'Bone Shovel',  blurb: 'Dig a tunnel in the direction you aim.' },
        boulder: { name: 'Bouncing Boulder', blurb: 'Heavy and bouncy. Rolls downhill and flattens whoever it meets. Wind leaves it alone.' },
        gourd:   { name: 'Thunder Gourd',    blurb: 'Plonk it at your feet, then run. Big boom after 5 seconds.' },
        vine:    { name: 'Vine Swing',       blurb: 'Fire a vine at the ground or a ledge, then swing. Fire or jump to let go.' },
        wall:    { name: 'Stone Barricade',  blurb: 'Stacks a stone wall in front of you for cover.' },
        mega:    { name: 'Mega Boulder',     blurb: 'Superweapon. A gigantic boulder drops from the sky wherever you point.' }
      },
      kit: ['boulder', 'gourd', 'vine', 'wall', 'mega'],
      bits: [['Ug', 'Gr', 'Bon', 'Thu', 'Mos', 'Fli', 'Peb', 'Og', 'Bram', 'Stu', 'Clu', 'Nub', 'Dus', 'Grub'],
             ['k', 'nt', 'sy', 'bble', 'dge', 'g', 'rk', 'mble', 'mp', 'bo', 'sty', 'gs', 'ug', 'o']],
      titles: ['Big', 'Lil', 'Old', 'Sir', 'Mad'],
      voice: { base: 125, wave: 'sawtooth', wobble: 0 },
      music: { tempo: 96, root: 146.83, scale: [0, 3, 5, 7, 10], lead: 'triangle', drum: 'tom', seed: 7 }
    },
    egypt: {
      id: 'egypt',
      name: 'Ancient Egypt',
      team: 'Sun Snags',
      when: 'about 2560 BC',
      tag: '#ffe066',
      ui: '#b8860b',
      names: ['Sandy', 'Scarab', 'Dune', 'Nile', 'Papyrus', 'Sphinxy', 'Ankh', 'Lotus',
              'Reed', 'Ibis', 'Goldie', 'Oasis', 'Sunny', 'Natron', 'Obelisk', 'Mirage'],
      weapons: {
        lob:   { name: 'Clay Fire Pot',  blurb: 'Booms where it lands. The wind pushes it about.' },
        bomb:  { name: 'Natron Jar',     blurb: 'A fizzing jar of natron salt. Pops after 3 seconds. Wind leaves it alone.' },
        shove: { name: 'Khopesh Whack',  blurb: 'A whack with the flat of a curved khopesh. Up close only. Sends them flying.' },
        dig:   { name: 'Copper Chisel',  blurb: 'Chip a tunnel in the direction you aim, like a pyramid builder.' },
        spear:    { name: 'Throwing Spear', blurb: 'Flies fast and flat. A direct hit does big damage, but only a tiny boom. The wind nudges it.' },
        scarab:   { name: 'Scarab Beetle',  blurb: 'Lands, then scuttles towards the nearest enemy and pops. Bursts after 5 seconds if it never finds one.' },
        sled:     { name: 'Sand Sled',      blurb: 'Ride the sand. Left and right to push, fire or jump to hop off. Fly off steep edges.' },
        sandwall: { name: 'Sand Barrier',   blurb: 'Piles up a sand dune in front of you. Blasts dig into the dune instead of you. Sleds love it.' },
        sun:      { name: 'Sun Mirror',     blurb: 'Superweapon. Polished mirrors catch the sunlight and burn one spot. Sand turns to glass.' }
      },
      kit: ['spear', 'scarab', 'sled', 'sandwall', 'sun'],
      bits: [['Sa', 'Ne', 'Kha', 'Ra', 'Pa', 'Sca', 'Lo', 'Ib', 'Mi', 'Du', 'Ob', 'Su', 'An', 'Ta'],
             ['nd', 'ile', 'fu', 'py', 'rab', 'tus', 'is', 'ra', 'ne', 'khet', 'mun', 'ny', 'sh', 'bo']],
      titles: ['Lord', 'Lady', 'Scribe', 'Little', 'Great'],
      voice: { base: 190, wave: 'sawtooth', wobble: 7 },
      music: { tempo: 104, root: 196, scale: [0, 1, 4, 5, 7, 8, 10], lead: 'triangle', drum: 'doumbek', seed: 5 }
    },
    fut: {
      id: 'fut',
      name: 'Futuristic',
      team: 'Neon Snags',
      when: 'about AD 3000',
      tag: '#5fe0f0',
      ui: '#007291',
      names: ['Volt', 'Pixel', 'Byte', 'Nova', 'Glitch', 'Zappo', 'Chrome', 'Orbit',
              'Laser', 'Fuzz', 'Neon', 'Static', 'Echo', 'Blip', 'Sprocket', 'Widget'],
      weapons: {
        lob:   { name: 'Plasma Bolt',   blurb: 'Booms where it lands. The wind pushes it about.' },
        bomb:  { name: 'Pulse Grenade', blurb: 'Bounces around. Pops after 3 seconds. Wind leaves it alone.' },
        shove: { name: 'Kinetic Punch', blurb: 'Up close only. Sends them flying.' },
        dig:   { name: 'Rock Drill',    blurb: 'Drill a tunnel in the direction you aim.' },
        disc:    { name: 'Ricochet Disc',   blurb: 'Flies dead straight and bounces off walls up to 4 times. No gravity, no wind.' },
        laser:   { name: 'Precision Laser', blurb: 'An instant beam that zaps the first thing it touches.' },
        jet:     { name: 'Jetpack',         blurb: 'Hold up to fly, left and right to steer. Fuel runs out fast.' },
        shield:  { name: 'Energy Shield',   blurb: 'This Snag takes half damage and half knockback until your next go.' },
        orbital: { name: 'Orbital Strike',  blurb: 'Superweapon. A beam from space hits wherever you point.' }
      },
      kit: ['disc', 'laser', 'jet', 'shield', 'orbital'],
      bits: [['Vol', 'Pix', 'By', 'No', 'Gli', 'Zap', 'Chro', 'Or', 'Ne', 'Spro', 'Wid', 'Ec', 'Bli', 'Sta'],
             ['t', 'el', 'te', 'va', 'tch', 'po', 'me', 'bit', 'on', 'ket', 'get', 'ho', 'x', 'tron']],
      titles: ['Dr', 'Unit', 'Mega', 'Mk2', 'Agent'],
      voice: { base: 260, wave: 'square', wobble: 18 },
      music: { tempo: 118, root: 220, scale: [0, 2, 4, 7, 9], lead: 'square', drum: 'kick', seed: 11 }
    }
  };

  window.B5MAPS = {
    city: {
      id: 'city',
      name: 'Future City',
      style: 'city',
      era: 'fut',
      year: 3000,
      pal: {
        top: [95, 224, 240], top2: [255, 120, 190], metal: [78, 88, 112], metal2: [66, 75, 98], seam: [52, 60, 80],
        deep: [44, 50, 68], win: [255, 214, 110], win2: [150, 235, 255],
        moss: [96, 168, 72], moss2: [70, 128, 56], rust: [140, 92, 64],
        rock: [120, 128, 148], rockL: [158, 166, 186],
        tuft: [96, 168, 72], flower: [242, 162, 192], flower2: [255, 214, 110]
      },
      sky: ['#1d2147', '#2b2c5e', '#46356f', '#71407a', '#a8507a', '#e88a6a'],
      skyGreen: ['#1d3a3a', '#24504a', '#2f6a52', '#4a8a5a', '#7aa860', '#c8c27a'],
      sun: '#ffd9a8',
      far: '#3a3e6e', farWin: '#ffd27a', mid: '#2c2f57', near: '#1f2142',
      water: '#2a7aa8', waterTop: '#7fe8ff', goo: '#5fd35f', gooTop: '#c8ff9a',
      skySandy: ['#2a2350', '#4a3460', '#7a4a62', '#b0645a', '#e09a5a', '#f6cf86'],
      sandy: { top: [240, 196, 70], top2: [44, 92, 168], metal: [212, 166, 104], metal2: [194, 146, 88], seam: [160, 116, 70], deep: [120, 84, 50], win: [255, 230, 140], win2: [120, 200, 220] },
      farSandy: '#8a5a62', midSandy: '#6a4250', nearSandy: '#4a2e3c'
    },
    desert: {
      id: 'desert',
      name: 'Pyramid Desert',
      style: 'desert',
      era: 'egypt',
      year: -2560,
      pal: {
        sand1: [240, 206, 136], sand2: [224, 186, 114], sand3: [206, 164, 96], deep: [168, 124, 70], speck: [150, 108, 60],
        lime1: [236, 224, 194], lime2: [214, 198, 162], mortar: [178, 160, 124], limeD: [196, 178, 140],
        ston1: [218, 160, 100], ston2: [194, 136, 82], stonD: [160, 108, 64],
        gran1: [172, 88, 76], gran2: [140, 66, 58], gold: [240, 196, 70], gold2: [196, 150, 40],
        blue: [44, 92, 168], red: [180, 64, 44], green: [70, 150, 110],
        neon: [95, 224, 240], neon2: [255, 120, 190],
        rock: [214, 180, 112], rockL: [236, 204, 136],
        tuft: [176, 164, 88], flower: [236, 120, 90], flower2: [255, 214, 110]
      },
      sky: ['#79c2e6', '#98d0ea', '#b9dde6', '#dbe4cf', '#f1dcae', '#f6c88e'],
      skyNeon: ['#1d2147', '#2b2c5e', '#46356f', '#71407a', '#a8507a', '#e88a6a'],
      sun: '#fff6cf',
      far: '#e9cfa2', farShade: '#d9b98a', mid: '#dcb47c', midShade: '#c99d62',
      near: '#5f7f3e', nearTrunk: '#7a5a34', bank: '#6f8f45',
      water: '#3a8a9a', waterTop: '#a6e3df', flood: '#9a6a3a', floodTop: '#d0a46a'
    },
    jungle: {
      id: 'jungle',
      name: 'Prehistoric Jungle',
      style: 'hills',
      era: 'pre',
      year: -10000,
      pal: {
        grass1: [126, 200, 80], grass2: [90, 158, 58], dirt1: [138, 90, 50], dirt2: [120, 76, 42],
        deep: [96, 62, 36], speck: [84, 54, 30], rock: [125, 116, 104], rockL: [160, 152, 140],
        tuft: [104, 176, 68], flower: [242, 162, 192], flower2: [255, 214, 110]
      },
      sky: ['#8fcbe2', '#a6d6e6', '#bfe0e6', '#d6e8df', '#eaead2', '#f6e3c3'],
      sun: '#fff3c8',
      far: '#a7b6c6', farTop: '#93a3b4', lava: '#ef7724', smoke: '#c9d0d6',
      mid: '#7fa784', near: '#4f7d58', nearTrunk: '#3e6347',
      water: '#3f8fb5', waterTop: '#9fd8ef'
    }
  };

  /* The squad picker timeline, drawn to scale. year: negative numbers are BC. */
  window.B5TIMELINE = [
    { id: 'pre',   name: 'Stone Age',   year: -10000, label: 'about 10,000 BC', ready: true },
    { id: 'egypt', name: 'Ancient Egypt', year: -2560, label: 'about 2560 BC, when the Great Pyramid was built', ready: true },
    { id: 'rome',  name: 'Ancient Rome', year: 100,   label: 'about AD 100', ready: false },
    { id: 'viking', name: 'Vikings',     year: 900,   label: 'about AD 900', ready: false },
    { id: 'med',   name: 'Medieval',     year: 1300,  label: 'about AD 1300', ready: false },
    { id: 'pirate', name: 'Pirates',     year: 1700,  label: 'about AD 1700', ready: false },
    { id: 'ww',    name: 'World Wars',   year: 1930,  label: '1914 to 1945', ready: false },
    { id: 'fut',   name: 'Far Future',   year: 3000,  label: 'about AD 3000', ready: true }
  ];

  /* Artefacts buried in each map. Real ones carry checked facts; glitches are the joke shelf. */
  window.B5ARTEFACTS = {
    jungle: [
      { id: 'handaxe', name: 'Flint hand axe', when: 'about 500,000 years ago', where: 'Boxgrove, West Sussex',
        fact: 'Early humans chipped lumps of flint into sharp teardrop shapes. One hand axe could cut meat, wood and animal skins.' },
      { id: 'needle', name: 'Bone needle', when: 'tens of thousands of years ago', where: 'Stone Age sites across Europe',
        fact: 'With a bone needle and thread made from animal sinew, people could sew snug, warm clothes for the Ice Age.' },
      { id: 'caveart', name: 'Ice Age cave art', when: 'about 13,000 years ago', where: 'Creswell Crags, Derbyshire',
        fact: 'People scratched pictures of animals, including a deer, into the cave walls. It is the only Ice Age cave art ever found in Britain.',
        now: 'Creswell Crags runs cave tours, so you could go and see it for real.' },
      { id: 'mammoth', name: 'Mammoth tooth', when: 'Ice Age Britain', where: 'Rivers and gravel pits across Britain',
        fact: 'A woolly mammoth\'s back tooth had ridges for grinding up tough grass. The very last mammoths died out only about 4,000 years ago, on an Arctic island.' },
      { id: 'headdress', name: 'Antler headdress', when: 'about 11,000 years ago', where: 'Star Carr, North Yorkshire',
        fact: 'Hunters cut deer skulls and antlers into headdresses. More than 30 were found at Star Carr. Nobody knows for sure if they were for hunting, dancing or ceremonies.' },
      { id: 'arrowhead', name: 'Flint arrowhead', when: 'about 6,000 years ago', where: 'Fields all over Britain',
        fact: 'Bows let hunters hit animals from far away. Arrowheads were chipped from flint like hand axes, only tiny and very sharp.' },
      { id: 'beaker', name: 'Beaker pot', when: 'about 4,500 years ago', where: 'Graves across Britain and Europe',
        fact: 'These bell shaped pots gave the Beaker people their name. They were often buried with the dead, maybe holding a drink for the journey.' },
      { id: 'bluestone', name: 'Stonehenge bluestone', when: 'about 5,000 years ago', where: 'Stonehenge, Wiltshire',
        fact: 'Some of Stonehenge\'s stones were moved about 150 miles from the Preseli Hills in Wales, using muscle power, ropes and wood.',
        now: 'You can visit Stonehenge in Wiltshire today.' },
      { id: 'dresser', name: 'Skara Brae stone dresser', when: 'about 5,000 years ago', where: 'Skara Brae, Orkney',
        fact: 'A storm in 1850 uncovered a whole Stone Age village. The houses still have stone beds and stone dressers, a bit like shelves for showing things off.',
        now: 'Skara Brae is open to visitors in Orkney, Scotland.' }
    ],
    desert: [
      { id: 'papyrus', name: 'Diary of Merer', when: 'about 2560 BC', where: 'Wadi al-Jarf, Egypt',
        fact: 'The oldest written papyrus ever found is a work diary. An official called Merer wrote down how his team moved limestone blocks by boat to build the Great Pyramid. It was only found in 2013.' },
      { id: 'breadmould', name: 'Pyramid bakery bread pot', when: 'about 2500 BC', where: 'Giza, Egypt',
        fact: 'Archaeologists found the pyramid builders\' town, with bakeries full of big bell shaped bread pots. The builders were paid workers, not slaves, and bread and beer were part of their pay.' },
      { id: 'canopic', name: 'Canopic jar', when: 'from about 2600 BC', where: 'Tombs across Egypt',
        fact: 'When a mummy was made, the liver, lungs, stomach and intestines were kept in four separate jars. The heart was left inside the body.',
        now: 'The British Museum in London has canopic jars and mummies you can see for real.' },
      { id: 'scarabcharm', name: 'Scarab charm', when: 'from about 2000 BC', where: 'All over Ancient Egypt',
        fact: 'Dung beetles roll balls of dung along the ground. That reminded Egyptians of the sun being rolled across the sky, so beetle shaped charms were thought to bring luck and protection.' },
      { id: 'shabti', name: 'Shabti figure', when: 'from about 2000 BC', where: 'Tombs across Egypt',
        fact: 'Little figures were buried with the dead to do their farm work in the afterlife. Some tombs had 401: one worker for every day of the year, plus 36 bosses to keep them busy.' },
      { id: 'kohl', name: 'Kohl eye paint pot', when: 'from about 4000 BC', where: 'All over Ancient Egypt',
        fact: 'Men and women wore dark kohl eye paint. It looked good, and it may have helped cut the glare of the bright desert sun.' },
      { id: 'senet', name: 'Senet game board', when: 'from about 3100 BC', where: 'Homes and tombs in Egypt',
        fact: 'One of the oldest board games we know of, played for thousands of years. Tutankhamun was buried with game boards so he could keep playing in the afterlife.' },
      { id: 'rosetta', name: 'Rosetta Stone', when: '196 BC', where: 'Rosetta (Rashid), Egypt',
        fact: 'The same message is carved three times: in hieroglyphs, in Demotic and in ancient Greek. Comparing them helped Jean-Francois Champollion crack hieroglyphs in 1822.',
        now: 'The Rosetta Stone is in the British Museum in London. It is one of the most visited objects there.' }
    ],
    desertGlitches: [
      { id: 'shades', name: 'Sunglasses', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Very handy in the desert sun, but about 4,500 years too early. Egyptians used kohl eye paint instead.' },
      { id: 'lolly', name: 'Unmelted ice lolly', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'An ice lolly that has not melted in the desert heat. That is two kinds of impossible.' },
      { id: 'trainer', name: 'Light up trainer', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'The heel still flashes. The pyramid builders went barefoot or wore sandals woven from reeds.' },
      { id: 'selfie', name: 'Selfie stick', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Nobody will invent photography for about another 4,400 years. A time traveller wanted a pyramid selfie.' }
    ],
    city: [
      { id: 'stamp', name: 'Penny Black stamp', when: '1840', where: 'Britain',
        fact: 'The world\'s first sticky postage stamp. It cost one penny to send a letter anywhere in Britain.' },
      { id: 'ticket', name: 'Card train ticket', when: 'the 1830s onwards', where: 'Britain\'s railways',
        fact: 'A railway clerk called Thomas Edmondson invented little card tickets in the 1830s. They were used in Britain for about 150 years.' },
      { id: 'bulb', name: 'Light bulb', when: 'about 1880', where: 'Gateshead and New Jersey',
        fact: 'Joseph Swan in England and Thomas Edison in America both made working light bulbs. Swan\'s house in Gateshead was one of the first homes lit by electric light.' },
      { id: 'floppy', name: 'Floppy disk', when: 'from 1971', where: 'Computers everywhere',
        fact: 'The first floppy disks were 8 inches wide. The later small ones held 1.44 MB, less than one photo on a phone today.' },
      { id: 'cassette', name: 'Cassette tape', when: 'from 1963', where: 'Music players everywhere',
        fact: 'Music came on tapes you had to rewind. Winding a tangled tape back in with a pencil was a real skill.' },
      { id: 'cube', name: 'Puzzle cube', when: '1974', where: 'Hungary',
        fact: 'Invented in 1974 by Erno Rubik, a Hungarian teacher. There are over 43 quintillion ways to mix one up.' },
      { id: 'brickphone', name: 'Brick mobile phone', when: '1985', where: 'Britain',
        fact: 'The first mobile phone call in Britain was made on New Year\'s Day 1985. Early mobiles were as big as a brick.' },
      { id: 'toybrick', name: 'Toy building brick', when: '1958', where: 'Denmark',
        fact: 'The clip together toy brick design was patented in 1958. Bricks made today still clip onto ones from back then.' }
    ],
    cityGlitches: [
      { id: 'dinoegg', name: 'Warm dinosaur egg', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Dinosaurs died out 66 million years ago. This egg is still warm. Someone has been time travelling with snacks.' },
      { id: 'helmet', name: 'Brand new Roman helmet', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Not a scratch on it. A Roman helmet should be about 2,000 years old by now.' },
      { id: 'fluff', name: 'Fresh mammoth fluff', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Mammoths died out about 4,000 years ago, but this fluff is still soft. It smells awful.' },
      { id: 'quill', name: 'Quill with wet ink', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'The ink is still wet. Nobody has written with a feather quill for well over 100 years.' }
    ],
    glitches: [
      { id: 'phone', name: 'Smartphone', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Someone dropped this while time travelling. Zero signal in the Stone Age.' },
      { id: 'duck', name: 'Rubber duck', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Bath toys are about 10,000 years too early. Who brought a duck to the Ice Age?' },
      { id: 'cone', name: 'Traffic cone', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Roadworks, several thousand years before the first road.' },
      { id: 'pad', name: 'Games controller', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Nobody has invented electricity yet, let alone this. A time traveller must have been bored.' }
    ]
  };

  /* Time Tour: winners change history. Keyed by the map being changed, then the squad that won the stop before. */
  window.B5RIPPLE = {
    desert: {
      pre: {
        look: 'rough',
        title: 'The Stone Snags won the Stone Age',
        text: 'So Stone Age ways won out. The pyramids are rough and half finished, and giant boulders lie all over the desert. Stone Snags carry an extra boulder. Sun Snags have one less spear.',
        postcard: 'Because the Stone Snags won back in 10,000 BC, the pyramids are rough and covered in boulders.',
        short: 'rough pyramids with boulders everywhere',
        ammo: { pre: { boulder: 1 }, egypt: { spear: -1 } }
      },
      fut: {
        look: 'neon',
        title: 'The Neon Snags won the Stone Age',
        text: 'So the future arrived thousands of years early. The pyramids glow with neon lights under a purple sky. Neon Snags bring an extra Ricochet Disc. Stone Snags have one less boulder.',
        postcard: 'Because the Neon Snags won back in 10,000 BC, the pyramids glow with neon lights.',
        short: 'neon pyramids',
        ammo: { fut: { disc: 1 }, pre: { boulder: -1 } }
      },
      egypt: {
        look: 'golden',
        title: 'The Sun Snags won the Stone Age',
        text: 'So Egypt got a head start. The pyramids were finished early, with smooth white sides and shining gold tips. Sun Snags carry an extra spear.',
        postcard: 'Because the Sun Snags won back in 10,000 BC, the pyramids shine with gold tips.',
        short: 'golden pyramids',
        ammo: { egypt: { spear: 1 } }
      }
    },
    city: {
      pre: {
        look: 'overgrown',
        title: 'The Stone Snags won in Ancient Egypt',
        text: 'So history went wild. Vines cover the towers, the sky has gone green, and the factories never quite worked. Neon Snags start with one less disc and laser. Stone Snags carry an extra boulder.',
        postcard: 'Because the Stone Snags won in 2560 BC, the Future City is covered in vines.',
        short: 'a Future City covered in vines',
        ammo: { fut: { disc: -1, laser: -1 }, pre: { boulder: 1 } }
      },
      fut: {
        look: 'gleaming',
        title: 'The Neon Snags won in Ancient Egypt',
        text: 'So the future arrived early. The Future City gleams brighter than ever. Neon Snags bring an extra Ricochet Disc, and everyone else has one less of their best kit.',
        postcard: 'Because the Neon Snags won in 2560 BC, the Future City gleams brighter than ever.',
        short: 'a gleaming Future City',
        ammo: { fut: { disc: 1 }, pre: { boulder: -1 }, egypt: { spear: -1 } }
      },
      egypt: {
        look: 'sandy',
        title: 'The Sun Snags won in Ancient Egypt',
        text: 'So Ancient Egypt never ended. The Future City is built like a giant temple, with sandstone towers, gold edges and pyramids on the skyline. Sun Snags carry an extra Scarab Beetle. Neon Snags have one less disc.',
        postcard: 'Because the Sun Snags won in 2560 BC, the Future City is built like a giant temple.',
        short: 'a Future City built like a temple',
        ammo: { egypt: { scarab: 1 }, fut: { disc: -1 } }
      }
    }
  };

  /* Jay on commentary. Each kind picks one line at random. */
  window.B5JAY = {
    big: ['Outrageous!', 'OUTRAGEOUS. Absolutely outrageous.', 'That one is going on the highlights reel.'],
    double: ['My ears are not a toilet!', 'Two for the price of one!'],
    water: ['In the wise words of my late, great grandfather, stop.', 'Splash! Back to your own time.', 'Straight in for a swim.'],
    miss: ['The fish enjoyed that one.', 'Nearly!', 'Bold choice.'],
    shove: ['Unhand me, goblin!', 'Bonk! A classic.'],
    find: ['Ooh, that is going in the museum.', 'When I was in China, I found one of those. Well, nearly.', 'Careful with that, it is older than me. Just.'],
    glitch: ['Hang on. That should NOT be here.', 'Who left that lying about in history?'],
    crate: ['Good girl, Bonnie!', 'Delivery from Bonnie!'],
    bark: ['Release the poodle!', 'Bonnie, NO. Actually, yes.'],
    breather: ['Fair enough. Everyone needs a breather.'],
    birds: ['Ooh, are those birds? Lovely.', 'Birds! Everyone stop and look at the birds.'],
    win: ['What a match!', 'Outrageous scenes. What a finish.'],
    sudden: ['Sudden Death! Everybody stay calm. I am not calm.', 'The volcanoes have had enough of this.'],
    swing: ['Look at them go!', 'Swinging like a gibbon. Lovely.'],
    jet: ['Up, up and away!', 'Mind the birds up there.'],
    zap: ['Pew!', 'Very precise. Very rude.'],
    strike: ['Here it comes...', 'Everybody look up!'],
    reactor: ['The reactor is melting down. Totally normal. Totally fine.', 'Is the water meant to be green?'],
    tour: ['Mind the gap. It is a few thousand years wide.', 'Next stop: somewhen else!'],
    sandstorm: ['Sandstorm! Hold on to your headcloths.', 'Sand in my eyes, sand in my ears. My ears are not a sandpit.'],
    sled: ['Wheee! Look at them slide.', 'Sand sledding. Lovely.'],
    scarab: ['Is that beetle following someone?', 'Run! The beetle has your scent.'],
    spear: ['Bullseye!', 'Straight through the middle. Outrageous.'],
    sun: ['Everybody put your sun cream on.', 'Mirrors at the ready...'],
    dune: ['Nice dune. Very sandy.', 'Hiding behind a sandcastle. Classic.']
  };
})();
