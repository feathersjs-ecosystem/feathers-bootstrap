import path from 'path';
import each from 'lodash/each';
import map from 'lodash/map';
import omit from 'lodash/omit';
import clone from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

const debug = require('debug')('feathers-bootstrap:loader');
const keywords = [ 'options', 'arguments', 'module', 'require' ];
const assign = (obj, data) => {
  const toAssign = omit(data, keywords);

  if(!isEmpty(toAssign)) {
    // We create a copy but make it point to the original obj prototype
    return Object.assign(Object.create(obj), obj, toAssign);
  }

  return obj;
};

export function load(mod, parent) {
  const data = clone(mod || {});
  const name = data.require;

  let location = '';

  // If the object has a `require` statement
  if(name) {
    debug(`Loading require ${name}`);
    const root = path.dirname(parent);
    // The location of the file to require
    try {
      location = require.resolve(name);
      debug(`require.resolve for ${name} returned ${location}`);
    } catch(error) {
      location = path.isAbsolute(name) ? name : path.join(root, name);
      debug(`resolved location for ${name} to ${location}`);
    }

    const loadedModule = require(location);

    if(path.extname(name) === '.json') {
      // if it s a JSON configuration file, clone its data
      // (since we are modifying it and required JSON files are singletons)
      // and process it recursively
      debug(`Recursively loading JSON configuration ${name}`);
      data.module = load(loadedModule, location);
    } else {
      data.module = loadedModule;
    }
  }

  // Except for `require` keys, process all other keys
  each(data, (value, key ) => {
    if(typeof value === 'object' && key !== 'module') {
      data[key] = load(value, parent);
    }
  });

  return data;
}

export function process(data, convert = value => value) {
  if(typeof data !== 'object') {
    return Promise.resolve(data);
  }

  if(Array.isArray(data)) { // Map data arrays
    return Promise.all(data.map(current => process(current, convert)));
  }

  const result = {};

  // Process all options, run the converter or process recursively
  return Promise.all(map(data, (value, key) => {
    if(key !== 'module') {
      const processed = typeof value === 'object' ? process(value, convert) :
        Promise.resolve(convert(value, key, data));

      return processed.then(data => result[key] = data);
    }

    return Promise.resolve();
  }))
  .then(() => {
    const mod = data.module;

    // If this is a loaded module
    if(typeof mod !== 'undefined') {
      // If the module is a function and `options` or `arguments`
      // is specified in the configuration, run that function with options or arguments
      if((result.options || result.arguments) && typeof mod === 'function') {
        const args = result.options ? [ result.options ] : result.arguments;
        debug(`Calling function returned from ${data.require} with`, args);

        // Call the module with the given arguments
        return assign(mod.call(this, ...args), data);
      }

      // If we are loading a JSON configuration file, process it recursively
      if(data.require && path.extname(data.require) === '.json') {
        debug(`Recursively processing JSON configuration file ${data.require}`);
        return process(mod, convert).then(processed => assign(processed, data));
      }

      // Otherwise just return the module
      return assign(mod, data);
    }

    return result;
  });
}

export default function loadAndProcess(data, parent, convert) {
  const loaded = load(data, parent);

  return process(loaded, convert);
}
