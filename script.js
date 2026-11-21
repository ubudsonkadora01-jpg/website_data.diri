/* ============================================================
   DARK CYBER THEME - JavaScript
   Author: Ubudson Takyau Kadora
   Fitur: Navigasi, Animasi Scroll, Typewriter, Jam Digital,
          Dark Mode, Particle Background, Form, Back to Top
   ============================================================ */

// ===================== MENUNGGU DOM SIAP =====================
document.addEventListener('DOMContentLoaded', function () {

    // ===================== ELEMEN-ELEMEN =====================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('backToTop');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const contactForm = document.getElementById('contactForm');
    const particleCanvas = document.getElementById('particleCanvas');

    // ===================== PARTICLE BACKGROUND =====================
    // Membuat efek partikel bergerak di background
    function initParticles() {
        const ctx = particleCanvas.getContext('2d');
        let width = particleCanvas.width = window.innerWidth;
        let height = particleCanvas.height = window.innerHeight;
        const particles = [];
        const particleCount = Math.min(80, Math.floor(width * height / 15000));

        // Kelas Partikel
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                // Warna cyan atau ungu secara acak
                this.color = Math.random() > 0.5
                    ? `rgba(0, 212, 255, ${this.opacity})`
                    : `rgba(123, 47, 247, ${this.opacity})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                // Kembali ke sisi berlawanan jika keluar layar
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Membuat partikel
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Menggambar garis antar partikel yang berdekatan
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.05 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        // Animasi loop
        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animate);
        }

        animate();

        // Update ukuran canvas saat window di-resize
        window.addEventListener('resize', function () {
            width = particleCanvas.width = window.innerWidth;
            height = particleCanvas.height = window.innerHeight;
        });
    }

    initParticles();

    // ===================== JAM DIGITAL =====================
    // Menampilkan waktu real-time di navbar
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('clockTime').textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Update setiap detik
    setInterval(updateClock, 1000);
    updateClock();

    // ===================== TYPEWRITER EFFECT =====================
    // Efek mengetik teks secara otomatis
    const typewriterTexts = [
        'Mahasiswa Sistem Informasi',
        'Future Cybersecurity Specialist',
        'Tech Enthusiast',
        'Lifelong Learner',
        'Gamer & Coder'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterEl = document.getElementById('typewriter');

    function typeEffect() {
        const currentText = typewriterTexts[textIndex];

        if (isDeleting) {
            // Menghapus karakter
            typewriterEl.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Menambah karakter
            typewriterEl.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        // Tentukan kecepatan mengetik
        let speed = isDeleting ? 40 : 80;

        // Jika selesai menulis, tunggu lalu hapus
        if (!isDeleting && charIndex === currentText.length) {
            speed = 2000; // Jeda sebelum menghapus
            isDeleting = true;
        }

        // Jika selesai menghapus, pindah ke teks berikutnya
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typewriterTexts.length;
            speed = 500; // Jeda sebelum menulis teks baru
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();

    // ===================== NAVIGASI SCROLL =====================
    // Mengubah tampilan navbar saat scroll
    window.addEventListener('scroll', function () {
        // Navbar efek saat scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Tombol back to top
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Highlight menu aktif berdasarkan posisi scroll
        updateActiveNavLink();

        // Animasi skill bars saat terlihat
        animateSkillBars();
    });

    // ===================== HIGHLIGHT MENU AKTIF =====================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section');
        let currentSection = '';

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ===================== HAMBURGER MENU =====================
    // Toggle menu mobile
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Tutup menu mobile saat link diklik
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===================== SMOOTH SCROLL =====================
    // Scroll halus ke section yang dipilih
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===================== BACK TO TOP =====================
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===================== DARK MODE TOGGLE =====================
    // Fitur light/dark mode
    const darkModeIcon = darkModeToggle.querySelector('i');

    // Cek preferensi yang tersimpan
    if (localStorage.getItem('lightMode') === 'true') {
        document.body.classList.add('light-mode');
        darkModeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('lightMode', isLight);

        if (isLight) {
            darkModeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            darkModeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // ===================== ANIMASI SAAT SCROLL =====================
    // Menampilkan elemen dengan animasi saat muncul di viewport
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    function handleScrollAnimation() {
        animateElements.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Jika elemen terlihat di viewport
            if (rect.top < windowHeight - 80) {
                el.classList.add('visible');
            }
        });
    }

    // Jalankan saat load dan scroll
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation();

    // ===================== ANIMASI SKILL BARS =====================
    // Mengisi progress bar skills saat terlihat
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;

        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            const progressBars = document.querySelectorAll('.skill-progress');
            progressBars.forEach(function (bar) {
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth + '%';
            });
            skillsAnimated = true;
        }
    }

    // ===================== DOWNLOAD CV =====================
    // Tombol download CV (alert karena belum ada file CV)
    const downloadBtn = document.getElementById('downloadCV');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function (e) {
            e.preventDefault();
            alert('📄 File CV belum tersedia.\n\nUntuk menambahkan CV:\n1. Simpan file CV Anda (format PDF) di folder yang sama dengan index.html\n2. Ubah href pada tombol Download CV menjadi nama file CV Anda\n\nContoh: href="CV_Ubudson.pdf"');
        });
    }

    // ===================== CONTACT FORM =====================
    // Validasi dan kirim formulir kontak
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Ambil data form
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validasi sederhana
            if (!name || !email || !subject || !message) {
                alert('⚠️ Mohon isi semua field yang diperlukan.');
                return;
            }

            // Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('⚠️ Format email tidak valid.');
                return;
            }

            // Tampilkan pesan sukses
            alert(`✅ Terima kasih, ${name}!\n\nPesan Anda telah diterima.\nSubjek: ${subject}\n\nSaya akan segera membalas email Anda.`);

            // Reset form
            contactForm.reset();
        });
    }

    // ===================== EFEK RIPPLE PADA TOMBOL =====================
    // Menambahkan efek klik bergelombang pada semua tombol
    document.querySelectorAll('.btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            // Buat elemen ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            // Hapus ripple setelah animasi selesai
            setTimeout(function () {
                ripple.remove();
            }, 600);
        });
    });

    // Tambahkan animasi ripple ke CSS secara dinamis
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ===================== KEYBOARD NAVIGATION =====================
    // Navigasi menggunakan keyboard (Escape untuk tutup menu)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ===================== KONSOL PESAN =====================
    // Pesan keren di konsol browser
    console.log('%c🛡️ Ubudson Takyau Kadora - Portfolio', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
    console.log('%c⚡ Future Cybersecurity Specialist', 'color: #7b2ff7; font-size: 14px;');
    console.log('%c📧 Ubudsonkadora01@gmail.com', 'color: #00ff88; font-size: 12px;');

});
