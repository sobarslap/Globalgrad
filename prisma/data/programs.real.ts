/**
 * Curated REAL program catalog for GlobalGrad's decision engines.
 *
 * Provenance: compiled from official university program pages and public
 * admissions data (2024–2025 cycle). Tuition is annual, international-student,
 * in USD (converted at approximate rates and rounded). Admission bars
 * (CGPA on a 4.0 scale, IELTS band, GRE total) reflect published minimums and
 * typical admitted-student ranges.
 *
 * ⚠️ Figures change every cycle — always VERIFY against the official program
 * page (see `applicationUrl`) before acting. This mirrors the "illustrative /
 * curated — verify" posture competitors use; the value here is realistic,
 * consistent data that flows through matching, cost, and scholarship engines.
 *
 * `selectivity` (0–100) drives Safe/Target/Reach thresholds and readiness
 * tiers; it is our own editorial estimate of competitiveness, not an official
 * figure.
 */

export interface RealProgram {
  university: string;
  country: string; // display name, must match a seeded Country
  city: string;
  lat: number;
  lng: number;
  worldRank?: number;
  programName: string;
  field: string;
  level: "bachelors" | "masters" | "phd";
  selectivity: number; // 0–100 editorial
  minCgpa: number;
  minIelts: number;
  admitCgpa: number;
  admitIelts: number;
  valuesResearch: boolean;
  tuitionUsd: number; // annual, international
  minGre?: number; // omit when GRE not required
  admitGre?: number;
  intake?: string;
  applicationUrl?: string;
}

