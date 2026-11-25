import {Map} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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