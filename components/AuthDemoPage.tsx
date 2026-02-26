"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AuthDemoPageProps = {
  title: string;
  intro: string;
  steps: string[];
  children: ReactNode;
};

export function AuthDemoPage({
  title,
  intro,
  steps,
  children,
}: AuthDemoPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="border-b border-blue-200 bg-white/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              Sign In Account
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          </div>
          <Link
            href="/public"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-500"
          >
            Back home →
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* 3. Updated the "Intro" box to be white so it pops off the blue bg */}
          <section className="rounded-[32px] border border-blue-200 bg-gradient-to-br from-[#448ecb] via-[#a1c9ea ] to-[#8ab3d5] p-8 shadow-sm">
            <p className="text-lg font-medium text-slate-100">{intro}</p>
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-slate-200">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          <div className="flex flex-col gap-6">{children}</div>
        </div>
      </main>
    </div>
  );
}