// "Why this rank" is a native <details>, so touch and keyboard users get
// tap/Enter to expand in place. Where a fine hover pointer exists it also opens
// on hover or focus, and meets WCAG 1.4.13: Escape dismisses it, the pointer can
// move into the panel (listeners sit on the wrapper), and it stays until hover
// or focus leaves. A click on the summary pins it open.

let outsideClicks: AbortController | undefined;

export function wirePopovers(root: ParentNode): void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const all = [...root.querySelectorAll<HTMLDetailsElement>('details.why')];

  // One document listener per render; the previous render's details are gone.
  outsideClicks?.abort();
  outsideClicks = new AbortController();
  document.addEventListener(
    'click',
    (e) => {
      for (const d of all) if (d.dataset.pinned && !d.contains(e.target as Node)) unpinAndClose(d);
    },
    { signal: outsideClicks.signal },
  );

  for (const d of all) {
    const summary = d.querySelector('summary')!;
    let hovered = false;
    d.addEventListener('mouseenter', () => { hovered = true; d.open = true; });
    d.addEventListener('mouseleave', () => { hovered = false; if (!d.dataset.pinned) d.open = false; });
    d.addEventListener('focusin', () => { d.open = true; });
    d.addEventListener('focusout', (e) => {
      // Clicking or selecting plain text in the panel sends focus to the body
      // (relatedTarget null); the pointer is still inside, so keep it open.
      if (e.relatedTarget === null && hovered) return;
      if (!d.contains(e.relatedTarget as Node | null)) unpinAndClose(d);
    });
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (d.dataset.pinned) unpinAndClose(d);
      else { d.dataset.pinned = '1'; d.open = true; }
    });
    d.addEventListener('keydown', (e) => {
      // Focus first: moving focus to the summary fires focusin, which would reopen it.
      if (e.key === 'Escape') { summary.focus(); unpinAndClose(d); }
    });
  }
}

function unpinAndClose(d: HTMLDetailsElement): void {
  delete d.dataset.pinned;
  d.open = false;
}
