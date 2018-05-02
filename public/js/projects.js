baguetteBox.run('.gallery', {
    // Custom options
});

document.querySelectorAll('.project').forEach(function (el) {
    el.addEventListener('click', function () {
        this.children[this.children.length - 1].children[0].click();
    })
});