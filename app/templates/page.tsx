import Link from 'next/link';
import { ArrowUpRight, Check, Code2, Search, Sparkles } from 'lucide-react';
import { templates, filterTemplates, frameworks, type TemplateCategory } from '@/lib/platform/templates';

function TemplateCard({ template }: { template: (typeof templates)[number] }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/30">
      <Link href={`/templates/${template.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className={`flex h-36 items-end bg-gradient-to-br ${template.imageClass} p-5 text-white`}>
          <div className="flex size-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm"><Code2 className="size-5" /></div>
        </div>
        <div className="p-5">
          <div className="mb-3 flex items-start justify-between gap-3"><h2 className="font-semibold tracking-tight">{template.name}</h2><ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
          <p className="min-h-12 text-sm leading-6 text-muted-foreground">{template.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">{template.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{tag}</span>)}</div>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>{template.framework}</span><a href={template.deployUrl} target="_blank" rel="noreferrer" className="font-medium text-foreground hover:underline">Deploy</a></div>
    </article>
  );
}

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; framework?: string }> }) {
  const params = await searchParams;
  const category = params.category === 'starter' || params.category === 'solution' ? params.category : 'all';
  const framework = params.framework && frameworks.includes(params.framework) ? params.framework : 'all';
  const results = filterTemplates({ query: params.q, category: category as TemplateCategory | 'all', framework });

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8"><Link href="/" className="font-semibold tracking-tight">Northstar Cloud</Link><nav className="flex items-center gap-4 text-sm text-muted-foreground"><Link href="/admin" className="hover:text-foreground">Console</Link><span className="text-foreground">Templates</span></nav></div></header>
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="max-w-2xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Start building</p><h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">Find a template for your next idea.</h1><p className="mt-5 text-pretty text-base leading-7 text-muted-foreground md:text-lg">Production-ready foundations and focused examples for teams building on the central platform.</p></div>
        <form className="mt-10 flex max-w-3xl flex-col gap-3 md:flex-row" action="/templates"><label className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><input name="q" defaultValue={params.q} placeholder="Search templates, frameworks, or capabilities" className="h-11 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" /></label><select name="category" defaultValue={category} className="h-11 rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="all">All categories</option><option value="starter">Starters</option><option value="solution">Solutions</option></select><select name="framework" defaultValue={framework} className="h-11 rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="all">All frameworks</option>{frameworks.map((item) => <option key={item} value={item}>{item}</option>)}</select><button className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90" type="submit">Search</button></form>
        <div className="mt-12 flex items-center justify-between gap-4 border-b border-border pb-4"><div><h2 className="text-lg font-semibold">{params.q || category !== 'all' || framework !== 'all' ? 'Matching templates' : 'Featured templates'}</h2><p className="mt-1 text-sm text-muted-foreground">{results.length} curated {results.length === 1 ? 'template' : 'templates'}</p></div><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><Sparkles className="size-4" /> Vercel-inspired starters</div></div>
        {results.length ? <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{results.map((template) => <TemplateCard key={template.slug} template={template} />)}</div> : <div className="mt-6 rounded-xl border border-dashed border-border px-6 py-20 text-center"><p className="font-medium">No templates found</p><p className="mt-2 text-sm text-muted-foreground">Try another search or reset your filters.</p><Link href="/templates" className="mt-5 inline-flex items-center gap-2 text-sm font-medium hover:underline"><Check className="size-4" /> View all templates</Link></div>}
      </div>
    </main>
  );
}
