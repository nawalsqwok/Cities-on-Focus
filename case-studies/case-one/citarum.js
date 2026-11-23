// Menunggu seluruh elemen HTML pada halaman Citarum siap
document.addEventListener("DOMContentLoaded", () => {
    // Mengambil elemen-elemen utama di citarum.html
    const titleEl = document.querySelector(".title-map");
    const descEl = document.querySelector(".desc-map");
    const mapFrame = document.querySelector(".map iframe");

    // Menyimpan data/konfigurasi studi kasus dalam satu objek
    const citarumCase = {
        title: "Kajian Spasial Kawasan Sempadan Sungai Citarum",
        description: "Pemantauan sebaran bangunan liar dan kerapatan lahan terbangun (NDBI) di sempadan sungai.",
        focusArea: "Sempadan Sungai Citarum (Jawa Barat)"
    };

    // Fungsi untuk menampilkan judul & deskripsi kajian ke layar
    // PELAJARI BAGIAN INII YAA, BUAT NANTI KALAU BANYAK TOMBOL MAKA FUNGSI RENDER INI BISA NGUBAHTESK JUDUL/DESKRIPSI/CATATAN DI LAYAR
    // UNTUK AWAL2 BELUM KERASA
    function renderCaseInfo(data) {
        if (titleEl) {
            titleEl.textContent = data.title;
        }
        if (descEl) {
            descEl.textContent = data.description;
        }
    }

    renderCaseInfo(citarumCase);

    // Mendeteksi saat iframe peta selesai dimuat
    if (mapFrame) {
        mapFrame.addEventListener("load", () => {
            console.log("Iframe peta siap untuk:", citarumCase.focusArea);
        });
    }
});