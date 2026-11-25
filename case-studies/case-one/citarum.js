import {
    Map,
    Popup,
    setWorkerUrl,
} from 'maplibre-gl';

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import 'maplibre-gl/dist/maplibre-gl.css';

setWorkerUrl(workerUrl);

const GEOJSON_DAS_URL = '../../data/batas_das_citarum.geojson';
const GEOJSON_BANJIR_URL = '../../data/banjir_citarum_2026_timeseries.geojson'

export function citarumMap(containerId = 'map') {
    const map = new Map({
        container: containerId,
        center: [107.6, -6.9],
        zoom: 9,
        style: {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
              }
            },
            layers: [
              {
                id: 'osm-layer',
                type: 'raster',
                source: 'osm'
              }
            ]
          }
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), 'bottom-right');

    let dataBanjirRaw = null;
    const infoEl = document.getElementById('info-luas-banjir');
    const filterEl = document.getElementById('filter-periode');

    function updateSummary(periodeDipilih) {
        if (!dataBanjirRaw || !infoEl) return;
    
        const fiturTersaring = (dataBanjirRaw.features || []).filter((feat) => {
            const periode = feat.properties && feat.properties.periode;
            return periode === periodeDipilih;
        });
    
        const totalHa = fiturTersaring.reduce((acc, feat) => {
            const luas = Number(feat.properties && feat.properties.luas_ha) || 0;
            return acc + luas;
        }, 0);
    
        infoEl.innerHTML =
            `Bulan <strong>${periodeDipilih}</strong>: <strong>${fiturTersaring.length}</strong> poligon | ` +
            `Total luas: <strong>${totalHa.toFixed(2)} ha</strong>`;
    }
    
    function applyPeriodeFilter(periodeDipilih) {
        if (!map.getLayer('banjir-fill')) return;
    
        const filterExpr = ['==', ['get', 'periode'], periodeDipilih];
        map.setFilter('banjir-fill', filterExpr);
        map.setFilter('banjir-outline', filterExpr);
    
        updateSummary(periodeDipilih);
    }

    map.on('load', async () => {
       // 1. Muat & tampilkan batas DAS Citarum
       try {
        const resDas = await fetch(GEOJSON_DAS_URL);
        if (!resDas.ok) throw new Error('Gagal memuat batas_das_citarum.geojson');
        const dasGeojson = await resDas.json();

        map.addSource('das-citarum', {
            type: 'geojson',
            data: dasGeojson
        });

        map.addLayer({
            id: 'das-citarum-fill',
            type: 'fill',
            source: 'das-citarum',
            paint: {
                'fill-color': '#222222',
                'fill-opacity': 0.04
            }
        });

        map.addLayer({
            id: 'das-citarum-line',
            type: 'line',
            source: 'das-citarum',
            paint: {
                'line-color': '#222222',
                'line-width': 2
            }
        });
    } catch (err) {
        console.error(err);
    }

    // 2. Muat & tampilkan data banjir time series 2026
    try {
        const resBanjir = await fetch(GEOJSON_BANJIR_URL);
        if (!resBanjir.ok) throw new Error('Gagal memuat banjir_citarum_2026_timeseries.geojson');
        dataBanjirRaw = await resBanjir.json();

        map.addSource('banjir-citarum', {
            type: 'geojson',
            data: dataBanjirRaw
        });

        map.addLayer({
            id: 'banjir-fill',
            type: 'fill',
            source: 'banjir-citarum',
            paint: {
                'fill-color': '#0066ff',
                'fill-opacity': 0.55
            }
        });

        map.addLayer({
            id: 'banjir-outline',
            type: 'line',
            source: 'banjir-citarum',
            paint: {
                'line-color': '#003db8',
                'line-width': 1
            }
        });

        map.on('click', 'banjir-fill', (e) => {
            const feature = e.features && e.features[0];
            if (!feature) return;

            const props = feature.properties || {};
            const luasFmt = Number(props.luas_ha || 0).toFixed(2);

            new Popup()
                .setLngLat(e.lngLat)
                .setHTML(
                    `<strong>Periode:</strong> ${props.periode || '-'}<br>` +
                    `<strong>Estimasi Luas:</strong> ${luasFmt} ha`
                )
                .addTo(map);
        });

        map.on('mouseenter', 'banjir-fill', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'banjir-fill', () => {
            map.getCanvas().style.cursor = '';
        });

        const initialPeriode = filterEl ? filterEl.value : '2026-11';
        applyPeriodeFilter(initialPeriode);
    } catch (err) {
        console.error(err);
        if (infoEl) {
            infoEl.textContent = 'Gagal memuat data GeoJSON banjir. Periksa path file & server lokal.';
        }
    }
});

if (filterEl) {
    filterEl.addEventListener('change', (e) => {
        applyPeriodeFilter(e.target.value);
    });
}

return map;
}

citarumMap('map');

// Menunggu seluruh elemen HTML pada halaman Citarum siap
// document.addEventListener("DOMContentLoaded", () => {
//     // Mengambil elemen-elemen utama di citarum.html
//     const titleEl = document.querySelector(".title-map");
//     const descEl = document.querySelector(".desc-map");
//     const mapFrame = document.querySelector(".map iframe");

//     // Menyimpan data/konfigurasi studi kasus dalam satu objek
//     const citarumCase = {
//         title: "Kajian Spasial Kawasan Sempadan Sungai Citarum",
//         description: "Pemantauan sebaran bangunan liar dan kerapatan lahan terbangun (NDBI) di sempadan sungai.",
//         focusArea: "Sempadan Sungai Citarum (Jawa Barat)"
//     };

    // Fungsi untuk menampilkan judul & deskripsi kajian ke layar
    // PELAJARI BAGIAN INII YAA, BUAT NANTI KALAU BANYAK TOMBOL MAKA FUNGSI RENDER INI BISA NGUBAHTESK JUDUL/DESKRIPSI/CATATAN DI LAYAR
    // UNTUK AWAL2 BELUM KERASA
    // function renderCaseInfo(data) {
    //     if (titleEl) {
    //         titleEl.textContent = data.title;
    //     }
    //     if (descEl) {
    //         descEl.textContent = data.description;
    //     }
    // }

    // renderCaseInfo(citarumCase);
// });