const nodemailer = require('nodemailer');

const {
  email: {
    template:{
      sender: EMAIL_SENDER,
      subject: EMAIL_SUBJECT,
      text:{
        content: EMAIL_TEXT_CONTENT
      },
      html:{
        content: EMAIL_HTML_CONTENT
      }
    },
    smtp: {
      host: SMTP_HOST,
      user: SMTP_USER,
      password: SMTP_PASSWORD,
      port: SMTP_PORT,
    },
  },
} = require('./config');

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const send_email = (sign_url, receiver) => {
  const mail_options = {
    from: EMAIL_SENDER,
    to: receiver,
    subject: EMAIL_SUBJECT,
    text: EMAIL_TEXT_CONTENT.replace(/SIGN_URL/, sign_url),
    html: EMAIL_HTML_CONTENT.replace(/SIGN_URL/, sign_url),
  };

  return new Promise((resolve, reject) => transport.sendMail(mail_options, (error, info) => {
    if (error) {
      console.log(error);
      reject(error);
    }
    console.log('Message sent: %s to %s', info.messageId, mail_options.to);
    resolve();
  }));
};

module.exports = {
  send_email,
};
