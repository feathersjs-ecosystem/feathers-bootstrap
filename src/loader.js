import path from 'path';
import each from 'lodash/each';
import map from 'lodash/map';
import clone from 'lodash/cloneDeep';

export function load(mod, parent) {
  const data = clone(mod);
  const name = data.require;

  // If the object has a `require` statement
  if(name) {
    // Root is the parents folder name
    const root = path.dirname(parent);
    // The location of the file to require
    const location = path.isAbsolute(name) ? name : path.join(root, name);

    const loadedModule = require(location);

    if(path.extname(name) === '.json') {
      // if it s a JSON configuration file, clone its data
      // (since we are modifying it and required JSON files are singletons)
      // and process it recursively
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
  const mod = data.module;

  // If this is a loaded module
  if(typeof mod !== 'undefined') {
    // If the module is a function and `options` or `arguments`
    // is specified in the configuration, run that function with options or arguments
    if((data.options || data.arguments) && typeof mod === 'function') {
      const args = data.options ? [ data.options ] : data.arguments;

      // Process all arguments and then  call the function with them
      return process(args, convert).then(
        processedArgs => mod.call(this, ...processedArgs)
      );
    }

    // Otherwise just process recursively
    return process(mod, convert);
  }

  if(Array.isArray(data)) { // Map data arrays
    return Promise.all(data.map(current => process(current, convert)));
  } else if(typeof data === 'object') { // Process objects
    const result = {};

    // Postprocess all options, run the converter or process recursively
    return Promise.all(map(data, (value, key) => {
      if(key !== 'module') {
        const processed = typeof value === 'object' ? process(value, convert) :
          Promise.resolve(convert(value, key, data));

        return processed.then(data => result[key] = data);
      }

      return Promise.resolve();
    })).then(() => result);
  }

  return Promise.resolve(data);
}

export default function loadAndProcess(data, parent, convert) {
  const loaded = load(data, parent);

  return process(loaded, convert);
}
