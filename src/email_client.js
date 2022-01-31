const nodemailer = require("nodemailer")

const { EMAIL_SENDER, EMAIL_SUBJECT, EMAIL_TEXT_CONTENT,EMAIL_HTML_CONTENT, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

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
    text: EMAIL_TEXT_CONTENT.replace(/SIGN_URL/, sign_url),
    html: EMAIL_HTML_CONTENT.replace(/SIGN_URL/, sign_url)
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
