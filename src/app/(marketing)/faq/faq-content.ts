export type FaqEntry = Readonly<{
  id: string;
  question: string;
  answer: string;
}>;

export const FAQ_ENTRIES: ReadonlyArray<FaqEntry> = [
  {
    id: "what-is-awa",
    question: "What is Aalgorix World Academy?",
    answer:
      "Aalgorix World Academy is an online learning and homeschooling platform for Grade 3 to Grade 12—powered by an AI Tutor and guided by industry-trained faculty. We focus on personalised learning, supplementary courses, life skills, and real-world outcomes.",
  },
  {
    id: "grades-age",
    question: "Which grades and age groups do you support?",
    answer:
      "Our core learning path supports Grade 3 through Grade 12, with programs designed for learners in the 8–18 age group.",
  },
  {
    id: "ai-learning",
    question: "How does your AI-powered learning work?",
    answer:
      "Our AI Tutor adapts learning pace and level, recommends practice and supplementary modules, and helps students build strong foundations. A dedicated life coach and faculty guidance keep learners consistent and motivated.",
  },
  {
    id: "special-needs",
    question: "Do you support learners with special learning needs?",
    answer:
      "Yes. We can support many learners who need extra attention through personalised pacing, structured routines, and closer mentor guidance. Share your child's needs during admission so we can recommend the right plan.",
  },
  {
    id: "hybrid-program",
    question: "What is the Hybrid School Program?",
    answer:
      "The Hybrid School Program blends structured home learning with live faculty support, small batches, and regular assessments. See the Programs page for details.",
  },
  {
    id: "screen-time",
    question: "How do you manage screen time?",
    answer:
      "We focus on regulated screen time by balancing guided learning with self-study and offline activities, keeping students engaged without excessive screen exposure.",
  },
  {
    id: "homeschooling",
    question: "Is this suitable for homeschooling?",
    answer:
      "Yes. Students can learn from the safety of their home with a structured plan, personalised learning paths, and progress tracking—so parents get clarity without supervising every session.",
  },
  {
    id: "future-ready",
    question: "What makes your program future-ready?",
    answer:
      "We prepare students for an algorithmic world with an AI-first curriculum, real-world skills, and talent farming—helping each learner discover strengths and build a portfolio.",
  },
  {
    id: "progress-reports",
    question: "Do you offer progress reports and assessments?",
    answer:
      "Yes. Students get regular assessments and progress tracking. Parents receive clear updates as learning advances.",
  },
  {
    id: "enroll-admissions",
    question: "How can I enroll or talk to admissions?",
    answer:
      "Reach our admissions team from the Contact page or via WhatsApp. We will recommend a plan based on grade, goals, and support needs.",
  },
] as const;
