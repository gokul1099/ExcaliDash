export interface UserIdentity {
  id: string;
  name: string;
  initials: string;
  color: string;
}

const TRANSFORMERS = [
  { name: "Optimus Prime", initials: "OP" },
  { name: "Megatron", initials: "ME" },
  { name: "Starscream", initials: "ST" },
  { name: "Bumblebee", initials: "BB" },
  { name: "Ultra Magnus", initials: "UM" },
  { name: "Shockwave", initials: "SH" },
  { name: "Soundwave", initials: "SW" },
  { name: "Ironhide", initials: "IR" },
  { name: "Ratchet", initials: "RA" },
  { name: "Prowl", initials: "PR" },
  { name: "Jazz", initials: "JA" },
  { name: "Hot Rod", initials: "HR" },
  { name: "Alpha Trion", initials: "AT" },
  { name: "Wheeljack", initials: "WH" },
  { name: "Sideswipe", initials: "SI" },
  { name: "Sunstreaker", initials: "SU" },
  { name: "Inferno", initials: "IN" },
  { name: "Grapple", initials: "GR" },
  { name: "Blaster", initials: "BL" },
  { name: "Perceptor", initials: "PE" },
  { name: "Trailbreaker", initials: "TR" },
  { name: "Cosmos", initials: "CO" },
  { name: "Warpath", initials: "WA" },
  { name: "Powerglide", initials: "PO" },
  { name: "Arcee", initials: "AR" },
  { name: "Springer", initials: "SP" },
  { name: "Kup", initials: "KU" },
  { name: "Blurr", initials: "BU" },
  { name: "Grimlock", initials: "GL" },
  { name: "Swoop", initials: "WO" },
  { name: "Skywarp", initials: "SK" },
  { name: "Thundercracker", initials: "TH" },
  { name: "Ramjet", initials: "AM" },
  { name: "Cyclonus", initials: "CY" },
  { name: "Scourge", initials: "SC" },
  { name: "Galvatron", initials: "GA" },
  { name: "Astrotrain", initials: "AS" },
  { name: "Blitzwing", initials: "BZ" },
  { name: "Rumble", initials: "RU" },
  { name: "Frenzy", initials: "FR" },
  { name: "Laserbeak", initials: "LA" },
  { name: "Ravage", initials: "RV" },
  { name: "Unicron", initials: "UN" },
  { name: "Devastator", initials: "DE" },
  { name: "Menasor", initials: "MN" },
  { name: "Bruticus", initials: "BR" },
  { name: "Motormaster", initials: "MO" },
  { name: "Scrapper", initials: "CR" },
  { name: "Mixmaster", initials: "MA" },
  { name: "Bonecrusher", initials: "BO" },
  { name: "Hook", initials: "HO" },
  { name: "Vortex", initials: "VO" },
  { name: "Swindle", initials: "WI" },
];

const COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#84cc16", // lime-500
  "#22c55e", // green-500
  "#10b981", // emerald-500
  "#14b8a6", // teal-500
  "#06b6d4", // cyan-500
  "#0ea5e9", // sky-500
  "#3b82f6", // blue-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500
  "#d946ef", // fuchsia-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
];

const generateClientId = (): string => {
  const cryptoObj: Crypto | undefined =
    typeof globalThis !== "undefined"
      ? globalThis.crypto || (globalThis as any).msCrypto
      : undefined;

  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoObj.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // RFC 4122 variant
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
      .slice(6, 8)
      .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  }

  // Final fallback for very old browsers; uniqueness window-scoped only.
  return `id-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
};

export const getUserIdentity = (): UserIdentity => {
  const stored = localStorage.getItem("excalidash-user-id");
  if (stored) {
    return JSON.parse(stored);
  }

  const randomTransformer =
    TRANSFORMERS[Math.floor(Math.random() * TRANSFORMERS.length)];
  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

  const identity: UserIdentity = {
    id: generateClientId(),
    name: randomTransformer.name,
    initials: randomTransformer.initials,
    color: randomColor,
  };

  localStorage.setItem("excalidash-user-id", JSON.stringify(identity));
  return identity;
};
