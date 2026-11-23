// ini nunggu semua elemen html selesai dimuat sebelum manipulasi DOM
document.addEventListener("DOMContentLoaded",() => {
    const navLinks = document.querySelectorAll(".nav-link");
    const section = document.querySelectorAll("section[id]");

    // Mengatur status menu aktif saat diklik
    navLinks.forEach((link)=>{
        link.addEventListener("click", () =>{
            navLinks.forEach((item) => item.removeAttribute("aria-current"));
            link.setAttribute("aria-current", "page");

            console.log("Menu aktif sekarang:", link.textContent.trim());
        });
    });

    // Memperbarui menu aktif otomatis berdasarkan posisi scroll
    const updateActiveNavOnScroll = () => {
        const scrollPosition = window.scrollY + 120;
        console.log("scrollPosition:", scrollPosition);

        section.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach((link) => {
                    link.removeAttribute("aria-current");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.setAttribute("aria-current", "page");
                    }
                });
            }
        });
    };
    window.addEventListener("scroll", updateActiveNavOnScroll);

    console.log("DOMContentLoaded jalan! Rangka HTML sudah siap.");
    console.log("Jumlah navLinks", navLinks.length);
    console.log("Isi navLinks", navLinks)
    console.log("Jumlah section ber-id:", section.length);
    console.log("Daftar section ber-id:", section);

});