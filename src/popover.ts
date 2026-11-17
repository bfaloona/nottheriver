// A shop's name is the button for its rank panel. A press (tap, click or Enter) opens the panel
// and pins it; another press closes it. Without a fine hover pointer that is all: the panel
// opens in place, as part of the list, and stays until the name is pressed again.
// With one, the stylesheet floats the panel over the list, so it also opens when the pointer
// rests on the name, and it meets WCAG 1.4.13: Escape dismisses it wherever focus is, the pointer
// can move into the panel (listeners sit on the wrapper), and it stays until the pointer or
// focus leaves. The link to the shop is the exception inside the wrapper: the pointer on it
// opens nothing and closes an unpinned panel, so heading for the shop never puts a panel up.
// Focus alone never opens it: a map pin click puts focus on the name, and Tab passes every one.

// Long enough that a pointer crossing the names on its way down the list opens nothing.
const REST_MS = 250;

let outsideClicks: AbortController | undefined;

const panelOf = (why: HTMLElement) => why.querySelector<HTMLElement>('.why-panel')!;

function setOpen(why: HTMLElement, open: boolean): void {
  panelOf(why).hidden = !open;
  why.querySelector('[data-retailer]')!.setAttribute('aria-expanded', String(open));
}

function unpinAndClose(why: HTMLElement): void {
  delete why.dataset.pinned;
  setOpen(why, false);
}

export function wirePopovers(root: ParentNode): void {
  const all = [...root.querySelectorAll<HTMLElement>('[data-why]')];
  const floats = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // One set of document listeners per render; the previous render's panels are gone.
  outsideClicks?.abort();
  outsideClicks = new AbortController();
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape') return;
      for (const why of all) {
        if (panelOf(why).hidden) continue;
        const focused = why.contains(document.activeElement);
        // A panel opened in place is part of the list: only Escape from inside it closes it.
        if (!floats && !focused) continue;
        // Focus inside the panel would be lost with it, so it goes back to the name.
        if (focused) why.querySelector<HTMLButtonElement>('[data-retailer]')!.focus();
        unpinAndClose(why);
      }
    },
    { signal: outsideClicks.signal },
  );
  // Only a floating panel closes on a click elsewhere: one opened in place would collapse and
  // move the list under the visitor's finger.
  if (floats) {
    document.addEventListener(
      'click',
      (e) => {
        for (const why of all) if (why.dataset.pinned && !why.contains(e.target as Node)) unpinAndClose(why);
      },
      { signal: outsideClicks.signal },
    );
  }

  for (const why of all) {
    let rest: ReturnType<typeof setTimeout> | undefined;
    const cancelRest = () => {
      clearTimeout(rest);
      rest = undefined;
    };
    why.querySelector<HTMLButtonElement>('[data-retailer]')!.addEventListener('click', () => {
      // A press decides: the pointer's rest must not reopen a panel just pressed shut.
      cancelRest();
      if (why.dataset.pinned) return unpinAndClose(why);
      why.dataset.pinned = '1';
      setOpen(why, true);
    });
    if (!floats) continue;

    let hovered = false;
    why.addEventListener('mouseenter', () => {
      hovered = true;
    });
    // mouseover, not mouseenter: it also fires as the pointer moves between the name, the link
    // and the panel, which the wrapper's own mouseenter does not report.
    // Only the name starts the rest; the space around it and the panel keep things as they are.
    why.addEventListener('mouseover', (e) => {
      const over = e.target as Element;
      if (over.closest('[data-visit]')) {
        cancelRest();
        if (!why.dataset.pinned) setOpen(why, false);
      } else if (over.closest('[data-retailer]') && panelOf(why).hidden) {
        rest ??= setTimeout(() => {
          rest = undefined;
          setOpen(why, true);
        }, REST_MS);
      }
    });
    why.addEventListener('mouseleave', () => {
      hovered = false;
      cancelRest();
      if (!why.dataset.pinned) setOpen(why, false);
    });
    why.addEventListener('focusout', (e) => {
      // Clicking or selecting plain text in the panel sends focus to the body
      // (relatedTarget null); the pointer is still inside, so keep it open.
      if (e.relatedTarget === null && hovered) return;
      if (!why.contains(e.relatedTarget as Node | null)) unpinAndClose(why);
    });
  }
}
