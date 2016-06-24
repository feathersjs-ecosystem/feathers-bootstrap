// import errors from 'feathers-errors';
// import load from './loader';

const debug = require('debug')('feathers-bootstrap');

export default function(options) {
  debug('Initializing feathers-bootstrap plugin');

  return function() {
    const app = this;
    const main = require(options.main);
    const configure = main.configure;
    const services = main.services;
    // const converter = value => {
    //   if(value.indexOf('app.') === 0) {
    //     const parts = value.substring(4).split('.');
    //     const val = app.get(parts.shift());

    //     let current = val;

    //     for(let i = 0; i < parts.length; i++) {
    //       current = current && current[i];
    //     }

    //     return current;
    //   }

    //   return value;
    // };

    configure.forEach(plugin => {
      // const fn = load(plugin, )
      process(plugin, function(module, data) {
        app.configure(module(... data.arguments));
      }.bind(app));
    });

    Object.keys(services).forEach(path => {
      process(services[path], function(module, data) {
        app.use(path, module(... data.arguments));
        const service = app.service(path);

        service.before(data.before || []);
        service.after(data.after || []);
      }.bind(app));
    });
  };
}
