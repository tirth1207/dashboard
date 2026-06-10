"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ActivityChart({ data }: { data: Array<{ name: string; minutes: number; category: string }> }) {
  return <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} /><XAxis dataKey="name" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} /><YAxis stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16 }} /><Bar dataKey="minutes" fill="url(#lifeos)" radius={[12, 12, 0, 0]} /><defs><linearGradient id="lifeos" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#38bdf8" /></linearGradient></defs></BarChart></ResponsiveContainer></div>;
}
