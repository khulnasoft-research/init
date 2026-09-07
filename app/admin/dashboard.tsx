'use client';

import { useActionState, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Bot,
  Box,
  Boxes,
  ChevronDown,
  CircleHelp,
  Clock3,
  Code2,
  Database,
  ExternalLink,
  Flag,
  Gauge,
  Globe2,
  KeyRound,
  Layers3,
  LifeBuoy,
  ListFilter,
  Loader2,
  Logs,
  Menu,
  MoreHorizontal,
  Plus,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  Workflow,
  X,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { deleteSubdomainAction } from '@/app/actions';
import { protocol, rootDomain } from '@/lib/utils';

type Tenant = { subdomain: string; emoji: string; createdAt: number };
type DeleteState = { error?: string; success?: string };

type NavItem = { label: string; icon: typeof Search; count?: string };

const primaryNav: NavItem[] = [
  { label: 'Projects', icon: Boxes, count: '88' },
  { label: 'Deployments', icon: Rocket },
  { label: 'Logs', icon: Logs },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Speed Insights', icon: Gauge },
  { label: 'Observability', icon: Activity },
  { label: 'Firewall', icon: Shield },
  { label: 'CDN', icon: Zap },
  { label: 'Environment Variables', icon: KeyRound },
  { label: 'Domains', icon: Globe2 }
];

const platformNav: NavItem[] = [
  { label: 'Connect', icon: Code2 },
  { label: 'Integrations', icon: Layers3 },
  { label: 'Storage', icon: Database },
  { label: 'Flags', icon: Flag },
  { label: 'Agent', icon: Bot },
  { label: 'AI Gateway', icon: Sparkles },
  { label: 'Sandboxes', icon: Box },
  { label: 'Workflows', icon: Workflow },
  { label: 'Images', icon: Activity },
  { label: 'Usage', icon: Clock3 }
];

function Sidebar({ active, onSelect }: { active: string; onSelect: (label: string) => void }) {
  const renderItems = (items: NavItem[]) => (
    <div className="flex flex-col gap-0.5">
      {items.map(({ label, icon: Icon, count }) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(label)}
          className={`flex items-center justify-between rounded-md px-2.5 py-2 text-left text-[13px] transition-colors ${
            active === label
              ? 'bg-accent font-medium text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </span>
          {count && <span className="text-xs text-muted-foreground">{count}</span>}
        </button>
      ))}
    </div>
  );

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="flex size-6 items-center justify-center rounded-sm bg-foreground text-background">
          <span className="text-xs font-bold">N</span>
        </div>
        <span className="text-sm font-semibold tracking-tight">Northstar Cloud</span>
        <ChevronDown className="ml-auto size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
        <div>
          <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
          {renderItems(primaryNav)}
        </div>
        <div>
          <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Platform</p>
          {renderItems(platformNav)}
        </div>
      </div>
      <div className="border-t border-sidebar-border p-3">
        {renderItems([
          { label: 'Support', icon: LifeBuoy },
          { label: 'Settings', icon: Settings }
        ])}
      </div>
    </aside>
  );
}

function TenantCard({ tenant, action, isPending }: { tenant: Tenant; action: (formData: FormData) => void; isPending: boolean }) {
  return (
    <Card className="rounded-lg border-border/80 shadow-none transition-colors hover:border-foreground/20">
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted text-xl">{tenant.emoji}</div>
            <div>
              <CardTitle className="text-sm font-medium">{tenant.subdomain}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Production project</p>
            </div>
          </div>
          <form action={action}>
            <input type="hidden" name="subdomain" value={tenant.subdomain} />
            <Button variant="ghost" size="icon" type="submit" disabled={isPending} aria-label={`Delete ${tenant.subdomain}`}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
        <span>Created {new Date(tenant.createdAt).toLocaleDateString()}</span>
        <a className="inline-flex items-center gap-1 text-foreground hover:underline" href={`${protocol}://${tenant.subdomain}.${rootDomain}`} target="_blank" rel="noopener noreferrer">
          Open <ExternalLink className="size-3" />
        </a>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard({ tenants }: { tenants: Tenant[] }) {
  const [active, setActive] = useState('Projects');
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [state, action, isPending] = useActionState<DeleteState, FormData>(deleteSubdomainAction, {});
  const filteredTenants = useMemo(() => tenants.filter((tenant) => tenant.subdomain.toLowerCase().includes(query.toLowerCase())), [tenants, query]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 flex w-72 transition-transform lg:static lg:translate-x-0`}>
        <Sidebar active={active} onSelect={(label) => { setActive(label); setMobileOpen(false); }} />
      </div>
      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center gap-3 border-b border-border px-4 md:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="size-5" /></Button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="truncate text-sm font-medium">{active}</span>
            <span className="hidden text-muted-foreground md:inline">/</span>
            <span className="hidden truncate text-sm text-muted-foreground md:inline">Northstar Cloud</span>
          </div>
          <div className="relative hidden w-64 md:block">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find..." className="h-9 bg-muted/40 pl-9 pr-12 text-sm" aria-label="Find projects" />
            <kbd className="pointer-events-none absolute right-2 top-2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">F</kbd>
          </div>
          <Button variant="outline" size="sm" className="hidden gap-2 sm:flex"><Plus className="size-4" /> Add New</Button>
          <Button variant="ghost" size="icon" aria-label="More options"><MoreHorizontal className="size-4" /></Button>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Workspace overview</p>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Projects</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Deploy, monitor, and scale the applications connected to your central platform.</p>
            </div>
            <Button className="w-fit gap-2"><Plus className="size-4" /> New Project</Button>
          </div>
          <div className="mb-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {[['Projects', tenants.length.toString()], ['Deployments', '24'], ['Usage this month', '18.4 GB']].map(([label, value]) => (
              <div key={label} className="bg-card px-4 py-4 md:px-5"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold tracking-tight">{value}</p></div>
            ))}
          </div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="text-base font-semibold">All projects</h2><p className="mt-1 text-xs text-muted-foreground">Your production and preview environments</p></div>
            <Button variant="outline" size="sm" className="gap-2"><ListFilter className="size-4" /> Filter</Button>
          </div>
          {filteredTenants.length === 0 ? (
            <Card className="rounded-lg border-dashed shadow-none"><CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center"><div className="flex size-10 items-center justify-center rounded-full bg-muted"><Boxes className="size-5 text-muted-foreground" /></div><div><p className="text-sm font-medium">{query ? 'No matching projects' : 'No projects yet'}</p><p className="mt-1 text-sm text-muted-foreground">{query ? 'Try a different search.' : 'Create your first project to get started.'}</p></div></CardContent></Card>
          ) : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredTenants.map((tenant) => <TenantCard key={tenant.subdomain} tenant={tenant} action={action} isPending={isPending} />)}</div>}
          <Separator className="my-10" />
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span>Workspace URL: {rootDomain}</span><Link href={`${protocol}://${rootDomain}`} className="inline-flex items-center gap-1 text-foreground hover:underline">View platform <ExternalLink className="size-3" /></Link></div>
          {(state.error || state.success) && <div role="status" className="fixed bottom-5 right-5 rounded-md border border-border bg-card px-4 py-3 text-sm shadow-lg">{state.error || state.success}<button className="ml-4 text-muted-foreground" onClick={() => window.location.reload()} aria-label="Dismiss"><X className="inline size-3" /></button></div>}
        </div>
      </main>
    </div>
  );
}
