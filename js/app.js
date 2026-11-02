/**
 * Branches Locator - Main Application Controller
 * Developed by Royal Technologies (https://royaltechbd.com)
 */

(function () {
  'use strict';

  // State Management
  let currentStyle = localStorage.getItem('branch_style') || 'cards';
  let currentTheme = localStorage.getItem('branch_theme') || 'default';
  let currentArea = 'all';
  let currentDistrict = 'all';
  let searchQuery = '';
  let userLocation = null;
  let leafletMap = null;
  let mapMarkers = [];

  // DOM Elements
  const searchInput = document.getElementById('brSearchInput');
  const districtSelect = document.getElementById('brDistrictSelect');
  const areaChips = document.querySelectorAll('.br-chip');
  const resultCountEl = document.getElementById('brResultCount');
  const cardsContainer = document.getElementById('cardsContainer');
  const mapLayoutEl = document.getElementById('mapLayout');
  const mapSidebarList = document.getElementById('mapSidebarList');
  const directoryContainer = document.getElementById('directoryContainer');
  const tableContainer = document.getElementById('tableContainer');
  const tableBody = document.getElementById('brTableBody');
  const emptyStateEl = document.getElementById('brEmptyState');
  const gpsBtn = document.getElementById('btnNearMe');
  const themeBtn = document.getElementById('btnThemeToggle');
  const exportCsvBtn = document.getElementById('btnExportCsv');
  const printTableBtn = document.getElementById('btnPrintTable');

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(currentTheme);
    initUrlParams();
    setupStyleSwitcher();
    setupFilters();
    setupEventListeners();
    initCountUp();
    initScrollReveal();
    renderAllViews();
  });

  // Calculate distance using Haversine formula (km)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  }

  // Filter Branches
  function getFilteredBranches() {
    if (!window.BRANCHES_DATA) return [];
    
    let list = window.BRANCHES_DATA.filter(b => {
      // Area match
      if (currentArea !== 'all' && b.area.toLowerCase() !== currentArea.toLowerCase()) {
        return false;
      }
      // District match
      if (currentDistrict !== 'all' && b.district_en.toLowerCase() !== currentDistrict.toLowerCase() && b.district !== currentDistrict) {
        return false;
      }
      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const searchPool = [
          b.name,
          b.bn_name,
          b.area,
          b.district,
          b.district_en,
          b.upazila,
          b.upazila_en,
          b.address,
          b.phone,
          b.email
        ].join(' ').toLowerCase();

        if (!searchPool.includes(q)) {
          return false;
        }
      }
      return true;
    });

    // If GPS user location is available, calculate distance and sort
    if (userLocation) {
      list = list.map(b => ({
        ...b,
        distance: getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
      })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    return list;
  }

  // Switch Active Layout Style
  function switchStyle(styleName) {
    currentStyle = styleName;
    localStorage.setItem('branch_style', styleName);

    // Update style switcher buttons
    document.querySelectorAll('.style-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.style === styleName);
    });

    // Toggle container views
    if (cardsContainer) cardsContainer.style.display = styleName === 'cards' ? 'flex' : 'none';
    if (mapLayoutEl) mapLayoutEl.style.display = styleName === 'map' ? 'grid' : 'none';
    if (directoryContainer) directoryContainer.style.display = styleName === 'directory' ? 'block' : 'none';
    if (tableContainer) tableContainer.style.display = styleName === 'table' ? 'block' : 'none';

    // If map view is activated, trigger leaflet resize
    if (styleName === 'map') {
      setTimeout(() => {
        if (!leafletMap) {
          initLeafletMap();
        } else {
          leafletMap.invalidateSize();
        }
      }, 100);
    }

    renderAllViews();
  }

  // Render All Active Views
  function renderAllViews() {
    const list = getFilteredBranches();

    // Update Counter
    if (resultCountEl) {
      resultCountEl.innerHTML = `Showing <b>${list.length}</b> of <b>${window.BRANCHES_DATA ? window.BRANCHES_DATA.length : 30}</b> branches`;
    }

    // Toggle Empty State
    if (emptyStateEl) {
      emptyStateEl.style.display = list.length === 0 ? 'block' : 'none';
    }

    // Render corresponding style
    if (currentStyle === 'cards') {
      renderCards(list);
    } else if (currentStyle === 'map') {
      renderMap(list);
    } else if (currentStyle === 'directory') {
      renderDirectory(list);
    } else if (currentStyle === 'table') {
      renderTable(list);
    }
  }

  // 1. Render Cards Grid
  function renderCards(list) {
    if (!cardsContainer) return;
    if (list.length === 0) {
      cardsContainer.innerHTML = '';
      return;
    }

    const html = list.map((b, index) => {
      const delay = Math.min((index % 8) * 60, 480);
      return `
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3 br-reveal is-visible" style="--delay: ${delay}ms;">
          <article class="br-card h-100">
            <span class="br-shine"></span>

            <!-- Image Cover / Building Emblem -->
            <div class="br-img">
              <div class="br-img-empty">
                <i class="bi bi-building"></i>
              </div>
              <span class="br-img-fade"></span>
              <span class="br-dist-badge">${b.district}</span>
              <span class="br-area-badge"><i class="bi bi-geo-alt-fill"></i> ${b.area}</span>
            </div>

            <!-- Body -->
            <div class="br-body">
              <h3 class="br-name">${b.name} Branch</h3>
              <div class="br-bn-name">${b.bn_name}</div>

              <ul class="br-meta">
                <li class="br-addr">
                  <i class="bi bi-geo-alt-fill"></i>
                  <span>${b.address}</span>
                </li>
                <li class="br-phone">
                  <i class="bi bi-telephone-fill"></i>
                  <a href="tel:${b.phone}">${b.phone}</a>
                </li>
                <li class="br-mail">
                  <i class="bi bi-envelope-fill"></i>
                  <span class="text-truncate" title="${b.email}">${b.email}</span>
                </li>
                ${b.distance ? `
                  <li class="text-primary fw-bold">
                    <i class="bi bi-cursor-fill text-primary"></i>
                    <span>${b.distance} km from you</span>
                  </li>
                ` : ''}
              </ul>

              <!-- Actions -->
              <div class="br-card-actions">
                <a href="${b.map_url}" target="_blank" rel="noopener" class="br-btn" title="Get Directions">
                  <span>Directions</span> <i class="bi bi-arrow-right"></i>
                </a>
                <a href="tel:${b.phone}" class="br-btn-call" title="Call Branch">
                  <i class="bi bi-telephone"></i>
                </a>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join('');

    cardsContainer.innerHTML = html;
  }

  // 2. Render Interactive Map & Sidebar
  function renderMap(list) {
    if (!mapSidebarList) return;

    if (!leafletMap) {
      initLeafletMap();
    }

    // Clear previous markers
    mapMarkers.forEach(m => leafletMap.removeLayer(m));
    mapMarkers = [];

    // Render Sidebar List
    mapSidebarList.innerHTML = list.map((b) => `
      <div class="map-branch-item" data-id="${b.id}" data-lat="${b.lat}" data-lng="${b.lng}">
        <div class="map-branch-title">
          <span>${b.name} Branch</span>
          ${b.distance ? `<span class="map-branch-dist">${b.distance} km</span>` : ''}
        </div>
        <div class="small text-muted fw-semibold mb-1">${b.bn_name} &bull; ${b.district}</div>
        <div class="map-branch-addr">${b.address}</div>
        <div class="map-branch-footer">
          <a href="tel:${b.phone}" class="text-success fw-bold text-decoration-none">
            <i class="bi bi-telephone-fill me-1"></i>${b.phone}
          </a>
          <a href="${b.map_url}" target="_blank" rel="noopener" class="text-primary fw-bold text-decoration-none">
            Directions &raquo;
          </a>
        </div>
      </div>
    `).join('');

    // Attach click events to sidebar items
    document.querySelectorAll('.map-branch-item').forEach(item => {
      item.addEventListener('click', function () {
        const id = parseInt(this.dataset.id, 10);
        const lat = parseFloat(this.dataset.lat);
        const lng = parseFloat(this.dataset.lng);

        document.querySelectorAll('.map-branch-item').forEach(el => el.classList.remove('is-selected'));
        this.classList.add('is-selected');

        if (leafletMap) {
          leafletMap.flyTo([lat, lng], 14, { duration: 1.2 });
          const markerObj = mapMarkers.find(m => m.branchId === id);
          if (markerObj) markerObj.openPopup();
        }
      });
    });

    // Add Markers to Map
    const bounds = [];
    list.forEach(b => {
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="custom-branch-marker" id="marker-${b.id}"><i class="bi bi-building"></i></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32]
      });

      const popupHtml = `
        <div class="map-popup-card">
          <h4>${b.name} Branch</h4>
          <div class="small fw-bold text-success mb-1">${b.bn_name} (${b.district})</div>
          <p class="mb-2">${b.address}</p>
          <div class="d-flex align-items-center justify-content-between gap-2 mt-2">
            <a href="tel:${b.phone}" class="btn btn-sm btn-outline-success rounded-pill fw-bold">
              <i class="bi bi-telephone-fill"></i> ${b.phone}
            </a>
            <a href="${b.map_url}" target="_blank" rel="noopener" class="btn btn-sm btn-primary rounded-pill fw-bold text-white">
              Directions &raquo;
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([b.lat, b.lng], { icon: customIcon }).addTo(leafletMap);
      marker.bindPopup(popupHtml);
      marker.branchId = b.id;

      marker.on('click', () => {
        document.querySelectorAll('.map-branch-item').forEach(el => {
          el.classList.toggle('is-selected', parseInt(el.dataset.id, 10) === b.id);
          if (parseInt(el.dataset.id, 10) === b.id) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });

      mapMarkers.push(marker);
      bounds.push([b.lat, b.lng]);
    });

    if (bounds.length > 0 && leafletMap) {
      leafletMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }

  // Initialize Leaflet Map
  function initLeafletMap() {
    const mapElement = document.getElementById('leafletMap');
    if (!mapElement || typeof L === 'undefined') return;

    // Centered at Southwestern Bangladesh (Satkhira / Jashore / Khulna region)
    leafletMap = L.map('leafletMap', {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([22.75, 89.15], 10);

    // Map Base Layers (Free OpenStreetMap & Esri)
    const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | Royal Technologies'
    });

    const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: 'Tiles &copy; Esri | Royal Technologies'
    });

    const openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: &copy; OpenTopoMap contributors'
    });

    osmStandard.addTo(leafletMap);

    const baseMaps = {
      "OpenStreetMap": osmStandard,
      "Satellite Imagery": esriSatellite,
      "Topographic Map": openTopo
    };

    L.control.layers(baseMaps).addTo(leafletMap);
  }

  // 3. Render District & Upazila Grouped Directory
  function renderDirectory(list) {
    if (!directoryContainer) return;
    if (list.length === 0) {
      directoryContainer.innerHTML = '';
      return;
    }

    // Group by District
    const grouped = {};
    list.forEach(b => {
      const dist = b.district || 'Other';
      if (!grouped[dist]) grouped[dist] = [];
      grouped[dist].push(b);
    });

    const html = Object.keys(grouped).map((distName, distIdx) => {
      const branches = grouped[distName];
      const isOpen = distIdx === 0 || list.length < 15;

      return `
        <div class="district-group-card ${isOpen ? 'is-open' : ''}" id="distCard-${distIdx}">
          <div class="district-header" onclick="this.parentElement.classList.toggle('is-open')">
            <h4 class="district-title">
              <i class="bi bi-geo-alt-fill text-success"></i>
              <span>${distName} জেলা (${branches[0].district_en} District)</span>
              <span class="district-badge-count">${branches.length} Branches</span>
            </h4>
            <i class="bi bi-chevron-down district-collapse-icon"></i>
          </div>

          <div class="district-body" style="${isOpen ? '' : 'display:none;'}">
            <div class="dir-branch-row">
              ${branches.map(b => `
                <div class="dir-branch-card">
                  <div class="dir-branch-head">
                    <h5>${b.name} Branch</h5>
                    <span class="dir-tag-upazila">${b.upazila}</span>
                  </div>
                  <div class="fw-semibold text-success small mb-2">${b.bn_name}</div>
                  
                  <div class="dir-branch-meta">
                    <div><i class="bi bi-geo-alt me-1 text-danger"></i>${b.address}</div>
                    <div><i class="bi bi-telephone me-1 text-success"></i><a href="tel:${b.phone}" class="text-decoration-none text-reset fw-bold">${b.phone}</a></div>
                    <div><i class="bi bi-envelope me-1 text-primary"></i>${b.email}</div>
                    ${b.distance ? `<div class="fw-bold text-primary"><i class="bi bi-cursor me-1"></i>${b.distance} km away</div>` : ''}
                  </div>

                  <div class="dir-branch-actions">
                    <a href="${b.map_url}" target="_blank" rel="noopener" class="btn btn-sm btn-primary rounded-pill flex-grow-1">
                      <i class="bi bi-geo-alt-fill me-1"></i> Directions
                    </a>
                    <a href="tel:${b.phone}" class="btn btn-sm btn-outline-success rounded-pill px-3">
                      <i class="bi bi-telephone-fill"></i>
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');

    directoryContainer.innerHTML = html;

    // Attach dynamic toggling
    document.querySelectorAll('.district-header').forEach(hdr => {
      hdr.addEventListener('click', function () {
        const body = this.nextElementSibling;
        const card = this.parentElement;
        const isOpen = card.classList.contains('is-open');
        body.style.display = isOpen ? 'block' : 'none';
      });
    });
  }

  // 4. Render Administrative Data Table
  function renderTable(list) {
    if (!tableBody) return;
    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No branches match your filters.</td></tr>`;
      return;
    }

    const html = list.map((b, idx) => {
      const badgeClass =
        b.district_en === 'Satkhira' ? 'badge-satkhira' :
        b.district_en === 'Jashore' ? 'badge-jashore' :
        b.district_en === 'Khulna' ? 'badge-khulna' : 'badge-jhenaidah';

      return `
        <tr>
          <td class="fw-bold text-muted">${idx + 1}</td>
          <td>
            <div class="fw-bold text-dark">${b.name}</div>
            <small class="text-muted">${b.bn_name}</small>
          </td>
          <td>
            <span class="br-table-badge ${badgeClass}">${b.district}</span>
          </td>
          <td>
            <span class="fw-semibold">${b.upazila}</span>
            <small class="d-block text-muted">Area: ${b.area}</small>
          </td>
          <td class="small" style="max-width: 280px;">${b.address}</td>
          <td>
            <a href="tel:${b.phone}" class="text-success fw-bold text-decoration-none">
              <i class="bi bi-telephone-fill me-1"></i>${b.phone}
            </a>
          </td>
          <td class="text-nowrap">
            <a href="${b.map_url}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary rounded-pill me-1" title="Directions">
              <i class="bi bi-geo-alt"></i>
            </a>
            <a href="tel:${b.phone}" class="btn btn-sm btn-outline-success rounded-pill" title="Call">
              <i class="bi bi-telephone"></i>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = html;
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value;
        renderAllViews();
      });
    }

    // District Dropdown
    if (districtSelect) {
      districtSelect.addEventListener('change', function (e) {
        currentDistrict = e.target.value;
        renderAllViews();
      });
    }

    // GPS "Near Me" Button
    if (gpsBtn) {
      gpsBtn.addEventListener('click', function () {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser.');
          return;
        }

        gpsBtn.disabled = true;
        gpsBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Locating...`;

        navigator.geolocation.getCurrentPosition(
          function (pos) {
            userLocation = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            };
            gpsBtn.disabled = false;
            gpsBtn.innerHTML = `<i class="bi bi-check-circle-fill"></i> Sorted by Near Me`;
            renderAllViews();
          },
          function (err) {
            gpsBtn.disabled = false;
            gpsBtn.innerHTML = `<i class="bi bi-geo-alt-fill"></i> Near Me`;
            alert('Unable to retrieve your location. Please check browser permissions.');
          },
          { timeout: 10000 }
        );
      });
    }

    // Theme Toggle
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const themes = ['default', 'sapphire', 'dark'];
        const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
        applyTheme(nextTheme);
      });
    }

    // Export CSV
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', exportToCSV);
    }

    // Print
    if (printTableBtn) {
      printTableBtn.addEventListener('click', function () {
        window.print();
      });
    }
  }

  // Style Switcher
  function setupStyleSwitcher() {
    document.querySelectorAll('.style-pill').forEach(btn => {
      btn.addEventListener('click', function () {
        switchStyle(this.dataset.style);
      });
    });

    // Initial style application
    switchStyle(currentStyle);
  }

  // Setup Area Filter Chips
  function setupFilters() {
    areaChips.forEach(chip => {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        areaChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentArea = this.dataset.area || 'all';
        renderAllViews();
      });
    });
  }

  // Handle URL Parameters (e.g. ?area=Tala&style=map)
  function initUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('area')) {
      currentArea = params.get('area');
      areaChips.forEach(c => {
        c.classList.toggle('active', (c.dataset.area || 'all').toLowerCase() === currentArea.toLowerCase());
      });
    }
    if (params.has('district')) {
      currentDistrict = params.get('district');
      if (districtSelect) districtSelect.value = currentDistrict;
    }
    if (params.has('style')) {
      currentStyle = params.get('style');
    }
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['cards', 'map', 'directory', 'table'].includes(hash)) {
        currentStyle = hash;
      }
    }
  }

  // Apply Theme
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('branch_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (themeBtn) {
      const icon =
        theme === 'dark' ? 'bi-moon-stars-fill' :
        theme === 'sapphire' ? 'bi-droplet-fill' : 'bi-sun-fill';
      themeBtn.innerHTML = `<i class="bi ${icon}"></i>`;
    }
  }

  // Export to CSV Function
  function exportToCSV() {
    const list = getFilteredBranches();
    if (list.length === 0) return;

    const headers = ["ID", "Name", "Bengali Name", "District", "Upazila", "Area", "Address", "Phone", "Email", "Latitude", "Longitude", "Google Maps URL"];
    const rows = list.map(b => [
      b.id,
      `"${b.name}"`,
      `"${b.bn_name}"`,
      `"${b.district}"`,
      `"${b.upazila}"`,
      `"${b.area}"`,
      `"${b.address.replace(/"/g, '""')}"`,
      `"${b.phone}"`,
      `"${b.email}"`,
      b.lat,
      b.lng,
      `"${b.map_url}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `branches_network_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Animated Numbers Count-Up
  function initCountUp() {
    const counters = document.querySelectorAll('.br-count');
    function run(el) {
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 1600;
      let start = null;

      function tick(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            run(e.target);
            co.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { co.observe(el); });
    } else {
      counters.forEach(function (el) { el.textContent = el.dataset.target; });
    }
  }

  // Scroll Reveal Animations
  function initScrollReveal() {
    const items = document.querySelectorAll('.br-reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  // Global helper for resetting filters
  window.resetBranchFilters = function () {
    currentArea = 'all';
    currentDistrict = 'all';
    searchQuery = '';
    userLocation = null;
    if (searchInput) searchInput.value = '';
    if (districtSelect) districtSelect.value = 'all';
    areaChips.forEach(c => c.classList.toggle('active', (c.dataset.area || 'all') === 'all'));
    if (gpsBtn) gpsBtn.innerHTML = `<i class="bi bi-geo-alt-fill"></i> Near Me`;
    renderAllViews();
  };

})();
