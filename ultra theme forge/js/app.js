/*
  Fix Summary (applied):
  - API timeout, improved error handling and updated to Google AI Studio (Gemini)
  - Replaced fixed iframe scaling with responsive aspect-ratio previews
  - Lazy-load previews via IntersectionObserver to avoid rendering many iframes
  - Disable card/global actions during generation to prevent duplicate calls
  - Mobile sidebar toggle + ESC to close, accessible aria-expanded on menu
  - Safe localStorage parsing and guarded DOM writes to avoid runtime errors
  - Increased touch target sizes and added :active feedback for touch
  - Event delegation used; removed inline handlers for maintainability
*/
// Global error logging and startup diagnostics
window.onerror = function(message, source, lineno, colno, error) {
  console.error('GLOBAL ERROR:', message, source, lineno, colno, error);
};
window.addEventListener('unhandledrejection', function(event) {
  console.error('UNHANDLED PROMISE REJECTION:', event.reason);
});
console.log('UltraThemeForge script loaded');

function showRuntimeError(message) {
  const panel = document.getElementById('runtime-error-panel');
  const msg = document.getElementById('runtime-error-message');
  if (panel && msg) {
    msg.textContent = message || 'An unknown runtime error occurred.';
    panel.classList.add('visible');
  }
}

function hideRuntimeError() {
  const panel = document.getElementById('runtime-error-panel');
  if (panel) {
    panel.classList.remove('visible');
  }
}

window.onerror = function(message, source, lineno, colno, error) {
  console.error('GLOBAL ERROR:', message, source, lineno, colno, error);
  showRuntimeError(`Startup failed: ${message || (error && error.message) || 'Unknown error'}`);
};
window.addEventListener('unhandledrejection', function(event) {
  console.error('UNHANDLED PROMISE REJECTION:', event.reason);
  showRuntimeError(`Unhandled rejection: ${event.reason?.message || event.reason || 'Unknown error'}`);
});

// ══════════════════════════════════════════════════════
//  DATA — 50 TYPES
// ══════════════════════════════════════════════════════
const CATEGORIES = [
  {
    id: 'basic', label: 'Basic Website Types', icon: '🌐',
    types: [
      { id: 'static', name: 'Static Website', emoji: '📄', desc: 'Simple portfolio/landing page with hero, about, projects, clean typography', url: 'staticsite.io' },
      { id: 'dynamic', name: 'Dynamic Website', emoji: '⚡', desc: 'Interactive dashboard with live data, charts, user activity feeds', url: 'dynamicweb.io' },
      { id: 'spa', name: 'SPA', emoji: '♾️', desc: 'Single Page Application with smooth scroll sections, animated transitions', url: 'myapp.io' },
      { id: 'mpa', name: 'MPA', emoji: '🗂️', desc: 'Multi-page corporate website with services, about, contact navigation', url: 'corporate.com' },
    ]
  },
  {
    id: 'frontend', label: 'Frontend Technologies', icon: '🎨',
    types: [
      { id: 'html', name: 'HTML', emoji: '🏗️', desc: 'Semantic structured webpage with clean layout and typography system', url: 'htmlsite.dev' },
      { id: 'css', name: 'CSS', emoji: '🎨', desc: 'Visually styled page with CSS animations, gradients, modern aesthetic', url: 'cssmagic.dev' },
      { id: 'javascript', name: 'JavaScript', emoji: '✨', desc: 'Interactive UI with modals, dropdown menus, sliders, live counters', url: 'jsinteractive.dev' },
      { id: 'typescript', name: 'TypeScript', emoji: '🔷', desc: 'Structured enterprise UI system with type-safe components and docs', url: 'tsapp.dev' },
      { id: 'react', name: 'React', emoji: '⚛️', desc: 'Component-based dashboard with reusable widgets, state management UI', url: 'reactapp.dev' },
      { id: 'angular', name: 'Angular', emoji: '🔴', desc: 'Enterprise admin panel with data tables, forms, routing tabs', url: 'angularapp.dev' },
      { id: 'vue', name: 'Vue', emoji: '💚', desc: 'Lightweight clean UI with smooth reactive transitions, card layouts', url: 'vueapp.dev' },
      { id: 'svelte', name: 'Svelte', emoji: '🟠', desc: 'Fast minimal UI with modern cards, compiled performance aesthetic', url: 'svelte.dev' },
      { id: 'nextjs', name: 'Next.js', emoji: '▲', desc: 'Modern SSR website with blog, SaaS pricing, optimized layouts', url: 'nextapp.dev' },
    ]
  },
  {
    id: 'backend', label: 'Backend Technologies', icon: '⚙️',
    types: [
      { id: 'nodejs', name: 'Node.js', emoji: '🟢', desc: 'Server monitoring dashboard with real-time logs, metrics, performance graphs', url: 'nodeserver.io' },
      { id: 'expressjs', name: 'Express.js', emoji: '🚂', desc: 'API management dashboard with routes, docs, request testing UI', url: 'expressapi.io' },
      { id: 'django', name: 'Django', emoji: '🐍', desc: 'Content management admin with forms, tables, user management', url: 'djangoapp.io' },
      { id: 'flask', name: 'Flask', emoji: '🧪', desc: 'Minimal backend admin panel with clean data tables and analytics', url: 'flaskapp.io' },
      { id: 'laravel', name: 'Laravel', emoji: '🔴', desc: 'Modern CRUD admin panel with elegant UI, artisan-style aesthetics', url: 'laravelapp.io' },
      { id: 'rails', name: 'Ruby on Rails', emoji: '💎', desc: 'Startup web app with Ruby red accents, clean product interface', url: 'railsapp.io' },
      { id: 'aspnet', name: 'ASP.NET', emoji: '🔵', desc: 'Enterprise system dashboard with corporate blue, Microsoft design language', url: 'aspapp.io' },
    ]
  },
  {
    id: 'fullstack', label: 'Full-Stack Types', icon: '🏗️',
    types: [
      { id: 'mern', name: 'MERN Stack', emoji: '🍃', desc: 'Full SaaS analytics platform with charts, user dashboards, billing', url: 'mernapp.io' },
      { id: 'mean', name: 'MEAN Stack', emoji: '📐', desc: 'Enterprise web application with complex data, reports, admin tools', url: 'meanapp.io' },
      { id: 'jamstack', name: 'JAMstack', emoji: '🫙', desc: 'Ultra-fast static modern landing page with CMS-driven content blocks', url: 'jamstack.io' },
    ]
  },
  {
    id: 'design', label: 'Design & UI/UX', icon: '✏️',
    types: [
      { id: 'ui', name: 'UI Design', emoji: '🖼️', desc: 'UI component kit showcase with buttons, cards, forms, typography', url: 'uikit.design' },
      { id: 'ux', name: 'UX Design', emoji: '🧭', desc: 'User onboarding flow with step-by-step interface, progress, clarity', url: 'uxflow.design' },
      { id: 'figma', name: 'Figma', emoji: '🎯', desc: 'Design system grid layout with Figma-like component documentation', url: 'designsystem.figma' },
      { id: 'adobexd', name: 'Adobe XD', emoji: '🔴', desc: 'Creative UI concept layout with prototype-style preview screens', url: 'concept.xd.adobe' },
      { id: 'sketch', name: 'Sketch', emoji: '💛', desc: 'Minimal Apple-style UI with HIG principles, clean whitespace', url: 'sketch.design' },
    ]
  },
  {
    id: 'purpose', label: 'Website Purpose Types', icon: '🎯',
    types: [
      { id: 'portfolio', name: 'Portfolio', emoji: '🖼️', desc: 'Creative personal portfolio with case studies, timeline, contact', url: 'john.design' },
      { id: 'business', name: 'Business', emoji: '🏢', desc: 'Corporate website with services, team, testimonials, values', url: 'acmecorp.com' },
      { id: 'ecommerce', name: 'E-commerce', emoji: '🛒', desc: 'Online store with product grid, cart, checkout, filter sidebar', url: 'shop.store' },
      { id: 'blog', name: 'Blog', emoji: '📝', desc: 'Content-rich blog with featured articles, categories, newsletter', url: 'myblog.com' },
      { id: 'landing', name: 'Landing Page', emoji: '🚀', desc: 'Marketing landing with bold hero, features, pricing, CTA sections', url: 'product.launch' },
      { id: 'webapp', name: 'Web App', emoji: '🔧', desc: 'Tool-based application with sidebar, workspace, settings panel', url: 'app.tools' },
      { id: 'saas', name: 'SaaS', emoji: '☁️', desc: 'Subscription platform with dashboard, billing, team management', url: 'saas.cloud' },
      { id: 'education', name: 'Educational', emoji: '📚', desc: 'Learning platform with course cards, progress tracking, video player', url: 'learn.edu' },
      { id: 'social', name: 'Social Media', emoji: '👥', desc: 'Social feed with profile, posts, stories, notifications bar', url: 'social.network' },
      { id: 'news', name: 'News Portal', emoji: '📰', desc: 'News site with breaking headline, category tabs, article grid', url: 'daily.news' },
      { id: 'forum', name: 'Forum', emoji: '💬', desc: 'Discussion forum with threads, votes, user badges, categories', url: 'forum.community' },
    ]
  },
  {
    id: 'advanced', label: 'Advanced Web Types', icon: '🚀',
    types: [
      { id: 'pwa', name: 'PWA', emoji: '📱', desc: 'Mobile-first progressive web app with install prompt, offline UI', url: 'pwa.app' },
      { id: 'web3', name: 'Web3', emoji: '🔗', desc: 'Crypto DeFi dashboard with wallet connect, token charts, NFT gallery', url: 'defi.web3' },
      { id: 'ai', name: 'AI-Powered', emoji: '🤖', desc: 'AI tool interface with chat, prompt input, generation outputs, history', url: 'ai.tools' },
      { id: 'headless', name: 'Headless CMS', emoji: '🧠', desc: 'Headless CMS admin with content modeling, API preview, editors', url: 'cms.headless' },
    ]
  },
  {
    id: 'styling', label: 'Styling Systems', icon: '🎨',
    types: [
      { id: 'tailwind', name: 'Tailwind CSS', emoji: '💨', desc: 'Utility-first modern UI with Tailwind aesthetic, utility color palette', url: 'tailwind.app' },
      { id: 'bootstrap', name: 'Bootstrap', emoji: '🅱️', desc: 'Grid-based classic UI with Bootstrap components, responsive columns', url: 'bootstrap.app' },
      { id: 'materialui', name: 'Material UI', emoji: '🎨', desc: 'Google Material design system with elevation, ripples, M3 palette', url: 'material.app' },
      { id: 'sass', name: 'Sass / SCSS', emoji: '🎀', desc: 'Advanced styled UI with SCSS-powered variables, mixins, nesting', url: 'scss.app' },
    ]
  },
  {
    id: 'other', label: 'Other Categories', icon: '⚙️',
    types: [
      { id: 'cms', name: 'CMS', emoji: '📁', desc: 'Content management website with page builder, media library, editors', url: 'cms.site' },
      { id: 'api', name: 'API-Based', emoji: '🔌', desc: 'API visualization dashboard with endpoint explorer, response viewer', url: 'api.platform' },
      { id: 'microservices', name: 'Microservices', emoji: '🕸️', desc: 'Multi-service system dashboard with service mesh, health checks, logs', url: 'services.infra' },
    ]
  }
];

