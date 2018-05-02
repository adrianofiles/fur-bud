const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../../config/email');

router.post('/', (req, res, next) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: config
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: req.body.email, // sender address
            to: 'furbudpl@gmail.com',
            subject: 'Kontakt z strony internetowej Fur-Bud', // Subject line
            text: `
            Kontakt email: ${req.body.email},
            Kontakt telefoniczny: ${req.body.phone},
            
            Wiadomość:
            ${req.body.message}`,
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({
                    message: 'Coś poszło nie tak.',
                    error: error
                });
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.status(201).json({
                message: 'Wiadomość została wysłana.',
                id: info.messageId
            })
        });
    });
});

module.exports = router;