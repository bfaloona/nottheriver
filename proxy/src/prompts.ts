import normalizeTemplate from '../prompts/normalize';
import enrichTemplate from '../prompts/enrich';

// The only retailer fields the model ever sees: no address, coordinates or distance.
export interface LlmView { domain: string; title: string; snippet: string; url: string }

// Single pass, so a substituted value is never re-scanned; braces in values are
// broken up anyway so a rendered prompt can never be fed back in as a template.
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key];
    if (value === undefined) throw new Error(`template variable missing: ${key}`);
    return value.replace(/\{\{/g, '{ {').replace(/\}\}/g, '} }');
  });
}

export function buildNormalizePrompt(input: { product: string; city: string; state: string }): string {
  return renderTemplate(normalizeTemplate, {
    product: JSON.stringify(input.product),
    city: JSON.stringify(input.city),
    state: JSON.stringify(input.state),
  });
}

export function buildEnrichPrompt(view: LlmView[]): string {
  const retailers = view.map(({ domain, title, snippet, url }) => ({ domain, title, snippet, url }));
  return renderTemplate(enrichTemplate, { retailers: JSON.stringify(retailers, null, 1) });
}
