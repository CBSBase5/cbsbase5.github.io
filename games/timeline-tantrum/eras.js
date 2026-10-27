/* Era and map data. Add a new era or map here; the engine reads it by id. */
(function () {
  'use strict';

  window.B5ERAS = {
    pre: {
      id: 'pre',
      name: 'Prehistoric',
      team: 'Stone Snags',
      when: 'about 10,000 BC',
      tag: '#ff7f5a',
      ui: '#ef7724',
      names: ['Ug', 'Bonk', 'Grub', 'Flint', 'Mossy', 'Pebbles', 'Thud', 'Ogg', 'Nubs',
              'Stomp', 'Twig', 'Bramble', 'Clunk', 'Grunt', 'Boulder', 'Dusty'],
      weapons: {
        lob:   { name: 'Sling Stone',  blurb: 'Booms where it lands. The wind pushes it about.' },
        bomb:  { name: 'Fizz Pot',     blurb: 'A bouncy clay pot. Pops after 3 seconds. Wind leaves it alone.' },
        shove: { name: 'Club Bonk',    blurb: 'Up close only. Sends them flying.' },
        dig:   { name: 'Bone Shovel',  blurb: 'Dig a tunnel in the direction you aim.' },
        boulder: { name: 'Bouncing Boulder', blurb: 'Heavy and bouncy. Rolls downhill and flattens whoever it meets. Wind leaves it alone.', real: ['10,000 BC', 'Flint tool'] },
        gourd:   { name: 'Thunder Gourd',    blurb: 'Plonk it at your feet, then run. Big boom after 5 seconds.', real: ['8000 BC', 'Gourd bottle'] },
        vine:    { name: 'Vine Swing',       blurb: 'Fire a vine at the ground or a ledge, then swing. Fire or jump to let go.', real: ['15,000 BC', 'Plant rope'] },
        wall:    { name: 'Stone Barricade',  blurb: 'Stacks a stone wall in front of you for cover.', real: ['3100 BC', 'Skara Brae'] },
        mega:    { name: 'Mega Boulder',     blurb: 'Superweapon. A gigantic boulder drops from the sky wherever you point.', real: ['2500 BC', 'Stonehenge'] }
      },
      kit: ['boulder', 'gourd', 'vine', 'wall', 'mega'],
      stats: { power: 5, precision: 2, tricks: 4 },
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
        shove: { name: 'Mace Whack',     blurb: 'A whack with a stone headed mace. Up close only. Sends them flying.' },
        dig:   { name: 'Copper Chisel',  blurb: 'Chip a tunnel in the direction you aim, like a pyramid builder.' },
        spear:    { name: 'Throwing Spear', blurb: 'Flies fast and flat. A direct hit does big damage, but only a tiny boom. The wind nudges it.', real: ['2500 BC', 'Copper spear'] },
        scarab:   { name: 'Scarab Beetle',  blurb: 'Lands, then scuttles towards the nearest enemy and pops. Bursts after 5 seconds if it never finds one.', real: ['1500 BC', 'Scarab charm'] },
        sled:     { name: 'Sand Sled',      blurb: 'Ride the sand. Left and right to push, fire or jump to hop off. Fly off steep edges.', real: ['1900 BC', 'Wooden sledge'] },
        sandwall: { name: 'Sand Barrier',   blurb: 'Piles up a sand dune in front of you. Blasts dig into the dune instead of you. Sleds love it.', real: ['2500 BC', 'Great Sphinx'] },
        sun:      { name: 'Sun Mirror',     blurb: 'Superweapon. Polished mirrors catch the sunlight and burn one spot. Sand turns to glass.', real: ['1900 BC', 'Bronze mirror'] }
      },
      kit: ['spear', 'scarab', 'sled', 'sandwall', 'sun'],
      stats: { power: 3, precision: 4, tricks: 5 },
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
        disc:    { name: 'Ricochet Disc',   blurb: 'Flies dead straight and bounces off walls up to 4 times. No gravity, no wind.', real: ['1957', 'Frisbee'] },
        laser:   { name: 'Precision Laser', blurb: 'An instant beam that zaps the first thing it touches.', real: ['1960', 'First laser'] },
        jet:     { name: 'Jetpack',         blurb: 'Hold up to fly, left and right to steer. Fuel runs out fast.', real: ['1961', 'Rocket belt'] },
        shield:  { name: 'Energy Shield',   blurb: 'This Snag takes half damage and half knockback until your next go.', real: ['1969', 'Space helmet'] },
        orbital: { name: 'Orbital Strike',  blurb: 'Superweapon. A beam from space hits wherever you point.', real: ['1957', 'Sputnik 1'] }
      },
      kit: ['disc', 'laser', 'jet', 'shield', 'orbital'],
      stats: { power: 3, precision: 5, tricks: 4 },
      bits: [['Vol', 'Pix', 'By', 'No', 'Gli', 'Zap', 'Chro', 'Or', 'Ne', 'Spro', 'Wid', 'Ec', 'Bli', 'Sta'],
             ['t', 'el', 'te', 'va', 'tch', 'po', 'me', 'bit', 'on', 'ket', 'get', 'ho', 'x', 'tron']],
      titles: ['Dr', 'Unit', 'Mega', 'Mk2', 'Agent'],
      voice: { base: 260, wave: 'square', wobble: 18 },
      music: { tempo: 118, root: 220, scale: [0, 2, 4, 7, 9], lead: 'square', drum: 'kick', seed: 11 }
    },
    rome: {
      id: 'rome',
      name: 'Roman Britain',
      team: 'Eagle Snags',
      when: 'about AD 122',
      tag: '#c58cff',
      ui: '#7b3fbf',
      names: ['Maximus', 'Brutus', 'Toga', 'Sandal', 'Aquila', 'Forum', 'Rufus', 'Felix',
              'Pax', 'Vesta', 'Marcus', 'Julia', 'Nova', 'Crassus', 'Gravel', 'Sulis'],
      weapons: {
        lob:   { name: 'Lead Sling Bullet', blurb: 'Booms where it lands. The wind pushes it about.' },
        bomb:  { name: 'Pitch Pot',         blurb: 'A pot of burning pitch. Pops after 3 seconds. Wind leaves it alone.' },
        shove: { name: 'Shield Bash',       blurb: 'Up close only. A shove with a big red shield.' },
        dig:   { name: 'Legion Pickaxe',    blurb: 'Dig a tunnel in the direction you aim, like soldiers digging a ditch.' },
        pilum:    { name: 'Pilum',           blurb: 'A heavy javelin. A direct hit goes straight through shields.', real: ['AD 100', 'Pilum'] },
        ballista: { name: 'Ballista Bolt',   blurb: 'Flies fast and almost straight. Wind leaves it alone.', real: ['AD 100', 'Ballista'] },
        road:     { name: 'Roman Road',      blurb: 'Lays a straight stone road ahead of you, even over gaps. Free move.', real: ['AD 80', 'Dere Street'] },
        testudo:  { name: 'Testudo',         blurb: 'Tortoise formation. Every Snag of yours nearby gets a shield until your next go.', real: ['AD 113', 'Trajan\'s Column'] },
        onager:   { name: 'Onager Barrage',  blurb: 'Superweapon. A catapult far away throws three boulders at the spot you pick.', real: ['AD 350', 'Onager'] }
      },
      kit: ['pilum', 'ballista', 'road', 'testudo', 'onager'],
      stats: { power: 4, precision: 4, tricks: 3 },
      bits: [['Max', 'Bru', 'Tog', 'San', 'Aqu', 'For', 'Jul', 'Corn', 'Fab', 'Luc', 'Oct', 'Pom', 'Vic', 'Cas'], ['us', 'a', 'ix', 'um', 'o', 'ia', 'ius', 'ella', 'ilia', 'ianus', 'icus', 'ina', 'orix', 'ulus']],
      titles: ['Big', 'Old', 'Lil', 'Sir', 'Mega'],
      voice: { base: 165, wave: 'triangle', wobble: 4 },
      music: { tempo: 112, root: 196, scale: [0, 2, 4, 5, 7, 9], lead: 'square', drum: 'march', seed: 23 }
    },
    sumer: {
      id: 'sumer',
      name: 'Sumerians',
      team: 'Wedge Snags',
      when: 'about 3500 BC',
      tag: '#ff8fc0',
      ui: '#c0306a',
      names: ['Ziggy', 'Lugal', 'Ninni', 'Dumu', 'Kish', 'Reedy', 'Date', 'Stylus',
              'Uri', 'Lagash', 'Eridu', 'Brickle', 'Tamar', 'Mudge', 'Tiggy', 'Euphy'],
      weapons: {
        lob:    { name: 'Bitumen Pot',      blurb: 'A pot of burning bitumen, the sticky black tar Sumerians used as glue. Booms where it lands. The wind pushes it about.' },
        bomb:   { name: 'Date Jar',         blurb: 'A clay jar of sticky dates. Bounces, then pops after 3 seconds. Wind leaves it alone.' },
        shove:  { name: 'Copper Axe Bonk',  blurb: 'Up close only. Sends them flying.' },
        dig:    { name: 'Copper Hoe',       blurb: 'Dig a tunnel in the direction you aim, like farmers digging canals.' },
        cart:   { name: 'War Cart',         blurb: 'Push off a cart on solid wooden wheels. It speeds up downhill and crashes into the first Snag it meets.', real: ['2600 BC', 'Standard of Ur'] },
        tablet: { name: 'Clay Tablet',      blurb: 'A heavy clay slab, thrown flat. It skims across water up to 3 times.', real: ['3200 BC', 'Clay tablet'] },
        steps:  { name: 'Mud Brick Steps',  blurb: 'Build a little staircase of mud bricks. Walk up it, or hide behind it.', real: ['2100 BC', 'Ziggurat of Ur'] },
        canal:  { name: 'Canal Flood',      blurb: 'Open the river banks. The water rises for 3 goes, so get your Snags up high.', real: ['5000 BC', 'River canals'] },
        bull:   { name: 'Bull of Heaven',   blurb: 'Superweapon. From the Epic of Gilgamesh, one of the oldest stories ever written. A giant bull charges across the spot you pick.', real: ['2500 BC', 'Bull lyre of Ur'] }
      },
      kit: ['cart', 'tablet', 'steps', 'canal', 'bull'],
      stats: { power: 4, precision: 4, tricks: 4 },
      bits: [['Zig', 'Lu', 'Nin', 'Du', 'Ki', 'Ree', 'Sty', 'U', 'La', 'E', 'Bri', 'Ta', 'Mu', 'Ti'],
             ['gy', 'gal', 'ni', 'mu', 'sh', 'dy', 'lus', 'ri', 'gash', 'du', 'ckle', 'mar', 'dge', 'ggy']],
      titles: ['Lugal', 'Big', 'Lil', 'Old', 'Scribe'],
      voice: { base: 140, wave: 'triangle', wobble: 9 },
      music: { tempo: 92, root: 207.65, scale: [0, 2, 3, 7, 8], lead: 'triangle', drum: 'frame', seed: 53 }
    },
    med: {
      id: 'med',
      name: 'Medieval',
      team: 'Crown Snags',
      when: 'about AD 1300',
      tag: '#8be05a',
      ui: '#3f8a2a',
      names: ['Bertram', 'Matilda', 'Godric', 'Wilfred', 'Rowena', 'Edmund', 'Mabel', 'Osric',
              'Hilda', 'Cuthbert', 'Agnes', 'Thistle', 'Gawain', 'Gwen', 'Alfric', 'Bodkin'],
      weapons: {
        lob:    { name: 'Fire Arrow',     blurb: 'Booms where it lands. The wind pushes it about.' },
        bomb:   { name: 'Beehive',        blurb: 'A buzzing beehive. Bounces, then pops after 3 seconds. Wind leaves it alone.' },
        shove:  { name: 'Mace Bonk',      blurb: 'Up close only. Sends them flying.' },
        dig:    { name: "Sapper's Pick",  blurb: 'Dig a tunnel in the direction you aim, like sappers digging under castle walls.' },
        volley: { name: 'Longbow Volley', blurb: 'Five arrows at once. One arrow stings, five really hurt. The wind pushes them a lot.', real: ['1300', 'Longbow'] },
        lance:  { name: 'Lance Charge',   blurb: 'Charge along the ground and send the first Snag you meet flying.', real: ['1300', 'Jousting lance'] },
        oil:    { name: 'Boiling Oil',    blurb: 'Tip out a pot of hot oil. It runs downhill and burns anyone in the way.', real: ['1300', 'Murder holes'] },
        banner: { name: 'Royal Banner',   blurb: 'Plant a banner. Every Snag of yours nearby gets back 20 health.', real: ['1198', 'Royal arms'] },
        treb:   { name: 'Trebuchet',      blurb: 'Superweapon. A giant stone flies in from far away and lands where you point.', real: ['1304', 'Warwolf'] }
      },
      kit: ['volley', 'lance', 'oil', 'banner', 'treb'],
      stats: { power: 4, precision: 3, tricks: 5 },
      bits: [['Ber', 'Mat', 'God', 'Wil', 'Ro', 'Ed', 'Ma', 'Os', 'Hil', 'Cuth', 'Ag', 'Gaw', 'Al', 'Bod'],
             ['tram', 'ilda', 'ric', 'fred', 'wena', 'mund', 'bel', 'win', 'da', 'bert', 'nes', 'ain', 'fric', 'kin']],
      titles: ['Sir', 'Dame', 'Lord', 'Lady', 'Little'],
      voice: { base: 150, wave: 'triangle', wobble: 0 },
      music: { tempo: 100, root: 220, scale: [0, 2, 3, 5, 7, 9, 10], lead: 'triangle', drum: 'tabor', seed: 31 }
    },
    pirate: {
      id: 'pirate',
      name: 'Pirates',
      team: 'Anchor Snags',
      when: 'about 1718',
      tag: '#6f9bff',
      ui: '#2f5fd0',
      names: ['Barnacle', 'Bilge', 'Salty', 'Squall', 'Doubloon', 'Marlin', 'Cutlass', 'Scurvy',
              'Polly', 'Reef', 'Plank', 'Anchor', 'Coral', 'Kipper', 'Shanty', 'Bosun'],
      weapons: {
        lob:       { name: 'Grenado',          blurb: 'A clay hand grenade, like the ones real pirates threw. Booms where it lands. The wind pushes it about.' },
        bomb:      { name: 'Stinkpot',         blurb: 'A pot of smelly smoke. Bounces, then pops after 3 seconds. Wind leaves it alone.' },
        shove:     { name: 'Cutlass Whack',    blurb: 'A whack with the flat of the cutlass. Up close only. Sends them flying.' },
        dig:       { name: 'Treasure Shovel',  blurb: 'Dig a tunnel in the direction you aim. X marks the spot.' },
        cannon:    { name: 'Cannon',           blurb: 'Fast and heavy. The kick shoves you backwards, so mind the edge. Wind leaves it alone.', real: ['1718', 'Ship\'s cannon'] },
        blunder:   { name: 'Blunderbuss',      blurb: 'A short blast of shot that spreads out. Best up close.', real: ['1700', 'Blunderbuss'] },
        launch:    { name: 'Human Cannonball', blurb: 'Fire yourself across the map in the direction you aim. A free move: you still get your go.', real: ['1877', 'Zazel, London'] },
        keg:       { name: 'Powder Keg',       blurb: 'Leave a keg behind you. It goes off when an enemy Snag comes close.', real: ['1700', 'Powder keg'] },
        broadside: { name: 'Broadside',        blurb: 'Superweapon. A ship sails past the edge of the map and fires five cannonballs where you point.', real: ['1718', 'Queen Anne\'s Revenge'] }
      },
      kit: ['cannon', 'blunder', 'launch', 'keg', 'broadside'],
      stats: { power: 5, precision: 3, tricks: 4 },
      bits: [['Bar', 'Bil', 'Sal', 'Squ', 'Dou', 'Mar', 'Cut', 'Scu', 'Pol', 'Ree', 'Pla', 'Anc', 'Cor', 'Kip'],
             ['nacle', 'ge', 'ty', 'all', 'bloon', 'lin', 'lass', 'vy', 'ly', 'f', 'nk', 'hor', 'al', 'per']],
      titles: ['Capn', 'Old', 'Mad', 'Salty', 'Lil'],
      voice: { base: 112, wave: 'sawtooth', wobble: 12 },
      music: { tempo: 128, root: 196, scale: [0, 2, 3, 5, 7, 8, 10], lead: 'square', drum: 'jig', seed: 41 }
    },
    scrap: {
      id: 'scrap',
      name: 'Wasteland',
      team: 'Scrap Snags',
      when: 'about AD 2500',
      tag: '#d0d8e2',
      ui: '#6a7a88',
      names: ['Junko', 'Rusty', 'Rivet', 'Grit', 'Spanner', 'Cog', 'Bucket', 'Ratchet',
              'Tinny', 'Scrapper', 'Flotsam', 'Gasket', 'Fuse', 'Nettle', 'Hubcap', 'Wonky'],
      weapons: {
        lob:     { name: 'Can Sling',      blurb: 'A tin can flung from a slingshot. Booms where it lands. The wind pushes it about.' },
        bomb:    { name: 'Battery Bomb',   blurb: 'An old fizzing battery. Bounces, then pops after 3 seconds. Wind leaves it alone.' },
        shove:   { name: 'Sign Bonk',      blurb: 'A whack with a bent road sign. Up close only. Sends them flying.' },
        dig:     { name: 'Hubcap Spade',   blurb: 'Dig a tunnel in the direction you aim with a hubcap on a stick.' },
        trolley: { name: 'Trolley Charge', blurb: 'Push off a shopping trolley full of junk. It speeds up downhill and crashes into the first Snag it meets.', real: ['1937', 'Shopping trolley'] },
        slug:    { name: 'Sticky Slug',    blurb: 'A mutant slug. It sticks to the first thing it touches, then pops after 3 seconds. Stick it on a Snag for a big boom.', real: ['1930', 'Sticky tape'] },
        tyres:   { name: 'Tyre Wall',      blurb: 'Stack a wall of old tyres in front of you. Shots bounce off it.', real: ['1888', 'Air filled tyre'] },
        springs: { name: 'Spring Boots',   blurb: 'Boing high into the air. A free move: you still get your go.', real: ['1919', 'Pogo stick'] },
        stomp:   { name: 'Robot Stomp',    blurb: 'Superweapon. A giant rusty robot foot stomps down wherever you point.', real: ['1939', 'Elektro the robot'] }
      },
      kit: ['trolley', 'slug', 'springs', 'tyres', 'stomp'],
      stats: { power: 4, precision: 3, tricks: 5 },
      bits: [['Ju', 'Ru', 'Ri', 'Gri', 'Spa', 'Co', 'Bu', 'Ra', 'Ti', 'Scra', 'Flo', 'Ga', 'Ne', 'Hu'],
             ['nko', 'sty', 'vet', 't', 'nner', 'g', 'cket', 'tchet', 'nny', 'pper', 'tsam', 'sket', 'ttle', 'bcap']],
      titles: ['Big', 'Lil', 'Old', 'Chief', 'Boss'],
      voice: { base: 135, wave: 'square', wobble: 14 },
      music: { tempo: 108, root: 174.61, scale: [0, 3, 5, 6, 7, 10], lead: 'sawtooth', drum: 'junk', seed: 61 }
    }
  };

  window.B5MAPS = {
    ruins: {
      id: 'ruins',
      name: 'Ruined City',
      style: 'ruins',
      era: 'scrap',
      year: 2500,
      pal: {
        rub1: [150, 138, 122], rub2: [128, 116, 102], rub3: [108, 98, 86], deep: [76, 68, 60], brick: [168, 92, 70], brickD: [130, 70, 54],
        con1: [176, 172, 160], con2: [154, 150, 140], conD: [120, 116, 108], win: [44, 46, 52], winG: [70, 120, 70],
        rust: [184, 98, 52], rust2: [146, 72, 40], rustL: [214, 138, 80], panel: [52, 84, 140], panelL: [96, 140, 196], dish: [210, 212, 214],
        moss: [104, 150, 70], moss2: [76, 118, 56], rebar: [96, 70, 56],
        rock: [140, 132, 120], rockL: [170, 162, 150],
        tuft: [110, 160, 72], flower: [236, 196, 70], flower2: [230, 120, 150]
      },
      sky: ['#7fa8a8', '#9cbaa8', '#bccaa4', '#d8cc9c', '#e6bc86', '#e09c74'],
      skyGreen: ['#3a5a4a', '#4a6e52', '#5e845a', '#7a9a62', '#a0b06a', '#c8c27a'],
      sun: '#ffe2b0',
      far: '#8a9a98', mid: '#6f8070', near: '#4f5e4a',
      water: '#4a6e5e', waterTop: '#9ac0a8'
    },
    uruk: {
      id: 'uruk',
      name: 'City of Uruk',
      style: 'uruk',
      era: 'sumer',
      year: -3500,
      pal: {
        grass1: [132, 176, 78], grass2: [104, 148, 60], silt1: [156, 124, 88], silt2: [140, 110, 78], deep: [100, 78, 56], speck: [88, 68, 48],
        brick1: [204, 166, 112], brick2: [186, 148, 98], mortar: [146, 112, 74], brickD: [166, 130, 86],
        white: [238, 230, 212], white2: [214, 204, 184], gold: [240, 196, 70], blue: [52, 92, 170],
        reed: [196, 176, 104], reed2: [160, 140, 76], reedD: [112, 96, 50],
        neon: [95, 224, 240], neon2: [255, 120, 190], nstone: [70, 62, 112], nstone2: [58, 52, 96],
        rock: [160, 140, 110], rockL: [196, 176, 140],
        tuft: [118, 168, 70], flower: [236, 200, 90], flower2: [220, 120, 160]
      },
      sky: ['#8cc4e6', '#a4d0e8', '#c0dce4', '#dce4d4', '#f0dcb4', '#f4c890'],
      skyNeon: ['#1d2147', '#2b2c5e', '#46356f', '#71407a', '#a8507a', '#e88a6a'],
      sun: '#fff6d8',
      far: '#c8b48c', farShade: '#b8a07a', mid: '#9cae68', midShade: '#8a9c5a', near: '#5f7f3e', nearTrunk: '#7a5a34',
      water: '#3f8a9a', waterTop: '#a6e0dc', flood: '#7a6a4a', floodTop: '#b8a476'
    },
    castle: {
      id: 'castle',
      name: 'Castle Siege',
      style: 'castle',
      era: 'med',
      year: 1300,
      pal: {
        grass1: [110, 176, 78], grass2: [80, 140, 58], earth1: [128, 92, 60], earth2: [110, 78, 50], deep: [84, 60, 40], speck: [70, 50, 34],
        ston1: [182, 178, 166], ston2: [156, 152, 142], mortar: [112, 108, 100], stonD: [134, 130, 122],
        slate: [74, 82, 104], slate2: [58, 64, 84], wood: [138, 96, 56], wood2: [112, 76, 44], woodD: [72, 48, 28],
        gold: [240, 196, 70], white: [242, 236, 222], neon: [95, 224, 240], neon2: [255, 120, 190], nstone: [70, 62, 112], nstone2: [58, 52, 96],
        rock: [140, 134, 124], rockL: [176, 170, 160],
        tuft: [96, 164, 70], flower: [236, 226, 120], flower2: [214, 70, 70]
      },
      sky: ['#86b4d8', '#9cc2e0', '#b2d0e4', '#c8dce4', '#dee6de', '#ece6d0'],
      skyNeon: ['#1d2147', '#2b2c5e', '#46356f', '#71407a', '#a8507a', '#e88a6a'],
      sun: '#fff6dc',
      far: '#93aab8', mid: '#86a874', midShade: '#749664', near: '#58784c', nearTrunk: '#4a3c2a',
      water: '#4a7a9a', waterTop: '#a8d0e0'
    },
    harbour: {
      id: 'harbour',
      name: 'Pirate Harbour',
      style: 'harbour',
      era: 'pirate',
      year: 1718,
      pal: {
        sand1: [240, 222, 164], sand2: [226, 204, 142], sand3: [210, 186, 124], deep: [150, 122, 82], speck: [130, 106, 72],
        grass1: [96, 184, 92], grass2: [70, 150, 72],
        ston1: [204, 190, 164], ston2: [182, 168, 144], mortar: [128, 116, 98], stonD: [158, 144, 122],
        wood: [142, 96, 58], wood2: [114, 76, 44], woodD: [72, 46, 26],
        gold: [240, 196, 70], white: [242, 236, 222], neon: [95, 224, 240], neon2: [255, 120, 190], nstone: [70, 62, 112], nstone2: [58, 52, 96],
        vine: [70, 140, 60], moss: [96, 168, 72],
        rock: [150, 140, 120], rockL: [190, 180, 160],
        tuft: [90, 170, 80], flower: [255, 120, 140], flower2: [255, 214, 110]
      },
      sky: ['#5fb8e0', '#7cc6e6', '#9ad4e8', '#bfe2e4', '#f0dcb0', '#f6c08a'],
      skyNeon: ['#1d2147', '#2b2c5e', '#46356f', '#71407a', '#a8507a', '#e88a6a'],
      skyGreen: ['#1d3a3a', '#24504a', '#2f6a52', '#4a8a5a', '#7aa860', '#c8c27a'],
      sun: '#fff3c8',
      sea: '#3a9ac0', seaTop: '#a6eef2', far: '#5f9a8a', mid: '#4a8a60', near: '#3a6e48', nearTrunk: '#7a5a34',
      water: '#2a8ab0', waterTop: '#a6eef2'
    },
    wall: {
      id: 'wall',
      name: "Hadrian's Wall",
      style: 'wall',
      era: 'rome',
      year: 122,
      pal: {
        grass1: [118, 172, 84], grass2: [86, 138, 62], earth1: [124, 96, 66], earth2: [108, 82, 56], deep: [84, 64, 46], speck: [70, 52, 38],
        ston1: [196, 188, 170], ston2: [172, 164, 146], mortar: [128, 120, 106], stonD: [150, 142, 126],
        turf1: [104, 132, 70], turf2: [122, 98, 64], gold: [240, 196, 70], white: [242, 236, 222],
        neon: [95, 224, 240], neon2: [255, 120, 190], nstone: [70, 62, 112], nstone2: [58, 52, 96],
        wood: [132, 92, 54], tile: [176, 82, 58],
        rock: [150, 144, 130], rockL: [184, 178, 164],
        tuft: [100, 160, 70], flower: [236, 226, 120], flower2: [214, 140, 200]
      },
      sky: ['#7d9bb8', '#93aec6', '#a9bfcf', '#c0cfd6', '#d6dcd6', '#e6e2d2'],
      skyNeon: ['#1d2147', '#2b2c5e', '#46356f', '#71407a', '#a8507a', '#e88a6a'],
      sun: '#f6f0d8',
      far: '#8fa6a8', mid: '#7e9c76', midShade: '#6c8a64', near: '#55744e', nearTrunk: '#4a3c2a',
      water: '#4a7a9a', waterTop: '#a8d0e0'
    },
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
    { id: 'sumer', name: 'Sumer',       year: -3500, label: 'about 3500 BC, when the first cities and writing began', ready: true },
    { id: 'egypt', name: 'Ancient Egypt', year: -2560, label: 'about 2560 BC, when the Great Pyramid was built', ready: true },
    { id: 'rome',  name: 'Roman Britain', year: 122,  label: 'about AD 122, when Hadrian\'s Wall was begun', ready: true },
    { id: 'viking', name: 'Vikings',     year: 900,   label: 'about AD 900', ready: false },
    { id: 'med',   name: 'Medieval',     year: 1300,  label: 'about AD 1300, the age of castles', ready: true },
    { id: 'pirate', name: 'Pirates',     year: 1718,  label: 'about 1718, the Golden Age of Piracy', ready: true },
    { id: 'ww',    name: 'World Wars',   year: 1930,  label: '1914 to 1945', ready: false },
    { id: 'scrap', name: 'Wasteland',    year: 2500,  label: 'about AD 2500, after the old cities fell', ready: true },
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
        fact: 'People scratched pictures of animals, including a deer, into the cave walls. It is some of the only Ice Age cave art ever found in Britain.',
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
        fact: 'The oldest papyrus ever found is a work diary. A man called Merer wrote about moving stone blocks by boat for the Great Pyramid.' },
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
    wall: [
      { id: 'invite', name: 'Birthday invitation', when: 'about AD 100', where: 'Vindolanda, Northumberland',
        fact: 'Claudia Severa invited her friend Lepidina to her birthday party on this wooden tablet. It is some of the oldest Latin known to be written by a woman.',
        now: 'It is in the British Museum in London, in the Roman Britain gallery.' },
      { id: 'ribhelm', name: 'Ribchester Helmet', when: 'about AD 100', where: 'Ribchester, Lancashire',
        fact: 'A bronze helmet with a face mask, made for showing off at cavalry sports, not for battle. A clogmaker\'s son found it in 1796.',
        now: 'It is in the British Museum in London.' },
      { id: 'wallpan', name: 'Hadrian\'s Wall souvenir pan', when: 'the 2nd century AD', where: 'found in Staffordshire',
        fact: 'A bronze pan with bright enamel. Around the rim are the names of four forts on Hadrian\'s Wall, a bit like a holiday souvenir. Metal detectorists found it in 2003.',
        now: 'It takes turns at the British Museum, Tullie House in Carlisle and the Potteries Museum in Stoke.' },
      { id: 'curse', name: 'Curse tablet', when: 'the 2nd to 4th century AD', where: 'Bath, Somerset',
        fact: 'A lead sheet asking the goddess Sulis Minerva to punish a thief. Nearly all of them are about clothes nicked from the baths. Someone wanted their cloak back.',
        now: 'You can see them at the Roman Baths in Bath.' },
      { id: 'pepperpot', name: 'Empress pepper pot', when: 'buried after AD 408', where: 'Hoxne, Suffolk',
        fact: 'A silver pepper pot shaped like a rich Roman lady. It was part of a hoard of nearly 15,000 coins, found in 1992 by a man helping a farmer look for a lost hammer.',
        now: 'It is in the British Museum in London. The hammer was given to the museum too.' },
      { id: 'shoe', name: 'Roman leather shoe', when: 'about AD 100', where: 'Vindolanda, Northumberland',
        fact: 'Leather usually rots away, but thousands of Roman shoes have survived at Vindolanda because the soil there has hardly any air in it. Some are huge.',
        now: 'You can see them at the Vindolanda museum near Hadrian\'s Wall.' },
      { id: 'coin', name: 'Coin of Hadrian', when: 'about AD 119 onwards', where: 'across Roman Britain',
        fact: 'Hadrian\'s coins were the first to show Britannia, sitting with a spear and shield. She came back on British coins in 1672 and is still on some today.',
        now: 'Museums all over Britain have Roman coins. Check the coins in your pocket for Britannia too.' },
      { id: 'dolphin', name: 'Cupid on a dolphin mosaic', when: 'about AD 100 to 280', where: 'Fishbourne, West Sussex',
        fact: 'A floor picture made of tiny stones, in the biggest Roman house ever found this side of the Alps. Workmen digging a trench for a water pipe found it in 1960.',
        now: 'You can visit Fishbourne Roman Palace, near Chichester.' }
    ],
    uruk: [
      { id: 'cuneiform', name: 'Early clay tablet', when: 'about 3300 to 3000 BC', where: 'Uruk, Iraq',
        fact: 'The oldest writing we know of was pressed into wet clay here at Uruk. It was not stories or letters. It was lists, keeping track of things like barley and cloth.' },
      { id: 'seal', name: 'Cylinder seal', when: 'from about 3500 BC', where: 'Uruk, Iraq',
        fact: 'Roll this little stone tube across wet clay and it leaves a picture, like a signature. Sumerians used it like a password for their stuff.' },
      { id: 'counting', name: 'Counting tablet', when: 'about 3000 BC onwards', where: 'Sumer, Iraq',
        fact: 'Sumerians counted in 60s. Later astronomers kept using 60s, which is why an hour has 60 minutes and a circle has 360 degrees, the same degrees you aim with in this game.' },
      { id: 'warka', name: 'Warka Vase', when: 'about 3000 BC', where: 'Uruk, Iraq',
        fact: 'One of the oldest carvings that tells a story: sheep, reeds and people carrying food to a temple. It was stolen in 2003, handed back in pieces, and mended.',
        now: 'It is in the Iraq Museum in Baghdad.' },
      { id: 'standard', name: 'Standard of Ur', when: 'about 2550 BC', where: 'Ur, Iraq',
        fact: 'A box covered in shell and blue stone pictures. One side is a battle, the other a feast. Nobody knows what it was for.',
        now: 'It is in the British Museum in London.' },
      { id: 'gameur', name: 'Royal Game of Ur', when: 'about 2600 to 2400 BC', where: 'Ur, Iraq',
        fact: 'One of the oldest board games in the world. A British Museum expert worked out the rules in the 1980s, from a clay tablet written much later, in 177 BC.',
        now: 'One of the boards is in the British Museum in London.' },
      { id: 'ram', name: 'Ram in a Thicket', when: 'about 2600 BC', where: 'Ur, Iraq',
        fact: 'A goat standing on its back legs to reach a tree, made of gold, silver, shell and blue lapis lazuli. Two were found together in the royal graves at Ur.',
        now: 'One is in the British Museum in London, the other in the Penn Museum in Philadelphia.' },
      { id: 'floodtab', name: 'Flood tablet', when: 'written in the 600s BC', where: 'Nineveh, Iraq',
        fact: 'Part of the Epic of Gilgamesh, one of the oldest stories in the world, which began with the Sumerians. When George Smith read it in 1872, he got so excited he ran round the room and started taking his clothes off.',
        now: 'It is in the British Museum in London.' }
    ],
    urukGlitches: [
      { id: 'bike', name: 'Bicycle', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Sumerians were among the first people to use wheels, but nobody built a bicycle until the 1800s.' },
      { id: 'biro', name: 'Ballpoint pen', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Sumerians wrote by pressing a cut reed into wet clay. Ballpoint pens came along in the 1930s.' },
      { id: 'dclock', name: 'Digital clock', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Counting in 60s started here, but clocks with glowing numbers are about 5,000 years away.' },
      { id: 'watercan', name: 'Plastic watering can', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Farmers here watered their fields with canals dug from the rivers. Plastic was not invented until 1907.' }
    ],
    castle: [
      { id: 'chessman', name: 'Lewis chessman', when: 'about 1150 to 1200', where: 'Isle of Lewis, Scotland',
        fact: 'Carved from walrus ivory, probably in Norway. More than 90 game pieces were found together in 1831. Four of the castle pieces are warriors biting the tops of their shields.',
        now: 'Most are in the British Museum in London, and 11 are in the National Museum of Scotland in Edinburgh.' },
      { id: 'tapestry', name: 'Bayeux Tapestry', when: 'made about 1070 to 1077', where: 'Bayeux, Normandy, France',
        fact: 'Not really a tapestry: it is embroidered, and about 70 metres long. It tells the story of 1066 with over 600 people, and only three of them are women.',
        now: 'In 2026 it came to the British Museum in London, its first visit to Britain in over 900 years.' },
      { id: 'mappa', name: 'Hereford Mappa Mundi', when: 'about 1300', where: 'Hereford, England',
        fact: 'The biggest map from the Middle Ages still around, drawn on a single sheet of calfskin. East is at the top, Jerusalem is in the middle, and it is full of monsters and strange creatures.',
        now: 'You can see it at Hereford Cathedral.' },
      { id: 'badge', name: 'Pilgrim badge', when: 'the 1300s', where: 'Canterbury, Kent',
        fact: 'Pilgrims bought cheap tin badges at holy places, like souvenirs. The medieval version of a keyring from the gift shop.' },
      { id: 'psalter', name: 'Luttrell Psalter', when: 'about 1325 to 1340', where: 'Lincolnshire, England',
        fact: 'A book of psalms made for Sir Geoffrey Luttrell. Its edges are packed with pictures of everyday life, like farm work, cooking and music, plus some very odd creatures.',
        now: 'It is kept at the British Library in London.' },
      { id: 'magna', name: 'Magna Carta', when: '1215', where: 'Runnymede, Surrey',
        fact: 'King John hated it. This charter said even the king had to follow the rules. Four copies from 1215 survive.',
        now: 'Two are at the British Library in London, one is at Lincoln and one is at Salisbury Cathedral.' },
      { id: 'skate', name: 'Bone ice skate', when: 'about the 1100s', where: 'London',
        fact: 'Made from the shin bone of a horse or a cow, tied on with leather straps. A writer called William FitzStephen described young Londoners skating on the ice and pushing themselves along with poles.',
        now: 'There are bone skates at the London Museum.' },
      { id: 'domesday', name: 'Domesday Book', when: '1086', where: 'England',
        fact: 'William the Conqueror sent people all over England to count who owned what, right down to the pigs. Yes, even the pigs got counted.',
        now: 'It is kept at The National Archives in Kew, London.' }
    ],
    castleGlitches: [
      { id: 'skateboard', name: 'Skateboard', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Skateboards were first made in California, around the 1950s. Bone skates were the nearest thing around here.' },
      { id: 'guitar', name: 'Electric guitar', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Electric guitars were invented in the 1930s. Nobody here has even heard of electricity.' },
      { id: 'beans', name: 'Tin of baked beans', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'These beans only reached Europe from the Americas in the 1500s, and food in tins was not invented until the early 1800s.' },
      { id: 'plasticsword', name: 'Plastic sword', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'The first fully man made plastic was invented in 1907. Every sword in this castle is real metal.' }
    ],
    harbour: [
      { id: 'eight', name: 'Piece of eight', when: 'the 1500s to the 1800s', where: 'Spanish mints in the Americas',
        fact: 'A big silver coin worth eight reales, used all around the world. People chopped them into pieces to make change. One eighth was called a bit.' },
      { id: 'qarcannon', name: 'Cannon from Queen Anne\'s Revenge', when: '1718', where: 'Beaufort Inlet, North Carolina, USA',
        fact: 'Blackbeard\'s ship ran aground in 1718. Divers found the wreck in 1996 and have raised more than 20 cannons, piles of lead shot and even a hand grenade.' },
      { id: 'arabcoin', name: 'Henry Every\'s silver coin', when: 'made in 1693', where: 'Rhode Island, USA',
        fact: 'In 1695 the pirate Henry Every robbed a huge treasure ship and vanished. His stolen coins keep popping up in fields in the USA.' },
      { id: 'articles', name: 'Pirate rules', when: 'about 1720', where: 'from a book printed in 1724',
        fact: 'Pirate crews wrote down rules called articles. Bartholomew Roberts\'s crew voted on big decisions, put the lights out at 8 at night, and paid extra to anyone badly hurt in a fight.' },
      { id: 'backstaff', name: 'Backstaff', when: 'invented in 1594', where: 'ships at sea',
        fact: 'Invented by the English sailor John Davis. You stood with your back to the sun and lined up its shadow to measure how high it was, then worked out how far north or south you were.' },
      { id: 'prwatch', name: 'Port Royal pocket watch', when: 'stopped on 7 June 1692', where: 'Port Royal, Jamaica',
        fact: 'An earthquake sank this pirate town into the sea. Divers found a watch stopped at 11:43, the moment it struck.' },
      { id: 'biscuit', name: 'Ship\'s biscuit', when: 'the 1600s and 1700s', where: 'ships everywhere',
        fact: 'A rock hard biscuit made of flour and water that lasted for months at sea. Sailors often found little beetles called weevils living inside.' },
      { id: 'flag', name: 'Pirate flag', when: 'the early 1700s', where: 'pirate ships',
        fact: 'Pirates flew black flags to scare other ships into giving up without a fight. Each crew had its own design, with skulls, bones or swords.' }
    ],
    harbourGlitches: [
      { id: 'satnav', name: 'Satnav', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Pirates found their way with the sun, the stars, a compass and charts. The first satellite did not go up until 1957.' },
      { id: 'ring', name: 'Rubber ring', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Handy if you fall overboard, but blow up rubber rings like this were not made until long after the pirates.' },
      { id: 'can', name: 'Fizzy drink can', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Drinks in metal cans only arrived in the 1900s. This one is still fizzing.' },
      { id: 'suncream', name: 'Sun cream', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Very handy in the Caribbean sun, but nobody sold sun cream until the 1900s.' }
    ],
    wallGlitches: [
      { id: 'pizza', name: 'Slice of pizza', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'No Roman ever had a margherita. Tomatoes only reached Europe from the Americas in the 1500s.' },
      { id: 'footy', name: 'Football shirt', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'The rules of modern football were written down in England in 1863. This shirt is about 1,700 years early.' },
      { id: 'calc', name: 'Pocket calculator', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Romans did sums with an abacus. Roman numerals do not even have a zero.' },
      { id: 'watch', name: 'Wristwatch', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Romans told the time with sundials and water clocks. Nobody wore one on their wrist.' }
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
        fact: 'Little card tickets were invented in the 1830s and used for about 150 years. Lose it and the inspector was not amused.' },
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
    ruins: [
      { id: 'barcode', name: 'Barcode', when: 'from 1974', where: 'Shops everywhere',
        fact: 'The first thing ever scanned with a barcode at a shop till was a packet of chewing gum, in 1974. Future Snags think the stripes are a secret code.' },
      { id: 'solar', name: 'Solar panel', when: 'from 1954', where: 'Roofs everywhere',
        fact: 'The first really useful solar cell was made in 1954. Sunlight goes in, electricity comes out. This one still works.' },
      { id: 'trafficlight', name: 'Traffic light', when: '1868', where: 'London',
        fact: 'The first one stood outside Parliament in 1868 and was lit by gas. A few weeks later it blew up.' },
      { id: 'headphones', name: 'Headphones', when: 'from 1910', where: 'A kitchen table, then everywhere',
        fact: 'Some of the first good headphones were made in 1910 by Nathaniel Baldwin, at his kitchen table.' },
      { id: 'bottle', name: 'Plastic bottle', when: 'from the 1970s', where: 'Bins everywhere',
        fact: 'Plastic drinks bottles became common in the 1970s. They take hundreds of years to break down, so the Scrap Snags keep finding them.' },
      { id: 'shoptrolley', name: 'Shopping trolley', when: '1937', where: 'Oklahoma, USA',
        fact: 'Sylvan Goldman invented it in 1937 by putting wheels and two baskets on a folding chair.' },
      { id: 'bike', name: 'First bike', when: '1817', where: 'Germany',
        fact: 'The first bike had no pedals. You pushed it along with your feet, like a scooter.' },
      { id: 'skateboard', name: 'Skateboard', when: 'from the 1950s', where: 'California, USA',
        fact: 'Surfers put wheels on planks so they could surf the streets when the sea was flat.' }
    ],
    ruinsGlitches: [
      { id: 'fridgeart', name: 'Cave painting on a fridge', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Somebody painted a mammoth on this fridge door with ochre, the red earth paint from Ice Age caves. The fridge is not impressed.' },
      { id: 'shipwheel', name: "Ship's wheel", glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Sailing ships started using wheels to steer in the early 1700s. This one is a long way from the sea.' },
      { id: 'scroll', name: 'Papyrus scroll', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Ancient Egyptians made paper from papyrus reeds over 5,000 years ago. This one is a shopping list: bread, onions, more bread.' },
      { id: 'laurel', name: 'Laurel wreath', glitch: true, when: 'out of time', where: 'should not be here',
        fact: 'Romans crowned winners with laurel leaves. Somebody won something in the year 2500.' }
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
    ruins: {
      pre: {
        look: 'overgrown',
        title: 'The Stone Snags won at the Pirate Harbour',
        text: 'So the Stone Age never ended. Plants have swallowed the Ruined City. Stone Snags carry an extra boulder. Scrap Snags have one less trolley.',
        postcard: 'Because the Stone Snags won in 1718, plants swallowed the Ruined City.',
        short: 'a city swallowed by plants',
        ammo: { pre: { boulder: 1 }, scrap: { trolley: -1 } }
      },
      egypt: {
        look: 'sandy',
        title: 'The Sun Snags won at the Pirate Harbour',
        text: 'So Egypt ruled the world. Sand has buried the Ruined City up to the windows. Sun Snags carry an extra scarab. Scrap Snags have one less slug.',
        postcard: 'Because the Sun Snags won in 1718, sand buried the Ruined City.',
        short: 'a city buried in sand',
        ammo: { egypt: { scarab: 1 }, scrap: { slug: -1 } }
      },
      fut: {
        look: 'gleaming',
        title: 'The Neon Snags won at the Pirate Harbour',
        text: 'So the future came early and somebody tidied up. The Ruined City is half rebuilt and shiny. Neon Snags carry an extra disc. Scrap Snags have one less trolley.',
        postcard: 'Because the Neon Snags won in 1718, the Ruined City got tidied up.',
        short: 'a half rebuilt, shiny city',
        ammo: { fut: { disc: 1 }, scrap: { trolley: -1 } }
      },
      rome: {
        look: 'gleaming',
        title: 'The Eagle Snags won at the Pirate Harbour',
        text: 'So Rome never fell. Roman builders patched the ruins with marble. Eagle Snags carry an extra pilum. Scrap Snags have one less tyre wall.',
        postcard: 'Because the Eagle Snags won in 1718, Romans patched the ruins with marble.',
        short: 'ruins patched with marble',
        ammo: { rome: { pilum: 1 }, scrap: { tyres: -1 } }
      },
      med: {
        look: 'normal',
        title: 'The Crown Snags won at the Pirate Harbour',
        text: 'So knights took over the wasteland. Crown Snags carry an extra volley. Scrap Snags have one less slug.',
        postcard: 'Because the Crown Snags won in 1718, knights guard the Ruined City.',
        short: 'knights in the ruins',
        ammo: { med: { volley: 1 }, scrap: { slug: -1 } }
      },
      pirate: {
        look: 'normal',
        title: 'The Anchor Snags won at the Pirate Harbour',
        text: 'So pirates sailed into the future. Anchor Snags carry an extra cannonball. Scrap Snags have one less trolley.',
        postcard: 'Because the Anchor Snags won in 1718, pirates raid the Ruined City.',
        short: 'pirates raiding the ruins',
        ammo: { pirate: { cannon: 1 }, scrap: { trolley: -1 } }
      },
      sumer: {
        look: 'normal',
        title: 'The Wedge Snags won at the Pirate Harbour',
        text: 'So clay tablets outlasted everything. Wedge Snags carry an extra war cart. Scrap Snags have one less tyre wall.',
        postcard: 'Because the Wedge Snags won in 1718, clay tablets outlasted everything.',
        short: 'ruins full of clay tablets',
        ammo: { sumer: { cart: 1 }, scrap: { tyres: -1 } }
      },
      scrap: {
        look: 'normal',
        title: 'The Scrap Snags won at the Pirate Harbour',
        text: 'So the Scrap Snags got here early and started collecting. Scrap Snags carry an extra trolley. Anchor Snags have one less cannonball.',
        postcard: 'Because the Scrap Snags won in 1718, the junk tribes rule the ruins.',
        short: 'junk tribes ruling the ruins',
        ammo: { scrap: { trolley: 1 }, pirate: { cannon: -1 } }
      }
    },
    uruk: {
      pre: {
        look: 'rough',
        title: 'The Stone Snags won in the Prehistoric Jungle',
        text: 'So people kept hunting instead of farming, and never quite settled down. Uruk is only half built: a low mound of mud bricks and reed huts. Stone Snags carry an extra boulder. Wedge Snags have one less war cart.',
        postcard: 'Because the Stone Snags won back in 10,000 BC, Uruk is only half built.',
        short: 'a half built Uruk',
        ammo: { pre: { boulder: 1 }, sumer: { cart: -1 } }
      },
      egypt: {
        look: 'golden',
        title: 'The Sun Snags won in the Prehistoric Jungle',
        text: 'So Egypt got going thousands of years early, and its builders came to Uruk. The temple is white and gold. Sun Snags carry an extra spear.',
        postcard: 'Because the Sun Snags won back in 10,000 BC, the temple at Uruk shines white and gold.',
        short: 'a golden Uruk',
        ammo: { egypt: { spear: 1 } }
      },
      fut: {
        look: 'neon',
        title: 'The Neon Snags won in the Prehistoric Jungle',
        text: 'So the future arrived thousands of years early. Uruk glows with neon lights. Neon Snags bring an extra disc. Wedge Snags have one less clay tablet.',
        postcard: 'Because the Neon Snags won back in 10,000 BC, Uruk glows with neon lights.',
        short: 'a neon Uruk',
        ammo: { fut: { disc: 1 }, sumer: { tablet: -1 } }
      },
      rome: {
        look: 'normal',
        title: 'The Eagle Snags won in the Prehistoric Jungle',
        text: 'So Rome rose thousands of years early. Eagle Snags march in with an extra pilum. Wedge Snags have one less war cart.',
        postcard: 'Because the Eagle Snags won back in 10,000 BC, Rome rose thousands of years early.',
        short: 'Rome rising early',
        ammo: { rome: { pilum: 1 }, sumer: { cart: -1 } }
      },
      med: {
        look: 'normal',
        title: 'The Crown Snags won in the Prehistoric Jungle',
        text: 'So knights turned up thousands of years early. Crown Snags carry an extra volley. Wedge Snags have one less clay tablet.',
        postcard: 'Because the Crown Snags won back in 10,000 BC, knights turned up thousands of years early.',
        short: 'knights by the river',
        ammo: { med: { volley: 1 }, sumer: { tablet: -1 } }
      },
      pirate: {
        look: 'normal',
        title: 'The Anchor Snags won in the Prehistoric Jungle',
        text: 'So pirates sailed up the river Euphrates thousands of years early. Anchor Snags carry an extra cannonball. Wedge Snags have one less war cart.',
        postcard: 'Because the Anchor Snags won back in 10,000 BC, pirates sailed up the Euphrates.',
        short: 'pirates on the Euphrates',
        ammo: { pirate: { cannon: 1 }, sumer: { cart: -1 } }
      },
      sumer: {
        look: 'normal',
        title: 'The Wedge Snags won in the Prehistoric Jungle',
        text: 'So the first cities started even earlier. Wedge Snags carry an extra war cart.',
        postcard: 'Because the Wedge Snags won back in 10,000 BC, the first cities started even earlier.',
        short: 'cities starting early',
        ammo: { sumer: { cart: 1 } }
      },
      scrap: {
        look: 'rough',
        title: 'The Scrap Snags won in the Prehistoric Jungle',
        text: 'So junk from the future fell into the first cities. Uruk is patched with tyres and tin. Scrap Snags carry an extra trolley. Wedge Snags have one less war cart.',
        postcard: 'Because the Scrap Snags won in 10,000 BC, Uruk is patched with junk.',
        short: 'an Uruk patched with junk',
        ammo: { scrap: { trolley: 1 }, sumer: { cart: -1 } }
      }
    },
    desert: {
      pre: {
        look: 'rough',
        title: 'The Stone Snags won at Uruk',
        text: 'So Stone Age ways won out. The pyramids are rough and half finished, and giant boulders lie all over the desert. Stone Snags carry an extra boulder. Sun Snags have one less spear.',
        postcard: 'Because the Stone Snags won in 3500 BC, the pyramids are rough and covered in boulders.',
        short: 'rough pyramids with boulders everywhere',
        ammo: { pre: { boulder: 1 }, egypt: { spear: -1 } }
      },
      fut: {
        look: 'neon',
        title: 'The Neon Snags won at Uruk',
        text: 'So the future arrived thousands of years early. The pyramids glow with neon lights under a purple sky. Neon Snags bring an extra Ricochet Disc. Stone Snags have one less boulder.',
        postcard: 'Because the Neon Snags won in 3500 BC, the pyramids glow with neon lights.',
        short: 'neon pyramids',
        ammo: { fut: { disc: 1 }, pre: { boulder: -1 } }
      },
      egypt: {
        look: 'golden',
        title: 'The Sun Snags won at Uruk',
        text: 'So Egypt got a head start. The pyramids were finished early, with smooth white sides and shining gold tips. Sun Snags carry an extra spear.',
        postcard: 'Because the Sun Snags won in 3500 BC, the pyramids shine with gold tips.',
        short: 'golden pyramids',
        ammo: { egypt: { spear: 1 } }
      },
      rome: {
        look: 'normal',
        title: 'The Eagle Snags won at Uruk',
        text: 'So Rome got a head start of thousands of years. Eagle Snags march in with an extra pilum. Sun Snags have one less spear.',
        postcard: 'Because the Eagle Snags won in 3500 BC, Rome rose thousands of years early.',
        short: 'Rome rising early',
        ammo: { rome: { pilum: 1 }, egypt: { spear: -1 } }
      },
      med: {
        look: 'normal',
        title: 'The Crown Snags won at Uruk',
        text: 'So knights turned up thousands of years early. Crown Snags carry an extra Longbow Volley. Sun Snags have one less spear.',
        postcard: 'Because the Crown Snags won in 3500 BC, knights turned up thousands of years early.',
        short: 'knights in the desert',
        ammo: { med: { volley: 1 }, egypt: { spear: -1 } }
      },
      pirate: {
        look: 'normal',
        title: 'The Anchor Snags won at Uruk',
        text: 'So pirates sailed the Nile thousands of years early. Anchor Snags carry an extra cannonball. Sun Snags have one less spear.',
        postcard: 'Because the Anchor Snags won in 3500 BC, pirates sailed the Nile.',
        short: 'pirates on the Nile',
        ammo: { pirate: { cannon: 1 }, egypt: { spear: -1 } }
      },
      sumer: {
        look: 'normal',
        title: 'The Wedge Snags won at Uruk',
        text: 'So Sumer grew into an empire before the pyramids were even finished. Wedge Snags carry an extra clay tablet. Sun Snags have one less spear.',
        postcard: 'Because the Wedge Snags won in 3500 BC, Sumer grew into an empire before the pyramids.',
        short: 'an early Sumerian empire',
        ammo: { sumer: { tablet: 1 }, egypt: { spear: -1 } }
      },
      scrap: {
        look: 'rough',
        title: 'The Scrap Snags won at Uruk',
        text: 'So the pyramids were built with spare parts. Scrap Snags carry an extra slug. Sun Snags have one less spear.',
        postcard: 'Because the Scrap Snags won in 3500 BC, the pyramids have hubcaps.',
        short: 'pyramids with hubcaps',
        ammo: { scrap: { slug: 1 }, egypt: { spear: -1 } }
      }
    },
    wall: {
      pre: {
        look: 'turf',
        title: 'The Stone Snags won in the Pyramid Desert',
        text: 'So nobody learned to build in stone. Hadrian\'s Wall is just a bank of earth and turf, like the first western stretch of the real wall. Stone Snags carry an extra boulder. Eagle Snags have one less ballista bolt.',
        postcard: 'Because the Stone Snags won in 2560 BC, Hadrian\'s Wall is only made of earth and turf.',
        short: 'a wall of earth and turf',
        ammo: { pre: { boulder: 1 }, rome: { ballista: -1 } }
      },
      egypt: {
        look: 'golden',
        title: 'The Sun Snags won in the Pyramid Desert',
        text: 'So Egyptian builders taught the world. Hadrian\'s Wall is smooth white stone with gold on top. Sun Snags carry an extra Scarab Beetle.',
        postcard: 'Because the Sun Snags won in 2560 BC, Hadrian\'s Wall shines white and gold.',
        short: 'a white and gold Hadrian\'s Wall',
        ammo: { egypt: { scarab: 1 } }
      },
      fut: {
        look: 'neon',
        title: 'The Neon Snags won in the Pyramid Desert',
        text: 'So the future came early. Hadrian\'s Wall glows with neon lights under a purple night sky. Neon Snags bring an extra disc. Eagle Snags have one less pilum.',
        postcard: 'Because the Neon Snags won in 2560 BC, Hadrian\'s Wall glows with neon lights.',
        short: 'a neon Hadrian\'s Wall',
        ammo: { fut: { disc: 1 }, rome: { pilum: -1 } }
      },
      rome: {
        look: 'normal',
        title: 'The Eagle Snags won in the Pyramid Desert',
        text: 'So Rome grew stronger than ever. Eagle Snags arrive at the Wall with an extra pilum.',
        postcard: 'Because the Eagle Snags won in 2560 BC, Rome grew stronger than ever.',
        short: 'a stronger Rome',
        ammo: { rome: { pilum: 1 } }
      },
      med: {
        look: 'normal',
        title: 'The Crown Snags won in the Pyramid Desert',
        text: 'So castles came early. Crown Snags arrive at the Wall with an extra Boiling Oil. Eagle Snags have one less pilum.',
        postcard: 'Because the Crown Snags won in 2560 BC, castles came early.',
        short: 'castles coming early',
        ammo: { med: { oil: 1 }, rome: { pilum: -1 } }
      },
      pirate: {
        look: 'normal',
        title: 'The Anchor Snags won in the Pyramid Desert',
        text: 'So pirates ruled the seas around Britain. Anchor Snags carry an extra Powder Keg. Eagle Snags have one less ballista bolt.',
        postcard: 'Because the Anchor Snags won in 2560 BC, pirates ruled the seas around Britain.',
        short: 'pirate seas around Britain',
        ammo: { pirate: { keg: 1 }, rome: { ballista: -1 } }
      },
      sumer: {
        look: 'normal',
        title: 'The Wedge Snags won in the Pyramid Desert',
        text: 'So the Sumerians taught the world to build in mud brick. Wedge Snags carry an extra war cart. Eagle Snags have one less pilum.',
        postcard: 'Because the Wedge Snags won in 2560 BC, the world learned to build in mud brick.',
        short: 'a world of mud brick',
        ammo: { sumer: { cart: 1 }, rome: { pilum: -1 } }
      },
      scrap: {
        look: 'turf',
        title: 'The Scrap Snags won in the Pyramid Desert',
        text: 'So Hadrian\'s Wall was finished with old tyres. Scrap Snags carry an extra tyre wall. Eagle Snags have one less pilum.',
        postcard: 'Because the Scrap Snags won in 2560 BC, Hadrian\'s Wall is made of tyres.',
        short: 'a wall of tyres',
        ammo: { scrap: { tyres: 1 }, rome: { pilum: -1 } }
      }
    },
    castle: {
      pre: {
        look: 'rough',
        title: 'The Stone Snags won at Hadrian\'s Wall',
        text: 'So nobody kept building in stone. The castle is a wooden fort on a mound of earth, like the first castles the Normans built after 1066. Stone Snags carry an extra boulder. Crown Snags have one less volley.',
        postcard: 'Because the Stone Snags won in AD 122, the castle is made of wood.',
        short: 'a wooden castle',
        ammo: { pre: { boulder: 1 }, med: { volley: -1 } }
      },
      egypt: {
        look: 'golden',
        title: 'The Sun Snags won at Hadrian\'s Wall',
        text: 'So Egyptian builders taught the world. The castle is smooth white stone with gold on the towers. Sun Snags carry an extra Scarab Beetle.',
        postcard: 'Because the Sun Snags won in AD 122, the castle shines white and gold.',
        short: 'a white and gold castle',
        ammo: { egypt: { scarab: 1 } }
      },
      fut: {
        look: 'neon',
        title: 'The Neon Snags won at Hadrian\'s Wall',
        text: 'So the future came early. The castle glows with neon lights under a purple night sky. Neon Snags bring an extra disc. Crown Snags have one less volley.',
        postcard: 'Because the Neon Snags won in AD 122, the castle glows with neon lights.',
        short: 'a neon castle',
        ammo: { fut: { disc: 1 }, med: { volley: -1 } }
      },
      rome: {
        look: 'normal',
        title: 'The Eagle Snags won at Hadrian\'s Wall',
        text: 'So the Romans never left Britain. The real Romans left around AD 410. Eagle Snags march in with an extra pilum. Crown Snags have one less Boiling Oil.',
        postcard: 'Because the Eagle Snags won in AD 122, the Romans never left Britain.',
        short: 'Romans who never left',
        ammo: { rome: { pilum: 1 }, med: { oil: -1 } }
      },
      med: {
        look: 'normal',
        title: 'The Crown Snags won at Hadrian\'s Wall',
        text: 'So knights took over early. Crown Snags carry an extra Boiling Oil.',
        postcard: 'Because the Crown Snags won in AD 122, knights took over early.',
        short: 'knights taking over early',
        ammo: { med: { oil: 1 } }
      },
      pirate: {
        look: 'normal',
        title: 'The Anchor Snags won at Hadrian\'s Wall',
        text: 'So pirates sailed up every river in Britain. Anchor Snags carry an extra Powder Keg. Crown Snags have one less volley.',
        postcard: 'Because the Anchor Snags won in AD 122, pirates sailed up every river.',
        short: 'pirates up every river',
        ammo: { pirate: { keg: 1 }, med: { volley: -1 } }
      },
      sumer: {
        look: 'normal',
        title: 'The Wedge Snags won at Hadrian\'s Wall',
        text: 'So mud brick builders spread all the way to Britain. Wedge Snags carry extra Mud Brick Steps. Crown Snags have one less volley.',
        postcard: 'Because the Wedge Snags won in AD 122, mud brick builders reached Britain.',
        short: 'mud brick in Britain',
        ammo: { sumer: { steps: 1 }, med: { volley: -1 } }
      },
      scrap: {
        look: 'rough',
        title: 'The Scrap Snags won at Hadrian\'s Wall',
        text: 'So the castle was held together with string. Scrap Snags carry an extra trolley. Crown Snags have one less volley.',
        postcard: 'Because the Scrap Snags won in AD 122, the castle is held together with string.',
        short: 'a castle held together with string',
        ammo: { scrap: { trolley: 1 }, med: { volley: -1 } }
      }
    },
    harbour: {
      pre: {
        look: 'overgrown',
        title: 'The Stone Snags won the Castle Siege',
        text: 'So the wild took over. The harbour is a jungle island, with vines over the fort and the wreck. Stone Snags carry an extra boulder. Anchor Snags have one less cannonball.',
        postcard: 'Because the Stone Snags won in AD 1300, the harbour is a jungle island.',
        short: 'a jungle harbour',
        ammo: { pre: { boulder: 1 }, pirate: { cannon: -1 } }
      },
      egypt: {
        look: 'golden',
        title: 'The Sun Snags won the Castle Siege',
        text: 'So Egypt never stopped building. The harbour fort is white stone with gold on top. Sun Snags carry an extra Scarab Beetle. Anchor Snags have one less Powder Keg.',
        postcard: 'Because the Sun Snags won in AD 1300, the harbour fort shines white and gold.',
        short: 'a golden harbour fort',
        ammo: { egypt: { scarab: 1 }, pirate: { keg: -1 } }
      },
      fut: {
        look: 'neon',
        title: 'The Neon Snags won the Castle Siege',
        text: 'So the future arrived early. The harbour glows with neon lights. Neon Snags bring an extra disc. Anchor Snags have one less cannonball.',
        postcard: 'Because the Neon Snags won in AD 1300, the harbour glows with neon lights.',
        short: 'a neon harbour',
        ammo: { fut: { disc: 1 }, pirate: { cannon: -1 } }
      },
      rome: {
        look: 'normal',
        title: 'The Eagle Snags won the Castle Siege',
        text: 'So the Roman Empire spread across the oceans. Eagle Snags carry an extra ballista bolt. Anchor Snags have one less cannonball.',
        postcard: 'Because the Eagle Snags won in AD 1300, the Roman Empire spread across the oceans.',
        short: 'a Roman ocean',
        ammo: { rome: { ballista: 1 }, pirate: { cannon: -1 } }
      },
      med: {
        look: 'normal',
        title: 'The Crown Snags won the Castle Siege',
        text: 'So knights ruled the waves. Crown Snags carry an extra volley. Anchor Snags have one less Blunderbuss.',
        postcard: 'Because the Crown Snags won in AD 1300, knights ruled the waves.',
        short: 'knights ruling the waves',
        ammo: { med: { volley: 1 }, pirate: { blunder: -1 } }
      },
      pirate: {
        look: 'normal',
        title: 'The Anchor Snags won the Castle Siege',
        text: 'So the pirates got going early. Anchor Snags carry an extra Powder Keg.',
        postcard: 'Because the Anchor Snags won in AD 1300, the pirates got going early.',
        short: 'pirates starting early',
        ammo: { pirate: { keg: 1 } }
      },
      sumer: {
        look: 'normal',
        title: 'The Wedge Snags won the Castle Siege',
        text: 'So the Sumerians sailed reed boats across the oceans. Wedge Snags carry an extra clay tablet. Anchor Snags have one less cannonball.',
        postcard: 'Because the Wedge Snags won in AD 1300, reed boats crossed the oceans.',
        short: 'reed boats on every ocean',
        ammo: { sumer: { tablet: 1 }, pirate: { cannon: -1 } }
      },
      scrap: {
        look: 'overgrown',
        title: 'The Scrap Snags won the Castle Siege',
        text: 'So the harbour filled up with junk boats. Scrap Snags carry an extra slug. Anchor Snags have one less cannonball.',
        postcard: 'Because the Scrap Snags won in 1300, the harbour is full of junk boats.',
        short: 'a harbour of junk boats',
        ammo: { scrap: { slug: 1 }, pirate: { cannon: -1 } }
      }
    },
    city: {
      pre: {
        look: 'overgrown',
        title: 'The Stone Snags won in the Ruined City',
        text: 'So history went wild. Vines cover the towers, the sky has gone green, and the factories never quite worked. Neon Snags start with one less disc and laser. Stone Snags carry an extra boulder.',
        postcard: 'Because the Stone Snags won in 2500, the Future City is covered in vines.',
        short: 'a Future City covered in vines',
        ammo: { fut: { disc: -1, laser: -1 }, pre: { boulder: 1 } }
      },
      fut: {
        look: 'gleaming',
        title: 'The Neon Snags won in the Ruined City',
        text: 'So the future arrived early. The Future City gleams brighter than ever. Neon Snags bring an extra Ricochet Disc, and everyone else has one less of their best kit.',
        postcard: 'Because the Neon Snags won in 2500, the Future City gleams brighter than ever.',
        short: 'a gleaming Future City',
        ammo: { fut: { disc: 1 }, pre: { boulder: -1 }, egypt: { spear: -1 }, rome: { pilum: -1 }, med: { volley: -1 }, pirate: { cannon: -1 }, sumer: { cart: -1 }, scrap: { trolley: -1 } }
      },
      egypt: {
        look: 'sandy',
        title: 'The Sun Snags won in the Ruined City',
        text: 'So Ancient Egypt never ended. The Future City is built like a giant temple, with sandstone towers, gold edges and pyramids on the skyline. Sun Snags carry an extra Scarab Beetle. Neon Snags have one less disc.',
        postcard: 'Because the Sun Snags won in 2500, the Future City is built like a giant temple.',
        short: 'a Future City built like a temple',
        ammo: { egypt: { scarab: 1 }, fut: { disc: -1 } }
      },
      rome: {
        look: 'gleaming',
        title: 'The Eagle Snags won in the Ruined City',
        text: 'So the Roman Empire never fell. The Future City gleams like polished marble. Eagle Snags carry an extra ballista bolt. Neon Snags have one less laser.',
        postcard: 'Because the Eagle Snags won in 2500, the Roman Empire never fell.',
        short: 'an empire that never fell',
        ammo: { rome: { ballista: 1 }, fut: { laser: -1 } }
      },
      med: {
        look: 'normal',
        title: 'The Crown Snags won in the Ruined City',
        text: 'So kings and queens ruled the future. Crown Snags carry an extra volley. Neon Snags have one less disc.',
        postcard: 'Because the Crown Snags won in 2500, knights guard the Future City.',
        short: 'knights in the Future City',
        ammo: { med: { volley: 1 }, fut: { disc: -1 } }
      },
      pirate: {
        look: 'normal',
        title: 'The Anchor Snags won in the Ruined City',
        text: 'So pirates took over the future. Anchor Snags carry an extra cannonball. Neon Snags have one less laser.',
        postcard: 'Because the Anchor Snags won in 2500, pirates run the Future City.',
        short: 'a pirate Future City',
        ammo: { pirate: { cannon: 1 }, fut: { laser: -1 } }
      },
      sumer: {
        look: 'normal',
        title: 'The Wedge Snags won in the Ruined City',
        text: 'So writing on clay never went away. Wedge Snags carry an extra war cart. Neon Snags have one less disc.',
        postcard: 'Because the Wedge Snags won in 2500, the Future City still writes on clay.',
        short: 'a Future City that writes on clay',
        ammo: { sumer: { cart: 1 }, fut: { disc: -1 } }
      },
      scrap: {
        look: 'overgrown',
        title: 'The Scrap Snags won in the Ruined City',
        text: 'So nobody ever cleaned up. The Future City is held together with string and tyres. Scrap Snags carry an extra trolley. Neon Snags have one less laser.',
        postcard: 'Because the Scrap Snags won in 2500, the Future City is held together with string.',
        short: 'a Future City held together with string',
        ammo: { scrap: { trolley: 1 }, fut: { laser: -1 } }
      }
    }
  };

  /* Jay on commentary. Each kind picks one line at random. */
  window.B5JAY = {
    big: ['Outrageous!', 'OUTRAGEOUS. Absolutely outrageous.', 'That one is going on the highlights reel.'],
    double: ['My ears are not a toilet!', 'Two for the price of one!'],
    water: ['In the wise words of my late, great grandfather, stop.', 'Splash! Back to your own time.', 'Straight in for a swim.'],
    miss: ['Nearly!', 'Bold choice.', 'That patch of grass had it coming.', 'Somewhere, a bird is very surprised.', 'Practice shot. Obviously.', 'You meant to do that. I can tell.', 'The ground says ouch.'],
    trolley: ['Clean up on aisle three!', 'Wonky wheel and all. Go on!'],
    slug: ['Ew. It is sticky.', 'That slug has a plan.'],
    tyres: ['Boing! Nothing gets through tyres.', 'Recycling, but make it battle.'],
    springs: ['Boooiiing!', 'Spring boots! Mind your head.'],
    stomp: ['THE FOOT. RUN.', 'A robot foot from the sky. Of course.'],
    satellite: ['Something is falling out of the sky. Probably fine.', 'Old satellite incoming!'],
    satrain: ['Satellite rain! Look up. Then run.', 'The sky is falling. Bits of it, anyway.'],
    climb: ['Up we go!', 'Climbing like a champion.'],
    superfire: ['Ooooh, here it comes!', 'Oh my days.', 'Cover your ears!', 'This is the best bit.'],
    superready: ['Superweapon ready! Go on. You know you want to.', 'The big one is charged up!', 'Super ready. Everybody duck.'],
    trick: ['Did you SEE that?!', 'Trick shot! Somebody frame that.', 'Outrageous. I love it.', 'Put that one in the museum!', 'Shot of the century!'],
    v_mammoth: ['Is that a mammoth? Nobody ordered a mammoth.', 'A woolly mammoth! Wrong time, big fella.'],
    v_robot: ['A robot from the future. Act natural.', 'Beep boop. Lost, are we?'],
    v_knight: ['A knight on a horse! Clip clop, clip clop.', 'Sir! You are about 600 years out.'],
    v_camel: ['A camel! Long way from Egypt, mate.', 'That camel looks very unimpressed.'],
    v_parrot: ['A parrot! Pieces of eight!', 'Who let the parrot through the portal?'],
    misswater: ['The fish enjoyed that one.', 'A present for the fish!', 'Splash! Very refreshing.'],
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
    volcano: ['The volcano has had enough of this.', 'Lava bombs! Floor is lava. Sky is also lava.'],
    greatflood: ['The Great Flood! Find a ziggurat. Any ziggurat.', 'Gilgamesh warned us about this.'],
    hail: ['Hailstones! Very British.', 'Ow, ow, ow. Ice cubes from the sky.'],
    siege: ['Incoming! The trebuchets have joined in.', 'Somebody brought the siege engines.'],
    hurricane: ['Hurricane! Hold on to your hats. And your bandanas.', 'The tide is coming in. Fast.'],
    reactor: ['The reactor is melting down. Totally normal. Totally fine.', 'Is the water meant to be green?'],
    tour: ['Mind the gap. It is a few thousand years wide.', 'Next stop: somewhen else!'],
    sandstorm: ['Sandstorm! Hold on to your headcloths.', 'Sand in my eyes, sand in my ears. My ears are not a sandpit.'],
    sled: ['Wheee! Look at them slide.', 'Sand sledding. Lovely.'],
    scarab: ['Is that beetle following someone?', 'Run! The beetle has your scent.'],
    spear: ['Bullseye!', 'Straight through the middle. Outrageous.'],
    sun: ['Everybody put your sun cream on.', 'Mirrors at the ready...'],
    dune: ['Nice dune. Very sandy.', 'Hiding behind a sandcastle. Classic.'],
    pilum: ['Straight through the shield!', 'Pilum! Very Roman. Very rude.'],
    ballista: ['That bolt was not messing about.', 'Ballista! Duck!'],
    boulder: ['Boulder! Everybody run downhill. No wait, uphill.', 'That rock has places to be.'],
    gourd: ['Plonk and run. Classic.', 'Is that gourd ticking? Gourds should not tick.'],
    wall: ['Instant wall. Very cosy.', 'Who needs a builder?'],
    disc: ['Boing, boing, boing, ouch.', 'That disc has been practising.'],
    shield: ['Shields up! Very shiny.', 'Bonk proof. Mostly.'],
    testudo: ['Tortoise formation! Lovely teamwork.', 'Shields up, everyone.'],
    road: ['All roads lead to Rome. This one leads over there.', 'A nice straight road. Very Roman.'],
    onager: ['Incoming boulders! Three of them!', 'Here come the catapult rocks...'],
    stampede: ['MAMMOTHS! Everybody hold on!', 'Woolly stampede! Mind your toes.'],
    flood: ['The Nile is flooding! Get to high ground!', 'Water levels rising. Totally normal for the Nile.'],
    gale: ['It is blowing a gale up here.', 'Northumberland weather. Bring a coat.'],
    drones: ['Delivery drones! Those are not my parcels.', 'Drones overhead! Watch the red markers.'],
    teach: ['Lovely. You are a natural.', 'Nailed it.', 'Outrageous. Do that again in a real match.'],
    volley: ['Arrows away!', 'Loose! Lovely archery.'],
    lance: ['Charge!', 'Full tilt! Outrageous.'],
    oil: ['Hot oil! Mind your toes.', 'That is not cooking oil.'],
    banner: ['Rally to the banner!', 'A royal pick me up.'],
    treb: ['Trebuchet! Here comes a big one.', 'Incoming stone. A very big stone.'],
    cannon: ['FIRE!', 'Boom! Mind the kick.'],
    blunder: ['Blunderbuss! Very loud, very rude.', 'Spread shot!'],
    launch: ['Human cannonball! Look at them fly.', 'Wheee! Do not try this at home.'],
    keg: ['Who left a keg there?', 'Careful where you step.'],
    broadside: ['Broadside! Everybody duck!', 'Ship ahoy! Five cannonballs incoming.'],
    arrows: ['Arrow storm! Find some cover!', 'The castle archers are awake.'],
    tide: ['High tide coming! Head for high ground.', 'The sea is coming in. Totally normal for a harbour.'],
    cart: ['War cart! Mind the wheels.', 'Look at it go downhill!'],
    tablet: ['Skimming a clay tablet. Outrageous.', 'One, two, three skips!'],
    steps: ['A lovely little staircase.', 'Very Sumerian. Very sturdy.'],
    canal: ['The river is rising! Everybody up!', 'Who opened the canal?'],
    bull: ['THE BULL OF HEAVEN!', 'Mind the horns! Mind the horns!'],
    river: ['The river is flooding! Get to high ground!', 'The Euphrates is coming over the banks.'],
    comet: ['A comet! Watch the red mark!', 'Something big is coming in from space.', 'Comet incoming. Probably fine.'],
    quake: ['Earthquake! Hold on to something.', 'The ground is having a wobble.', 'Who stamped that hard?'],
    foot: ['A giant foot?! From where?!', 'Mind the foot! The really big foot!'],
    secret: ['A secret stash! How did you find that?', 'Hidden treasure! Outrageous.', 'Somebody buried snacks down there.'],
    glint: ['Did something just sparkle underground?', 'I saw a twinkle. Just saying.'],
    v_goldsnag: ['A golden Snag! Bop it for a prize!', 'Ooh, shiny! A golden Snag!'],
    v_dragon: ['A DRAGON! Nobody panic. Everybody panic.', 'Is that a dragon? That is a dragon.'],
    v_trex: ['T. rex! Run! Or stand very still!', 'A T. rex! Wrong time, very big fella.'],
    gold: ['Golden Snag bonus! Super meter boost!', 'Bopped the golden Snag! Lovely.'],
    fav: ['Bonnie has picked a favourite: %N%.', 'Bonnie likes %N% best. Do not tell the others.'],
    favko: ['Bonnie is very upset about %N%.', 'Not %N%! Bonnie needs a cuddle.'],
    nap: ['Shh. Bonnie is having a nap.', 'Bonnie is asleep. Maybe aim somewhere else?'],
    napwake: ['You woke Bonnie! She is not impressed.', 'Bonnie is awake. And grumpy. Sorry, Bonnie.'],
    laststand: ['Last Snag standing! %N% is not giving up.', '%N% versus everyone. I like those odds.'],
    comeback: ['Comeback! Do not count them out!', 'The comeback is ON.', 'Ooh, they are fighting back!'],
    revenge: ['Revenge! %N% did not forget.', '%N% got them back. Lovely.', 'That is payback, that is.'],
    name_jay: ['%N%? Great name. Very handsome name.', 'A Snag called %N%. I am honoured.'],
    name_bonnie: ['%N%! Bonnie approves.', 'Named after Bonnie? Woof.'],
    name_any: ['%N%! What a name.', 'Good luck, %N%.', '%N% is ready for anything.'],
    tipmore: ['Bit short. A touch more power, maybe?', 'Nearly there. Hold the button a little longer?'],
    tipless: ['A bit long. Maybe a touch less power?', 'Over the top! Let go a little sooner?'],
    tipwind: ['The wind is strong. Try aiming into it a bit?', 'Wind is pushing hard. Watch the flag.'],
    lose: ['So close! Bonnie brought you a biscuit.', 'Rematch? I think you have got them next time.']
  };
})();
