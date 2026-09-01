// ==UserScript==
// @name         Meta Business Suite Content Table Cleaner & Pager
// @namespace    https://github.com/Daidaros/meta-business-suite-content-table-cleaner
// @version      2.1.0
// @description  Hide promotion and overflow controls, then paginate Meta Business Suite content only when more than eight rows are loaded.
// @author       Daidaros
// @match        https://business.facebook.com/latest/insights/content*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const MARK = 'data-ocultar-controles-meta';
  const STYLE_ID = 'ocultar-controles-meta-style';
  const PAGER_ID = 'ocultar-controles-meta-pager';
  const PAGE_HIDDEN = 'data-ocultar-controles-meta-page-hidden';
  const ROWS_PER_PAGE = 8;
  const PROMOTION_LABELS = new Set([
    // English, Spanish, Portuguese, French, German, Italian and Dutch
    'boost', 'boost post', 'promocionar', 'promover', 'booster', 'promouvoir',
    'bewerben', 'metti in evidenza', 'promoten', 'bericht promoten',
    // Nordic and Central European languages
    'marknadsför', 'promoveren', 'markedsfør', 'mainosta', 'promuj',
    // Turkish, Indonesian, Vietnamese and Russian
    'tanıt', 'promosikan', 'quảng cáo', 'продвигать',
    // Chinese, Japanese, Korean, Arabic and Hebrew
    '推广', '推廣', '宣伝する', '홍보하기', 'ترويج', 'كسب التفاعل', 'קדם',
  ]);
  let page = 0;

  const cleanText = (element) =>
    (element.textContent || '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleLowerCase();

  function markControls() {
    for (const grid of document.querySelectorAll('[role="grid"]')) {
      for (const control of grid.querySelectorAll('[role="row"] [role="button"]')) {
        const isPromote = PROMOTION_LABELS.has(cleanText(control));
        const isOverflowMenu = control.getAttribute('aria-haspopup') === 'menu';

        if (isPromote || isOverflowMenu) control.setAttribute(MARK, 'true');
      }
    }
  }

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      [role="grid"] [${MARK}="true"] {
        display: none !important;
      }

      [role="grid"] [${PAGE_HIDDEN}="true"] {
        display: none !important;
      }

      #${PAGER_ID} {
        align-items: center;
        background: #ffffff;
        border: 1px solid #ccd0d5;
        border-radius: 8px;
        bottom: 16px;
        box-shadow: 0 2px 8px rgb(0 0 0 / 18%);
        color: #1c1e21;
        display: flex;
        font: 14px/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        gap: 10px;
        padding: 8px 10px;
        position: fixed;
        right: 16px;
        z-index: 2147483647;
      }

      #${PAGER_ID} button {
        background: #f0f2f5;
        border: 0;
        border-radius: 6px;
        color: #050505;
        cursor: pointer;
        font: inherit;
        padding: 6px 10px;
      }

      #${PAGER_ID} button:disabled {
        cursor: default;
        opacity: .45;
      }
    `;
    document.head.append(style);
  }

  function dataRows() {
    const grid = document.querySelector('[role="grid"]');
    if (!grid) return [];

    return Array.from(grid.querySelectorAll('[role="row"]')).filter((row) =>
      !row.querySelector('[role="columnheader"]') && row.querySelector('[role="button"]')
    );
  }

  function ensurePager() {
    let pager = document.getElementById(PAGER_ID);
    if (pager) return pager;

    pager = document.createElement('div');
    pager.id = PAGER_ID;
    pager.innerHTML = `
      <button type="button" data-action="previous">‹ Anterior</button>
      <span data-page-label></span>
      <button type="button" data-action="next">Siguiente ›</button>
    `;

    pager.addEventListener('click', (event) => {
      const action = event.target.closest('button')?.dataset.action;
      if (action === 'previous') page -= 1;
      if (action === 'next') page += 1;
      applyPagination();
    });
    document.body.append(pager);
    return pager;
  }

  function removePager() {
    document.getElementById(PAGER_ID)?.remove();
  }

  function applyPagination() {
    const rows = dataRows();
    if (rows.length <= ROWS_PER_PAGE) {
      rows.forEach((row) => row.removeAttribute(PAGE_HIDDEN));
      page = 0;
      removePager();
      return;
    }

    const pager = ensurePager();
    const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));
    page = Math.max(0, Math.min(page, totalPages - 1));

    rows.forEach((row, index) => {
      const visible = index >= page * ROWS_PER_PAGE && index < (page + 1) * ROWS_PER_PAGE;
      row.setAttribute(PAGE_HIDDEN, String(!visible));
    });

    pager.querySelector('[data-page-label]').textContent = `Página ${page + 1} de ${totalPages}`;
    pager.querySelector('[data-action="previous"]').disabled = page === 0;
    pager.querySelector('[data-action="next"]').disabled = page >= totalPages - 1;
  }

  let queued = false;
  function update() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      installStyle();
      markControls();
      applyPagination();
    });
  }

  update();
  new MutationObserver(update).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