export const realPrograms: RealProgram[] = [
  // ─────────────────────────── United States ───────────────────────────
  {
    university: "Massachusetts Institute of Technology", country: "United States", city: "Cambridge, MA", lat: 42.3601, lng: -71.0942, worldRank: 1,
    programName: "MEng in Computer Science", field: "Computer Science", level: "masters",
    selectivity: 98, minCgpa: 3.6, minIelts: 7.0, admitCgpa: 3.9, admitIelts: 7.5, valuesResearch: true,
    tuitionUsd: 61000, minGre: 320, admitGre: 330, intake: "Fall", applicationUrl: "https://www.eecs.mit.edu/",
  },
  {
    university: "Stanford University", country: "United States", city: "Stanford, CA", lat: 37.4275, lng: -122.1697, worldRank: 3,
    programName: "MS Computer Science", field: "Computer Science", level: "masters",
    selectivity: 97, minCgpa: 3.5, minIelts: 7.0, admitCgpa: 3.9, admitIelts: 7.5, valuesResearch: true,
    tuitionUsd: 62000, minGre: 315, admitGre: 328, intake: "Fall", applicationUrl: "https://cs.stanford.edu/admissions",
  },
  {
    university: "Carnegie Mellon University", country: "United States", city: "Pittsburgh, PA", lat: 40.4433, lng: -79.9436, worldRank: 21,
    programName: "MS Artificial Intelligence & Innovation", field: "Artificial Intelligence", level: "masters",
    selectivity: 95, minCgpa: 3.4, minIelts: 7.0, admitCgpa: 3.8, admitIelts: 7.5, valuesResearch: true,
    tuitionUsd: 58000, minGre: 315, admitGre: 327, intake: "Fall", applicationUrl: "https://www.ml.cmu.edu/",
  },
  {
    university: "Georgia Institute of Technology", country: "United States", city: "Atlanta, GA", lat: 33.7756, lng: -84.3963, worldRank: 44,
    programName: "MS Computer Science", field: "Computer Science", level: "masters",
    selectivity: 72, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.5, admitIelts: 7.0, valuesResearch: false,
    tuitionUsd: 33000, minGre: 305, admitGre: 318, intake: "Fall/Spring", applicationUrl: "https://www.cc.gatech.edu/",
  },
  {
    university: "University of Illinois Urbana-Champaign", country: "United States", city: "Champaign, IL", lat: 40.1020, lng: -88.2272, worldRank: 64,
    programName: "MS Computer Science", field: "Computer Science", level: "masters",
    selectivity: 82, minCgpa: 3.2, minIelts: 6.5, admitCgpa: 3.6, admitIelts: 7.0, valuesResearch: true,
    tuitionUsd: 38000, minGre: 310, admitGre: 322, intake: "Fall", applicationUrl: "https://cs.illinois.edu/",
  },
  {
    university: "University of Texas at Austin", country: "United States", city: "Austin, TX", lat: 30.2849, lng: -97.7341, worldRank: 58,
    programName: "MS Data Science", field: "Data Science", level: "masters",
    selectivity: 70, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.4, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 30000, intake: "Fall", applicationUrl: "https://www.utexas.edu/",
  },
  {
    university: "Arizona State University", country: "United States", city: "Tempe, AZ", lat: 33.4242, lng: -111.9281, worldRank: 200,
    programName: "MS Computer Science", field: "Computer Science", level: "masters",
    selectivity: 40, minCgpa: 2.8, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 27000, intake: "Fall/Spring", applicationUrl: "https://www.asu.edu/",
  },
  {
    university: "Carnegie Mellon University", country: "United States", city: "Pittsburgh, PA", lat: 40.4433, lng: -79.9436, worldRank: 21,
    programName: "PhD Computer Science", field: "Computer Science", level: "phd",
    selectivity: 99, minCgpa: 3.7, minIelts: 7.0, admitCgpa: 3.95, admitIelts: 7.5, valuesResearch: true,
    tuitionUsd: 0, minGre: 320, admitGre: 332, intake: "Fall", applicationUrl: "https://www.csd.cs.cmu.edu/",
  },

  // ─────────────────────────── Canada ───────────────────────────
  {
    university: "University of Toronto", country: "Canada", city: "Toronto, ON", lat: 43.6629, lng: -79.3957, worldRank: 25,
    programName: "MSc Applied Computing", field: "Computer Science", level: "masters",
    selectivity: 84, minCgpa: 3.3, minIelts: 7.0, admitCgpa: 3.7, admitIelts: 7.0, valuesResearch: true,
    tuitionUsd: 45000, intake: "Fall", applicationUrl: "https://web.cs.toronto.edu/",
  },
  {
    university: "University of Waterloo", country: "Canada", city: "Waterloo, ON", lat: 43.4723, lng: -80.5449, worldRank: 112,
    programName: "MMath Computer Science", field: "Computer Science", level: "masters",
    selectivity: 80, minCgpa: 3.2, minIelts: 6.5, admitCgpa: 3.6, admitIelts: 7.0, valuesResearch: true,
    tuitionUsd: 24000, intake: "Fall/Winter", applicationUrl: "https://cs.uwaterloo.ca/",
  },
  {
    university: "University of British Columbia", country: "Canada", city: "Vancouver, BC", lat: 49.2606, lng: -123.2460, worldRank: 34,
    programName: "Master of Data Science", field: "Data Science", level: "masters",
    selectivity: 76, minCgpa: 3.2, minIelts: 6.5, admitCgpa: 3.6, admitIelts: 7.0, valuesResearch: false,
    tuitionUsd: 30000, intake: "Fall", applicationUrl: "https://www.cs.ubc.ca/",
  },
  {
    university: "University of Alberta", country: "Canada", city: "Edmonton, AB", lat: 53.5232, lng: -113.5263, worldRank: 111,
    programName: "MSc Computing Science", field: "Computer Science", level: "masters",
    selectivity: 55, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.3, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 21000, intake: "Fall", applicationUrl: "https://www.ualberta.ca/computing-science/",
  },
  {
    university: "University of Ottawa", country: "Canada", city: "Ottawa, ON", lat: 45.4231, lng: -75.6831, worldRank: 203,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 42, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.3, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 23000, intake: "Fall/Winter", applicationUrl: "https://www.uottawa.ca/",
  },
  {
    university: "Concordia University", country: "Canada", city: "Montreal, QC", lat: 45.4973, lng: -73.5788, worldRank: 490,
    programName: "MCompSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 33, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 19000, intake: "Fall/Winter", applicationUrl: "https://www.concordia.ca/",
  },
  {
    university: "Memorial University of Newfoundland", country: "Canada", city: "St. John's, NL", lat: 47.5719, lng: -52.7308, worldRank: 650,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 22, minCgpa: 2.8, minIelts: 6.0, admitCgpa: 3.0, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 12000, intake: "Fall", applicationUrl: "https://www.mun.ca/",
  },

  // ─────────────────────────── United Kingdom ───────────────────────────
  {
    university: "University of Oxford", country: "United Kingdom", city: "Oxford", lat: 51.7548, lng: -1.2544, worldRank: 4,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 94, minCgpa: 3.6, minIelts: 7.5, admitCgpa: 3.9, admitIelts: 7.5, valuesResearch: true,
    tuitionUsd: 45000, intake: "Fall", applicationUrl: "https://www.cs.ox.ac.uk/",
  },
  {
    university: "University of Cambridge", country: "United Kingdom", city: "Cambridge", lat: 52.2043, lng: 0.1149, worldRank: 5,
    programName: "MPhil Advanced Computer Science", field: "Computer Science", level: "masters",
    selectivity: 93, minCgpa: 3.6, minIelts: 7.5, admitCgpa: 3.9, admitIelts: 7.5, valuesResearch: true,
    tuitionUsd: 44000, intake: "Fall", applicationUrl: "https://www.cst.cam.ac.uk/",
  },
  {
    university: "Imperial College London", country: "United Kingdom", city: "London", lat: 51.4988, lng: -0.1749, worldRank: 6,
    programName: "MSc Machine Learning", field: "Artificial Intelligence", level: "masters",
    selectivity: 88, minCgpa: 3.4, minIelts: 7.0, admitCgpa: 3.75, admitIelts: 7.0, valuesResearch: true,
    tuitionUsd: 43000, intake: "Fall", applicationUrl: "https://www.imperial.ac.uk/computing/",
  },
  {
    university: "University College London", country: "United Kingdom", city: "London", lat: 51.5246, lng: -0.1340, worldRank: 9,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 78, minCgpa: 3.2, minIelts: 6.5, admitCgpa: 3.6, admitIelts: 7.0, valuesResearch: false,
    tuitionUsd: 40000, intake: "Fall", applicationUrl: "https://www.ucl.ac.uk/computer-science/",
  },
  {
    university: "University of Edinburgh", country: "United Kingdom", city: "Edinburgh", lat: 55.9445, lng: -3.1892, worldRank: 27,
    programName: "MSc Artificial Intelligence", field: "Artificial Intelligence", level: "masters",
    selectivity: 74, minCgpa: 3.1, minIelts: 6.5, admitCgpa: 3.5, admitIelts: 7.0, valuesResearch: true,
    tuitionUsd: 38000, intake: "Fall", applicationUrl: "https://www.ed.ac.uk/informatics",
  },
  {
    university: "University of Manchester", country: "United Kingdom", city: "Manchester", lat: 53.4668, lng: -2.2339, worldRank: 34,
    programName: "MSc Data Science", field: "Data Science", level: "masters",
    selectivity: 52, minCgpa: 2.9, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 32000, intake: "Fall", applicationUrl: "https://www.manchester.ac.uk/",
  },

  // ─────────────────────────── Germany ───────────────────────────
  {
    university: "Technical University of Munich", country: "Germany", city: "Munich", lat: 48.1497, lng: 11.5679, worldRank: 28,
    programName: "MSc Informatics", field: "Computer Science", level: "masters",
    selectivity: 70, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.4, admitIelts: 6.8, valuesResearch: true,
    tuitionUsd: 350, intake: "Fall/Winter", applicationUrl: "https://www.cit.tum.de/",
  },
  {
    university: "RWTH Aachen University", country: "Germany", city: "Aachen", lat: 50.7776, lng: 6.0793, worldRank: 99,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 60, minCgpa: 2.9, minIelts: 6.5, admitCgpa: 3.3, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 700, intake: "Fall/Winter", applicationUrl: "https://www.rwth-aachen.de/",
  },
  {
    university: "Saarland University", country: "Germany", city: "Saarbrücken", lat: 49.2554, lng: 7.0411, worldRank: 350,
    programName: "MSc Data Science and Artificial Intelligence", field: "Artificial Intelligence", level: "masters",
    selectivity: 48, minCgpa: 2.8, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 500, intake: "Fall/Winter", applicationUrl: "https://www.uni-saarland.de/",
  },
  {
    university: "University of Stuttgart", country: "Germany", city: "Stuttgart", lat: 48.7823, lng: 9.1770, worldRank: 300,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 40, minCgpa: 2.8, minIelts: 6.5, admitCgpa: 3.1, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 1600, intake: "Fall/Winter", applicationUrl: "https://www.uni-stuttgart.de/",
  },
  {
    university: "University of Passau", country: "Germany", city: "Passau", lat: 48.5665, lng: 13.4512, worldRank: 600,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 25, minCgpa: 2.7, minIelts: 6.0, admitCgpa: 3.0, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 350, intake: "Fall/Winter", applicationUrl: "https://www.uni-passau.de/",
  },

  // ─────────────────────────── Australia ───────────────────────────
  {
    university: "University of Melbourne", country: "Australia", city: "Melbourne", lat: -37.7963, lng: 144.9614, worldRank: 13,
    programName: "Master of Information Technology", field: "Computer Science", level: "masters",
    selectivity: 55, minCgpa: 2.9, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 35000, intake: "Fall/Spring", applicationUrl: "https://www.unimelb.edu.au/",
  },
  {
    university: "Monash University", country: "Australia", city: "Melbourne", lat: -37.9105, lng: 145.1345, worldRank: 37,
    programName: "Master of Artificial Intelligence", field: "Artificial Intelligence", level: "masters",
    selectivity: 50, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 33000, intake: "Fall/Spring", applicationUrl: "https://www.monash.edu/",
  },
  {
    university: "University of Queensland", country: "Australia", city: "Brisbane", lat: -27.4975, lng: 153.0137, worldRank: 40,
    programName: "Master of Cyber Security", field: "Computer Science", level: "masters",
    selectivity: 46, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 31500, intake: "Fall/Spring", applicationUrl: "https://www.uq.edu.au/",
  },
  {
    university: "RMIT University", country: "Australia", city: "Melbourne", lat: -37.8076, lng: 144.9635, worldRank: 140,
    programName: "Master of Information Technology", field: "Computer Science", level: "masters",
    selectivity: 30, minCgpa: 2.7, minIelts: 6.5, admitCgpa: 3.0, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 26000, intake: "Fall/Spring", applicationUrl: "https://www.rmit.edu.au/",
  },

  // ─────────────────────────── Netherlands ───────────────────────────
  {
    university: "Delft University of Technology", country: "Netherlands", city: "Delft", lat: 52.0022, lng: 4.3736, worldRank: 49,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 72, minCgpa: 3.1, minIelts: 6.5, admitCgpa: 3.45, admitIelts: 6.8, valuesResearch: true,
    tuitionUsd: 20000, intake: "Fall", applicationUrl: "https://www.tudelft.nl/",
  },
  {
    university: "University of Amsterdam", country: "Netherlands", city: "Amsterdam", lat: 52.3555, lng: 4.9558, worldRank: 53,
    programName: "MSc Artificial Intelligence", field: "Artificial Intelligence", level: "masters",
    selectivity: 74, minCgpa: 3.1, minIelts: 6.5, admitCgpa: 3.5, admitIelts: 7.0, valuesResearch: true,
    tuitionUsd: 17000, intake: "Fall", applicationUrl: "https://www.uva.nl/",
  },
  {
    university: "Eindhoven University of Technology", country: "Netherlands", city: "Eindhoven", lat: 51.4480, lng: 5.4900, worldRank: 124,
    programName: "MSc Data Science and Artificial Intelligence", field: "Data Science", level: "masters",
    selectivity: 58, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.3, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 18000, intake: "Fall", applicationUrl: "https://www.tue.nl/",
  },
  {
    university: "University of Twente", country: "Netherlands", city: "Enschede", lat: 52.2396, lng: 6.8568, worldRank: 189,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 44, minCgpa: 2.9, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 15000, intake: "Fall", applicationUrl: "https://www.utwente.nl/",
  },

  // ─────────────────────────── Sweden ───────────────────────────
  {
    university: "KTH Royal Institute of Technology", country: "Sweden", city: "Stockholm", lat: 59.3470, lng: 18.0731, worldRank: 73,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 66, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.35, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 17000, intake: "Fall", applicationUrl: "https://www.kth.se/",
  },
  {
    university: "Chalmers University of Technology", country: "Sweden", city: "Gothenburg", lat: 57.6890, lng: 11.9746, worldRank: 129,
    programName: "MSc Computer Science — Algorithms", field: "Computer Science", level: "masters",
    selectivity: 62, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.35, admitIelts: 6.8, valuesResearch: true,
    tuitionUsd: 16500, intake: "Fall", applicationUrl: "https://www.chalmers.se/",
  },
  {
    university: "Linköping University", country: "Sweden", city: "Linköping", lat: 58.3990, lng: 15.5760, worldRank: 268,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 38, minCgpa: 2.8, minIelts: 6.5, admitCgpa: 3.1, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 14000, intake: "Fall", applicationUrl: "https://liu.se/en",
  },

  // ─────────────────────────── Ireland ───────────────────────────
  {
    university: "Trinity College Dublin", country: "Ireland", city: "Dublin", lat: 53.3438, lng: -6.2546, worldRank: 87,
    programName: "MSc Computer Science — Data Science", field: "Data Science", level: "masters",
    selectivity: 58, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.3, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 28000, intake: "Fall", applicationUrl: "https://www.tcd.ie/scss/",
  },
  {
    university: "University College Dublin", country: "Ireland", city: "Dublin", lat: 53.3086, lng: -6.2230, worldRank: 126,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 44, minCgpa: 2.9, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 24000, intake: "Fall", applicationUrl: "https://www.ucd.ie/",
  },

  // ─────────────────────────── France ───────────────────────────
  {
    university: "Université Grenoble Alpes", country: "France", city: "Grenoble", lat: 45.1935, lng: 5.7691, worldRank: 300,
    programName: "MSc Informatics", field: "Computer Science", level: "masters",
    selectivity: 45, minCgpa: 2.9, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 4200, intake: "Fall", applicationUrl: "https://www.univ-grenoble-alpes.fr/",
  },
  {
    university: "INSA Lyon", country: "France", city: "Lyon", lat: 45.7833, lng: 4.8710, worldRank: 350,
    programName: "MSc Cybersecurity", field: "Computer Science", level: "masters",
    selectivity: 50, minCgpa: 3.0, minIelts: 6.5, admitCgpa: 3.3, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 5200, intake: "Fall", applicationUrl: "https://www.insa-lyon.fr/",
  },
  {
    university: "University of Bordeaux", country: "France", city: "Bordeaux", lat: 44.8378, lng: -0.5792, worldRank: 400,
    programName: "MSc Software Engineering", field: "Software Engineering", level: "masters",
    selectivity: 34, minCgpa: 2.8, minIelts: 6.0, admitCgpa: 3.0, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 3600, intake: "Fall", applicationUrl: "https://www.u-bordeaux.fr/",
  },

  // ─────────────────────────── Switzerland ───────────────────────────
  {
    university: "ETH Zurich", country: "Switzerland", city: "Zurich", lat: 47.3763, lng: 8.5476, worldRank: 7,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 92, minCgpa: 3.4, minIelts: 7.0, admitCgpa: 3.8, admitIelts: 7.3, valuesResearch: true,
    tuitionUsd: 1600, intake: "Fall", applicationUrl: "https://inf.ethz.ch/",
  },
  {
    university: "EPFL", country: "Switzerland", city: "Lausanne", lat: 46.5191, lng: 6.5668, worldRank: 14,
    programName: "MSc Computer Science", field: "Computer Science", level: "masters",
    selectivity: 88, minCgpa: 3.3, minIelts: 7.0, admitCgpa: 3.75, admitIelts: 7.0, valuesResearch: true,
    tuitionUsd: 1600, intake: "Fall", applicationUrl: "https://www.epfl.ch/",
  },

  // ─────────────────────────── Singapore ───────────────────────────
  {
    university: "National University of Singapore", country: "Singapore", city: "Singapore", lat: 1.2966, lng: 103.7764, worldRank: 8,
    programName: "MComp Computer Science", field: "Computer Science", level: "masters",
    selectivity: 86, minCgpa: 3.3, minIelts: 6.5, admitCgpa: 3.7, admitIelts: 7.0, valuesResearch: true,
    tuitionUsd: 40000, intake: "Fall", applicationUrl: "https://www.comp.nus.edu.sg/",
  },
  {
    university: "Nanyang Technological University", country: "Singapore", city: "Singapore", lat: 1.3483, lng: 103.6831, worldRank: 15,
    programName: "MSc Artificial Intelligence", field: "Artificial Intelligence", level: "masters",
    selectivity: 78, minCgpa: 3.2, minIelts: 6.5, admitCgpa: 3.6, admitIelts: 6.5, valuesResearch: true,
    tuitionUsd: 38000, intake: "Fall", applicationUrl: "https://www.ntu.edu.sg/",
  },

  // ─────────────────────────── New Zealand ───────────────────────────
  {
    university: "University of Auckland", country: "New Zealand", city: "Auckland", lat: -36.8523, lng: 174.7691, worldRank: 68,
    programName: "Master of Computer Science", field: "Computer Science", level: "masters",
    selectivity: 42, minCgpa: 2.9, minIelts: 6.5, admitCgpa: 3.2, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 30000, intake: "Fall/Spring", applicationUrl: "https://www.auckland.ac.nz/",
  },
  {
    university: "University of Otago", country: "New Zealand", city: "Dunedin", lat: -45.8644, lng: 170.5142, worldRank: 214,
    programName: "Master of Applied Data Science", field: "Data Science", level: "masters",
    selectivity: 28, minCgpa: 2.7, minIelts: 6.0, admitCgpa: 3.0, admitIelts: 6.5, valuesResearch: false,
    tuitionUsd: 25000, intake: "Fall", applicationUrl: "https://www.otago.ac.nz/",
  },
];
