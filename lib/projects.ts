/**
 * Project list — edit this file to add/remove/update projects.
 * Order: higher `position` shows first.
 */

export type ProjectCategory = "AI" | "Fullstack" | "Frontend" | "Backend" | "Web3" | "Mobile";

export type Project = {
  id: number;
  name: string;
  slug: string;
  category: ProjectCategory | string;
  role: string;
  description: string;
  stack: string[];
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  position?: number;
};

export const projects: Project[] = [
  {
    id: 1,
    name: "SnapCV",
    slug: "snapcv",
    category: "Frontend",
    role: "Frontend Engineer (Team)",
    description:
      "SnapCV is an AI-powered SaaS platform for building ATS-friendly resumes, designed for Indonesian students and fresh graduates. Currently in active migration from a static landing page to a full-stack Next.js App Router application with integrated AI optimization and PDF export.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Lucide",
    ],
    imageUrl: "/projects/SnapCV.png",
    demoUrl: "https://snapcv-cvbuilder.vercel.app/",
    repoUrl: "https://github.com/nafizamhdr/snapcv",
    featured: true,
    position: 90,
  },
  {
    id: 2,
    name: "NEMOS",
    slug: "nemos",
    category: "Frontend",
    role: "Frontend Engineer (Team)",
    description:
      "NEMOS is a financing platform that reimagines how Indonesian SMEs access capital through Revenue-Based Financing (RBF). It connects investors with high-potential SMEs transparently and interest-free, leveraging AI-powered receipt verification and on-chain audit trails for tamper-proof transaction records.",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Solidity",
      "AI / OCR",
    ],
    imageUrl: "/projects/Nemos.png",
    demoUrl: "https://nemos-three.vercel.app/",
    repoUrl: "https://github.com/HisyamAlammar/NEMOS",
    featured: true,
    position: 80,
  },
  {
    id: 3,
    name: "Kinea",
    slug: "kinea",
    category: "Fullstack",
    role: "Solo Developer",
    description:
      "Kinea is a CEP extension for Adobe After Effects that turns natural-language intent into real motion-design work. Describe what you want; Kinea plans the action, generates the steps, and builds it live inside your active composition — powered by the AI CLI you already have logged in. Zero API key management, costs scale with your own account.",
    stack: [
      "Adobe CEP 9",
      "JavaScript",
      "Node.js 18+",
      "ExtendScript",
      "Gemini CLI",
      "Claude Code",
    ],
    imageUrl: "/projects/Kinea.svg",
    repoUrl: "https://github.com/nafizamhdr/Kinea",
    featured: true,
    position: 70,
  },
  {
    id: 4,
    name: "AURA",
    slug: "aura",
    category: "AI",
    role: "ML Engineer (Team)",
    description:
      "AURA (Accenture Universal Reliability Assistant) is a Predictive Maintenance Copilot platform built to revolutionize how industries monitor and maintain vital assets. It tackles the high cost of unexpected machine downtime by translating complex sensor data into clear, actionable insights for operators — combining time-series modeling, anomaly detection, and an LLM-powered assistant for natural-language diagnostics.",
    stack: ["Python", "scikit-learn", "Pandas", "NumPy", "TensorFlow", "FastAPI", "Streamlit"],
    imageUrl: "/projects/Aura.png",
    repoUrl: "https://github.com/fatimaah0123/CapstoneAsah_Aura",
    featured: true,
    position: 60,
  },
  {
    id: 5,
    name: "Hercules",
    slug: "hercules",
    category: "Fullstack",
    role: "Solo Developer",
    description:
      "AI-powered fitness assistant that runs entirely in the browser — no backend, no database, no account required. Users bring their own Gemini API key and get personalized workouts, session logging, strength tracking, and AI-driven progress analysis. Built as a privacy-first, install-free PWA.",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Google Gemini API", "LocalStorage"],
    imageUrl: "/projects/Hercules.png",
    repoUrl: "https://github.com/nafizamhdr/Hercules-Personal-AI-Fitness-Assistant",
    featured: true,
    position: 50,
  },
  {
    id: 6,
    name: "Attesta",
    slug: "attesta",
    category: "Frontend",
    role: "Frontend Engineer (Team)",
    description:
      "Attesta is a decentralized platform that analyzes GitHub repositories to evaluate developer contributions and code quality at scale. It leverages the Claude API to perform deep, context-aware code analysis and anchors every verified assessment on-chain — producing tamper-proof reputation records for developers and open-source contributors.",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Claude API", "Monad Blockchain"],
    imageUrl: "/projects/Attesta.png",
    repoUrl: "https://github.com/Attesta-Monad",
    featured: true,
    position: 40,
  },
  {
    id: 7,
    name: "Garbage Classification",
    slug: "garbage-classification",
    category: "AI",
    role: "Solo Developer",
    description:
      "Deep-learning image classifier for 10 garbage categories using MobileNetV2 transfer learning in TensorFlow. Includes data augmentation, EarlyStopping and ModelCheckpoint callbacks, and a full conversion pipeline to TFLite and TFJS for mobile and web deployment.",
    stack: [
      "Python",
      "TensorFlow",
      "Keras",
      "MobileNetV2",
      "Matplotlib",
      "Seaborn",
      "TFLite",
      "TFJS",
    ],
    imageUrl: "/projects/GarbageClassification.svg",
    repoUrl: "https://github.com/nafizamhdr/Garbage-Classification-MobileNetV2",
    featured: true,
    position: 30,
  },
  {
    id: 8,
    name: "Steroid Discourse Sentiment",
    slug: "steroid-discourse-sentiment",
    category: "AI",
    role: "Solo Developer",
    description:
      "NLP sentiment analysis of YouTube comments discussing teen steroid use. Compares Logistic Regression, Random Forest, and Linear SVM classifiers across TF-IDF and Count Vectorizer feature extraction, with VADER-based automatic labeling.",
    stack: [
      "Python",
      "scikit-learn",
      "NLTK",
      "VADER",
      "Pandas",
      "NumPy",
      "TF-IDF",
      "joblib",
    ],
    imageUrl: "/projects/SteroidSentiment.svg",
    repoUrl: "https://github.com/nafizamhdr/steroid-discourse-sentiment",
    featured: true,
    position: 20,
  },
];

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => {
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    if (fa !== fb) return fb - fa;
    return (b.position ?? 0) - (a.position ?? 0);
  });
}
