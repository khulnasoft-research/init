export type TemplateCategory = 'starter' | 'solution';

export type PlatformTemplate = {
  slug: string;
  name: string;
  description: string;
  category: TemplateCategory;
  framework: string;
  tags: string[];
  sourceUrl: string;
  demoUrl?: string;
  deployUrl: string;
  imageClass: string;
  featured?: boolean;
  envVars: string[];
};

export const templates: PlatformTemplate[] = [
  {
    slug: 'platforms-starter-kit',
    name: 'Platforms Starter Kit',
    description: 'A multi-tenant Next.js foundation for customer-facing platforms and admin consoles.',
    category: 'starter',
    framework: 'Next.js',
    tags: ['multi-tenant', 'redis', 'app-router'],
    sourceUrl: 'https://github.com/vercel/platforms',
    demoUrl: '/',
    deployUrl: 'https://vercel.com/new/clone?repository-url=https://github.com/vercel/platforms',
    imageClass: 'from-slate-950 to-slate-700',
    featured: true,
    envVars: ['KV_REST_API_URL', 'KV_REST_API_TOKEN', 'NEXT_PUBLIC_ROOT_DOMAIN']
  },
  {
    slug: 'nextjs-saas-starter',
    name: 'Next.js SaaS Starter',
    description: 'A polished starting point for authenticated SaaS products with billing-ready structure.',
    category: 'starter',
    framework: 'Next.js',
    tags: ['saas', 'auth', 'billing'],
    sourceUrl: 'https://github.com/vercel/nextjs-postgres-auth-starter',
    deployUrl: 'https://vercel.com/new/clone?repository-url=https://github.com/vercel/nextjs-postgres-auth-starter',
    imageClass: 'from-indigo-950 to-indigo-600',
    featured: true,
    envVars: ['POSTGRES_URL', 'AUTH_SECRET']
  },
  {
    slug: 'ai-chatbot',
    name: 'AI Chatbot',
    description: 'A streaming AI chat experience with a focused conversation interface and model-ready API route.',
    category: 'solution',
    framework: 'Next.js',
    tags: ['ai', 'chat', 'streaming'],
    sourceUrl: 'https://github.com/vercel/ai-chatbot',
    deployUrl: 'https://vercel.com/new/clone?repository-url=https://github.com/vercel/ai-chatbot',
    imageClass: 'from-violet-950 to-violet-600',
    featured: true,
    envVars: ['AI_GATEWAY_API_KEY']
  },
  {
    slug: 'commerce',
    name: 'Next.js Commerce',
    description: 'A high-performance commerce storefront with product discovery and checkout foundations.',
    category: 'solution',
    framework: 'Next.js',
    tags: ['commerce', 'storefront', 'ecommerce'],
    sourceUrl: 'https://github.com/vercel/commerce',
    deployUrl: 'https://vercel.com/new/clone?repository-url=https://github.com/vercel/commerce',
    imageClass: 'from-emerald-950 to-emerald-600',
    envVars: ['COMMERCE_PROVIDER', 'COMMERCE_API_URL']
  },
  {
    slug: 'docs-starter',
    name: 'Next.js Docs Starter',
    description: 'A clean documentation workspace with navigation, search-ready content, and responsive reading layouts.',
    category: 'starter',
    framework: 'Next.js',
    tags: ['docs', 'content', 'mdx'],
    sourceUrl: 'https://github.com/vercel/nextjs-postgres-nextauth-tailwindcss',
    deployUrl: 'https://vercel.com/new/clone?repository-url=https://github.com/vercel/nextjs-postgres-nextauth-tailwindcss',
    imageClass: 'from-amber-950 to-amber-600',
    envVars: []
  },
  {
    slug: 'storage-upload',
    name: 'Storage Uploads',
    description: 'A focused file upload experience for images, documents, and user-generated assets.',
    category: 'solution',
    framework: 'Next.js',
    tags: ['storage', 'uploads', 'files'],
    sourceUrl: 'https://github.com/vercel/examples/tree/main/solutions/image-upload',
    deployUrl: 'https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples',
    imageClass: 'from-cyan-950 to-cyan-600',
    envVars: ['BLOB_READ_WRITE_TOKEN']
  }
];

export type TemplateFilters = {
  query?: string;
  category?: TemplateCategory | 'all';
  framework?: string | 'all';
};

export function getTemplate(slug: string) {
  return templates.find((template) => template.slug === slug);
}

export function filterTemplates(filters: TemplateFilters) {
  const query = filters.query?.trim().toLowerCase() ?? '';
  const category = filters.category ?? 'all';
  const framework = filters.framework ?? 'all';

  return templates.filter((template) => {
    const matchesQuery = !query || [template.name, template.description, template.framework, ...template.tags].join(' ').toLowerCase().includes(query);
    const matchesCategory = category === 'all' || template.category === category;
    const matchesFramework = framework === 'all' || template.framework === framework;
    return matchesQuery && matchesCategory && matchesFramework;
  });
}

export const frameworks = [...new Set(templates.map((template) => template.framework))];

export function getRelatedTemplates(template: PlatformTemplate) {
  return templates.filter((candidate) => candidate.slug !== template.slug && candidate.category === template.category).slice(0, 3);
}
