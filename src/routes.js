const { aes_encrypt, hmac_encrypt, aes_decrypt } = require('./crypto_helper');
const { send_email } = require('./email_client');
const { get_customer_by_email, generate_portal_link } = require('./stripe_client');
const config = require('./config');

// 10 minutes
const EXPIRED_IN = 10 * 60 * 1000;

const construct_url = (request_url, email) => {
  const encrypt_email = aes_encrypt(email);
  const url = new URL(`${request_url}/auth/${encrypt_email}`);

  const searchParams = new URLSearchParams();

  searchParams.append('expire', Date.now() + EXPIRED_IN);

  const url_to_sign = `${encrypt_email}?${searchParams.toString()}`;

  searchParams.append('sign', hmac_encrypt(url_to_sign));

  url.search = searchParams.toString();

  return url.toString();
};

const init_routes = (server) => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('index', config.i18n);
    },
  });

  server.route({
    method: 'GET',
    path: '/auth/{email}',
    handler: (request, h) => {
      const { expire, sign } = request.query;
      const { email } = request.params;

      const searchParams = new URLSearchParams();
      searchParams.append('expire', expire);
      const url_to_sign = `${email}?${searchParams.toString()}`;
      const hmac_is_valid = hmac_encrypt(url_to_sign) === sign;

      if (hmac_is_valid) {
        const customer_email = aes_decrypt(email);
        return get_customer_by_email(customer_email)
          .then(customer => {
            if (customer) {
              return h.redirect(`${request.url.origin}/customers/${customer.id}`);
            }
            console.error('Customer not found', {customer: customer, customer_email: customer_email });
            return h.redirect(config.auth.error.fallback_url);
          });
      }
      console.error('Invalid HMAC', {params: request.params, query: request.query });
      return h.redirect(config.auth.error.fallback_url);
    },
  });

  server.route({
    method: 'POST',
    path: '/auth',
    handler: (request, h) => {
      const { email } = request.query;
      const sign_url = construct_url(request.url.origin, email);

      return send_email(sign_url, email)
        .then(() => h.response().code(200))
        .catch(() => h.response().code(500));
    },
  });

  server.route({
    method: 'GET',
    path: '/customers/{customer_id}',
    handler: (request, h) => {
      const { customer_id } = request.params;

      return generate_portal_link(customer_id)
        .then(stripe_portal_url => {
          return h.redirect(stripe_portal_url);
        })
        .catch(error => {
          console.error(error);
          return h.response().code(500);
        });
    },
  });
};

module.exports = init_routes;
