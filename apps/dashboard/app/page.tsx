import { aggregateActivity, calculateFocusScore, calculateGoalAlignment, calculateProductivityScore, formatDuration } from "@lifeos/analytics";
import { Card, MetricCard } from "@lifeos/ui";
import { events, goals } from "../lib/mock-data";
import { ActivityChart } from "../components/activity-chart";

export default function DashboardPage() {
  const totals = aggregateActivity(events);
  const productivity = calculateProductivityScore(events);
  const focus = calculateFocusScore(events);
  const alignment = calculateGoalAlignment(events, goals);
  const codingSeconds = totals.byCategory.development;
  const learningSeconds = totals.byCategory.learning;
  const distractionSeconds = totals.byCategory.social + totals.byCategory.entertainment + totals.byCategory.shopping;

  return (
    <main className="grid-bg min-h-screen overflow-hidden px-6 py-8 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(14,165,233,.2),transparent_30%)]" />
      <section className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3"><div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-violet-400 to-sky-400" /><span className="font-semibold">LifeOS AI</span></div>
          <div className="hidden gap-6 text-sm text-white/60 md:flex"><span>Dashboard</span><span>Reports</span><span>Goals</span><span>Privacy</span></div>
        </nav>
        <header className="py-14">
          <p className="text-sm uppercase tracking-[0.4em] text-violet-200/70">Personal analytics, automatically</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">Understand where your digital life actually goes.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/60">LifeOS AI combines desktop, browser, mobile, and coding telemetry into privacy-first summaries that reveal focus, learning, distractions, and goal alignment.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Focus Score" value={`${focus.score}%`} detail={focus.explanation} tone="violet" />
          <MetricCard label="Productivity Score" value={`${productivity.score}%`} detail="Weighted from development, learning, and deep work." tone="emerald" />
          <MetricCard label="Screen Time" value={formatDuration(totals.totalSeconds)} detail="Tracked across connected sources." tone="sky" />
          <MetricCard label="Goal Alignment" value={`${alignment}%`} detail="Actual behavior compared with active goals." tone="amber" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <Card><div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-semibold">Daily activity timeline</h2><p className="text-sm text-white/50">Category distribution by tracked session.</p></div></div><ActivityChart data={events.map((event) => ({ name: event.title, minutes: Math.round(event.durationSeconds / 60), category: event.category }))} /></Card>
          <Card><h2 className="text-xl font-semibold">Today at a glance</h2><div className="mt-6 space-y-4 text-sm text-white/70"><p>Coding time: <b className="text-white">{formatDuration(codingSeconds)}</b></p><p>Learning time: <b className="text-white">{formatDuration(learningSeconds)}</b></p><p>Distraction time: <b className="text-white">{formatDuration(distractionSeconds)}</b></p><p>Most used app: <b className="text-white">{totals.byApp[0]?.name}</b></p><p>Most used website: <b className="text-white">{totals.byDomain[0]?.domain}</b></p></div></Card>
        </div>
      </section>
    </main>
  );
}
