// menu mobile
var mobileMenu = document.querySelector('.mobile-menu');

document.querySelector('.hamburger').addEventListener('click', function (e) {
    e.preventDefault();
    mobileMenu.style.display = 'block';
});

document.querySelector('.close-menu').addEventListener('click', function (e) {
    e.preventDefault();
    mobileMenu.style.display = 'none';
});

window.addEventListener('resize', function () {
    if (window.innerWidth > 520) {
        mobileMenu.style.display = 'none';
    }
});

window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
        document.querySelector('.navigation').classList.add('scrolled');
    } else {
        document.querySelector('.navigation').classList.remove('scrolled');
    }
});