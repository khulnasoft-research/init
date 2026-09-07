import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from 'lucide-react';
import { getRelatedTemplates, getTemplate, templates } from '@/lib/platform/templates';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return templates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const template = getTemplate((await params).slug);
  return template ? { title: `${template.name} | Northstar Templates`, description: template.description } : { title: 'Template not found' };
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const template = getTemplate((await params).slug);
  if (!template) notFound();
  const related = getRelatedTemplates(template);

  return <main className="min-h-screen bg-background"><header className="border-b border-border"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8"><Link href="/templates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All templates</Link><Link href="/admin" className="text-sm font-medium hover:underline">Console</Link></div></header><div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16"><div className={`flex h-56 items-end rounded-2xl bg-gradient-to-br ${template.imageClass} p-7 text-white md:h-72`}><div><p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/70">{template.category}</p><h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{template.name}</h1></div></div><div className="grid gap-10 py-10 lg:grid-cols-[1fr_280px]"><div><p className="max-w-2xl text-lg leading-8 text-muted-foreground">{template.description}</p><div className="mt-7 flex flex-wrap gap-2">{template.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">{tag}</span>)}</div><div className="mt-10 flex flex-wrap gap-3"><a href={template.deployUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Deploy template <ArrowUpRight className="size-4" /></a><a href={template.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">View source <ExternalLink className="size-4" /></a>{template.demoUrl && <Link href={template.demoUrl} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">View demo</Link>}</div></div><aside className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Template details</h2><dl className="mt-5 flex flex-col gap-4 text-sm"><div><dt className="text-muted-foreground">Framework</dt><dd className="mt-1 font-medium">{template.framework}</dd></div><div><dt className="text-muted-foreground">Environment variables</dt><dd className="mt-2 flex flex-col gap-2">{template.envVars.length ? template.envVars.map((env) => <span key={env} className="inline-flex items-center gap-2 font-mono text-xs"><Check className="size-3 text-muted-foreground" />{env}</span>) : <span className="text-muted-foreground">None required</span>}</dd></div></dl></aside></div>{related.length > 0 && <section className="border-t border-border pt-8"><h2 className="text-lg font-semibold">More like this</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{related.map((item) => <Link key={item.slug} href={`/templates/${item.slug}`} className="rounded-lg border border-border p-4 hover:border-foreground/30"><p className="font-medium">{item.name}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p></Link>)}</div></section>}</div></main>;
}
