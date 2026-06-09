export const siteConfig = {
  name: "Nafiza Mahadri Widyatamaka",
  shortName: "Nafiza",
  initial: "N",
  role: "AI Engineer & Fullstack Developer",
  location: "Yogyakarta, Indonesia",
  email: "nafizawae@gmail.com",
  avatar: "/profile.jpg",

  tagline:
    "AI Engineer & Full-Stack Web Developer. Transforming complex data into intelligent, user-centric applications. Experienced in blending machine learning, Web3 integration, and full-stack technologies to build innovative, end-to-end digital ecosystems.",

  bio: "Informatics student at Universitas Amikom Yogyakarta with a deep passion for creating intelligent, user-centric digital experiences. I specialize in integrating machine learning models with full-stack web development, bridging the gap between complex AI algorithms and intuitive interfaces. I am driven by the challenge of transforming raw data and modern web architecture into scalable applications that deliver real-world solutions.",

  education: [
    {
      school: "Universitas Amikom Yogyakarta",
      degree: "Informatics",
      period: "2023 — Present",
    },
  ],

  experience: [
    {
      role: "Practicum Assistant",
      company: "Universitas Amikom Yogyakarta",
      period: "2024 — Present",
      description:
        "Assisting laboratory practicums for Computer Graphics, Multimedia, and Advanced Programming courses. Mentoring students through hands-on coding exercises and reviewing project submissions.",
    },
  ],

  socials: {
    github: "https://github.com/Nafizamhdr",
    linkedin: "https://www.linkedin.com/in/nafiza-mahadri-972524360/",
    instagram: "https://www.instagram.com/nafizamhdri/",
    email: "mailto:nafizawae@gmail.com",
  },

  skills: {
    "AI / ML": [
      "Python",
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "LangChain",
      "OpenAI API",
      "Hugging Face",
      "RAG",
      "Vector DB (Pinecone / Chroma)",
    ],
    Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite"],
    Backend: ["Node.js", "FastAPI", "Express", "PostgreSQL", "MongoDB"],
    "Tools / DevOps": ["Docker", "Git", "Vercel", "AWS"],
  } as Record<string, string[]>,
};

export type SiteConfig = typeof siteConfig;
