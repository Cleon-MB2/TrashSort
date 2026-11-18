export type WasteCategory = 'organic' | 'inorganic' | 'b3';

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  imageUrl: string;
  explanation: string;
  impactFact: string;
}

export interface BinConfig {
  id: WasteCategory;
  label: string;
  shortSubtitle: string;
  description: string;
  examples: string[];
  accentHex: string;
  surfaceBgClass: string;
  borderClass: string;
  activeBorderClass: string;
  activeBgClass: string;
  headingTextClass: string;
  bodyTextClass: string;
  buttonBgClass: string;
  canBodyFill: string;
  canLidFill: string;
  canAccentFill: string;
}

export interface RoundAnswer {
  item: WasteItem;
  chosenCategory: WasteCategory | 'timeout';
  isCorrect: boolean;
  pointsEarned: number;
}

export const TOTAL_QUESTIONS = 10;
export const POINTS_PER_CORRECT = 10;

export const BIN_CONFIGS: Record<WasteCategory, BinConfig> = {
  organic: {
    id: 'organic',
    label: 'Organic Waste',
    shortSubtitle: 'Food Scraps & Plants',
    description:
      'Natural waste from plants or food that breaks down quickly and can be turned into nutrient-rich compost.',
    examples: ['Banana peels', 'Apple cores', 'Dry leaves', 'Eggshells'],
    accentHex: '#059669',
    surfaceBgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    activeBorderClass: 'border-emerald-600 ring-4 ring-emerald-300',
    activeBgClass: 'bg-emerald-100',
    headingTextClass: 'text-emerald-950',
    bodyTextClass: 'text-emerald-900',
    buttonBgClass: 'bg-emerald-700 text-white',
    canBodyFill: '#10B981',
    canLidFill: '#047857',
    canAccentFill: '#ECFDF5',
  },
  inorganic: {
    id: 'inorganic',
    label: 'Inorganic Waste',
    shortSubtitle: 'Plastic, Paper, Metal & Glass',
    description:
      'Man-made or non-living materials that do not rot easily but can be cleaned, melted, and recycled into new items.',
    examples: ['Plastic bottles', 'Cardboard boxes', 'Soda cans', 'Glass jars'],
    accentHex: '#0284C7',
    surfaceBgClass: 'bg-sky-50',
    borderClass: 'border-sky-300',
    activeBorderClass: 'border-sky-600 ring-4 ring-sky-300',
    activeBgClass: 'bg-sky-100',
    headingTextClass: 'text-sky-950',
    bodyTextClass: 'text-sky-900',
    buttonBgClass: 'bg-sky-700 text-white',
    canBodyFill: '#0EA5E9',
    canLidFill: '#0369A1',
    canAccentFill: '#F0F9FF',
  },
  b3: {
    id: 'b3',
    label: 'B3 Waste',
    shortSubtitle: 'Hazardous & Toxic Items',
    description:
      'Dangerous materials containing toxic chemicals or heavy metals. They need special handling so they never poison soil or water.',
    examples: ['Used batteries', 'Paint cans', 'CFL light bulbs', 'Chemical sprays'],
    accentHex: '#DC2626',
    surfaceBgClass: 'bg-rose-50',
    borderClass: 'border-rose-300',
    activeBorderClass: 'border-rose-600 ring-4 ring-rose-300',
    activeBgClass: 'bg-rose-100',
    headingTextClass: 'text-rose-950',
    bodyTextClass: 'text-rose-900',
    buttonBgClass: 'bg-rose-700 text-white',
    canBodyFill: '#EF4444',
    canLidFill: '#B91C1C',
    canAccentFill: '#FEF2F2',
  },
};

