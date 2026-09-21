import { experienceEntrySchema, type ExperienceEntry } from "./schema";

/**
 * Real experience, most recent first. Dates are ISO "YYYY-MM" per
 * `experienceEntrySchema`, taken directly from the resume.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "exp-hack-with-india",
    organization: "Hack with India, MRIIRS Chapter",
    role: "Knowledge Resource Lead",
    location: "Faridabad, Haryana",
    startDate: "2025-10",
    summary:
      "Runs the technical side of MRIIRS's Hack with India chapter — workshops for a large student developer community and hands-on mentorship during hackathons.",
    highlights: [
      "Lead technical workshops for 200+ student developers covering web development, AI/ML, and full-stack best practices.",
      "Mentor hackathon teams on architecture decisions, API design, and deployment strategy.",
    ],
    stack: [],
  },
  {
    id: "exp-skycore-aviation",
    organization: "Skycore Aviation Academy",
    role: "Full-Stack Developer",
    location: "Remote",
    startDate: "2025-09",
    endDate: "2025-10",
    summary:
      "Built the corporate web presence for a flight-training academy, then extended the engagement to two more aviation-themed properties.",
    highlights: [
      "Built a responsive corporate site with React, TypeScript, and Tailwind CSS — 95+ Lighthouse score, 1K+ monthly visitors (skycoreaviation.vercel.app).",
      "Shipped two further properties under the same engagement: a pilot simulation portal (pilot-sim-portal.vercel.app) and a private jet charter site (airjet-rosy.vercel.app).",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "exp-central-health-innovation",
    organization: "Central Health Innovation, MRIIRS",
    role: "Backend Developer",
    location: "Faridabad, Haryana",
    startDate: "2025-06",
    endDate: "2025-08",
    summary:
      "Built the backend for a healthcare initiative at MRIIRS, including location-aware lookups backed by the Google Maps API.",
    highlights: [
      "Built scalable REST APIs with Node.js, Express, TypeScript, and MongoDB.",
      "Integrated the Google Maps API to reduce query latency on location-based lookups.",
    ],
    stack: ["Node.js", "Express", "TypeScript", "MongoDB"],
  },
];

experience.forEach((entry) => experienceEntrySchema.parse(entry));
