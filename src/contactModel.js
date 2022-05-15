const nodemailer = require("nodemailer");
require('dotenv').config();

const config = {
    service: process.env.NOTIFICATION_SERVICE || 'gmail',
    host: process.env.NOTIFICATION_HOST || "localhost",
    port: process.env.NOTIFICATION_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.NOTIFICATION_USER,
        pass: process.env.NOTIFICATION_PASS,
    },
}

function sendEmail(body) {
    try {
        return new Promise(async (resolve, reject) => {
            const transporter = nodemailer.createTransport(config);
            if (
                !body.to || body.to === '' ||
                !body.subject || body.subject === '' ||
                !body.text || body.text === ''
            ) {
                return reject({message: 'Invalid request!'})
            }
            return resolve(transporter.sendMail(body));
        });
    } catch (error) {
        console.error(error);
        reject({message: `Error al enviar email.`})
    }
}

module.exports = {
  sendEmail,
}