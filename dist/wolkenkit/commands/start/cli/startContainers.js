'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var difference = require('lodash/difference'),
    remove = require('lodash/remove');

var docker = require('../../../../docker'),
    runtimes = require('../../../runtimes'),
    sleep = require('../../../../sleep');

var startContainers = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options, progress) {
    var _this = this;

    var configuration, env, sharedKey, persistData, debug, runtime, containers, numberOfContainers, started, err, _loop;

    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (options) {
              _context3.next = 2;
              break;
            }

            throw new Error('Options are missing.');

          case 2:
            if (options.configuration) {
              _context3.next = 4;
              break;
            }

            throw new Error('Configuration is missing.');

          case 4:
            if (options.env) {
              _context3.next = 6;
              break;
            }

            throw new Error('Environment is missing.');

          case 6:
            if (options.sharedKey) {
              _context3.next = 8;
              break;
            }

            throw new Error('Shared key is missing.');

          case 8:
            if (!(options.persistData === undefined)) {
              _context3.next = 10;
              break;
            }

            throw new Error('Persist data is missing.');

          case 10:
            if (!(options.debug === undefined)) {
              _context3.next = 12;
              break;
            }

            throw new Error('Debug is missing.');

          case 12:
            if (progress) {
              _context3.next = 14;
              break;
            }

            throw new Error('Progress is missing.');

          case 14:
            configuration = options.configuration, env = options.env, sharedKey = options.sharedKey, persistData = options.persistData, debug = options.debug;
            runtime = configuration.runtime.version;
            _context3.next = 18;
            return runtimes.getContainers({
              forVersion: runtime,
              configuration: configuration,
              env: env,
              sharedKey: sharedKey,
              persistData: persistData,
              debug: debug
            });

          case 18:
            containers = _context3.sent;
            numberOfContainers = containers.length;
            started = [];
            err = void 0;
            _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop() {
              var nextContainerToStart;
              return _regenerator2.default.wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      nextContainerToStart = containers.find(function (container) {
                        var dependsOn = container.dependsOn || [];
                        var startedContainerNames = started.map(function (startedContainer) {
                          return startedContainer.name;
                        });

                        return difference(dependsOn, startedContainerNames).length === 0;
                      });


                      if (nextContainerToStart) {
                        remove(containers, function (container) {
                          return container.name === nextContainerToStart.name;
                        });

                        /* eslint-disable no-loop-func */
                        (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                          return _regenerator2.default.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.prev = 0;
                                  _context.next = 3;
                                  return docker.startContainer({ configuration: configuration, env: env, container: nextContainerToStart });

                                case 3:

                                  started.push(nextContainerToStart);
                                  progress({ message: 'Started ' + nextContainerToStart.name + ' (' + started.length + '/' + numberOfContainers + ').', type: 'info' });
                                  _context.next = 10;
                                  break;

                                case 7:
                                  _context.prev = 7;
                                  _context.t0 = _context['catch'](0);

                                  err = _context.t0;

                                case 10:
                                case 'end':
                                  return _context.stop();
                              }
                            }
                          }, _callee, _this, [[0, 7]]);
                        }))();
                        /* eslint-enable no-loop-func */
                      }

                      _context2.next = 4;
                      return sleep(50);

                    case 4:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _loop, _this);
            });

          case 23:
            if (!(started.length < numberOfContainers && !err)) {
              _context3.next = 27;
              break;
            }

            return _context3.delegateYield(_loop(), 't0', 25);

          case 25:
            _context3.next = 23;
            break;

          case 27:
            if (!err) {
              _context3.next = 29;
              break;
            }

            throw err;

          case 29:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee2, this);
  }));

  return function startContainers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = startContainers;