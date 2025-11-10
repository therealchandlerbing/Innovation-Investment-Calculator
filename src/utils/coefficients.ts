export const COEFFICIENTS = {
  monthlyBurnRates: {
    Software: 75000,
    Hardware: 95000,
    Biotech: 125000,
    'Clean Energy': 110000,
  },

  developmentMonths: {
    'Concept (TRL 1-3)': 18,
    'Prototype (TRL 4-6)': 12,
    'Pilot (TRL 7-8)': 9,
    'Production (TRL 9)': 6,
  },

  teamMultipliers: {
    'No team yet': 1.3,
    'Partial team (1-3 people)': 1.1,
    'Full team assembled (4+ people)': 1.0,
  },

  geographyModifiers: {
    'San Francisco Bay Area': 1.35,
    'New York City': 1.32,
    'Boston': 1.28,
    'Seattle': 1.25,
    'Los Angeles': 1.22,
    'San Diego': 1.18,
    'Washington DC': 1.15,
    'Denver': 1.10,
    'Austin': 1.05,
    'Remote US': 1.00,
    'Toronto': 0.95,
    'Montreal': 0.85,
    'Mexico City': 0.70,
    'São Paulo': 0.65,
    'Buenos Aires': 0.60,
    'Santiago': 0.68,
    'Bangalore': 0.35,
    'Warsaw': 0.55,
    'Lisbon': 0.60,
    'Tel Aviv': 0.90,
  },

  riskProbabilities: {
    technical: {
      'Concept (TRL 1-3)': 0.65,
      'Prototype (TRL 4-6)': 0.45,
      'Pilot (TRL 7-8)': 0.28,
      'Production (TRL 9)': 0.15,
    },
    market: {
      'Enterprise B2B': 0.40,
      'SMB B2B': 0.35,
      'Consumer B2C': 0.50,
      'Government': 0.55,
    },
    regulatory: {
      'None': 0.05,
      'Moderate (compliance, certifications)': 0.18,
      'Heavy (FDA, EPA, nuclear)': 0.35,
    },
    competitive: 0.25,
  },

  riskImpacts: {
    technical: 0.25,
    market: 0.20,
    regulatory: 0.15,
    competitive: 0.12,
  },

  scenarioModifiers: {
    optimistic: {
      development: 0.75,
      gtm: 0.70,
      risk: 0.60,
    },
    realistic: {
      development: 1.0,
      gtm: 1.0,
      risk: 1.0,
    },
    conservative: {
      development: 1.25,
      gtm: 1.35,
      risk: 1.30,
    },
  },

  gtmRampMonths: {
    'Enterprise B2B': 18,
    'SMB B2B': 14,
    'Consumer B2C': 10,
    'Government': 24,
  },
};
