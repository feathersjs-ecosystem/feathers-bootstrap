import config from 'config';
import path from 'path';
import omit from 'lodash/omit';
import each from 'lodash/each';
import loader from './loader';

const debug = require('debug')('feathers-bootstrap');
const CONFIG_KEY = 'config';
// Methods on `app` that can register middleware
const middlewareMethods = ['use', 'get', 'post', 'put', 'delete', 'patch', 'options'];

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
    const load = loader.bind(app);
    // Configuration filename is either absolute or relative to the current folder
    const filename = path.isAbsolute(options.main) ? options.main :
      path.join(process.cwd(), options.main);
    // The plain `feathers.json`
    const main = require(filename);
    const bootstrap = load(main.config || {}, filename, converter)
      // Merge node-config with processed `config` from `feathers.json`
      .then(bootstrapConfig => Object.assign(config, bootstrapConfig))
      // Then process all other fields from the configuration file
      .then(() => load(omit(main, 'config'), filename, converter))
      .then(bootstrap => {
        const { services, plugins } = bootstrap;

        each(plugins, fn => app.configure(fn));
        each(services, (service, path) => app.use(path, service));
        each(middlewareMethods, method =>
          each(bootstrap[method], (middleware, path) =>
            app[method](path, ...middleware)
          )
        );
      }).catch(e => {
        console.error('BOOTSTRAP ERROR', e);
        throw e;
      });

    Object.assign(app, {
      config, bootstrap,
      start() {
        return this.bootstrap.then(() =>
          this.listen(this.config.get('port'))
        );
      }
    });
  };
}
