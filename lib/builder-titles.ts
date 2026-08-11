/**
 * Every competing Task #1 submission we found has some version of a random
 * "builder class" generator (Pixel Crafter, Palm Wrangler, etc). Pure RNG
 * is fine but forgettable. This version keeps the Goa-flavored voice but
 * biases the pick toward whatever the person actually typed in the
 * stack/role field, so an "ML engineer" is more likely to land on
 * something ML-flavored than a web3 dev is.
 *
 * Falls back to the generic pool (and true randomness) when the input is
 * empty or matches nothing — so it never feels broken, just less specific.
 */

interface TitlePool {
  keywords: string[];
  titles: string[];
}

const POOLS: TitlePool[] = [
  {
    keywords: ["ml", "ai", "machine learning", "deep learning", "model", "llm", "gpu", "nvidia", "pytorch", "genai"],
    titles: [
      "Tide Whisperer",
      "Gradient Surfer",
      "Neural Tide Caller",
      "Backprop Beachcomber",
      "Latent Space Sailor",
    ],
  },
  {
    keywords: ["frontend", "react", "next", "ui", "design", "css", "figma"],
    titles: [
      "Pixel Tide Shaper",
      "Palm Frond Pixel-Pusher",
      "Coastal Component Weaver",
      "Sunset Grid Architect",
    ],
  },
  {
    keywords: ["backend", "infra", "devops", "server", "api", "database", "systems", "distributed"],
    titles: [
      "Reef Uptime Keeper",
      "Coconut Cluster Wrangler",
      "Monsoon-Proof Backend Anchor",
      "Deep Sea Systems Diver",
    ],
  },
  {
    keywords: ["crypto", "web3", "solidity", "chain", "defi", "smart contract", "onchain"],
    titles: [
      "Onchain Tide Trader",
      "Palm-Shaded Validator",
      "Coral Reef Consensus Diver",
      "Sandbank Signer",
    ],
  },
  {
    keywords: ["design", "product", "pm", "growth", "marketing", "brand"],
    titles: [
      "Shoreline Storyteller",
      "Launch Day Lighthouse Keeper",
      "Coastal Roadmap Navigator",
    ],
  },
  {
    keywords: ["hardware", "robotics", "embedded", "iot", "firmware"],
    titles: [
      "Salt-Air Solderer",
      "Tide-Tested Tinkerer",
      "Beachfront Bootloader",
    ],
  },
];

const GENERIC_TITLES = [
  "Kokum Cooler Coder",
  "Palm Wrangler",
  "Genesis Day Builder",
  "Sundown Shipper",
  "Fireside Debugger",
  "Sand-in-the-Keyboard Builder",
];

function poolFor(rawInput: string): string[] {
  const input = rawInput.toLowerCase().trim();
  if (!input) return GENERIC_TITLES;

  const matched = POOLS.find((pool) =>
    pool.keywords.some((kw) => input.includes(kw))
  );

  return matched ? matched.titles : GENERIC_TITLES;
}

export function generateBuilderTitle(stackOrRole: string): string {
  const pool = poolFor(stackOrRole);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Reroll that avoids repeating the current title when possible. */
export function rerollBuilderTitle(stackOrRole: string, current: string): string {
  const pool = poolFor(stackOrRole);
  const options = pool.length > 1 ? pool.filter((t) => t !== current) : pool;
  return options[Math.floor(Math.random() * options.length)];
}
