// S2S Motorsport — Shared Navigation Component
// Usage: Set window.navDepth = 1 for subpages, then load this script.
// Place <div id="nav-root"></div> where the nav should appear.

(function() {
  var depth = window.navDepth || 0;
  var p = depth ? '../'.repeat(depth) : '';
  var home = depth ? p + 'index.html' : '#home';
  var team = depth ? p + 'index.html#team' : '#team';
  var hof = depth ? p + 'index.html#hof' : '#hof';
  var sponsoren = depth ? p + 'index.html#sponsoren' : '#sponsoren';

  var html = '<a href="#main-content" class="skip-link">Zum Inhalt springen</a>'
    + '<nav id="navbar" class="fixed top-0 left-0 right-0 z-50 nav-blur"'
    + ' style="background:rgba(6,9,26,0.82);border-bottom:1px solid rgba(255,255,255,0.06);">'
    + '<div class="max-w-site mx-auto px-6 flex items-center justify-between h-16">'
    // Logo
    + '<a href="' + home + '" class="flex items-center gap-3 group" aria-label="SEA 2 SUMMIT Motorsport Home">'
    + '<img src="' + p + 'brand_assets/logo-cropped.png" alt="S2S Logo" class="h-10 w-auto drop-shadow-lg transition-transform duration-200 group-hover:scale-105" />'
    + '</a>'
    // Desktop links
    + '<div class="hidden md:flex items-center gap-8">'
    + '<a href="' + home + '" class="nav-link text-brand-silver text-sm font-body font-medium">Home</a>'
    + '<div class="relative" data-dropdown>'
    + '<button class="nav-link text-brand-silver text-sm font-body font-medium inline-flex items-center gap-1" aria-expanded="false" aria-haspopup="true">'
    + 'Ligen'
    + '<svg class="w-3.5 h-3.5 transition-transform duration-200 dropdown-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>'
    + '</button>'
    + '<div class="dropdown-panel absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible transition-all duration-200" style="min-width:160px;">'
    + '<div class="rounded-lg overflow-hidden py-2 px-1" style="background:rgba(6,9,26,0.96);border:1px solid rgba(255,255,255,0.08);box-shadow:0 8px 32px rgba(0,0,0,0.5);">'
    + '<a href="' + p + 'monday-night-trophy/" class="dropdown-item block px-4 py-2 text-sm text-brand-silver rounded-md transition-colors duration-150">MNT</a>'
    + '<a href="' + p + 'tcr-series/" class="dropdown-item block px-4 py-2 text-sm text-brand-silver rounded-md transition-colors duration-150">TCR</a>'
    + '<a href="' + p + 'cup-series/" class="dropdown-item block px-4 py-2 text-sm text-brand-silver rounded-md transition-colors duration-150">CUP</a>'
    + '</div></div></div>'
    + '<a href="' + team + '" class="nav-link text-brand-silver text-sm font-body font-medium">Team</a>'
    + '<a href="' + p + 'endurance/" class="nav-link text-brand-silver text-sm font-body font-medium">Endurance</a>'
    + '<a href="' + hof + '" class="nav-link text-brand-silver text-sm font-body font-medium">Hall of Fame</a>'
    + '<a href="' + sponsoren + '" class="nav-link text-brand-silver text-sm font-body font-medium">Sponsoren</a>'
    + '</div>'
    // CTA + hamburger
    + '<div class="flex items-center gap-4">'
    + '<a href="https://discord.gg/UyUq396BPZ" target="_blank" rel="noopener" class="hidden md:inline-flex items-center gap-2 btn-primary px-5 py-2 rounded text-sm">Discord</a>'
    + '<button id="menu-btn" aria-label="Men\u00fc \u00f6ffnen" aria-expanded="false" class="md:hidden flex flex-col gap-1.5 p-2 rounded nav-hamburger">'
    + '<span class="menu-bar block w-5 h-0.5 bg-brand-white transition-transform duration-200 origin-center"></span>'
    + '<span class="menu-bar block w-5 h-0.5 bg-brand-white transition-opacity duration-200"></span>'
    + '<span class="menu-bar block w-5 h-0.5 bg-brand-white transition-transform duration-200 origin-center"></span>'
    + '</button>'
    + '</div>'
    + '</div>'
    // Mobile menu
    + '<div id="mobile-menu" class="hidden md:hidden" style="background:rgba(6,9,26,0.96);border-top:1px solid rgba(255,255,255,0.06);">'
    + '<div class="max-w-site mx-auto px-6 py-4 flex flex-col gap-4">'
    + '<a href="' + home + '" class="nav-link text-brand-silver font-medium py-2">Home</a>'
    + '<div data-mobile-dropdown>'
    + '<button class="nav-link text-brand-silver font-medium py-2 w-full text-left inline-flex items-center gap-1" aria-expanded="false">'
    + 'Ligen'
    + '<svg class="w-3.5 h-3.5 transition-transform duration-200 dropdown-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>'
    + '</button>'
    + '<div class="mobile-sub hidden pl-4 flex flex-col gap-2 mt-1">'
    + '<a href="' + p + 'monday-night-trophy/" class="nav-link text-brand-silver font-medium py-1.5 text-sm">MNT</a>'
    + '<a href="' + p + 'tcr-series/" class="nav-link text-brand-silver font-medium py-1.5 text-sm">TCR</a>'
    + '<a href="' + p + 'cup-series/" class="nav-link text-brand-silver font-medium py-1.5 text-sm">CUP</a>'
    + '</div></div>'
    + '<a href="' + team + '" class="nav-link text-brand-silver font-medium py-2">Team</a>'
    + '<a href="' + p + 'endurance/" class="nav-link text-brand-silver font-medium py-2">Endurance</a>'
    + '<a href="' + hof + '" class="nav-link text-brand-silver font-medium py-2">Hall of Fame</a>'
    + '<a href="' + sponsoren + '" class="nav-link text-brand-silver font-medium py-2">Sponsoren</a>'
    + '<a href="https://discord.gg/UyUq396BPZ" target="_blank" rel="noopener" class="btn-primary px-5 py-3 rounded text-sm text-center mt-2">Discord</a>'
    + '</div></div>'
    + '</nav>';

  var root = document.getElementById('nav-root');
  if (root) root.outerHTML = html;
})();
