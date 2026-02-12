export function switchDashboardTabUi(tab: string) {
  document
    .querySelectorAll<HTMLElement>('.dashboard-tab')
    .forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tab));

  document.querySelectorAll<HTMLElement>('.dashboard-panel').forEach((panel) => {
    panel.style.display = panel.dataset.panel === tab ? 'block' : 'none';
  });
}

export function updateToggleSectionsButtonUi(
  collapseText: string,
  openText: string
) {
  const btn = document.getElementById('toggleSectionsBtn');
  if (!btn) return;

  const heads = Array.from(document.querySelectorAll<HTMLElement>('.section-head'));
  if (!heads.length) {
    btn.textContent = openText;
    return;
  }

  const allOpen = heads.every((h) => h.classList.contains('open'));
  btn.textContent = allOpen ? collapseText : openText;
}

export function toggleSectionUi(
  headEl: HTMLElement,
  onToggle: () => void
) {
  headEl.classList.toggle('open');
  onToggle();
}

export function toggleAllSectionsUi(onToggle: () => void) {
  const heads = Array.from(document.querySelectorAll<HTMLElement>('.section-head'));
  if (!heads.length) return;

  const allOpen = heads.every((h) => h.classList.contains('open'));
  heads.forEach((h) => h.classList.toggle('open', !allOpen));
  onToggle();
}
