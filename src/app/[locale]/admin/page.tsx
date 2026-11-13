"use client";

import { ExperimentContentEditor } from "@/features/experiments/components/ExperimentContentEditor";
import { AdminUsers } from "@/features/auth/AdminUsers";
import React, { useState, useEffect } from "react";
import { Video, Globe, CheckCircle2, PlusCircle, ShieldCheck } from "lucide-react";
import { getAllExperiments } from "@/features/experiments/data";
import { extractYouTubeId } from "@/features/experiments/types";

export default function AdminStudioPage() {
  const [initialExperiments, setExperiments] = useState(getAllExperiments);
  const [records, setRecords] = useState<Record<string, { status: string; updatedAt: string }>>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("published");
  const [selectedExp, setSelectedExp] = useState(initialExperiments[0]);
  const [youtubeInput, setYoutubeInput] = useState(selectedExp.youtubeVideo);
  const [titleKy, setTitleKy] = useState(selectedExp.title.ky);
  const [titleRu, setTitleRu] = useState(selectedExp.title.ru);
  const [titleEn, setTitleEn] = useState(selectedExp.title.en);
  const [equation, setEquation] = useState(selectedExp.chemicalEquation);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/experiments", { cache: "no-store" }).then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setExperiments(result.experiments.map((row: { data: (typeof initialExperiments)[number] }) => row.data));
      setRecords(Object.fromEntries(result.experiments.map((row: { slug: string; status: string; updated_at: string }) => [row.slug, { status: row.status, updatedAt: row.updated_at }])));
      const first = result.experiments[0];
      if (first) {
        setSelectedExp(first.data);
        setStatus(first.status);
        setYoutubeInput(first.data.youtubeVideo);
        setTitleKy(first.data.title.ky);
        setTitleRu(first.data.title.ru);
        setTitleEn(first.data.title.en);
        setEquation(first.data.chemicalEquation);
        setLoaded(true);
      } else setError("No experiments are available to edit.");
    }).catch(() => setError("Unable to load the saved catalog. Reload before editing."));
  }, []);

  const resolvedYoutubeId = extractYouTubeId(youtubeInput);

  function selectExperiment(exp: (typeof initialExperiments)[number]) {
    setSelectedExp(exp);
    setStatus(records[exp.slug]?.status ?? "draft");
    setYoutubeInput(exp.youtubeVideo);
    setTitleKy(exp.title.ky);
    setTitleRu(exp.title.ru);
    setTitleEn(exp.title.en);
    setEquation(exp.chemicalEquation);
    setSavedNotice(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!loaded || saving) return;
    setSaving(true); setError(""); setSavedNotice(false);
    try {
      const response = await fetch("/api/admin/experiments", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ experiment: { ...selectedExp, youtubeVideo: youtubeInput, title: { en: titleEn, ky: titleKy, ru: titleRu }, chemicalEquation: equation }, status, updatedAt: records[selectedExp.slug]?.updatedAt ?? null }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setRecords(prev => ({ ...prev, [selectedExp.slug]: { status, updatedAt: result.updatedAt } }));
      const saved = { ...selectedExp, youtubeVideo: resolvedYoutubeId, title: { en: titleEn, ky: titleKy, ru: titleRu }, chemicalEquation: equation };
      setExperiments(prev => prev.some(exp => exp.slug === saved.slug) ? prev.map(exp => exp.slug === saved.slug ? saved : exp) : [...prev, saved]);
      setSavedNotice(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to save."); }
    finally { setSaving(false); }
  }

  return (
    <div className="container-page py-8 sm:py-12 space-y-8 overflow-y-auto flex-1">
      <div className="space-y-2 max-w-3xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-bold">
          <ShieldCheck className="size-3.5" />
          Administrator Content Studio (CMS)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">
          Manage Experiments, YouTube Videos & Translations
        </h1>
        <p className="text-base text-ink-soft">
          Codify and update the 24 chemistry experiments, paste YouTube URLs or 11-character video
          IDs, and review Kyrgyz (Ң, Ө, Ү), Russian, and English scientific text.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Catalog Selector Sidebar */}
        <div className="lg:col-span-4 card-tactile p-4 bg-card space-y-3 max-h-[640px] overflow-y-auto">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">
              Catalog ({initialExperiments.length}/30 max)
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
              <PlusCircle className="size-3.5" />
              Metadata editor
            </span>
          </div>
          <button type="button" disabled={!loaded || saving || initialExperiments.length >= 30} className="btn-tactile-secondary w-full px-4 py-2 disabled:opacity-40" onClick={() => {
            const draft = { ...structuredClone(selectedExp), id: crypto.randomUUID(), slug: `new-experiment-${Date.now()}`, featured: false, procedure: undefined, transcriptSegments: undefined };
            selectExperiment(draft); setStatus("draft");
          }}>Create draft from selected experiment</button>
          <ul className="space-y-1.5">
            {initialExperiments.map((exp, idx) => {
              const active = exp.id === selectedExp.id;
              return (
                <li key={exp.id}>
                  <button
                    type="button"
                    disabled={!loaded || saving}
                    onClick={() => selectExperiment(exp)}
                    className={`w-full text-left rounded-xl p-3 text-xs transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-white font-bold"
                        : "bg-surface text-ink hover:bg-primary-soft"
                    }`}
                  >
                    <div className="truncate">
                      {idx + 1}. {exp.title.en}
                    </div>
                    <div
                      className={`truncate text-[11px] mt-0.5 ${
                        active ? "text-white/80" : "text-ink-muted"
                      }`}
                    >
                      KY: {exp.title.ky}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Editor Form + Live YouTube Embed Preview */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-8 card-tactile p-6 sm:p-8 bg-card space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border">
            <div>
              <div className="text-xs font-mono text-ink-muted">Slug: /{selectedExp.slug}</div>
              <h2 className="text-xl font-bold text-ink">{titleEn}</h2>
            </div>
            <span className="rounded-full bg-success-soft text-success px-3 py-1 text-xs font-bold">
              KY · RU · EN
            </span>
          </div>

          {error && <p role="alert" className="text-red-700">{error}</p>}
          <label className="block font-semibold">Publication status
            <select aria-label="Publication status" className="ml-3 border rounded p-2" value={status} onChange={e => setStatus(e.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select>
          </label>
          {!records[selectedExp.slug] && <label className="block">New experiment URL slug<input className="mt-1 w-full rounded border border-input p-3" value={selectedExp.slug} onChange={e=>setSelectedExp({...selectedExp,slug:e.target.value})}/></label>}
          {/* YouTube Video URL or ID Input + Live Preview */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-ink flex items-center gap-2">
              <Video className="size-4 text-primary" />
              YouTube Video URL or 11-Character Video ID
            </label>
            <input
              type="text"
              aria-label="YouTube video URL or ID"
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or 11-char ID"
              className="w-full rounded-xl border border-input bg-surface px-3.5 py-2.5 font-mono text-sm text-ink focus:border-primary focus:outline-none"
            />
            <div className="text-xs text-ink-soft">
              Resolved YouTube Embed ID:{" "}
              <code className="font-mono font-bold text-primary">{resolvedYoutubeId}</code>
            </div>
            <div className="aspect-video w-full max-w-md rounded-xl overflow-hidden border border-border bg-black">
              <iframe
                key={resolvedYoutubeId}
                src={`https://www.youtube-nocookie.com/embed/${resolvedYoutubeId}?rel=0`}
                title="Admin YouTube Preview"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>

          {/* Multilingual Titles */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="text-sm font-bold text-ink flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              Multilingual Titles & Chemical Equation
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink-soft mb-1">
                  Кыргызча (Kyrgyz — supports Ң ң, Ө ө, Ү ү)
                </label>
                <input
                  type="text"
                  aria-label="Kyrgyz title"
                  value={titleKy}
                  onChange={(e) => setTitleKy(e.target.value)}
                  className="w-full rounded-xl border border-input bg-surface px-3.5 py-2 text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-soft mb-1">
                  Русский (Russian)
                </label>
                <input
                  type="text"
                  aria-label="Russian title"
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  className="w-full rounded-xl border border-input bg-surface px-3.5 py-2 text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-soft mb-1">
                  English
                </label>
                <input
                  type="text"
                  aria-label="English title"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full rounded-xl border border-input bg-surface px-3.5 py-2 text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-soft mb-1">
                  Balanced Chemical Equation / Relationship
                </label>
                <input
                  type="text"
                  aria-label="Chemical equation"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  className="w-full rounded-xl border border-input bg-surface px-3.5 py-2 font-mono text-sm text-ink"
                />
              </div>
            </div>
          </div>

          <ExperimentContentEditor value={selectedExp} onChange={setSelectedExp} />
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              {savedNotice && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-success">
                  <CheckCircle2 className="size-4" />
                  Changes saved to the catalog.
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!loaded || saving}
              className="px-6 py-2.5 text-sm btn-tactile-primary cursor-pointer"
            >
              {saving ? "Saving…" : "Save experiment"}
            </button>
          </div>
        </form>
      </div>
      <AdminUsers />
    </div>
  );
}
