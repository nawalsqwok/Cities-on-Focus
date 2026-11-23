// ini nunggu semua elemen html selesai dimuat sebelum manipulasi DOM
document.addEventListener("DOMContentLoaded",() => {
    const navLinks = document.querySelectorAll(".nav-link");
    const section = document.querySelectorAll("section[id]");

    // Mengatur status menu aktif saat diklik
    navLinks.forEach((link)=>{
        link.addEventListener("click", () =>{
            navLinks.forEach((item) => item.removeAttribute("aria-current"));
            link.setAttribute("aria-current", "page");
        });
    });

    console.log("DOMContentLoaded jalan! Rangka HTML sudah siap.");
    console.log("Jumlah navLinks", navLinks.length);
    console.log("Isi navLinks", navLinks)
    console.log("Jumlah section ber-id:", section.length);
    console.log("Daftar section ber-id:", section);
});