// Flatten all types
const ALL_TYPES = CATEGORIES.flatMap(c => c.types.map(t => ({...t, categoryId: c.id, categoryLabel: c.label})));

// Variants definition
const VARIANTS = {
  clean: {
    id: 'clean', name: 'Clean Light', shortName: 'Clean',
    desc: 'Minimal white UI, soft shadows, modern SaaS aesthetic',
    style: 'clean minimal UI, pure white background #FFFFFF, light gray accents #F5F5F7, subtle box shadows, modern sans-serif fonts, generous whitespace, Apple-inspired refinement, soft borders #E5E5EA'
  },
  bold: {
    id: 'bold', name: 'Bold Creative', shortName: 'Bold',
    desc: 'Strong colors, asymmetric layout, editorial flair',
    style: 'bold creative layout, vibrant saturated colors, strong typographic hierarchy, asymmetric grid sections, high contrast, editorial magazine feel, large statement fonts, thick borders, geometric accents'
  },
  dark: {
    id: 'dark', name: 'Dark Futuristic', shortName: 'Dark',
    desc: 'Dark theme, neon glow, glassmorphism, cyberpunk',
    style: 'dark futuristic UI, very dark background #0A0A0F, neon purple/cyan accents, glassmorphism panels, glowing borders, monospace code fonts mixed with display fonts, gradient meshes, cyberpunk aesthetic'
  }
};

// Design types for palette generation
const DESIGN_TYPES = [
  { id: 'luxury', name: 'Luxury', icon: '💎' },
  { id: 'professional', name: 'Professional', icon: '🏢' },
  { id: 'modern', name: 'Modern', icon: '⚡' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'saas', name: 'SaaS', icon: '☁️' },
  { id: 'portfolio', name: 'Portfolio', icon: '🎨' }
];

const MOODS = ['any', 'dark', 'light', 'vibrant', 'pastel', 'muted'];
const COLOR_SCHEMES = ['free', 'complementary', 'analogous', 'monochromatic', 'triadic'];

// Supported model options shown in the UI (Google AI Studio / Gemini).
// Gemini 2.0 models were shut down on June 1, 2026 — only 2.5/3.5 era models work.
const MODEL_OPTIONS = {
  'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', label: 'Gemini 2.5 Flash (recommended)' },
  'gemini-2.5-flash-lite': { name: 'Gemini 2.5 Flash-Lite', label: 'Gemini 2.5 Flash-Lite (fastest & cheapest)' },
  'gemini-3.5-flash': { name: 'Gemini 3.5 Flash', label: 'Gemini 3.5 Flash (highest quality)' }
};

const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash'
];

// Approximate price per mockup (USD) used to estimate remaining mockups/credits
// (~8k output tokens per mockup at current per-token rates)
const MODEL_PRICING = {
  'gemini-2.5-flash': 0.02,
  'gemini-2.5-flash-lite': 0.004,
  'gemini-3.5-flash': 0.08
};

// Per-category fonts — applied to the short subtitle when a type is selected
const CATEGORY_FONTS = {
  'basic': 'Inter, sans-serif',
  'frontend': 'Poppins, sans-serif',
  'backend': 'Roboto Slab, serif',
  'fullstack': 'Montserrat, sans-serif',
  'design': 'Playfair Display, serif',
  'purpose': 'Lora, serif',
  'advanced': 'Orbitron, sans-serif',
  'styling': 'Raleway, sans-serif',
  'other': 'Source Sans 3, sans-serif'
};

// ══════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════
let state = {
  selectedTypeId: null,
  apiKey: localStorage.getItem('utf_api_key') || '',
  // Persisted chosen model id (defaults to primary Gemini flash)
  modelId: localStorage.getItem('utf_model') || PRIMARY_MODEL,
  // Available credit (USD) and per-model usage will be loaded from localStorage below
  mockups: {},
  generating: false,
  cancelGeneration: false,
  abortController: null,
  currentModalHtml: '',
  // Design controls state
  designType: 'luxury',
  mood: 'any',
  colorCount: 3,
  colorScheme: 'free',
  palette: [],
  savedPalettes: [],
  savedMockups: []
};

if (!Object.keys(MODEL_OPTIONS).includes(state.modelId)) {
  state.modelId = PRIMARY_MODEL;
  localStorage.setItem('utf_model', state.modelId);
}

// Safely load stored mockups (avoid crash on invalid JSON)
try {
  const raw = localStorage.getItem('utf_mockups');
  state.mockups = raw ? JSON.parse(raw) : {};
} catch (e) {
  console.warn('Invalid saved mockups in localStorage, clearing.');
  localStorage.removeItem('utf_mockups');
  state.mockups = {};
}

// Load usage tracking and available credit from localStorage
try {
  state.usage = JSON.parse(localStorage.getItem('utf_usage')) || {};
} catch (e) {
  console.warn('Invalid usage data in localStorage, clearing.');
  localStorage.removeItem('utf_usage');
  state.usage = {};
}
state.credit = parseFloat(localStorage.getItem('utf_credit')) || 5.0; // default $5 free credit

// Load saved mockups from localStorage as a separate saved tab collection
try {
  state.savedMockups = JSON.parse(localStorage.getItem('utf_saved')) || [];
} catch (e) {
  console.warn('Invalid saved mockups in localStorage, clearing.');
  localStorage.removeItem('utf_saved');
  state.savedMockups = [];
}

// ══════════════════════════════════════════════════════
//  MASTER PROMPT SYSTEM (Python equivalent, JS version)
// ══════════════════════════════════════════════════════
const MASTER_PROMPT_BASE = `Create an ULTRA high-end website mockup as complete, working HTML/CSS/JS code.

Design Requirements:
- Fully realistic website (NOT concept, NOT wireframe, NOT placeholder)
- Pixel-perfect UI with professional product-level design quality
- Clear structure: navbar/header, hero section, content sections, footer
- Proper typography with web fonts, spacing hierarchy, alignment
- Real content — no Lorem Ipsum, use realistic text relevant to the website type

Quality Standard:
- Behance/Dribbble portfolio-level presentation
- No blurry borders, no placeholder boxes with X marks
- Consistent design system with defined color palette
- Professional layout logic that makes spatial sense

Visual System:
- Strong visual hierarchy with clear primary/secondary/tertiary levels
- Real UI components: navigation, buttons, cards, forms, images (use SVG or CSS shapes), charts (CSS-drawn), icons (emoji or SVG)
- Background with texture, gradient, or pattern (not flat solid colors)

Technical Output:
- Complete single HTML file with embedded CSS and JS
- Desktop layout optimized for 1440px width
- Full-page mockup with at least 3-4 distinct sections visible
- All CSS must be inline in <style> tag, all JS in <script> tag
- NO external dependencies except Google Fonts (use @import)

CRITICAL UNIQUENESS RULE:
Each mockup must look COMPLETELY DIFFERENT in layout, color palette, typography, and structure from other variants of the same type.`;

function buildPrompt(typeData, variant) {
  return `${MASTER_PROMPT_BASE}

Website Type: ${typeData.name}
Type Description: ${typeData.desc}
URL to display: ${typeData.url}

Style Variant: ${variant.name}
Variant Style: ${variant.style}

Additional Instructions:
- This is the "${variant.shortName}" variant — make it distinctly ${variant.id === 'clean' ? 'clean, light, and minimal' : variant.id === 'bold' ? 'bold, colorful, and energetic' : 'dark, futuristic, and glowing'}
- The design should feel NATIVE to ${typeData.name} — use appropriate terminology, icons, and UI patterns for this specific type
- Create a complete, realistic page that could genuinely represent a ${typeData.name} in production
- Include at least: header/nav, hero/above-fold, 2-3 content sections, footer
- Typography: use Google Fonts that match the aesthetic — import them at the top
- Make layout unique: vary grid columns, section heights, element positioning
- Add micro-details: hover states (via CSS :hover), subtle animations, realistic data/content

Output ONLY the HTML code starting with <!DOCTYPE html>, nothing else, no explanation.`;
}

// ══════════════════════════════════════════════════════
//  API CALL
// ══════════════════════════════════════════════════════
async function generateWithFallback(prompt, apiKey, options = {}) {
  if (!apiKey) throw new Error('Missing Google AI Studio API key. Please add it in the API Setup banner.');

  const { signal } = options;
  // Try the user-selected model first, then the remaining models as fallbacks
  const selected = MODEL_OPTIONS[state.modelId] ? state.modelId : PRIMARY_MODEL;
  const models = [selected, ...Object.keys(MODEL_OPTIONS).filter(m => m !== selected)];
  let lastError = 'All Gemini models failed.';

  for (const model of models) {
    const controller = new AbortController();
    const timeoutMs = 60_000;
    const to = setTimeout(() => controller.abort(), timeoutMs);
    if (signal) {
      if (signal.aborted) controller.abort();
      else signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      console.log('[generateWithFallback] sending prompt length=', prompt?.length || 0, 'model=', model);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const body = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      const raw = await response.text().catch(() => null);
      let data = null;
      try { data = raw ? JSON.parse(raw) : null; } catch (e) { data = raw; }
      console.log('Gemini response:', data);

      if (!response.ok || !data?.candidates?.length) {
        lastError = (data && (data.error?.message || data.error || data.message)) || `Model failed: ${model}`;
        console.warn('Model failed:', model, data);
        continue;
      }

      console.log('Using model:', model);
      const text = data.candidates[0].content?.parts?.[0]?.text || (typeof data === 'string' ? data : 'No response');
      const htmlMatch = (text || '').match(/<!DOCTYPE html>[\s\S]*/i);
      return { text: htmlMatch ? htmlMatch[0] : text, model };
    } catch (err) {
      if (err.name === 'AbortError') {
        lastError = 'Request timed out — please try again.';
        console.error('Error with model:', model, err);
      } else if (err.name === 'TypeError') {
        lastError = 'Network error — check your connection and try again.';
        console.error('Error with model:', model, err);
      } else {
        lastError = err.message || String(err);
        console.error('Error with model:', model, err);
      }
    } finally {
      clearTimeout(to);
    }
  }

  throw new Error(lastError || 'AI generation failed. Please check API key or try again later.');
}

// ══════════════════════════════════════════════════════
//  STORAGE HELPERS
// ══════════════════════════════════════════════════════
function getMockupKey(typeId, variantId) { return `${typeId}_${variantId}`; }

function saveMockup(typeId, variantId, html, modelId) {
  const key = getMockupKey(typeId, variantId);
  state.mockups[key] = html;
  localStorage.setItem('utf_mockups', JSON.stringify(state.mockups));
  updateStats();
  // Record usage for the model used to create this mockup
  try { trackUsage(modelId || state.modelId || PRIMARY_MODEL, 1); } catch (e) { console.warn('Usage tracking failed', e); }
}

function getMockup(typeId, variantId) {
  return state.mockups[getMockupKey(typeId, variantId)] || null;
}

function hasMockup(typeId, variantId) { return !!getMockup(typeId, variantId); }
function getSavedKey(typeId, variantId) { return `${typeId}_${variantId}`; }
function isMockupSaved(typeId, variantId) { return state.savedMockups.some(item => item.key === getSavedKey(typeId, variantId)); }
function getSavedMockup(key) { return state.savedMockups.find(item => item.key === key); }

