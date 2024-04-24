function getBaseURL() {
  if (process.env.PROD_URL) {
    return `https://${process.env.PROD_URL}`;
  }
  if (process.env.NEXT_PUBLIC_PROD_URL) {
    return `https://${process.env.NEXT_PUBLIC_PROD_URL}`;
  }
  // if backend
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // if client-side
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

const config = {
  baseURL: getBaseURL(),
  pages: {
    index: "/",
  },
  api: {
    example: "/api/example",
  },

  raiderio: {
    baseURL: "https://raider.io/api/v1",
    characters: {
      profile: "/characters/profile",
      mplus_best_runs: "/characters/profile",
      mplus_best_alternate_runs: "/characters/profile",
    },
    mythic_plus: {
      runs: "/mythic-plus/runs",
      run_details: "/mythic-plus/run-details",
      score_colors: "/mythic-plus/score-tiers",
      affixes: "/mythic-plus/affixes",
    },
  },
};

export default config;
