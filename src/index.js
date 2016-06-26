import config from 'config';
import path from 'path';
import omit from 'lodash/omit';
import each from 'lodash/each';
import load from './loader';

const debug = require('debug')('feathers-bootstrap');
const CONFIG_KEY = 'config';
const converter = value => {
  if(value === CONFIG_KEY) {
    return config;
  }

  if(value.indexOf(`${CONFIG_KEY}.`) === 0) {
    const key = value.substring(CONFIG_KEY.length + 1);

    return config.get(key);
  }

  return value;
};

export default function(options) {
  debug('Initializing feathers-bootstrap plugin');

  return function() {
    const app = this;
    const filename = path.isAbsolute(options.main) ? options.main :
      path.join(process.cwd(), options.main);
    const main = require(filename);
    const bootstrap = load(main.config || {}, filename, converter)
      .then(bootstrapConfig => {
        each(bootstrapConfig, (value, key) => {
          if(config.has(key)) {
            throw new Error(`Configuration key '${key}' already exists in the application configuration provided by node-config`);
          }
        });

        Object.assign(config, bootstrapConfig);
      })
      .then(() => load(omit(main, 'config'), filename, converter))
      .then(bootstrap => {
        const plugins = bootstrap.plugins || [];
        const services = bootstrap.services || {};

        each(plugins, fn => app.configure(fn));
        each(services, (service, path) => app.use(path, service));
      }).catch(e => {
        console.error('BOOTSTRAP ERROR', e);
        throw e;
      });

    Object.assign(app, { config, bootstrap, });
  };
}