function saveMockupToSaved(typeId, variantId) {
  const html = getMockup(typeId, variantId);
  if (!html) {
    showToast('Generate this mockup before saving it to the Saved tab.', 'error');
    return;
  }

  const key = getSavedKey(typeId, variantId);
  if (isMockupSaved(typeId, variantId)) {
    showToast('This mockup is already saved.', 'warning');
    return;
  }

  const type = ALL_TYPES.find(t => t.id === typeId) || { name: typeId };
  const variant = VARIANTS[variantId] || { name: variantId };

  state.savedMockups.push({
    key,
    typeId,
    variantId,
    typeName: type.name,
    variantName: variant.name,
    html,
    savedAt: new Date().toISOString()
  });
  localStorage.setItem('utf_saved', JSON.stringify(state.savedMockups));
  renderSavedCards();
  renderSavedSummary();
  updateGeneratedCardSavedState(typeId, variantId);
  showToast(`Saved ${type.name} — ${variant.name} to Saved tab`, 'success');
}

function saveAllGenerated() {
  const keys = Object.keys(state.mockups);
  if (!keys.length) {
    showToast('No generated mockups to save.', 'error');
    return;
  }
  let added = 0;
  keys.forEach(key => {
    const [typeId, variantId] = key.split('_');
    if (!isMockupSaved(typeId, variantId)) {
      const html = state.mockups[key];
      const type = ALL_TYPES.find(t => t.id === typeId) || { name: typeId };
      const variant = VARIANTS[variantId] || { name: variantId };
      state.savedMockups.push({
        key,
        typeId,
        variantId,
        typeName: type.name,
        variantName: variant.name,
        html,
        savedAt: new Date().toISOString()
      });
      added++;
    }
  });
  localStorage.setItem('utf_saved', JSON.stringify(state.savedMockups));
  renderSavedCards();
  renderSavedSummary();
  updateTypeMeta(state.selectedTypeId);
  showToast(`Saved ${added} generated mockup${added === 1 ? '' : 's'} to Saved tab`, added ? 'success' : 'warning');
}

function deleteSavedMockup(key) {
  state.savedMockups = state.savedMockups.filter(item => item.key !== key);
  localStorage.setItem('utf_saved', JSON.stringify(state.savedMockups));
  renderSavedCards();
  renderSavedSummary();
  showToast('Saved mockup removed.', 'success');
}

function openSavedModal(key) {
  const saved = getSavedMockup(key);
  if (!saved) return;
  document.getElementById('modal-url').textContent = `https://${saved.typeName.toLowerCase().replace(/\s+/g,'') || 'saved'}.local — ${saved.variantName}`;
  document.getElementById('modal-iframe').srcdoc = saved.html;
  state.currentModalHtml = saved.html;
  document.getElementById('modal-backdrop').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function copySavedHtml(key) {
  const saved = getSavedMockup(key);
  if (!saved) return;
  navigator.clipboard.writeText(saved.html).then(() => {
    showToast('📋 Saved mockup HTML copied!', 'success');
  });
}

function updateGeneratedCardSavedState(typeId, variantId) {
  const card = document.getElementById(`card-${typeId}-${variantId}`);
  if (!card) return;
  if (isMockupSaved(typeId, variantId)) {
    card.classList.add('saved');
  } else {
    card.classList.remove('saved');
  }
}

function clearGeneratedMockup(typeId, variantId) {
  const key = getMockupKey(typeId, variantId);
  if (!state.mockups[key]) {
    showToast('Nothing to clear for this mockup.', 'warning');
    return;
  }
  delete state.mockups[key];
  localStorage.setItem('utf_mockups', JSON.stringify(state.mockups));
  updateStats();
  if (state.selectedTypeId === typeId) renderMockupGrid(typeId);
  showToast('Mockup cleared. Saved copy remains in Saved tab if it was saved.', 'success');
}

function renderSavedSummary() {
  const summary = document.getElementById('saved-summary');
  if (!summary) return;
  if (!state.savedMockups.length) {
    summary.textContent = 'No saved mockups yet. Generate mockups and save them here for future reuse.';
  } else {
    summary.textContent = `Saved mockups: ${state.savedMockups.length}. ${state.savedMockups.length === 150 ? 'All generated mockups are preserved in the Saved tab.' : 'Saved mockups remain available even after you clear generated previews.'}`;
  }
}

function renderSavedCards() {
  const grid = document.getElementById('saved-grid');
  if (!grid) return;
  if (!state.savedMockups.length) {
    grid.innerHTML = `<div class="saved-empty">No saved mockups yet. Use the save icon on generated cards or the Save All Generated button to add mockups here.</div>`;
    return;
  }
  grid.innerHTML = state.savedMockups.map(item => `
    <div class="saved-card">
      <div class="saved-card-header">
        <div>
          <div class="saved-card-title">${item.typeName} — ${item.variantName}</div>
          <div class="saved-card-sub">Saved at ${new Date(item.savedAt).toLocaleString()}</div>
        </div>
        <div class="saved-card-actions">
          <button class="icon-btn" data-action="openSaved" data-saved-key="${item.key}" title="Open">⛶</button>
          <button class="icon-btn" data-action="copySaved" data-saved-key="${item.key}" title="Copy">📋</button>
          <button class="icon-btn" data-action="deleteSaved" data-saved-key="${item.key}" title="Delete">🗑</button>
        </div>
      </div>
    </div>
  `).join('');
}

function showSavedView() {
  document.getElementById('welcome-state').style.display = 'none';
  document.getElementById('type-view').style.display = 'none';
  const savedView = document.getElementById('saved-view');
  if (!savedView) return;
  savedView.style.display = 'flex';
  savedView.style.flexDirection = 'column';
  renderSavedSummary();
  renderSavedCards();
  updateMobileToolsVisibility();
}

function showTypeView() {
  const savedView = document.getElementById('saved-view');
  if (savedView) savedView.style.display = 'none';
  if (state.selectedTypeId) {
    document.getElementById('type-view').style.display = 'flex';
    document.getElementById('welcome-state').style.display = 'none';
  } else {
    document.getElementById('type-view').style.display = 'none';
    document.getElementById('welcome-state').style.display = 'flex';
  }
  updateMobileToolsVisibility();
}

// The mobile design-tools panel is visible only while a specific type page is open
function updateMobileToolsVisibility() {
  const tv = document.getElementById('type-view');
  const open = !!state.selectedTypeId && tv && tv.style.display !== 'none';
  document.body.classList.toggle('type-page-open', open);
}

// Return to the home (welcome) screen from a type page
function goHome() {
  state.selectedTypeId = null;
  document.querySelectorAll('.type-item').forEach(el => el.classList.remove('active'));
  const savedView = document.getElementById('saved-view');
  if (savedView) savedView.style.display = 'none';
  document.getElementById('type-view').style.display = 'none';
  document.getElementById('welcome-state').style.display = 'flex';
  updateMobileToolsVisibility();
}

function updateStats() {
  const total = Object.keys(state.mockups).length;
  const genEl = document.getElementById('total-generated');
  if (genEl) genEl.textContent = total;
  const leftEl = document.getElementById('total-left');
  if (leftEl) leftEl.textContent = 150 - total;
  updateSidebarDots();
}

// ══════════════════════════════════════════════════════
//  USAGE TRACKING
// ══════════════════════════════════════════════════════
function trackUsage(modelId, count = 1) {
  modelId = modelId || state.modelId || PRIMARY_MODEL;
  const price = MODEL_PRICING[modelId] || 0;
  if (!state.usage) state.usage = {};
  const cur = state.usage[modelId] || { count: 0, spent: 0 };
  cur.count = (cur.count || 0) + count;
  cur.spent = +(((cur.spent || 0) + (count * price)).toFixed(4));
  state.usage[modelId] = cur;
  localStorage.setItem('utf_usage', JSON.stringify(state.usage));
  updateUsageUI();
}

function getTotalSpent() {
  let s = 0;
  if (!state.usage) return 0;
  for (const k of Object.keys(state.usage)) s += Number(state.usage[k].spent || 0);
  return +s.toFixed(4);
}

function getRemainingCredit() {
  return Math.max(0, (Number(state.credit) || 0) - getTotalSpent());
}

function updateUsageUI() {
  const mu = document.getElementById('model-usage');
  const details = document.getElementById('model-usage-details');
  const breakdown = document.getElementById('mu-breakdown');
  const creditInput = document.getElementById('mu-credit-input');
  if (!mu) return;
  const totalSpent = getTotalSpent();
  const remaining = getRemainingCredit();
  const price = MODEL_PRICING[state.modelId] || MODEL_PRICING[PRIMARY_MODEL] || 0;
  const estLeft = price > 0 ? Math.floor(remaining / price) : '∞';
  const summaryEl = mu.querySelector('.mu-summary-text');
  if (summaryEl) summaryEl.textContent = `Credit: $${(Number(state.credit)||0).toFixed(2)} • Spent: $${totalSpent.toFixed(2)} • Remaining: $${remaining.toFixed(2)} (~${estLeft} mockups left with current model)`;
  if (creditInput) creditInput.value = (Number(state.credit) || 0).toFixed(2);
  if (breakdown) {
    breakdown.innerHTML = Object.keys(MODEL_OPTIONS).map(mid => {
      const u = state.usage && state.usage[mid] ? state.usage[mid] : { count: 0, spent: 0 };
      const p = MODEL_PRICING[mid] || 0;
      const leftIfUsing = p > 0 ? Math.floor(remaining / p) : '∞';
      return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.03)"><div><strong>${MODEL_OPTIONS[mid].name}</strong> — Used: ${u.count}</div><div style="text-align:right;">Spent: $${(u.spent||0).toFixed(2)} • ${leftIfUsing} left</div></div>`;
    }).join('');
  }
}

function resetUsage() { state.usage = {}; localStorage.removeItem('utf_usage'); updateUsageUI(); showToast('Usage reset'); }

