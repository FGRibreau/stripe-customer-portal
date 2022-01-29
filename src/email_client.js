const nodemailer = require("nodemailer")

const { logo, name, EMAIL_SENDER, EMAIL_SUBJECT, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
})

const send_email = (sign_url, receiver) => {
    const mail_options = {
        from: EMAIL_SENDER,
        to: receiver,
        subject: EMAIL_SUBJECT,
        text: `Hi, To access to your Stripe account, use the next link :${ sign_url }. Kind Regards`,
        html: `<p>Hi,</p><p>To access to your Stripe account, click on the next link :</p><p>${ sign_url }</p><p>King regards</p><p>${ name }</p><img src="${ logo }"/>`
    }

    return new Promise((resolve, reject) => transport.sendMail(mail_options, (error, info) => {
        if (error) {
            console.log(error)
            reject(error)
        }
        console.log("Message sent: %s", info.messageId)
        resolve()
    }))
}

module.exports = {
    send_email
}
