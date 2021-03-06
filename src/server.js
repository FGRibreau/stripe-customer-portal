const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const routes = require('./routes');
const config = require('./config');

const init = async () => {
  const server = Hapi.server({
    port: config.port,
    host: config.host
  });

  await server.register(Vision);
  await server.register(Inert);

  server.views({
    engines: { ejs: require('ejs') },
    relativeTo: __dirname + '/../',
    path: 'templates',
  });

  server.route({
    method: 'GET',
    path: '/public/{params*}',
    handler: {
      directory: {
        path: './public',
      },
    },
  });

  routes(server);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