// ══════════════════════════════════════════════════════
//  SIDEBAR RENDER
// ══════════════════════════════════════════════════════
function renderSidebar(filter = '') {
  const container = document.getElementById('sidebar-content');
  container.innerHTML = '';

  const isMobile = window.innerWidth <= 768;

  // On mobile the design tools live in the content area (#mobile-tools-panel)
  // so the slide-in sidebar stays a simple, easy-to-tap type list.
  const mobilePanel = document.getElementById('mobile-tools-panel');
  if (mobilePanel) mobilePanel.innerHTML = '';
  const toolsContainer = (isMobile && mobilePanel) ? mobilePanel : container;

  // Design Controls Panel — collapsible on mobile
  const designPanel = document.createElement('div');
  designPanel.className = 'design-panel';

  if (isMobile) {
    // Mobile: collapsed by default, tap header to expand
    designPanel.innerHTML = `
      <div id="design-panel-toggle" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:2px 0 6px;">
        <span style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--text3);font-family:var(--head);">🎨 Design Tools</span>
        <span id="design-panel-chevron" style="color:var(--text3);font-size:0.75rem;transition:transform 0.2s;">▶</span>
      </div>
      <div id="design-panel-body" style="display:none;">
        <div class="design-section">
          <div class="design-title">🎨 Design Type</div>
          <div class="design-grid" id="design-type-grid"></div>
        </div>
        <div class="design-section">
          <div class="design-title">🎭 Mood</div>
          <div class="mood-chips" id="mood-chips"></div>
        </div>
        <div class="design-section">
          <div class="design-title">🔢 Color Count</div>
          <div class="count-buttons" id="count-buttons"></div>
        </div>
        <div class="design-section">
          <div class="design-title">🎯 Color Scheme</div>
          <div class="scheme-chips" id="scheme-chips"></div>
        </div>
        <button class="gen-palette-btn" id="gen-palette-btn">✨ Generate Palette</button>
      </div>
    `;
    toolsContainer.appendChild(designPanel);
    // Toggle logic
    const toggleBtn = document.getElementById('design-panel-toggle');
    const body = document.getElementById('design-panel-body');
    const chevron = document.getElementById('design-panel-chevron');
    if (toggleBtn && body && chevron) {
      toggleBtn.addEventListener('click', () => {
        const open = body.style.display === 'block';
        body.style.display = open ? 'none' : 'block';
        chevron.style.transform = open ? '' : 'rotate(90deg)';
      });
    }
  } else {
    // Desktop: always fully visible
    designPanel.innerHTML = `
      <div class="design-section">
        <div class="design-title">🎨 Design Type</div>
        <div class="design-grid" id="design-type-grid"></div>
      </div>
      <div class="design-section">
        <div class="design-title">🎭 Mood</div>
        <div class="mood-chips" id="mood-chips"></div>
      </div>
      <div class="design-section">
        <div class="design-title">🔢 Color Count</div>
        <div class="count-buttons" id="count-buttons"></div>
      </div>
      <div class="design-section">
        <div class="design-title">🎯 Color Scheme</div>
        <div class="scheme-chips" id="scheme-chips"></div>
      </div>
      <button class="gen-palette-btn" id="gen-palette-btn">✨ Generate Palette</button>
    `;
    toolsContainer.appendChild(designPanel);
  }

  // Add event listener for generate palette button
  const genBtn = document.getElementById('gen-palette-btn');
  if (genBtn) genBtn.addEventListener('click', generatePalette);

  // Add event listener for device selector
  const deviceSelect = document.getElementById('preview-device');
  if (deviceSelect) deviceSelect.addEventListener('change', updateLivePreview);

  // Palette Display
  if (state.palette && state.palette.length > 0) {
    const palettePanel = document.createElement('div');
    palettePanel.className = 'palette-panel';
    palettePanel.innerHTML = `
      <div class="design-title">🎨 Current Palette</div>
      <div class="palette-colors" id="palette-colors"></div>
      <div class="palette-actions">
        <button class="palette-btn" onclick="exportPalette('css')">CSS</button>
        <button class="palette-btn" onclick="exportPalette('scss')">SCSS</button>
        <button class="palette-btn" onclick="exportPalette('tailwind')">Tailwind</button>
        <button class="palette-btn" onclick="exportPalette('hex')">HEX</button>
        <button class="palette-btn" onclick="buildGradient()">Gradient</button>
        <button class="palette-btn" onclick="checkAccessibility()">A11y</button>
        <button class="palette-btn" onclick="toggleLivePreview()">Preview</button>
        <button class="palette-btn" onclick="savePalette()">Save</button>
      </div>
    `;
    toolsContainer.appendChild(palettePanel);
    renderPaletteColors();
  }

  // Separator (desktop sidebar only — mobile sidebar starts directly with types)
  if (!isMobile) {
    const sep = document.createElement('div');
    sep.className = 'sidebar-separator';
    container.appendChild(sep);
  }

  renderDesignControls();

  const filterLower = filter.toLowerCase();

  CATEGORIES.forEach(cat => {
    const matching = cat.types.filter(t =>
      !filter || t.name.toLowerCase().includes(filterLower) || t.id.toLowerCase().includes(filterLower)
    );
    if (!matching.length) return;

    const catDiv = document.createElement('div');

    const hdr = document.createElement('div');
    // Start categories collapsed on desktop; auto-expand on mobile for easy access
    const startOpen = isMobile || !!filter;
    hdr.className = 'cat-header' + (startOpen ? ' open' : '');
    hdr.innerHTML = `
      <span style="font-size:0.9rem;">${cat.icon}</span>
      <span class="cat-header-label">${cat.label}</span>
      <span class="cat-count">${matching.length}</span>
      <span class="cat-chevron">▶</span>
    `;

    const items = document.createElement('div');
    items.className = 'cat-items';

    matching.forEach(type => {
      const div = document.createElement('div');
      div.className = 'type-item' + (state.selectedTypeId === type.id ? ' active' : '');
      div.dataset.typeId = type.id;

      const dots = ['clean','bold','dark'].map(v =>
        `<div class="gen-dot ${hasMockup(type.id, v) ? 'filled' : ''}"></div>`
      ).join('');

      div.innerHTML = `
        <span class="type-emoji">${type.emoji}</span>
        <span class="type-name">${type.name}</span>
        <div class="gen-dots">${dots}</div>
      `;
      div.addEventListener('click', () => selectType(type.id));
      items.appendChild(div);
    });

    // Show items if startOpen (mobile or filtered)
    items.style.display = startOpen ? 'block' : 'none';

    hdr.addEventListener('click', () => {
      hdr.classList.toggle('open');
      items.style.display = hdr.classList.contains('open') ? 'block' : 'none';
    });

    catDiv.appendChild(hdr);
    catDiv.appendChild(items);
    container.appendChild(catDiv);
  });

  // Saved Palettes Section
  if (state.savedPalettes && state.savedPalettes.length > 0) {
    const savedPanel = document.createElement('div');
    savedPanel.className = 'saved-panel';
    savedPanel.innerHTML = `
      <div class="design-title">💾 Saved Palettes</div>
      <div class="saved-palettes" id="saved-palettes"></div>
    `;
    toolsContainer.appendChild(savedPanel);
    renderSavedPalettesList();
  }
}

function renderDesignControls() {
  // Design types
  const typeGrid = document.getElementById('design-type-grid');
  if (typeGrid) {
    typeGrid.innerHTML = DESIGN_TYPES.map(dt => `
      <button class="design-type-btn ${state.designType === dt.id ? 'active' : ''}" onclick="selectDesignType('${dt.id}')">
        ${dt.icon}<br>${dt.name}
      </button>
    `).join('');
  }

  // Moods
  const moodChips = document.getElementById('mood-chips');
  if (moodChips) {
    moodChips.innerHTML = MOODS.map(mood => `
      <button class="mood-chip ${state.mood === mood ? 'active' : ''}" onclick="selectMood('${mood}')">
        ${mood.charAt(0).toUpperCase() + mood.slice(1)}
      </button>
    `).join('');
  }

  // Color count
  const countButtons = document.getElementById('count-buttons');
  if (countButtons) {
    countButtons.innerHTML = [2,3,4,5,6].map(count => `
      <button class="count-btn ${state.colorCount === count ? 'active' : ''}" onclick="selectColorCount(${count})">
        ${count}
      </button>
    `).join('');
  }

  // Color schemes
  const schemeChips = document.getElementById('scheme-chips');
  if (schemeChips) {
    schemeChips.innerHTML = COLOR_SCHEMES.map(scheme => `
      <button class="scheme-chip ${state.colorScheme === scheme ? 'active' : ''}" onclick="selectColorScheme('${scheme}')">
        ${scheme.charAt(0).toUpperCase() + scheme.slice(1)}
      </button>
    `).join('');
  }
}

function selectDesignType(typeId) {
  state.designType = typeId;
  renderDesignControls();
  showToast(`Design type: ${DESIGN_TYPES.find(dt => dt.id === typeId).name}`);
}

function selectMood(mood) {
  state.mood = mood;
  renderDesignControls();
  showToast(`Mood: ${mood}`);
}

function selectColorCount(count) {
  state.colorCount = count;
  renderDesignControls();
  showToast(`Color count: ${count}`);
}

function selectColorScheme(scheme) {
  state.colorScheme = scheme;
  renderDesignControls();
  showToast(`Color scheme: ${scheme}`);
}

function generatePalette() {
  // Simple palette generation based on design type
  const palettes = {
    luxury: ['#0a0812', '#1a1428', '#9b7fe8', '#c9a84c', '#f5f0e8'],
    professional: ['#0a1628', '#1a3a70', '#2a5fae', '#4a85cc', '#f0f5ff'],
    modern: ['#0a0a14', '#1a1a2e', '#4444ff', '#8888ff', '#f0f0ff'],
    ecommerce: ['#f0f5ff', '#3b82f6', '#1d4ed8', '#1e3a5f', '#ffffff'],
    saas: ['#050510', '#0f0f25', '#7c5cfc', '#5cfcca', '#ffffff'],
    portfolio: ['#050510', '#0d0d20', '#7c5cfc', '#ffffff', '#aaaacc']
  };

  const basePalette = palettes[state.designType] || palettes.luxury;
  state.palette = basePalette.slice(0, state.colorCount);
  renderPalette();
  updateLivePreview();
  showToast('Palette generated!');
}

function renderPalette() {
  if (state.palette && state.palette.length > 0) {
    renderSidebar();
  }
}

function renderPaletteColors() {
  const colorsDiv = document.getElementById('palette-colors');
  if (!colorsDiv || !state.palette) return;

  colorsDiv.innerHTML = state.palette.map((color, i) => `
    <div class="palette-color" style="background:${color}" onclick="copyColor('${color}')">
      <span class="color-hex">${color}</span>
    </div>
  `).join('');
}

function copyColor(color) {
  navigator.clipboard.writeText(color).then(() => {
    showToast(`Copied ${color} to clipboard!`);
  });
}

