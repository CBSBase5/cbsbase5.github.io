/* ==========================================================
   Base 5 - scrambled checks for every code on the site.
   No code is stored here: only a PBKDF2 hash of each, so a page
   can tell whether a code is right without knowing it.
   Made 2026-10-19. Rebuild from teacher/build-targets.html when
   codes change. Used by /data/b5lock.js.
   ========================================================== */
window.B5KEYS = {
 "iter": 600000,
 "students": {
  "JT": {
   "salt": "39qc9Kvn0porVBgIGBd+TQ==",
   "hash": "Mb1w3tQA9dCucZvmFceBI3lvFsuL0CwyiZG46KG3q8Q="
  },
  "LW": {
   "salt": "RHSKlyh2NoiJ9eC/+S2zyQ==",
   "hash": "qD3LYSo8pt3keXj8LvzdhpKz5vnRg/yfqAWAqvAwsZE="
  },
  "EGW": {
   "salt": "tbztHibpRJ+QMioX1lV/Bg==",
   "hash": "1b5JrQ0eubj3Dhia6my/7kLUhHadSENnQ4l48f6EOEc="
  },
  "LP": {
   "salt": "0WJ+H4Rx+zlARa1UunjuvQ==",
   "hash": "nbesJGkrNYiaDAsolznjDBsE19S5TN6pBWvn4dk8oqc="
  },
  "LC": {
   "salt": "Zh8Hyz1Erhxb9HtoePZZRQ==",
   "hash": "+8caWNSXLgvAYGO2cNIeE1akxc6purPSlDaTyf+CVvM="
  },
  "HK": {
   "salt": "sEHUG81GFniE2McZoVXaEA==",
   "hash": "kIIxHGBLB9D8osg3ZXJAZIj8sZXTIYu+Q3ciV6ttsQw="
  }
 },
 "staff": {
  "salt": "C7vDweUWGRhYGOoPrQW/aA==",
  "hash": "OuffCgLMJ25qrPFtQXhyw3o3ndayTVlFjxLq/zfQyWo="
 }
};
