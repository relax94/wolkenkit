'use strict';

var get = require('lodash/get');

var image = require('./image');

var container = function container(options) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.configuration) {
    throw new Error('Configuration is missing.');
  }
  if (!options.env) {
    throw new Error('Environment is missing.');
  }
  if (!options.sharedKey) {
    throw new Error('Shared key is missing.');
  }
  if (options.persistData === undefined) {
    throw new Error('Persist data is missing.');
  }
  if (options.debug === undefined) {
    throw new Error('Debug is missing.');
  }

  /* eslint-disable no-unused-vars */
  var configuration = options.configuration,
      env = options.env,
      sharedKey = options.sharedKey,
      persistData = options.persistData,
      debug = options.debug;
  /* eslint-enable no-unused-vars */

  var selectedEnvironment = configuration.environments[env];

  var result = {
    dependsOn: [configuration.application + '-node-modules', configuration.application + '-postgres', configuration.application + '-rabbitmq'],
    image: configuration.application + '-flows',
    name: configuration.application + '-flows',
    cmd: 'dumb-init node ' + (debug ? '--inspect=0.0.0.0:9229' : '') + ' /wolkenkit/app.js',
    env: {
      APPLICATION: configuration.application,
      COMMANDBUS_URL: 'amqp://wolkenkit:' + sharedKey + '@messagebus:5672',
      EVENTSTORE_TYPE: 'postgres',
      EVENTSTORE_URL: 'pg://wolkenkit:' + sharedKey + '@eventstore:5432/wolkenkit',
      FLOWBUS_URL: 'amqp://wolkenkit:' + sharedKey + '@messagebus:5672',
      NODE_ENV: get(selectedEnvironment, 'node.environment', 'development'),
      PROFILING_HOST: selectedEnvironment.api.address.host,
      PROFILING_PORT: 8125
    },
    labels: {
      'wolkenkit-api-host': selectedEnvironment.api.address.host,
      'wolkenkit-api-port': selectedEnvironment.api.address.port,
      'wolkenkit-application': configuration.application,
      'wolkenkit-debug': debug,
      'wolkenkit-persist-data': persistData,
      'wolkenkit-shared-key': sharedKey,
      'wolkenkit-type': image().type
    },
    networks: [configuration.application + '-network'],
    restart: 'always',
    volumesFrom: [configuration.application + '-node-modules']
  };

  if (debug) {
    result.ports = {
      9229: selectedEnvironment.api.address.port + 8
    };
  }

  return result;
};

module.exports = container;