function exportPalette(format) {
  if (!state.palette || !state.palette.length) {
    showToast('No palette to export!');
    return;
  }

  let content = '';
  let filename = `palette-${Date.now()}`;

  if (format === 'css') {
    content = `:root {\n${state.palette.map((c, i) => `  --color-${i+1}: ${c};`).join('\n')}\n}`;
    filename += '.css';
  } else if (format === 'json') {
    content = JSON.stringify({
      designType: state.designType,
      mood: state.mood,
      colorCount: state.colorCount,
      colorScheme: state.colorScheme,
      colors: state.palette
    }, null, 2);
    filename += '.json';
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Palette exported as ${filename}!`);
}

function savePalette() {
  if (!state.palette || !state.palette.length) {
    showToast('No palette to save!');
    return;
  }

  if (!state.savedPalettes) state.savedPalettes = [];
  const palette = {
    id: Date.now().toString(),
    name: `${state.designType}-${state.mood}-${state.colorCount}colors`,
    designType: state.designType,
    mood: state.mood,
    colorCount: state.colorCount,
    colorScheme: state.colorScheme,
    colors: [...state.palette],
    created: new Date().toISOString()
  };

  state.savedPalettes.push(palette);
  saveState();
  showToast('Palette saved!');
  renderSavedPalettes();
}

function renderSavedPalettes() {
  renderSidebar();
}

function renderSavedPalettesList() {
  const savedDiv = document.getElementById('saved-palettes');
  if (!savedDiv || !state.savedPalettes) return;

  savedDiv.innerHTML = state.savedPalettes.map(palette => `
    <div class="saved-palette-item" onclick="loadPalette('${palette.id}')">
      <div class="saved-palette-name">${palette.name}</div>
      <div class="saved-palette-colors">
        ${palette.colors.map(c => `<div class="saved-color" style="background:${c}"></div>`).join('')}
      </div>
      <button class="delete-palette-btn" onclick="event.stopPropagation(); deletePalette('${palette.id}')">×</button>
    </div>
  `).join('');
}

function loadPalette(paletteId) {
  const palette = state.savedPalettes.find(p => p.id === paletteId);
  if (!palette) return;

  state.designType = palette.designType;
  state.mood = palette.mood;
  state.colorCount = palette.colorCount;
  state.colorScheme = palette.colorScheme;
  state.palette = [...palette.colors];

  renderDesignControls();
  renderPalette();
  showToast(`Loaded palette: ${palette.name}`);
}

function deletePalette(paletteId) {
  state.savedPalettes = state.savedPalettes.filter(p => p.id !== paletteId);
  saveState();
  renderSidebar();
  showToast('Palette deleted');
}

function toggleLivePreview() {
  const section = document.getElementById('live-preview-section');
  const btn = document.querySelector('.preview-btn');
  if (section.style.display === 'none') {
    section.style.display = 'block';
    btn.textContent = 'Hide Preview';
    updateLivePreview();
  } else {
    section.style.display = 'none';
    btn.textContent = 'Show Preview';
  }
}

function updateLivePreview() {
  if (!state.palette || state.palette.length === 0) return;

  const iframe = document.getElementById('preview-iframe');
  const device = document.getElementById('preview-device').value;

  // Create a simple HTML mockup with the current palette
  const mockupHTML = generateMockupHTML();
  iframe.srcdoc = mockupHTML;
}

function checkAccessibility() {
  if (!state.palette || state.palette.length < 2) {
    showToast('Need at least 2 colors to check accessibility!');
    return;
  }

  let results = [];
  const colors = state.palette;

  // Check contrast ratios between all color pairs
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const ratio = getContrastRatio(colors[i], colors[j]);
      const aa = ratio >= 4.5;
      const aaa = ratio >= 7;
      results.push({
        color1: colors[i],
        color2: colors[j],
        ratio: ratio.toFixed(2),
        aa: aa,
        aaa: aaa
      });
    }
  }

  // Show results in a modal or toast
  const good = results.filter(r => r.aa).length;
  const total = results.length;
  showToast(`Accessibility: ${good}/${total} color pairs pass AA standard`);

  // Log detailed results to console for now
  console.log('Accessibility Results:', results);
}

function buildGradient() {
  if (!state.palette || state.palette.length < 2) {
    showToast('Need at least 2 colors to build gradient!');
    return;
  }

  const colors = state.palette;
  const gradient = `linear-gradient(135deg, ${colors.join(', ')})`;

  // Copy to clipboard
  navigator.clipboard.writeText(gradient).then(() => {
    showToast(`Gradient copied: ${gradient}`);
  });

  // Also show in console
  console.log('Generated Gradient:', gradient);
}

function getContrastRatio(color1, color2) {
  // Convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

function generateMockupHTML() {
  const device = document.getElementById('preview-device').value;
  const colors = state.palette || ['#7c5cfc', '#5cfcca', '#ffffff'];

  let width, height;
  switch(device) {
    case 'mobile': width = '375px'; height = '667px'; break;
    case 'tablet': width = '768px'; height = '1024px'; break;
    default: width = '1200px'; height = '800px';
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Theme Preview</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: ${colors[0]};
          color: ${colors[2]};
          min-height: 100vh;
        }
        .header {
          background: ${colors[1]};
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .nav { background: ${colors[0]}; padding: 15px; }
        .nav a { color: ${colors[2]}; margin: 0 15px; text-decoration: none; }
        .hero {
          padding: 60px 20px;
          text-align: center;
          background: linear-gradient(135deg, ${colors[0]}, ${colors[1]});
        }
        .btn {
          background: ${colors[1]};
          color: ${colors[0]};
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          margin: 10px;
        }
        .content { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
        .card {
          background: ${colors[2]};
          color: ${colors[0]};
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .footer { background: ${colors[0]}; color: ${colors[2]}; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <header class="header">
        <h1>Sample ${state.designType || 'Website'}</h1>
      </header>
      <nav class="nav">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </nav>
      <section class="hero">
        <h2>Welcome to Our ${state.designType || 'Website'}</h2>
        <p>This is a live preview of your generated color palette applied to a sample layout.</p>
        <button class="btn">Get Started</button>
        <button class="btn">Learn More</button>
      </section>
      <main class="content">
        <div class="card">
          <h3>Design Type: ${state.designType || 'Not selected'}</h3>
          <p>Mood: ${state.mood || 'Not selected'}</p>
          <p>Color Scheme: ${state.colorScheme || 'Not selected'}</p>
        </div>
        <div class="card">
          <h3>Your Color Palette</h3>
          <div style="display: flex; gap: 10px; margin: 10px 0;">
            ${colors.map(c => `<div style="width: 40px; height: 40px; background: ${c}; border-radius: 4px; border: 2px solid #fff;"></div>`).join('')}
          </div>
          <p>${colors.join(', ')}</p>
        </div>
      </main>
      <footer class="footer">
        <p>&copy; 2024 Theme Preview. Generated with UltraThemeForge.</p>
      </footer>
    </body>
    </html>
  `;
}

function updateSidebarDots() {
  document.querySelectorAll('.type-item').forEach(item => {
    const typeId = item.dataset.typeId;
    const dots = item.querySelectorAll('.gen-dot');
    ['clean','bold','dark'].forEach((v, i) => {
      if (dots[i]) dots[i].classList.toggle('filled', hasMockup(typeId, v));
    });
  });
}

function filterTypes() {
  renderSidebar(document.getElementById('search-input').value);
}

// ══════════════════════════════════════════════════════
//  TYPE SELECTION
// ══════════════════════════════════════════════════════
function selectType(typeId) {
  state.selectedTypeId = typeId;
  const type = ALL_TYPES.find(t => t.id === typeId);
  if (!type) return;

  // ── Close mobile sidebar so content becomes visible after tapping a type ──
  const _sidebar = document.querySelector('.sidebar');
  if (_sidebar && _sidebar.classList.contains('mobile-open')) {
    _sidebar.classList.remove('mobile-open');
    document.body.classList.remove('mobile-sidebar-open');
    const _mobileBtn = document.getElementById('mobile-menu-btn');
    if (_mobileBtn) _mobileBtn.setAttribute('aria-expanded', 'false');
  }

  // Update sidebar active
  document.querySelectorAll('.type-item').forEach(el => {
    el.classList.toggle('active', el.dataset.typeId === typeId);
  });

  // Hide welcome, saved view and show type view
  document.getElementById('welcome-state').style.display = 'none';
  const savedView = document.getElementById('saved-view');
  if (savedView) savedView.style.display = 'none';
  const tv = document.getElementById('type-view');
  tv.style.display = 'flex';
  tv.style.flexDirection = 'column';
  tv.style.gap = '20px';

  // Update header
  document.getElementById('type-title').innerHTML = `<span class="emoji">${type.emoji}</span>${type.name}`;
  // Apply a category-appropriate font to the subtitle for visual variety
  const subEl = document.getElementById('type-subtitle');
  if (subEl) {
    subEl.textContent = type.desc;
    try {
      const font = CATEGORY_FONTS[type.categoryId] || 'var(--body)';
      subEl.style.fontFamily = font;
    } catch (e) { /* ignore */ }
  }
  document.getElementById('type-meta').innerHTML = `
    <span class="meta-chip">${type.categoryLabel}</span>
    <span class="meta-chip accent">3 variants</span>
    <span class="meta-chip">${['clean','bold','dark'].filter(v => hasMockup(typeId,v)).length}/3 generated</span>
  `;

  // API setup visibility
  document.getElementById('api-setup').style.display = state.apiKey ? 'none' : 'flex';
  if (state.apiKey) document.getElementById('api-key-input').value = state.apiKey;

  // Render variant cards
  renderVariantCards(typeId);

  // Render mockup grid
  renderMockupGrid(typeId);

  updateMobileToolsVisibility();
}

function renderVariantCards(typeId) {
  const container = document.getElementById('variant-selector');
  container.innerHTML = '';

  Object.values(VARIANTS).forEach(v => {
    const card = document.createElement('div');
    card.className = `variant-card ${hasMockup(typeId, v.id) ? 'generated' : ''}`;
    card.innerHTML = `
      <div class="v-status"></div>
      <div class="v-dot ${v.id}"></div>
      <div class="v-name">${v.name}</div>
      <div class="v-desc">${v.desc}</div>
    `;
    container.appendChild(card);
  });
}

// ══════════════════════════════════════════════════════
//  MOCKUP GRID
// ══════════════════════════════════════════════════════
function renderMockupGrid(typeId) {
  const grid = document.getElementById('mockups-grid');
  grid.innerHTML = '';

  const observer = window._utf_iframeObserver;
  Object.values(VARIANTS).forEach(variant => {
    const html = getMockup(typeId, variant.id);
    const card = createMockupCard(typeId, variant, html);
    grid.appendChild(card);
    const preview = card.querySelector('.mockup-preview');
    if (preview && preview.dataset.srcdoc && observer) {
      observer.observe(preview);
    }
  });
}

function createMockupCard(typeId, variant, html) {
  const type = ALL_TYPES.find(t => t.id === typeId);
  const card = document.createElement('div');
  card.className = 'mockup-card';
  card.id = `card-${typeId}-${variant.id}`;
  if (html && isMockupSaved(typeId, variant.id)) card.classList.add('saved');

  // Header
  const header = document.createElement('div');
  header.className = 'mockup-card-header';
  header.innerHTML = `
    <div class="mockup-browser-dots">
      <div class="browser-dot r"></div>
      <div class="browser-dot y"></div>
      <div class="browser-dot g"></div>
    </div>
    <div class="mockup-browser-bar">
      <span style="color:var(--text3);font-size:0.7rem;">🔒</span>
      <span class="browser-url">${type?.url || 'localhost'}</span>
    </div>
    <span class="mockup-variant-badge badge-${variant.id}">${variant.shortName}</span>
  `;
  card.appendChild(header);

  // Preview container (use lazy iframe loading via data-srcdoc)
  const preview = document.createElement('div');
  preview.className = 'mockup-preview';
  preview.id = `preview-${typeId}-${variant.id}`;

  if (html) {
    // store html for lazy loading; iframe will be created when in viewport
    preview.dataset.srcdoc = html;
    const overlay = document.createElement('div');
    overlay.className = 'mockup-overlay';
    const ovBtn = document.createElement('button');
    ovBtn.className = 'overlay-btn';
    ovBtn.dataset.action = 'openModal';
    ovBtn.dataset.type = typeId;
    ovBtn.dataset.variant = variant.id;
    ovBtn.textContent = '🔍 Full Preview';
    overlay.appendChild(ovBtn);
    preview.appendChild(overlay);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'mockup-placeholder';
    placeholder.dataset.action = 'generate';
    placeholder.dataset.type = typeId;
    placeholder.dataset.variant = variant.id;

    const icon = document.createElement('div'); icon.className = 'ph-icon'; icon.textContent = '🎨';
    const text = document.createElement('div'); text.className = 'ph-text'; text.textContent = `${variant.name} Variant`;
    const click = document.createElement('div'); click.className = 'ph-click'; click.textContent = 'Click to generate';
    const btn = document.createElement('button'); btn.className = 'ph-gen-btn'; btn.textContent = '⚡ Generate Now';
    btn.dataset.action = 'generate'; btn.dataset.type = typeId; btn.dataset.variant = variant.id;

    placeholder.appendChild(icon);
    placeholder.appendChild(text);
    placeholder.appendChild(click);
    placeholder.appendChild(btn);
    preview.appendChild(placeholder);
  }

  card.appendChild(preview);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'mockup-footer';
  footer.innerHTML = `<span class="mockup-footer-label">${variant.name}</span>`;
  const actions = document.createElement('div');
  actions.className = 'mockup-footer-actions';

  if (html) {
    const regen = document.createElement('button'); regen.className = 'icon-btn'; regen.title = 'Regenerate'; regen.textContent = '🔄'; regen.dataset.action = 'generate'; regen.dataset.type = typeId; regen.dataset.variant = variant.id;
    const save = document.createElement('button'); save.className = 'icon-btn'; save.title = 'Save'; save.textContent = '💾'; save.dataset.action = 'saveCard'; save.dataset.type = typeId; save.dataset.variant = variant.id;
    const clear = document.createElement('button'); clear.className = 'icon-btn'; clear.title = 'Clear'; clear.textContent = '✖'; clear.dataset.action = 'clearCard'; clear.dataset.type = typeId; clear.dataset.variant = variant.id;
    const copy = document.createElement('button'); copy.className = 'icon-btn'; copy.title = 'Copy HTML'; copy.textContent = '📋'; copy.dataset.action = 'copy'; copy.dataset.type = typeId; copy.dataset.variant = variant.id;
    const full = document.createElement('button'); full.className = 'icon-btn'; full.title = 'Fullscreen'; full.textContent = '⛶'; full.dataset.action = 'openModal'; full.dataset.type = typeId; full.dataset.variant = variant.id;
    actions.appendChild(regen); actions.appendChild(save); actions.appendChild(clear); actions.appendChild(copy); actions.appendChild(full);
  } else {
    const gen = document.createElement('button'); gen.className = 'icon-btn'; gen.title = 'Generate'; gen.textContent = '⚡'; gen.dataset.action = 'generate'; gen.dataset.type = typeId; gen.dataset.variant = variant.id;
    actions.appendChild(gen);
  }

  footer.appendChild(actions);
  card.appendChild(footer);

  return card;
}

function escapeAttr(str) {
  return str.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ══════════════════════════════════════════════════════
//  GENERATION
// ══════════════════════════════════════════════════════
function checkApiKey() {
  if (!state.apiKey) {
    showToast('❗ Please add your Google AI Studio API key first', 'error');
    document.getElementById('api-setup').style.display = 'flex';
    document.getElementById('api-key-input').focus();
    return false;
  }
  return true;
}

async function generateSingle(typeId, variantId) {
  if (!checkApiKey()) return;
  if (state.generating) return;

  const type = ALL_TYPES.find(t => t.id === typeId);
  const variant = VARIANTS[variantId];
  const controller = new AbortController();
  state.abortController = controller;

  // prevent duplicate actions for this card and top-level generators
  disableCardActions(typeId, variantId, true);
  disableGlobalActions(true);
  setCardLoading(typeId, variantId);
  state.generating = true;

  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressLabel = document.getElementById('progress-label');
  if (progressBar) {
    progressBar.classList.add('show');
    if (progressLabel) progressLabel.textContent = `Generating ${variant.name}...`;
    if (progressText) progressText.textContent = '1/1';
    if (progressFill) progressFill.style.width = '100%';
  }

  try {
    console.log('[generateSingle] start', typeId, variantId);
    const prompt = buildPrompt(type, variant);
    const { text: html, model } = await generateWithFallback(prompt, state.apiKey, { signal: controller.signal });
    saveMockup(typeId, variantId, html, model);
    updateCardWithHtml(typeId, variantId, html, type, variant);
    updateVariantCard(typeId, variantId);
    updateGeneratedCardSavedState(typeId, variantId);
    showToast(`✅ ${type.name} — ${variant.name} generated!`, 'success');
    updateTypeMeta(typeId);
    console.log('[generateSingle] success', typeId, variantId);
  } catch (err) {
    if (err.name === 'AbortError' || String(err).toLowerCase().includes('abort')) {
      showToast('⏹ Generation stopped', 'warning');
      setCardError(typeId, variantId, variantId, 'Generation was stopped');
    } else {
      setCardError(typeId, variantId, variantId, err.message);
      showToast(`❌ ${err.message}`, 'error');
    }
  } finally {
    state.generating = false;
    state.abortController = null;
    if (progressBar) progressBar.classList.remove('show');
    disableCardActions(typeId, variantId, false);
    disableGlobalActions(false);
  }
}

async function generateAllVariants() {
  if (!checkApiKey()) return;
  if (state.generating) return;

  const typeId = state.selectedTypeId;
  if (!typeId) return;

  state.generating = true;
  state.cancelGeneration = false;
  state.abortController = new AbortController();
  disableGlobalActions(true);

  console.log('[generateAllVisible] starting bulk generation');

  console.log('[generateAllVariants] start', { typeId });

  const pb = document.getElementById('progress-bar');
  const pf = document.getElementById('progress-fill');
  const pt = document.getElementById('progress-text');
  const pl = document.getElementById('progress-label');
  if (pb) pb.classList.add('show');

  const variantIds = Object.keys(VARIANTS);
  const type = ALL_TYPES.find(t => t.id === typeId);
  let done = 0;

  for (const variantId of variantIds) {
    if (state.cancelGeneration) break;
    if (pl) pl.textContent = `Generating ${VARIANTS[variantId].name}...`;
    setCardLoading(typeId, variantId);
    disableCardActions(typeId, variantId, true);

    try {
      const { text: html, model } = await generateWithFallback(buildPrompt(type, VARIANTS[variantId]), state.apiKey, { signal: state.abortController.signal });
      saveMockup(typeId, variantId, html, model);
      updateCardWithHtml(typeId, variantId, html, type, VARIANTS[variantId]);
      updateVariantCard(typeId, variantId);
    } catch (err) {
      if (err.name === 'AbortError' || String(err).toLowerCase().includes('abort')) {
        showToast('⏹ Bulk generation stopped.', 'warning');
        break;
      }
      setCardError(typeId, variantId, variantId, err.message);
    }

    // Re-enable card actions for this variant after attempt
    disableCardActions(typeId, variantId, false);

    done++;
    if (pf) pf.style.width = `${(done / variantIds.length) * 100}%`;
    if (pt) pt.textContent = `${done}/${variantIds.length}`;
    await new Promise(r => setTimeout(r, 800));
  }

  if (pb) pb.classList.remove('show');
  state.generating = false;
  state.abortController = null;
  disableGlobalActions(false);
  updateTypeMeta(typeId);
  if (!state.cancelGeneration) showToast(`✅ All variants for ${type.name} generated!`, 'success');
}

function cancelGeneration() {
  state.cancelGeneration = true;
  state.generating = false;
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) progressBar.classList.remove('show');
  disableGlobalActions(false);
  showToast('⏹ Generation cancelled', 'error');
}

async function generateAllVisible() {
  if (!checkApiKey()) return;
  if (state.generating) return;

  if (!confirm(`Generate all 150 mockups? This will make 150 API calls and may take several minutes. Proceed?`)) return;

  state.generating = true;
  state.cancelGeneration = false;
  state.abortController = new AbortController();
  disableGlobalActions(true);

  const pb = document.getElementById('progress-bar');
  const pf = document.getElementById('progress-fill');
  const pt = document.getElementById('progress-text');
  const pl = document.getElementById('progress-label');

  if (document.getElementById('type-view').style.display !== 'none' && pb) {
    pb.classList.add('show');
  }

  const total = ALL_TYPES.length * 3;
  let done = 0;

  for (const type of ALL_TYPES) {
    if (state.cancelGeneration) break;
    for (const [variantId, variant] of Object.entries(VARIANTS)) {
      if (state.cancelGeneration) break;
      if (hasMockup(type.id, variantId)) { done++; continue; }
      pl.textContent = `${type.name} — ${variant.name}...`;

      try {
        disableCardActions(type.id, variantId, true);
        const { text: html, model } = await generateWithFallback(buildPrompt(type, variant), state.apiKey, { signal: state.abortController.signal });
        saveMockup(type.id, variantId, html, model);
        if (state.selectedTypeId === type.id) {
          updateCardWithHtml(type.id, variantId, html, type, variant);
          updateVariantCard(type.id, variantId);
        }
      } catch (err) {
        if (err.name === 'AbortError' || String(err).toLowerCase().includes('abort')) {
          showToast('⏹ Generation stopped.', 'warning');
          break;
        }
        console.error(`${type.id} ${variantId}:`, err);
        const msg = err && err.message ? err.message : 'Generation failed';
        if (msg.toLowerCase().includes('invalid api key') || msg.toLowerCase().includes('missing') || msg.toLowerCase().includes('quota')) {
          showToast(msg, 'error');
          state.generating = false;
          if (document.getElementById('progress-bar')) document.getElementById('progress-bar').classList.remove('show');
          return;
        } else {
          showToast(`${type.name} ${variant.name}: ${msg}`, 'error');
        }
      }

      // Ensure card actions are re-enabled regardless of success/failure
      disableCardActions(type.id, variantId, false);

      done++;
      pf.style.width = `${(done / total) * 100}%`;
      pt.textContent = `${done}/${total}`;
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (pb) pb.classList.remove('show');
  state.generating = false;
  state.abortController = null;
  disableGlobalActions(false);
  showToast(`✅ Generation complete! ${Object.keys(state.mockups).length}/150 mockups created.`, 'success');
}

function regenerateAll() {
  if (!state.selectedTypeId || !checkApiKey()) return;
  generateAllVariants();
}

// ══════════════════════════════════════════════════════
//  CARD STATE HELPERS
// ══════════════════════════════════════════════════════
function setCardLoading(typeId, variantId) {
  const previewEl = document.getElementById(`preview-${typeId}-${variantId}`);
  if (!previewEl) return;
  previewEl.innerHTML = `
    <div class="mockup-loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Generating ${VARIANTS[variantId]?.name}...</div>
      <div class="loading-sub">Gemini is creating your mockup</div>
    </div>
  `;
}

// Disable or enable UI actions for a specific mockup card
function disableCardActions(typeId, variantId, disabled = true) {
  const card = document.getElementById(`card-${typeId}-${variantId}`);
  if (!card) return;
  const attr = disabled ? 'true' : null;
  // mark dataset so CSS can dim if needed
  if (disabled) card.dataset.disabled = '1'; else delete card.dataset.disabled;

  // disable footer buttons
  card.querySelectorAll('.mockup-footer-actions button, .overlay-btn, .ph-gen-btn').forEach(b => {
    try { b.disabled = disabled; } catch (e) {}
    if (disabled) b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled');
    if (disabled) b.classList.add('disabled'); else b.classList.remove('disabled');
  });
}

// Disable/enable top-level actions to prevent duplicate generation
function disableGlobalActions(disabled = true) {
  const ids = ['btn-save-api-key','btn-export','btn-save-all'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.disabled = !!disabled;
    if (disabled) el.classList.add('disabled'); else el.classList.remove('disabled');
  });
}

function setCardError(typeId, variantId, vName, msg) {
  const previewEl = document.getElementById(`preview-${typeId}-${variantId}`);
  if (!previewEl) return;
  previewEl.innerHTML = '';
  const wrap = document.createElement('div'); wrap.className = 'mockup-loading';
  const icon = document.createElement('div'); icon.style.fontSize = '2rem'; icon.textContent = '❌';
  const title = document.createElement('div'); title.className = 'loading-text'; title.style.color = 'var(--red)'; title.textContent = 'Generation failed';
  const sub = document.createElement('div'); sub.className = 'loading-sub'; sub.textContent = msg;
  const retry = document.createElement('button'); retry.className = 'ph-gen-btn'; retry.style.marginTop = '8px'; retry.textContent = 'Retry';
  retry.dataset.action = 'generate'; retry.dataset.type = typeId; retry.dataset.variant = variantId;
  wrap.appendChild(icon); wrap.appendChild(title); wrap.appendChild(sub); wrap.appendChild(retry);
  previewEl.appendChild(wrap);
}

function updateCardWithHtml(typeId, variantId, html, type, variant) {
  const previewEl = document.getElementById(`preview-${typeId}-${variantId}`);
  if (!previewEl) return;
  console.log('[updateCardWithHtml]', `${typeId}_${variantId}`);
  // Store HTML on the preview for lazy iframe creation and show overlay for touch
  previewEl.innerHTML = '';
  previewEl.dataset.srcdoc = html;
  const overlay = document.createElement('div'); overlay.className = 'mockup-overlay';
  const ovBtn = document.createElement('button');
  ovBtn.className = 'overlay-btn';
  ovBtn.dataset.action = 'openModal';
  ovBtn.dataset.type = typeId;
  ovBtn.dataset.variant = variantId;
  ovBtn.textContent = '🔍 Full Preview';
  overlay.appendChild(ovBtn);
  previewEl.appendChild(overlay);

  // Ask the observer to load iframe if visible
  if (window._utf_iframeObserver) window._utf_iframeObserver.unobserve(previewEl);
  if (window._utf_iframeObserver) window._utf_iframeObserver.observe(previewEl);

  // Update footer buttons
  const card = document.getElementById(`card-${typeId}-${variantId}`);
  if (card) {
    const footer = card.querySelector('.mockup-footer-actions');
    if (footer) {
      footer.innerHTML = '';
      const regen = document.createElement('button'); regen.className = 'icon-btn'; regen.title = 'Regenerate'; regen.textContent = '🔄'; regen.dataset.action = 'generate'; regen.dataset.type = typeId; regen.dataset.variant = variantId;
      const save = document.createElement('button'); save.className = 'icon-btn'; save.title = 'Save'; save.textContent = '💾'; save.dataset.action = 'saveCard'; save.dataset.type = typeId; save.dataset.variant = variantId;
      const clear = document.createElement('button'); clear.className = 'icon-btn'; clear.title = 'Clear'; clear.textContent = '✖'; clear.dataset.action = 'clearCard'; clear.dataset.type = typeId; clear.dataset.variant = variantId;
      const copy = document.createElement('button'); copy.className = 'icon-btn'; copy.title = 'Copy HTML'; copy.textContent = '📋'; copy.dataset.action = 'copy'; copy.dataset.type = typeId; copy.dataset.variant = variantId;
      const full = document.createElement('button'); full.className = 'icon-btn'; full.title = 'Fullscreen'; full.textContent = '⛶'; full.dataset.action = 'openModal'; full.dataset.type = typeId; full.dataset.variant = variantId;
      footer.appendChild(regen); footer.appendChild(save); footer.appendChild(clear); footer.appendChild(copy); footer.appendChild(full);

      // ensure any transient disabled state is removed
      footer.querySelectorAll('button').forEach(b => { b.disabled = false; b.removeAttribute('aria-disabled'); b.classList.remove('disabled'); });
    }
    // Remove dataset-disabled marker if present
    if (card.dataset && card.dataset.disabled) delete card.dataset.disabled;
  }
}

function updateVariantCard(typeId, variantId) {
  const cards = document.querySelectorAll('.variant-card');
  const variantIds = Object.keys(VARIANTS);
  const idx = variantIds.indexOf(variantId);
  if (cards[idx] && hasMockup(typeId, variantId)) {
    cards[idx].classList.add('generated');
  }
}

function updateTypeMeta(typeId) {
  const genCount = ['clean','bold','dark'].filter(v => hasMockup(typeId, v)).length;
  const metaEl = document.getElementById('type-meta');
  if (!metaEl) return;
  const chips = metaEl.querySelectorAll('.meta-chip');
  if (chips[2]) chips[2].textContent = `${genCount}/3 generated`;
}

// ══════════════════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════════════════
function openModal(typeId, variantId) {
  const html = getMockup(typeId, variantId);
  if (!html) return;

  console.log('[openModal]', `${typeId}_${variantId}`);

  const type = ALL_TYPES.find(t => t.id === typeId);
  document.getElementById('modal-url').textContent = `https://${type?.url || 'localhost'} — ${VARIANTS[variantId]?.name} Variant`;
  document.getElementById('modal-iframe').srcdoc = html;
  state.currentModalHtml = html;
  document.getElementById('modal-backdrop').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-backdrop')) return;
  document.getElementById('modal-backdrop').classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('modal-iframe').srcdoc = ''; }, 300);
}

