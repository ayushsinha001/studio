# CourtIQ | Premium AI Legal Intelligence System

CourtIQ is a high-fidelity LegalTech platform designed to accelerate the judicial process through structured AI intervention. Built for the modern Indian Judiciary, it bridges the gap between massive case backlogs and rapid justice delivery.

## 🚀 Hackathon Technical Pitch

### 🧠 Core Innovation: The "Judicial Intelligence" Engine
CourtIQ doesn't just "chat" about law; it performs structured legal reasoning.
- **Genkit Flows:** All AI features are orchestrated via Genkit flows with strict Zod-validated input/output schemas. This ensures that legal documents, outcome predictions, and triage scores are consistent and admissible for research.
- **BNS/BSA Integration:** Fully aware of the 2023 Indian legal reforms, capable of performing "Statutory Duality" checks (IPC vs. BNS).
- **Evidentiary Strength Modeling:** A predictive engine that maps documentary and witness testimony against historical Supreme Court precedents.

### 🛠 Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
- **UI Components:** ShadCN UI (Radix Primitives), Lucide Icons.
- **AI Backend:** Genkit 1.x, Google Gemini 2.5 Flash.
- **Data Visualization:** Recharts (Area & Bar Charts).
- **Type Safety:** 100% TypeScript with rigorous schema validation.

### ⚖️ Feature Suite
1. **Outcome Predictor:** Predictive modeling for civil/criminal cases with confidence scoring.
2. **Drafting Studio:** Automated generation of NDAs, Writ Petitions, and Legal Notices.
3. **Evidence Analyzer:** AI-powered fact extraction and internal contradiction detection.
4. **JAI Triage Center:** A "Justice Acceleration Index" that prioritizes cases based on Article 21 principles.
5. **AI Stenographer:** High-fidelity transcription of court proceedings.
6. **Smart Calendar:** Complexity-aware scheduling to minimize court idle time.

## 🏗 Architectural Highlights
- **Server Actions:** Direct client-to-server AI invocation with a 20MB body limit for document/audio uploads.
- **Resilient AI:** Integrated error handling for rate-limiting (429 errors) and resource exhaustion.
- **Mobile First:** Responsive sidebar-based navigation for judicial officers on the move.

---
*Developed for the AI LegalTech Hackathon 2024.*