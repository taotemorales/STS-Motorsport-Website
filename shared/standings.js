/**
 * standings.js — Renders standings/results tables from JSON data.
 *
 * Usage (standings):
 *   <tbody data-standings="cup"
 *          data-src="../data/cup-standings.json"></tbody>
 *
 * Usage (grouped standings like TCR/MNT — one tbody per group):
 *   <tbody data-standings="tcr"
 *          data-src="../data/tcr-standings.json"
 *          data-group="0"></tbody>
 *
 * Usage (endurance results):
 *   <tbody data-results="endurance"
 *          data-src="../data/endurance-results.json"></tbody>
 *
 * Status footer:
 *   <span data-standings-status="cup"
 *         data-src="../data/cup-standings.json"></span>
 *   <span data-standings-status="tcr"
 *         data-src="../data/tcr-standings.json"
 *         data-group="0"></span>
 */

(function () {
  'use strict';

  // SVG arrow templates
  var UP_SVG = '<svg width="9" height="11" viewBox="0 0 9 11" fill="none" style="flex-shrink:0;opacity:0.85;"><path d="M4.5 10V1M4.5 1L1 4.5M4.5 1L8 4.5" stroke="#2EAD6B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DOWN_SVG = '<svg width="9" height="11" viewBox="0 0 9 11" fill="none" style="flex-shrink:0;opacity:0.85;"><path d="M4.5 1V10M4.5 10L1 6.5M4.5 10L8 6.5" stroke="#D01200" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Platform tag classes
  var PLATFORM_CLASSES = {
    'GT7': 'sim-tag sim-gt7',
    'iRacing': 'sim-tag sim-iracing',
    'ACC': 'sim-tag sim-acc'
  };

  // Medal metal per podium position
  var MEDAL = {
    1: { label: 'Gold', cls: 'podium-gold' },
    2: { label: 'Silber', cls: 'podium-silver' },
    3: { label: 'Bronze', cls: 'podium-bronze' }
  };

  // Points color per position
  function ptsStyle(pos) {
    if (pos === 1) return '';
    if (pos === 2) return ' style="color:#D4D8F0;"';
    if (pos === 3) return ' style="color:#B0B8D8;"';
    return ' style="color:#9BA3C0;"';
  }

  // Position badge HTML
  function posBadge(pos) {
    if (pos <= 3) return '<span class="pos-badge pos-' + pos + '">' + pos + '</span>';
    return '<span class="pos-badge" style="color:#5A6080;">' + pos + '</span>';
  }

  // Driver name with optional movement arrow
  function driverCell(driver, movement, pos) {
    var isPodium = pos <= 3;
    var name = isPodium ? '<span class="font-medium' + (pos === 1 ? ' text-brand-white' : '') + '">' + driver + '</span>' : driver;

    if (movement === 'up') {
      return '<span style="display:inline-flex;align-items:center;gap:6px;">' + UP_SVG + name + '</span>';
    }
    if (movement === 'down') {
      return '<span style="display:inline-flex;align-items:center;gap:6px;">' + DOWN_SVG + name + '</span>';
    }
    return name;
  }

  // Build a single standings row
  function standingsRow(entry, columns) {
    var cls = entry.pos <= 3 ? ' class="podium-' + entry.pos + '"' : '';
    var teamColName = columns[2]; // "Team" or "Fahrzeug"
    var html = '<tr' + cls + '>';
    html += '<td>' + posBadge(entry.pos) + '</td>';
    html += '<td>' + driverCell(entry.driver, entry.movement, entry.pos) + '</td>';
    html += '<td class="hidden sm:table-cell text-brand-dim">' + entry.team + '</td>';
    html += '<td class="text-right"><span class="pts"' + ptsStyle(entry.pos) + '>' + entry.points + '</span></td>';
    html += '</tr>';
    return html;
  }

  // Build an endurance results row
  function resultsRow(entry) {
    var html = '<tr>';
    html += '<td>' + posBadge(entry.pos) + '</td>';
    html += '<td><div class="text-brand-dim" style="font-size:0.72rem; margin-bottom:2px;">' + entry.series + '</div><div class="text-brand-silver">' + entry.event + '</div></td>';
    html += '<td><span class="' + (PLATFORM_CLASSES[entry.platform] || 'sim-tag') + '">' + entry.platform + '</span></td>';
    html += '<td class="hidden sm:table-cell text-brand-dim">' + entry.date + '</td>';
    html += '<td class="hidden md:table-cell text-brand-dim">' + entry.car + '</td>';
    html += '<td class="text-brand-silver">' + entry.drivers + '</td>';
    html += '</tr>';
    return html;
  }

  // Parse "DD.MM.YYYY" into a sortable integer (YYYYMMDD)
  function parseEnduDate(str) {
    var p = String(str || '').split('.');
    if (p.length !== 3) return 0;
    return parseInt(p[2], 10) * 10000 + parseInt(p[1], 10) * 100 + parseInt(p[0], 10);
  }

  // Build a single podium showcase card
  function podiumCard(entry) {
    var medal = MEDAL[entry.pos];
    if (!medal) return '';
    var platformCls = PLATFORM_CLASSES[entry.platform] || 'sim-tag';

    var html = '<article class="podium-card ' + medal.cls + ' card-lift">';
    html += '<div class="podium-card-inner">';

    // Header: medal badge + position label + platform tag
    html += '<div class="podium-head">';
    html += '<span class="medal-badge"><span class="medal-num">' + entry.pos + '</span></span>';
    html += '<span class="podium-pos">' + medal.label + '</span>';
    html += '<span class="' + platformCls + ' podium-platform">' + entry.platform + '</span>';
    html += '</div>';

    // Series + event
    html += '<div class="podium-series">' + entry.series + '</div>';
    html += '<h4 class="podium-event">' + entry.event + '</h4>';

    // Meta: car + date
    html += '<div class="podium-meta">' + entry.car + ' · ' + entry.date + '</div>';

    // Drivers
    html += '<div class="podium-drivers">' + entry.drivers + '</div>';

    html += '</div></article>';
    return html;
  }

  // Render all podium showcase containers from endurance results JSON
  function renderPodiums() {
    var hosts = document.querySelectorAll('[data-podiums]');
    hosts.forEach(function (host) {
      var src = host.getAttribute('data-src');
      if (!src) return;

      fetchJSON(src).then(function (data) {
        var podiums = (data.results || []).filter(function (e) {
          return typeof e.pos === 'number' && e.pos <= 3 && e.showcase !== false;
        });
        // Sort: best position first, then most recent within a position
        podiums.sort(function (a, b) {
          if (a.pos !== b.pos) return a.pos - b.pos;
          return parseEnduDate(b.date) - parseEnduDate(a.date);
        });

        host.innerHTML = podiums.map(podiumCard).join('');

        // Keep the "N×" label in sync with the data
        var key = host.getAttribute('data-podiums');
        document.querySelectorAll('[data-podium-count="' + key + '"]').forEach(function (el) {
          el.textContent = podiums.length;
        });
      });
    });
  }

  // Cache fetched JSON to avoid duplicate requests
  var cache = {};

  // Pagination state per results table (keyed by data-results value)
  var paginationState = {};

  function fetchJSON(url) {
    if (cache[url]) return cache[url];
    cache[url] = fetch(url).then(function (r) { return r.json(); });
    return cache[url];
  }

  // Render all standings tbodies
  function renderStandings() {
    var tbodies = document.querySelectorAll('tbody[data-standings]');
    tbodies.forEach(function (tbody) {
      var src = tbody.getAttribute('data-src');
      var groupIdx = tbody.getAttribute('data-group');
      if (!src) return;

      fetchJSON(src).then(function (data) {
        var standings, columns;
        if (groupIdx !== null && data.groups) {
          var group = data.groups[parseInt(groupIdx, 10)];
          standings = group.standings;
          columns = group.columns;
        } else {
          standings = data.standings;
          columns = data.columns;
        }
        var html = '';
        standings.forEach(function (entry) {
          html += standingsRow(entry, columns);
        });
        tbody.innerHTML = html;
      });
    });
  }

  // Render a single page of paginated results
  function renderPage(key) {
    var state = paginationState[key];
    if (!state) return;

    var start = state.page * state.pageSize;
    var pageData = state.data.slice(start, start + state.pageSize);

    var html = '';
    pageData.forEach(function (entry) {
      html += resultsRow(entry);
    });
    state.tbody.innerHTML = html;

    updatePaginationControls(key);
  }

  // Build prev/next buttons + page indicator inside all nav elements for this key
  function updatePaginationControls(key) {
    var state = paginationState[key];
    var navs = document.querySelectorAll('nav[data-pagination-for="' + key + '"]');
    if (!navs.length || !state) return;

    var totalPages = Math.ceil(state.data.length / state.pageSize);
    if (totalPages <= 1) {
      navs.forEach(function (nav) { nav.innerHTML = ''; });
      return;
    }

    var isFirst = state.page === 0;
    var isLast = state.page >= totalPages - 1;
    var html = '';

    // Previous
    html += '<button class="pagination-btn' + (isFirst ? ' pagination-btn-disabled' : '') + '"';
    html += ' data-pagination-key="' + key + '" data-pagination-dir="prev"';
    html += isFirst ? ' disabled aria-disabled="true"' : '';
    html += ' aria-label="Vorherige Seite">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
    html += '</button>';

    // Indicator
    html += '<span class="pagination-indicator">' + (state.page + 1) + ' / ' + totalPages + '</span>';

    // Next
    html += '<button class="pagination-btn' + (isLast ? ' pagination-btn-disabled' : '') + '"';
    html += ' data-pagination-key="' + key + '" data-pagination-dir="next"';
    html += isLast ? ' disabled aria-disabled="true"' : '';
    html += ' aria-label="Nächste Seite">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
    html += '</button>';

    navs.forEach(function (nav) { nav.innerHTML = html; });
  }

  // Delegated click handler for pagination buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-pagination-key]');
    if (!btn || btn.disabled) return;

    var key = btn.getAttribute('data-pagination-key');
    var dir = btn.getAttribute('data-pagination-dir');
    var state = paginationState[key];
    if (!state) return;

    var totalPages = Math.ceil(state.data.length / state.pageSize);

    if (dir === 'prev' && state.page > 0) {
      state.page--;
    } else if (dir === 'next' && state.page < totalPages - 1) {
      state.page++;
    }

    renderPage(key);
  });

  // Render all endurance results tbodies (with optional pagination)
  function renderResults() {
    var tbodies = document.querySelectorAll('tbody[data-results]');
    tbodies.forEach(function (tbody) {
      var src = tbody.getAttribute('data-src');
      if (!src) return;

      var key = tbody.getAttribute('data-results');
      var pageSizeAttr = tbody.getAttribute('data-page-size');
      var pageSize = pageSizeAttr ? parseInt(pageSizeAttr, 10) : 0;

      fetchJSON(src).then(function (data) {
        if (!pageSize || data.results.length <= pageSize) {
          var html = '';
          data.results.forEach(function (entry) {
            html += resultsRow(entry);
          });
          tbody.innerHTML = html;
          return;
        }

        paginationState[key] = {
          data: data.results,
          page: 0,
          pageSize: pageSize,
          tbody: tbody
        };

        renderPage(key);
      });
    });
  }

  // Render status footers
  function renderStatus() {
    var spans = document.querySelectorAll('[data-standings-status]');
    spans.forEach(function (span) {
      var src = span.getAttribute('data-src');
      var groupIdx = span.getAttribute('data-group');
      if (!src) return;

      fetchJSON(src).then(function (data) {
        var status;
        if (groupIdx !== null && data.groups) {
          status = data.groups[parseInt(groupIdx, 10)].status;
        } else {
          status = data.status;
        }
        span.textContent = status;
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      renderStandings();
      renderResults();
      renderPodiums();
      renderStatus();
    });
  } else {
    renderStandings();
    renderResults();
    renderPodiums();
    renderStatus();
  }
})();