// ══════════════════════════════════════════════════════
//  COPY / EXPORT
// ══════════════════════════════════════════════════════
function copyHtml(typeId, variantId) {
  const html = getMockup(typeId, variantId);
  if (!html) return;
  navigator.clipboard.writeText(html).then(() => {
    showToast('📋 HTML copied to clipboard!', 'success');
  });
}

function copyCurrentHtml() {
  if (!state.currentModalHtml) return;
  navigator.clipboard.writeText(state.currentModalHtml).then(() => {
    showToast('📋 HTML copied!', 'success');
  });
}

function exportAll() {
  const total = Object.keys(state.mockups).length;
  if (total === 0) { showToast('No mockups to export yet', 'error'); return; }

  let zip = '/* UltraThemeForge Export — ' + total + ' mockups */\n\n';
  for (const [key, html] of Object.entries(state.mockups)) {
    const [typeId, variantId] = key.split('_');
    const type = ALL_TYPES.find(t => t.id === typeId);
    zip += `/* ═══ ${type?.name} — ${variantId} ═══ */\n`;
  }

  // For a real export, we'd zip; here we'll export as JSON manifest
  const blob = new Blob([JSON.stringify({
    exported: new Date().toISOString(),
    total,
    mockups: Object.fromEntries(
      Object.entries(state.mockups).map(([k, v]) => [k, v.substring(0, 100) + '...'])
    )
  }, null, 2)], { type: 'application/json' });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ultathemeforge-${total}-mockups.json`;
  a.click();
  showToast(`📦 Exported manifest for ${total} mockups`, 'success');
}

// ══════════════════════════════════════════════════════
//  OVERVIEW MODE
// ══════════════════════════════════════════════════════
function showOverview() {
  document.getElementById('welcome-state').style.display = 'none';
  const tv = document.getElementById('type-view');
  tv.style.display = 'flex';
  tv.style.flexDirection = 'column';
  tv.style.gap = '20px';

  document.getElementById('type-title').innerHTML = '📊 All 50 Types';
  document.getElementById('type-subtitle').textContent = 'Complete overview of all website types and generation status';
  document.getElementById('type-meta').innerHTML = `
    <span class="meta-chip">${Object.keys(state.mockups).length}/150 generated</span>
    <span class="meta-chip accent">${ALL_TYPES.length} types × 3 variants</span>
  `;
  // Ensure API setup / compact status reflect saved key state
  try { refreshApiKeyUI(); } catch (e) { /* ignore if function not yet defined */ }
  document.getElementById('variant-selector').innerHTML = '';
  document.getElementById('progress-bar').classList.remove('show');

  // Stats
  const stats = document.createElement('div');
  stats.className = 'stats-bar';
  const gen = Object.keys(state.mockups).length;
  stats.innerHTML = `
    <div class="stat-card"><div class="stat-card-n">50</div><div class="stat-card-l">Total Types</div></div>
    <div class="stat-card"><div class="stat-card-n">150</div><div class="stat-card-l">Total Mockups</div></div>
    <div class="stat-card"><div class="stat-card-n">${gen}</div><div class="stat-card-l">Generated</div></div>
    
  `;

  const grid = document.createElement('div');
  grid.className = 'overview-grid';
  ALL_TYPES.forEach(type => {
    const item = document.createElement('div');
    item.className = 'overview-item';
    const dots = ['clean','bold','dark'].map(v =>
      `<div class="ov-dot ${hasMockup(type.id, v) ? 'done' : ''}"></div>`
    ).join('');
    item.innerHTML = `
      <div class="ov-emoji">${type.emoji}</div>
      <div class="ov-name">${type.name}</div>
      <div class="ov-cat">${type.categoryLabel}</div>
      <div class="ov-dots">${dots}</div>
    `;
    item.addEventListener('click', () => selectType(type.id));
    grid.appendChild(item);
  });

  document.getElementById('mockups-grid').className = '';
  document.getElementById('mockups-grid').style.display = 'flex';
  document.getElementById('mockups-grid').style.flexDirection = 'column';
  document.getElementById('mockups-grid').style.gap = '16px';
  document.getElementById('mockups-grid').innerHTML = '';
  document.getElementById('mockups-grid').appendChild(stats);
  document.getElementById('mockups-grid').appendChild(grid);

  state.selectedTypeId = null;
  document.querySelectorAll('.type-item').forEach(el => el.classList.remove('active'));
  updateMobileToolsVisibility();
}

// ══════════════════════════════════════════════════════
//  API KEY
// ══════════════════════════════════════════════════════
function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key || !key.startsWith('AIza')) {
    showToast('❗ Please enter a valid Google AI Studio API key (starts with AIza)', 'error');
    return;
  }
  state.apiKey = key;
  localStorage.setItem('utf_api_key', key);
  try { refreshApiKeyUI(); } catch (e) { document.getElementById('api-setup').style.display = 'none'; }
  showToast('✅ API key saved! Ready to generate mockups.', 'success');
}

function deleteApiKey() {
  // Confirm and remove the saved API key from state and localStorage
  const input = document.getElementById('api-key-input');
  const current = state.apiKey || (input ? input.value.trim() : '');
  if (!current) {
    showToast('No API key found to remove', 'info');
    return;
  }
  if (!confirm('Remove the stored Google AI Studio API key? You will need to enter it again to generate mockups.')) return;
  state.apiKey = '';
  localStorage.removeItem('utf_api_key');
  if (input) { input.value = ''; input.focus(); }
  try { refreshApiKeyUI(); } catch (e) { const apiSetup = document.getElementById('api-setup'); if (apiSetup) apiSetup.style.display = 'flex'; }
  showToast('✅ API key removed', 'success');
}

// Refresh API setup UI: show compact status when a key is present, otherwise show full setup
function refreshApiKeyUI() {
  const apiSetup = document.getElementById('api-setup');
  const compact = document.getElementById('api-key-compact');
  const input = document.getElementById('api-key-input');
  if (state.apiKey) {
    if (apiSetup) apiSetup.style.display = 'none';
    if (compact) compact.style.display = 'block';
    if (input) input.value = state.apiKey;
  } else {
    if (apiSetup) apiSetup.style.display = 'flex';
    if (compact) compact.style.display = 'none';
    if (input) input.value = '';
  }
}

// ══════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ══════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════
//  ABOUT PANEL
// ══════════════════════════════════════════════════════
function showAbout() {
  document.getElementById('about-backdrop').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeAbout() {
  document.getElementById('about-backdrop').classList.remove('show');
  document.body.style.overflow = '';
}
function closeAboutOutside(e) {
  if (e.target === document.getElementById('about-backdrop')) closeAbout();
}

// ══════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal(null);
    closeAbout();
    // Also close mobile sidebar if open
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
      document.body.classList.remove('mobile-sidebar-open');
      const mobileBtn = document.getElementById('mobile-menu-btn');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    }
  }
  if (e.key === 'g' && e.ctrlKey && state.selectedTypeId) {
    e.preventDefault();
    generateAllVariants();
  }
});

// --------------------------------------------------
// Event delegation and lazy iframe observer
// - All dynamic buttons use `data-action` attributes
// - We use an IntersectionObserver to lazily create iframes
// --------------------------------------------------
document.body.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  // Ignore clicks on disabled controls
  if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
  const action = btn.dataset.action;
  const type = btn.dataset.type;
  const variant = btn.dataset.variant;

  switch (action) {
    case 'generate':
      if (type && variant) generateSingle(type, variant);
      break;
    case 'saveCard':
      if (type && variant) saveMockupToSaved(type, variant);
      break;
    case 'clearCard':
      if (type && variant) clearGeneratedMockup(type, variant);
      break;
    case 'openModal':
      if (type && variant) openModal(type, variant);
      break;
    case 'openSaved':
      if (btn.dataset.savedKey) openSavedModal(btn.dataset.savedKey);
      break;
    case 'copy':
      if (type && variant) copyHtml(type, variant);
      break;
    case 'copySaved':
      if (btn.dataset.savedKey) copySavedHtml(btn.dataset.savedKey);
      break;
    case 'deleteSaved':
      if (btn.dataset.savedKey) deleteSavedMockup(btn.dataset.savedKey);
      break;
    case 'export':
      exportAll();
      break;
    case 'overview':
      showOverview();
      break;
    case 'about':
      showAbout();
      break;
    default:
      break;
  }
});

// Lazy iframe loader — creates iframe only when preview enters viewport
window._utf_iframeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    try {
      if (el.dataset.srcdoc && !el.dataset.loaded) {
        const iframe = document.createElement('iframe');
        iframe.loading = 'lazy';
        iframe.srcdoc = el.dataset.srcdoc;
        iframe.title = 'Mockup Preview';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        const overlay = el.querySelector('.mockup-overlay');
        if (overlay) el.insertBefore(iframe, overlay);
        else el.appendChild(iframe);
        el.dataset.loaded = '1';
      }
    } catch (e) {
      console.error('Iframe load error', e);
    }
    window._utf_iframeObserver.unobserve(el);
  });
}, { root: null, rootMargin: '200px', threshold: 0.05 });

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
function init() {
  console.log('App started');
  const statusBanner = document.getElementById('status-banner');
  try {
    renderSidebar();
    updateStats();

    if (state.apiKey) {
    const input = document.getElementById('api-key-input');
    if (input) input.value = state.apiKey;
    try { refreshApiKeyUI(); } catch(e){}
  }

  // Static header / UI bindings
  document.getElementById('btn-overview')?.addEventListener('click', showOverview);
  document.getElementById('btn-about')?.addEventListener('click', showAbout);
  document.getElementById('btn-export')?.addEventListener('click', exportAll);
  document.getElementById('btn-save-all')?.addEventListener('click', saveAllGenerated);
  document.getElementById('btn-saved-tab')?.addEventListener('click', showSavedView);
  document.getElementById('btn-show-saved')?.addEventListener('click', showSavedView);
  document.getElementById('btn-show-types')?.addEventListener('click', showTypeView);
  document.getElementById('btn-back-home')?.addEventListener('click', goHome);
  document.getElementById('btn-save-api-key')?.addEventListener('click', saveApiKey);
  document.getElementById('btn-delete-api-key')?.addEventListener('click', deleteApiKey);
  document.getElementById('btn-show-api-setup')?.addEventListener('click', () => {
    const apiSetup = document.getElementById('api-setup');
    const compact = document.getElementById('api-key-compact');
    if (apiSetup) apiSetup.style.display = 'flex';
    if (compact) compact.style.display = 'none';
    document.getElementById('api-key-input')?.focus();
  });
  document.getElementById('btn-delete-api-key-compact')?.addEventListener('click', deleteApiKey);

  // Initialize model selector and persistence
  const modelSelectEl = document.getElementById('model-select');
  if (modelSelectEl) {
    // Set initial value from state (loaded from localStorage during startup)
    try { modelSelectEl.value = state.modelId || PRIMARY_MODEL; } catch(e){}
    modelSelectEl.addEventListener('change', () => {
      state.modelId = modelSelectEl.value;
      localStorage.setItem('utf_model', state.modelId);
      try { updateUsageUI(); } catch(e){}
      showToast(`Model set to ${MODEL_OPTIONS[state.modelId]?.name || state.modelId}`);
    });
    document.getElementById('btn-save-model')?.addEventListener('click', () => {
      state.modelId = modelSelectEl.value;
      localStorage.setItem('utf_model', state.modelId);
      showToast(`Model saved: ${MODEL_OPTIONS[state.modelId]?.name || state.modelId}`);
    });
  }

  // Manage usage panel bindings
  const muManageBtn = document.getElementById('mu-manage-btn');
  const muDetails = document.getElementById('model-usage-details');
  if (muManageBtn && muDetails) {
    muManageBtn.addEventListener('click', () => {
      muDetails.style.display = muDetails.style.display === 'block' ? 'none' : 'block';
    });
    document.getElementById('mu-save-credit')?.addEventListener('click', () => {
      const v = parseFloat(document.getElementById('mu-credit-input').value) || 0;
      state.credit = v;
      localStorage.setItem('utf_credit', state.credit);
      updateUsageUI();
      showToast(`Available credit set to $${v.toFixed(2)}`);
      muDetails.style.display = 'none';
    });
    document.getElementById('mu-reset-usage')?.addEventListener('click', () => {
      if (confirm('Reset all tracked usage?')) { state.usage = {}; localStorage.removeItem('utf_usage'); updateUsageUI(); showToast('Usage reset'); }
    });
  }

  // Help toggle for the usage line (small chevron that reveals an instruction)
  const muHelpToggle = document.getElementById('mu-help-toggle');
  const muHelp = document.getElementById('mu-help');
  if (muHelpToggle && muHelp) {
    muHelpToggle.addEventListener('click', () => {
      const open = muHelp.style.display === 'block';
      muHelp.style.display = open ? 'none' : 'block';
      muHelpToggle.textContent = open ? '▾' : '▴';
      muHelpToggle.setAttribute('aria-expanded', (!open).toString());
    });
  }

  // Debug: log button clicks to verify interactions
  document.querySelectorAll('button').forEach(btn => {
    if (!btn.dataset._debugBound) {
      btn.addEventListener('click', () => {
        console.log('BUTTON CLICK:', btn.id || btn.dataset.action || btn.textContent.trim());
      });
      btn.dataset._debugBound = '1';
    }
  });

  // Initial update of usage UI
  try { updateUsageUI(); } catch(e){}
  document.getElementById('progress-cancel')?.addEventListener('click', cancelGeneration);

  // Modal bindings
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(e); });
  document.getElementById('btn-copy-modal')?.addEventListener('click', copyCurrentHtml);
  document.getElementById('btn-modal-close')?.addEventListener('click', () => closeModal(null));
  document.getElementById('btn-runtime-error-dismiss')?.addEventListener('click', hideRuntimeError);

  // About panel bindings
  const aboutBackdrop = document.getElementById('about-backdrop');
  if (aboutBackdrop) aboutBackdrop.addEventListener('click', (e) => { if (e.target === aboutBackdrop) closeAbout(); });
  document.getElementById('btn-about-close')?.addEventListener('click', closeAbout);
  document.getElementById('btn-about-close-bottom')?.addEventListener('click', closeAbout);
  document.getElementById('btn-start-static')?.addEventListener('click', () => { closeAbout(); selectType('static'); });
  document.getElementById('btn-about-overview')?.addEventListener('click', () => { closeAbout(); showOverview(); });

  // Home screen quick-start card (mobile only)
  document.getElementById('btn-home-start-static')?.addEventListener('click', () => selectType('static'));
  document.getElementById('btn-home-overview')?.addEventListener('click', showOverview);

  // Re-render the sidebar/tools when the viewport crosses the mobile breakpoint,
  // so the design tools move between sidebar (desktop) and content area (mobile)
  let _utfWasMobile = window.innerWidth <= 768;
  let _utfResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(_utfResizeTimer);
    _utfResizeTimer = setTimeout(() => {
      const nowMobile = window.innerWidth <= 768;
      if (nowMobile !== _utfWasMobile) {
        _utfWasMobile = nowMobile;
        renderSidebar(document.getElementById('search-input')?.value || '');
      }
    }, 150);
  });

  // Search input (debounced)
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let t = null;
    searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => filterTypes(), 200); });
  }

  // Mobile menu toggle (creates a mobile backdrop on demand)
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.setAttribute('aria-expanded', 'false');
    // Don't force-show the mobile button on desktop; CSS media query controls visibility.
    mobileBtn.addEventListener('click', () => {
      // Ensure backdrop exists before toggling state so CSS can show it immediately
      let mb = document.getElementById('mobile-sidebar-backdrop');
      if (!mb) {
        mb = document.createElement('div');
        mb.id = 'mobile-sidebar-backdrop';
        mb.className = 'mobile-sidebar-backdrop';
        document.body.appendChild(mb);
        mb.addEventListener('click', () => {
          sidebar.classList.remove('mobile-open');
          document.body.classList.remove('mobile-sidebar-open');
          mobileBtn.setAttribute('aria-expanded', 'false');
        });
      }

      const open = sidebar.classList.toggle('mobile-open');
      mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('mobile-sidebar-open', open);
    });
  }

  // Ensure observer watches any existing previews
  document.querySelectorAll('.mockup-preview').forEach(p => { if (p.dataset.srcdoc && window._utf_iframeObserver) window._utf_iframeObserver.observe(p); });

    // Initialization successful
    if (statusBanner) {
      statusBanner.textContent = 'Ready';
      statusBanner.className = 'status-banner success';
    }
    console.log('App initialized successfully');
  } catch (err) {
    console.error('INIT ERROR:', err);
    if (statusBanner) {
      statusBanner.textContent = 'Failed';
      statusBanner.className = 'status-banner failure';
    }
    showRuntimeError(`Initialization failed: ${err?.message || 'Unknown error'}`);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
};