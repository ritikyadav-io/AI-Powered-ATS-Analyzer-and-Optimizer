import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Analyzer from "../pages/Analyzer";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      functions: {
        invoke: vi.fn(),
      },
    },
  };
});

describe("Analyzer E2E Page Tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MemoryRouter>
            <Analyzer />
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  };

  it("should upload a resume, submit a job description, and run all 15 analysis pipeline nodes successfully", async () => {
    // 1. Mock the backend Supabase invoke calls for each group: critical, high, action
    const mockCriticalResponse = {
      data: {
        _perf: {
          group: "critical",
          ms: 150,
          provider: "lovable",
          model: "google/gemini-2.5-flash",
          attemptsLog: [
            { provider: "lovable", model: "google/gemini-2.5-flash", schema: true, status: "success", latencyMs: 150 }
          ]
        },
        candidate: {
          name: "John Doe",
          title: "Senior Software Engineer",
          topSkills: ["React", "TypeScript", "Node.js"]
        },
        categoryScores: [
          { name: "Keyword Match", score: 85, tone: "success" },
          { name: "Formatting", score: 90, tone: "success" }
        ],
        modules: [
          { id: "ats", name: "ATS Compliance Checker", desc: "ATS checker", score: 85, weight: "Critical", findings: ["A"], recommendations: ["Fix A"], reason: "Good" },
          { id: "quant", name: "Quantification Analyzer", desc: "Quant check", score: 80, weight: "Critical", findings: ["B"], recommendations: ["Fix B"], reason: "Good" },
          { id: "keywords", name: "Industry Keyword Gap", desc: "Keywords match", score: 90, weight: "Critical", findings: ["C"], recommendations: ["Fix C"], reason: "Good" },
          { id: "skills", name: "Skills Match Analyzer", desc: "Skills match", score: 88, weight: "Critical", findings: ["D"], recommendations: ["Fix D"], reason: "Good" }
        ],
        missingKeywords: ["Rust", "GraphQL"],
        strongPoints: ["Solid TypeScript design patterns", "Consistent clean architecture usage"],
        companyBrief: "Google Cloud Platform developer tools division specializing in container workflows."
      },
      error: null
    };

    const mockHighResponse = {
      data: {
        _perf: {
          group: "high",
          ms: 200,
          provider: "lovable",
          model: "google/gemini-2.5-flash",
          attemptsLog: [
            { provider: "lovable", model: "google/gemini-2.5-flash", schema: true, status: "success", latencyMs: 200 }
          ]
        },
        modules: [
          { id: "verbs", name: "Power Verb Enhancer", desc: "Power verbs", score: 90, weight: "High", findings: ["E"], recommendations: ["Fix E"], reason: "Good" },
          { id: "recruiter", name: "Recruiter Impression Scan", desc: "Recruiter scan", score: 85, weight: "High", findings: ["F"], recommendations: ["Fix F"], reason: "Good" },
          { id: "format", name: "Formatting Auditor", desc: "Formatting", score: 95, weight: "High", findings: ["G"], recommendations: ["Fix G"], reason: "Good" },
          { id: "achievement", name: "Achievement Strength", desc: "Achievement check", score: 80, weight: "High", findings: ["H"], recommendations: ["Fix H"], reason: "Good" },
          { id: "projects", name: "Project Impact Enhancer", desc: "Project check", score: 75, weight: "Medium", findings: ["I"], recommendations: ["Fix I"], reason: "Good" },
          { id: "grammar", name: "Grammar & Clarity", desc: "Grammar check", score: 98, weight: "Medium", findings: ["J"], recommendations: ["Fix J"], reason: "Good" },
          { id: "leadership", name: "Leadership & Ownership", desc: "Leadership check", score: 85, weight: "Medium", findings: ["K"], recommendations: ["Fix K"], reason: "Good" },
          { id: "redflags", name: "Red Flags Detector", desc: "Red flags", score: 90, weight: "Medium", findings: ["L"], recommendations: ["Fix L"], reason: "Good" }
        ]
      },
      error: null
    };

    const mockActionResponse = {
      data: {
        _perf: {
          group: "action",
          ms: 180,
          provider: "lovable",
          model: "google/gemini-2.5-flash",
          attemptsLog: [
            { provider: "lovable", model: "google/gemini-2.5-flash", schema: true, status: "success", latencyMs: 180 }
          ]
        },
        verdict: "Strong frontend application demonstrating high keyword alignment.",
        rewrites: [
          { type: "Metrics", before: "Wrote backend endpoints", after: "Engineered scalable Go backend endpoints, serving 2M+ active request transactions with 50ms latency." }
        ],
        linkedinSummary: "Highly energetic senior software engineering lead specialized in TypeScript systems...",
        coverLetter: "Dear Google Cloud Hiring Team, I am extremely thrilled to apply..."
      },
      error: null
    };

    // Configure the mock responses based on group name passed in body with a slight delay
    vi.mocked(supabase.functions.invoke).mockImplementation(async (fnName, options: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const group = options?.body?.group;
      if (group === "critical") return mockCriticalResponse as any;
      if (group === "high") return mockHighResponse as any;
      if (group === "action") return mockActionResponse as any;
      return { data: null, error: new Error("Invalid mock group") } as any;
    });

    renderComponent();

    // 2. Upload sample resume file
    const file = new File(["sample resume content"], "resume.pdf", { type: "application/pdf" });
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(fileInput).toBeTruthy();
    
    // Simulate drop or change event
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Verify file name displays in the UploadZone
    await waitFor(() => {
      expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    });

    // 3. Fill in target role inputs
    const companyInput = screen.getByPlaceholderText("e.g. Stripe");
    fireEvent.change(companyInput, { target: { value: "Google Cloud" } });

    const roleInput = screen.getByPlaceholderText("e.g. Senior Data Analyst");
    fireEvent.change(roleInput, { target: { value: "Senior Frontend Engineer" } });

    const jdTextarea = screen.getByPlaceholderText("Paste the job description…");
    fireEvent.change(jdTextarea, { target: { value: "We are hiring a Senior Frontend Engineer proficient in React and TypeScript. Must design clean client architectures." } });

    // 4. Click run analysis
    const runBtn = screen.getByRole("button", { name: /Run AI Analysis/i });
    fireEvent.click(runBtn);

    // 5. Assert loading screen shows
    expect(await screen.findByText(/Analyzing your resume against/i)).toBeInTheDocument();
    expect(screen.getByText(/running the 15-node ATS pipeline/i)).toBeInTheDocument();

    // 6. Wait for UI to resolve to results stage
    expect(await screen.findByText("One-click ATS report", {}, { timeout: 10000 })).toBeInTheDocument();

    // 7. Assert results details show up properly
    expect(screen.getByText("Strong frontend application demonstrating high keyword alignment.")).toBeInTheDocument();
    expect(screen.getByText("John Doe · Senior Software Engineer")).toBeInTheDocument();
    
    // Check computed score mathematically:
    // Critical (ATS 85, Quant 80, Keywords 90, Skills 88) - Weight 1.5 each
    // High (Verbs 90, Recruiter 85, Format 95, Achievement 80) - Weight 1.2 each
    // Medium (Projects 75, Grammar 98, Leadership 85, Redflags 90) - Weight 1.0 each
    // Total weight: (4*1.5) + (4*1.2) + (4*1.0) = 6.0 + 4.8 + 4.0 = 14.8
    // Total score sum: (85+80+90+88)*1.5 + (90+85+95+80)*1.2 + (75+98+85+90)*1.0
    //                 = (343)*1.5 + (350)*1.2 + (348)*1.0
    //                 = 514.5 + 420.0 + 348.0 = 1282.5
    // Weighted avg: 1282.5 / 14.8 = 86.65 => round => 87
    expect(screen.getByText("87")).toBeInTheDocument(); // overall score

    // Assert missing keywords show up
    expect(screen.getByText("Rust")).toBeInTheDocument();
    expect(screen.getByText("GraphQL")).toBeInTheDocument();

    // 8. Assert Diagnostics Timeline exists and shows correct metrics
    expect(screen.getByText("Pipeline Diagnostics & Fallback Timeline")).toBeInTheDocument();
    
    // Toggle Diagnostics Timeline to verify items render
    const diagnosticsToggle = screen.getByText("Pipeline Diagnostics & Fallback Timeline");
    fireEvent.click(diagnosticsToggle);

    expect(screen.getByText("Critical Modules Group")).toBeInTheDocument();
    expect(screen.getByText(/resolved via Lovable \(google\/gemini-2.5-flash\) in 150ms/i)).toBeInTheDocument();
  }, 15000);
});
