function copyToClipboard(elementId, buttonElement) {
    const textToCopy = document.getElementById(elementId).innerText;
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const tooltip = document.createElement('div');
        tooltip.innerText = 'Tersalin!';
        tooltip.className = 'absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs rounded-md px-2 py-1 transition-opacity duration-300 opacity-0';
        buttonElement.parentNode.appendChild(tooltip);
        setTimeout(() => tooltip.classList.remove('opacity-0'), 10);
        setTimeout(() => {
            tooltip.classList.add('opacity-0');
            setTimeout(() => tooltip.remove(), 300);
        }, 1500);
    }).catch(err => console.error('Gagal menyalin:', err));
}

function generateICS(isCustomEvent) {
    const eventDetails = isCustomEvent ? {
        title: "Pemenuhan Hukum Adat Putra & Putri",
        date: "22451225T070000Z",
        endDate: "22451225T130000Z",
        location: "GPU Jaro Pirarahan, Jl. Pahlawan, Buntok"
    } : {
        title: "Resepsi Putra & Putri",
        date: "22451226T020000Z",
        endDate: "22451226T060000Z",
        location: "GPU Jaro Pirarahan, Jl. Pahlawan, Buntok"
    };
    const icsContent = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `SUMMARY:${eventDetails.title}`, `DTSTART:${eventDetails.date}`, `DTEND:${eventDetails.endDate}`, `LOCATION:${eventDetails.location.replace(/,/g, '\\,')}`, `DESCRIPTION:Acara pernikahan ${eventDetails.title}. Jangan lupa hadir!`, "END:VEVENT", "END:VCALENDAR"].join('\n');
    const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${eventDetails.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof AOS !== 'undefined') AOS.init({
        duration: 800,
        once: false
    });
    const preloader = document.getElementById('preloader');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const openButton = document.getElementById('open-invitation');
    const music = document.getElementById('background-music');
    const musicPlayer = document.getElementById('music-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const rsvpForm = document.getElementById('rsvp-form');
    const wishesWall = document.getElementById('wishes-wall');
    const wishesCount = document.getElementById('wishes-count');
    const emptyWishesPlaceholder = document.getElementById('empty-wishes-placeholder');
    const galleryImages = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const bottomNav = document.getElementById('bottom-nav');
    let currentIndex = 0;
    let imagesArray = Array.from(galleryImages);
    let touchStartX = 0;
    let touchEndX = 0;
    window.addEventListener('load', () => preloader.classList.add('preloader-hidden'));
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const guest = urlParams.get('to');
        if (guest) document.getElementById('guest-name').textContent = guest.replace(/_/g, " ");
    } catch (e) {
        console.error("Error reading URL params:", e);
    }
    openButton.addEventListener('click', () => {
        cover.style.transform = 'translateY(-100%)';
        mainContent.style.opacity = '1';
        document.body.style.overflowY = 'auto';
        bottomNav.classList.add('show');
        music.play().catch(error => console.log("Autoplay prevented.", error));
        musicPlayer.classList.add('playing');
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        setTimeout(() => {
            cover.style.display = 'none';
        }, 1000);
    });
    playPauseBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicPlayer.classList.add('playing');
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            music.pause();
            musicPlayer.classList.remove('playing');
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    });
    const countdownDate = new Date(2245, 12, 25, 14, 0, 0).getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        if (distance < 0) {
            clearInterval(this);
            document.getElementById("countdown").innerHTML = "<p class='col-span-4 text-2xl font-heading'>The day is here!</p>";
            return;
        }
        const d = val => Math.floor(val).toString().padStart(2, '0');
        document.getElementById("days").innerText = d(distance / 864e5);
        document.getElementById("hours").innerText = d(distance % 864e5 / 36e5);
        document.getElementById("minutes").innerText = d(distance % 36e5 / 6e4);
        document.getElementById("seconds").innerText = d(distance % 6e4 / 1e3);
    }, 1000);
    const updateLightboxImage = (index) => {
        currentIndex = index;
        lightboxImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lightboxImg.src = imagesArray[currentIndex].src;
            lightboxImg.style.transform = 'scale(1)';
        }, 150);
    };
    const showNextImage = () => updateLightboxImage((currentIndex + 1) % imagesArray.length);
    const showPrevImage = () => updateLightboxImage((currentIndex - 1 + imagesArray.length) % imagesArray.length);
    imagesArray.forEach((img, index) => {
        img.addEventListener('click', () => {
            updateLightboxImage(index);
            lightbox.classList.remove('hidden');
            setTimeout(() => lightbox.style.opacity = 1, 10);
        });
    });
    const closeLightbox = () => {
        lightbox.style.opacity = 0;
        setTimeout(() => lightbox.classList.add('hidden'), 300);
    };
    lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, { passive: true });
    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) showNextImage();
        if (touchEndX > touchStartX + 50) showPrevImage();
    });
    document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
    document.getElementById('prev-lightbox').addEventListener('click', showPrevImage);
    document.getElementById('next-lightbox').addEventListener('click', showNextImage);
    const formatTimestamp = (date) => {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        if (seconds < 10) return "Baru saja";
        if (seconds < 60) return `${seconds} detik yang lalu`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} menit yang lalu`;
        const pad = (n) => n.toString().padStart(2, '0');
        const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
        if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
            return `Hari ini pukul ${time}`;
        }
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()) {
            return `Kemarin pukul ${time}`;
        }
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} pukul ${time}`;
    };
    const updateWishesWall = () => {
        const wishElements = wishesWall.querySelectorAll('.wish-item');
        wishesCount.textContent = wishElements.length;
        if (wishElements.length > 0) {
            emptyWishesPlaceholder.style.display = 'none';
            wishElements.forEach(wish => {
                const timestamp = new Date(wish.dataset.timestamp);
                wish.querySelector('.timestamp').textContent = formatTimestamp(timestamp);
            });
        } else {
            emptyWishesPlaceholder.style.display = 'block';
        }
    };
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitButton = this.querySelector('button[type="submit"]');
        const name = this.elements.name.value.trim();
        const confirmation = this.elements.confirmation.value;
        const wishes = this.elements.wishes.value.trim();
        if (!name || !wishes) return;
        submitButton.disabled = true;
        submitButton.querySelector('#submit-text').textContent = 'Mengirim...';
        const confirmationColors = {
            'Hadir': 'bg-green-800/50 text-green-300',
            'Tidak Hadir': 'bg-red-800/50 text-red-300',
            'Masih Ragu': 'bg-yellow-800/50 text-yellow-300',
        };
        const sanitize = (str) => str.replace(/</g, "<").replace(/>/g, ">");
        setTimeout(() => {
            const newWishElement = document.createElement('div');
            newWishElement.className = 'wish-item glass-card rounded-lg p-4';
            newWishElement.dataset.timestamp = new Date().toISOString();
            newWishElement.innerHTML = `<div class="flex justify-between items-start"><p class="font-bold text-gold-gradient">${sanitize(name)}</p><span class="text-xs px-2 py-1 ${confirmationColors[confirmation]} rounded-full flex-shrink-0">${confirmation}</span></div><p class="mt-2 text-gray-300 break-words">${sanitize(wishes).replace(/\n/g, '<br>')}</p><p class="timestamp text-xs text-gray-500 mt-2 text-right"></p>`;
            wishesWall.insertAdjacentElement('afterbegin', newWishElement);
            updateWishesWall();
            this.reset();
            submitButton.disabled = false;
            submitButton.querySelector('#submit-text').textContent = 'Kirim Ucapan';
            if (typeof confetti === 'function') confetti({
                particleCount: 100,
                spread: 70,
                origin: {
                    y: 0.6
                }
            });
        }, 500);
    });
    updateWishesWall();
    setInterval(updateWishesWall, 5000);
    
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});