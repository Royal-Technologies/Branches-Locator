# 🏢 Branches Locator - Modern Branch Network & GIS Explorer

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Leaflet.js](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)](https://leafletjs.com/)
[![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A modern, high-performance, and feature-rich **Branches Locator Web Application** designed for organizations, NGOs, financial institutions, and corporate networks across Bangladesh. 

Built with clean **HTML5, CSS3, and Vanilla JavaScript**, it requires **zero paid API keys** and includes **4 selectable design styles** (Modern Card Grid, Interactive Split Map, District Directory, and Administrative Data Table), instant live search, area pills, real-time GPS distance calculation, multiple theme presets, and one-click CSV export.

Developed and maintained by **[Royal Technologies](https://royaltechbd.com/)**.

---

## 🏷️ GitHub Topics & Description

- **Repository Description**:
  > *A modern, highly customizable Branches Locator web application featuring 4 selectable layout styles (Modern Cards Grid, Interactive Leaflet Map, District Directory, and Data Table), live search, area filters, animated counters, GPS distance calculation, and turn-by-turn navigation. Built with HTML5, CSS3, and JavaScript by Royal Technologies.*

- **Topics / Tags**:
  `branch-locator`, `store-locator`, `interactive-map`, `leafletjs`, `bangladesh`, `directory`, `html5`, `css3`, `javascript`, `bootstrap5`, `responsive-design`, `gis`, `royal-technologies`

---

## 🌟 4 Selectable Design Styles

Users can switch seamlessly between all 4 styles on the fly via the top glassmorphic switcher bar, or open individual standalone style pages:

| # | Style Name | File | Description & Highlights |
|---|------------|------|--------------------------|
| **1** | **Modern Card Grid** | [`style-cards.html`](style-cards.html) | Signature Unnayan Prochesta design with animated gradient hero, count-up stats, glowing header, glassmorphic cards, hover shine effect, area badges, and turn-by-turn navigation buttons. |
| **2** | **Interactive Split Map** | [`style-map.html`](style-map.html) | Side-by-side interactive GIS explorer powered by Leaflet.js and OpenStreetMap. Features custom animated map markers, interactive popups, multi-layer toggle (Street, Satellite, Topo), and smooth fly-to zoom when selecting branches. |
| **3** | **District Directory** | [`style-directory.html`](style-directory.html) | Clean, structured accordion tree grouped by District (*Satkhira, Jashore, Khulna, Jhenaidah*) and Upazila. Shows branch count badges and collapsible cards. |
| **4** | **Data Table View** | [`style-table.html`](style-table.html) | Administrative spreadsheet view with sortable columns, district color badges, quick dial, direct map navigation, and one-click **Export to CSV** and **Print** functionality. |

> **All-in-One Master App**: [`index.html`](index.html) combines all 4 styles with a real-time reactive switcher, theme selector, and synced URL hash / local storage memory.

---

## 🚀 Key Features

- **100% Free & Open-Source GIS Map**:
  - Powered by **Leaflet.js** and **OpenStreetMap**.
  - No Google Maps API billing or watermarks required.
  - Layer switcher: **OpenStreetMap Standard**, **Esri Satellite Imagery**, and **OpenTopo Terrain**.
- **Complete 30-Branch Nationwide Network**:
  - Preloaded with all 30 branches across **4 Districts** (*সাতক্ষীরা / Satkhira, যশোর / Jashore, খুলনা / Khulna, ঝিনাইদহ / Jhenaidah*) and **16 Upazilas**.
  - Verified Bengali addresses, official phone numbers, email addresses, and geo-coordinates.
- **Smart Instant Search & Multi-Level Filtering**:
  - Live as-you-type search across branch name, Bengali name, district, upazila, address, phone, or email.
  - Interactive Area chip pills: `All Areas`, `Tala`, `Kalaroa`, `Assasuni`, `Jashore`, `Chowgacha`.
  - District dropdown filter with Bengali and English names.
- **GPS "Near Me" Geolocation**:
  - Finds user's live coordinates and calculates distance to each branch using the Haversine formula in kilometers.
  - Automatically sorts branches from nearest to farthest.
- **Theme Customization**:
  - 🌿 **Emerald Nature** (Default signature green & gold theme)
  - 💎 **Sapphire Blue** (Corporate blue theme)
  - 🌙 **Dark Luxury** (Modern dark mode theme)
- **Direct Actions**:
  - 📞 Direct click-to-call (`tel:`)
  - ✉️ Direct email link (`mailto:`)
  - 🧭 One-click Google Maps turn-by-turn directions link
- **Data Export & Portability**:
  - Complete datasets provided in **JSON**, **GeoJSON**, and **JavaScript** formats.
  - Instant client-side **CSV export** for Excel/Google Sheets.

---

## 📁 Project Structure

```
D:\laragon\www\Github\Branches Locator\
│
├── index.html                  # Master Application with live 4-style switcher
├── style-cards.html            # Standalone Style 1: Modern Card Grid
├── style-map.html              # Standalone Style 2: Interactive Split Map & Explorer
├── style-directory.html        # Standalone Style 3: District & Upazila Directory
├── style-table.html            # Standalone Style 4: Administrative Data Table
│
├── favicon.svg                 # Scalable modern vector favicon (Map pin + node network)
├── favicon.png                 # High-resolution raster favicon
│
├── css/
│   ├── bootstrap.min.css       # Bootstrap 5 framework
│   ├── bootstrap-icons.min.css # Bootstrap Icons stylesheet
│   ├── leaflet.css             # Leaflet GIS stylesheet (Local copy)
│   ├── style.css               # Main application stylesheet (All styles & themes)
│   └── fonts/                  # Bootstrap icon font files (.woff, .woff2)
│
├── js/
│   ├── bootstrap.bundle.min.js # Bootstrap 5 JS bundle
│   ├── leaflet.js              # Leaflet GIS engine (Local copy)
│   ├── branches-data.js        # Complete 30-branch dataset with geo-coordinates
│   └── app.js                  # Unified application controller (Search, filters, GPS, etc.)
│
├── data/
│   ├── branches.json           # Standard JSON dataset
│   └── branches.geojson        # GIS GeoJSON FeatureCollection
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Comprehensive project documentation
```

---

## 📊 Branch Network Summary

| District (জেলা) | Upazilas Covered | Branch Count | Key Branches |
|-----------------|------------------|:------------:|--------------|
| **Satkhira (সাতক্ষীরা)** | Tala, Kalaroa, Satkhira Sadar, Assasuni | **13** | Tala (Main), Patkelghata, Khalishkhali, Kolaroa, Fulbaria, Gazirhat, Satkhira Sadar, Brahmarajpur, Assasuni, Kadakati, Baradal, Kulla, Annulia, Khajra |
| **Jashore (যশোর)** | Chowgacha, Sharsha, Jhikargacha, Manirampur, Keshabpur, Jashore Sadar | **11** | Satmile, Chowgacha, Chutipur, Sharsha, Bagachra, Jhikargacha, Bakra, Khedapara, Trimohini |
| **Khulna (খুলনা)** | Dumuria, Paikgachha, Koyra | **4** | Atharomile (18 Mile), Kapilmuni, Bagali, Baka |
| **Jhenaidah (ঝিনাইদহ)** | Moheshpur, Kotchandpur | **2** | Moheshpur, Kotchandpur |
| **Total** | **16 Upazilas** | **30 Branches** | Fully geocoded and verified |

---

## 🛠️ Getting Started & Usage

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/Royal-Technologies/Branches-Locator.git
   ```

2. **Run Locally:**
   - Double-click `index.html` to open directly in any modern web browser (Chrome, Edge, Firefox, Safari).
   - Or open through Laragon / Apache:
     `http://localhost/Branches-Locator/`

3. **Deploy Anywhere:**
   Because this project is built entirely with client-side HTML, CSS, and JavaScript, it can be deployed instantly to:
   - GitHub Pages
   - Vercel / Netlify
   - Any Apache, Nginx, or cPanel hosting server

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Free for personal, commercial, and educational use.

---

## 👨‍💻 Developed By

**Royal Technologies**  
- 🌐 Website: [https://royaltechbd.com/](https://royaltechbd.com/)  
- 📧 Email: [info@royaltechbd.com](mailto:info@royaltechbd.com)  
- 📍 Address: Tala, Satkhira, Bangladesh  
