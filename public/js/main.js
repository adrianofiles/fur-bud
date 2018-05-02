var mySiema = new Siema({
    selector: '.siema',
    duration: 500,
    easing: 'ease-in-out',
    perPage: 1,
    startIndex: 0,
    draggable: true,
    multipleDrag: true,
    threshold: 20,
    loop: true,
    rtl: false,
    onInit: () => {},
    onChange: () => {},
});


setInterval(() => mySiema.next(), 8000)

// document.querySelector('.prev').addEventListener('click', () => mySiema.prev());
// document.querySelector('.next').addEventListener('click', () => mySiema.next());