export const BIN_ORDER: WasteCategory[] = ['organic', 'inorganic', 'b3'];

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: 'banana-peel',
    name: 'Banana Peel',
    category: 'organic',
    imageUrl: '/src/assets/images/waste_banana_peel_1794982954976.jpg',
    explanation:
      'Banana peels come from fruit and decompose naturally in weeks when placed in the Organic bin.',
    impactFact: 'Composting fruit peels returns rich nutrients back into garden soil.',
  },
  {
    id: 'apple-core',
    name: 'Apple Core',
    category: 'organic',
    imageUrl: '/src/assets/images/waste_apple_core_1794982957566.jpg',
    explanation:
      'An eaten apple core is natural plant food waste that belongs in the Organic bin for composting.',
    impactFact: 'Composting food scraps stops harmful methane gas from forming in landfills.',
  },
  {
    id: 'dry-leaves',
    name: 'Dried Leaves & Twigs',
    category: 'organic',
    imageUrl: '/src/assets/images/waste_dry_leaves_1794982957766.jpg',
    explanation:
      'Fallen leaves and twigs are yard plant waste that break down naturally into compost.',
    impactFact: 'Dead leaves make great mulch that helps trees and flowers retain water.',
  },
  {
    id: 'egg-shells',
    name: 'Cracked Eggshells',
    category: 'organic',
    imageUrl: '/src/assets/images/waste_egg_shells_1794982957877.jpg',
    explanation:
      'Eggshells are natural kitchen waste rich in calcium and belong in the Organic compost bin.',
    impactFact: 'Crushed eggshells add vital calcium minerals to help garden vegetables grow.',
  },
  {
    id: 'water-bottle',
    name: 'Plastic Water Bottle',
    category: 'inorganic',
    imageUrl: '/src/assets/images/waste_water_bottle_1794982959310.jpg',
    explanation:
      'Plastic bottles do not decompose like plants, so they go in the Inorganic bin to be recycled.',
    impactFact: 'Recycling plastic bottles saves energy and turns them into new bottles or fabric.',
  },
  {
    id: 'cardboard-box',
    name: 'Cardboard Box',
    category: 'inorganic',
    imageUrl: '/src/assets/images/waste_cardboard_box_1794982959253.jpg',
    explanation:
      'Clean flattened cardboard is dry recyclable paper material suited for the Inorganic bin.',
    impactFact: 'Recycling one ton of cardboard saves over 17 trees and thousands of liters of water.',
  },
  {
    id: 'soda-can',
    name: 'Aluminum Soda Can',
    category: 'inorganic',
    imageUrl: '/src/assets/images/waste_soda_can_1794982962484.jpg',
    explanation:
      'Aluminum cans are valuable metal that can be melted down and recycled endlessly in the Inorganic bin.',
    impactFact: 'Recycling one aluminum can saves enough energy to power a TV for three hours.',
  },
  {
    id: 'glass-jar',
    name: 'Empty Glass Jar',
    category: 'inorganic',
    imageUrl: '/src/assets/images/waste_glass_jar_1794982959625.jpg',
    explanation:
      'Glass jars are 100% recyclable Inorganic waste that can be melted and reshaped repeatedly.',
    impactFact: 'Recycled glass never loses purity and reduces mining for new raw sand.',
  },
  {
    id: 'aa-batteries',
    name: 'Used AA Batteries',
    category: 'b3',
    imageUrl: '/src/assets/images/waste_aa_batteries_1794982960251.jpg',
    explanation:
      'Batteries contain heavy metals and acids that leak toxins, so they belong strictly in the B3 Waste bin.',
    impactFact: 'Keeping batteries out of regular trash prevents toxic metals from entering groundwater.',
  },
  {
    id: 'paint-can',
    name: 'Leftover Paint Can',
    category: 'b3',
    imageUrl: '/src/assets/images/waste_paint_can_1794982961072.jpg',
    explanation:
      'Household paint contains chemical solvents and pigments that are hazardous, requiring B3 Waste disposal.',
    impactFact: 'Proper B3 disposal keeps chemical paint fumes and toxins out of rivers and soil.',
  },
  {
    id: 'cfl-bulb',
    name: 'Fluorescent Light Bulb',
    category: 'b3',
    imageUrl: '/src/assets/images/waste_cfl_bulb_1794982960409.jpg',
    explanation:
      'Spiral CFL bulbs contain a small amount of toxic mercury vapor, making them B3 hazardous waste.',
    impactFact: 'Special B3 recycling safely captures mercury so it never pollutes classroom or city air.',
  },
  {
    id: 'aerosol-spray',
    name: 'Chemical Aerosol Spray',
    category: 'b3',
    imageUrl: '/src/assets/images/waste_aerosol_spray_1794982961329.jpg',
    explanation:
      'Pressurized chemical spray cans are flammable and toxic, so they must go into the B3 Waste bin.',
    impactFact: 'Separating pressurized chemical cans prevents fires inside garbage and recycling trucks.',
  },
];

export function selectRoundItems(count: number = TOTAL_QUESTIONS): WasteItem[] {
  const pool = [...WASTE_ITEMS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
