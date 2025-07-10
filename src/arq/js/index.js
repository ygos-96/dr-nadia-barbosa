const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }

        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    });
});

// FAQ toggle function
function toggleFAQ(num) {
    const btn = document.querySelectorAll('.faq-btn')[num - 1];
    const content = document.querySelectorAll('.faq-content')[num - 1];
    const icon = btn.querySelector('i');

    content.classList.toggle('hidden');

    if (content.classList.contains('hidden')) {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    } else {
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    }
}

// Botão Voltar ao Topo
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const whatsappBtn = document.querySelector('.whatsapp-btn');
const backToTopBtn = document.getElementById('backToTop');

function toggleFloatingButtons() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollPercent = (scrollTop / (docHeight - windowHeight)) * 100;

    if (scrollPercent > 3 && scrollPercent < 98) {
        whatsappBtn.classList.add('visible');
        backToTopBtn.classList.add('visible');
    } else {
        whatsappBtn.classList.remove('visible');
        backToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleFloatingButtons);
document.addEventListener('DOMContentLoaded', toggleFloatingButtons);
