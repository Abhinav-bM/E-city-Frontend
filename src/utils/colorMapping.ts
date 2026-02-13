export const colorMap: Record<string, string> = {
  // Standard Colors
  black: "#000000",
  white: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#22C55E",
  yellow: "#EAB308",
  purple: "#A855F7",
  pink: "#EC4899",
  orange: "#F97316",
  gray: "#6B7280",
  grey: "#6B7280",
  silver: "#E5E7EB",
  gold: "#FFD700",

  // Tech Specific
  midnight: "#191970",
  starlight: "#F8F9EC",
  "space gray": "#4B4B4B",
  "space grey": "#4B4B4B",
  "rose gold": "#B76E79",
  graphite: "#41424C",
  sierra: "#698F9F",
  alpine: "#4E5851",
  porcelain: "#F0EFEF",
  obsidian: "#1A1A1A",
  hazel: "#8E8D80",
  snow: "#FFFAFA",
  charcoal: "#36454F",
  cream: "#FFFDD0",
  titanium: "#878681",
  natural: "#D4C5B3",
  ink: "#252525",
  sage: "#9CAB8E",
  emerald: "#50C878",
  chalk: "#F5F5F5",
  coral: "#FF7F50",
  mint: "#98FF98",
  amber: "#FFBF00",
  bronze: "#CD7F32",
  phantom: "#0C0C0C",
  lavender: "#E6E6FA",
  lilac: "#C8A2C8",
  violet: "#EE82EE",
  iris: "#5D3FD3",
  azure: "#007FFF",
  cobalt: "#0047AB",
  navy: "#000080",
  bay: "#90ABC0",
  cotton: "#FBFBF9",
  ceramic: "#FCFCFC",
  pearl: "#EAE0C8",
  ash: "#B2BEB5",
  platinum: "#E5E4E2",
  limongrass: "#E1ED85",
};

export const getColor = (name: string): string | null => {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  if (colorMap[key]) return colorMap[key];

  // Check valid hex
  if (name.startsWith("#") && (name.length === 4 || name.length === 7)) {
    return name;
  }

  // Return null if unknown
  return null;
};
