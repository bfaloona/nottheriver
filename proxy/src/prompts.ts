import normalizeTemplate from '../prompts/normalize';
import enrichTemplate from '../prompts/enrich';

// The only candidate fields the model ever sees: no address, coordinates or distance.
// The id, not the domain, keys a classification, so a shop's blog page is judged as a page.
export interface LlmView { id: string; domain: string; title: string; snippet: string; url: string }
export interface EnrichProduct { canonical_name: string; category: string }

// Single pass, so a substituted value is never re-scanned; braces in values are
// broken up anyway so a rendered prompt can never be fed back in as a template.
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key];
    if (value === undefined) throw new Error(`template variable missing: ${key}`);
    return value.replace(/\{\{/g, '{ {').replace(/\}\}/g, '} }');
  });
}

// The product only: one product gets one cached reading wherever it was searched.
export function buildNormalizePrompt(input: { product: string }): string {
  return renderTemplate(normalizeTemplate, { product: JSON.stringify(input.product) });
}

export function buildEnrichPrompt(view: LlmView[], product: EnrichProduct): string {
  const candidates = view.map(({ id, domain, title, snippet, url }) => ({ id, domain, title, snippet, url }));
  return renderTemplate(enrichTemplate, {
    product: JSON.stringify({ canonical_name: product.canonical_name, category: product.category }),
    candidates: JSON.stringify(candidates, null, 1),
  });
}
