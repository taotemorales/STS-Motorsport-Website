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

  // Cache fetched JSON to avoid duplicate requests
  var cache = {};

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

  // Render all endurance results tbodies
  function renderResults() {
    var tbodies = document.querySelectorAll('tbody[data-results]');
    tbodies.forEach(function (tbody) {
      var src = tbody.getAttribute('data-src');
      if (!src) return;

      fetchJSON(src).then(function (data) {
        var html = '';
        data.results.forEach(function (entry) {
          html += resultsRow(entry);
        });
        tbody.innerHTML = html;
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
      renderStatus();
    });
  } else {
    renderStandings();
    renderResults();
    renderStatus();
  }
})();
