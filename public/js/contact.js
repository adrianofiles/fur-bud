document.querySelector('#form').addEventListener('submit', function (e) {
    e.preventDefault();

    var mail = {
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        message: document.querySelector('#message').value,
    };

    axios.post('/email', mail)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

});
