const env = require('common-env/withLogger')(console);
module.exports = env.getOrElseAll({
  port: 8080,
  host: 'localhost',

  auth:{
    error:{
      fallback_url: 'https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#500'
    }
  },

  email:{
    template:{
      sender: 'me@me.com',
      subject: 'Magic link to access to your subscription management',
      text:{
        content: 'Log in with this magic link: SIGN_URL . If you didn\'t try to login, you can safely ignore this email.'
      },
      html:{
        content: '<h2>Login</h2><p><a href=\'SIGN_URL\'>Click here to log in with this magic link</a></p><p>If you didn\'t try to login, you can safely ignore this email.</p>'
      }
    },
    smtp:{
      host: {
        $type: env.types.String,
      },
      port: {
        $type: env.types.String,
      },
      user: {
        $type: env.types.String,
      },
      password: {
        $type: env.types.String,
        $secure: true,
      },
    },
  },


  i18n: {
    login: {
      logo: 'https://imgur.com/rb1GGR8.png',
      name: 'My SaaS',
      description: 'In order to manage your subscription and download your invoices, please type your the email you used to subscribe.',
      email: 'Email',
      button: {
        default: 'Connect',
        loading: 'Sending email...'
      }
    },
    success: {
      message: 'Check your email and click on the magic link to connect.',
    },
    error: {
      alert: {
        title: 'An error occurred',
      },
    },
  },
});
