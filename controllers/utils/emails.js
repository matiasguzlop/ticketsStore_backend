const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');



const sendEmailActivationEmail = ({ email, token }) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        host: "mail.enguz.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            // user: process.env.NODE_ENV === "test" ? process.env.EMAIL_USER_TEST : process.env.EMAIL_USER,
            // pass: process.env.NODE_ENV === "test" ? process.env.EMAIL_PASS_TEST : process.env.EMAIL_PASS,
            user: "mguzman@enguz.com",
            pass: "Enguz9731!"
        },
        secureConnection: false,
        tls: {
            rejectUnauthorized: false
        }
    }));

    const message = {
        from: process.env.NODE_ENV === "test" ? process.env.EMAIL_USER_TEST : process.env.EMAIL_USER,
        to: email,
        subject: "Activa tu cuenta de Trainer Scheduler",
        html: `
        Hola, para activar tu cuenta visita el siguiente link: 
        <br><a href='http://${process.env.NODE_ENV === "test" ? process.env.MAIN_FRONT_URL_TEST : process.env.MAIN_FRONT_URL}/activateAccount?token=${token}'>Activa tu cuenta</a>
        <br><br> Saludos!
        <br><span style='font-size:0.6em;'>Este mensaje fue generado automáticamente.</span>`,
    }
    console.log("message:", message)
    return transporter.sendMail(message);
}

const sendRecoveryEmail = ({ email, token }) => {
    const message = {
        from: process.env.NODE_ENV === "test" ? process.env.EMAIL_USER_TEST : process.env.EMAIL_USER,
        to: email,
        subject: "Recuperación de contraseña de Trainer Scheduler",
        html: `
            Hola, para recuperar tu contraseña visita el siguiente link:
            <br><a href='http://${process.env.MAIN_FRONT_URL}/accountRecovery?token=${token}'>Recupera tu contraseña</a>
            <br><br>Saludos!
            <br><span style='font-size:0.6em;'>Este mensaje fue generado automáticamente.</span>`
    }
    return transporter.sendMail(message);
}

module.exports = {
    sendEmailActivationEmail,
    sendRecoveryEmail,
}