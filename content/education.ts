import { Certification, Education } from "./types";

export const education: Education = {
  degree: "Bachelor of Technology in Computer Science and Engineering",
  institution: "Malla Reddy Institute of Technology and Science",
  location: "Hyderabad",
  startDate: "Oct 2021",
  endDate: "Jul 2024",
  gpa: "7.3",
};

export const certifications: Certification[] = [
  {
    name: "Cisco Certified Network Associate (CCNA)",
    issuer: "Cisco",
    issued: "Jul 2026",
    credentialUrl: "https://www.credly.com/badges/e3cc7a86-9610-444a-8345-cabf2996e6ed/public_url",
  },
  {
    name: "Cisco AI Technical Practitioner (AITECH)",
    issuer: "Cisco",
    credentialUrl: "https://www.credly.com/badges/e27d2abe-9a01-4995-8af3-5e6e68f6757f/public_url",
  },
];
