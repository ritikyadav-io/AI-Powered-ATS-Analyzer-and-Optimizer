import type { AnalysisReport } from "./reportPdf";

const KEY = "resumai.history.v1";

export type HistoryEntry = {
  id: string;
  createdAt: number;
  company: string;
  role: string;
  overallScore: number;
  candidateName: string;
  report: AnalysisReport;
};

export function getHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveHistory(entry: Omit<HistoryEntry, "id" | "createdAt">) {
  const list = getHistory();
  const withId: HistoryEntry = { ...entry, id: crypto.randomUUID(), createdAt: Date.now() };
  const next = [withId, ...list].slice(0, 25);
  localStorage.setItem(KEY, JSON.stringify(next));
  return withId;
}

export function removeHistory(id: string) {
  const next = getHistory().filter(h => h.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearHistory() { localStorage.removeItem(KEY); }