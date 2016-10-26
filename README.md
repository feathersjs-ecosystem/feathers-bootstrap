# feathers-bootstrap

[![Build Status](https://travis-ci.org/feathersjs/feathers-bootstrap.png?branch=master)](https://travis-ci.org/feathersjs/feathers-bootstrap)
[![Code Climate](https://codeclimate.com/github/feathersjs/feathers-bootstrap.png)](https://codeclimate.com/github/feathersjs/feathers-bootstrap)
[![Test Coverage](https://codeclimate.com/github/feathersjs/feathers-bootstrap/badges/coverage.svg)](https://codeclimate.com/github/feathersjs/feathers-bootstrap/coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/feathers-bootstrap.svg?style=flat-square)](https://david-dm.org/feathersjs/feathers-bootstrap)
[![Download Status](https://img.shields.io/npm/dm/feathers-bootstrap.svg?style=flat-square)](https://www.npmjs.com/package/feathers-bootstrap)
[![Slack Status](http://slack.feathersjs.com/badge.svg)](http://slack.feathersjs.com)

> Feathers application bootstrap and configuration using JSON configuration files

## Why JSON configuration?

[Feathers](http://feathersjs.com/) makes it easy to get an app started with just a single JavaScript file and a few lines of code. As an application grows however, it becomes more and more important to organize separate aspects of the application into individual files and manage the overall configuration.

Tools like [Yeoman](http://yeoman.io/) help creating generators for automating some of the boilerplate necessary for that. For Feathers there is [generator-feathers](https://github.com/feathersjs/generator-feathers) but with the many databases and plugins Feathers supports it has become hard to maintain from [unwieldy templates](https://github.com/feathersjs/generator-feathers/blob/master/generators/app/templates/service.js) to brittle [AST code transformations](https://github.com/feathersjs/generator-feathers/blob/master/lib/transform.js).

JSON files on the other hand are much easier to analyze and modify either by hand or automated tools like a generator. This plugin uses [json-di](https://github.com/daffl/json-di) a JSON dependency injection module to bootstrap and configure a Feathers application.

## Usage

For the following example we will create a basic configuration file that configures Feathers with REST and Socket.io support and an in-memory service at the `/todos` endpoint. In a new folder, install all required modules:

```
npm install feathers body-parser feathers-bootstrap feathers-rest feathers-socketio feathers-hooks feathers-memory
```

Then create a `feathers.json` file:

```js
{
  "config": {
    "port": 3030,
    "paginate": {
      "default": 10,
      "max": 25
    }
  },
  "plugins": [
    { "require": "feathers-rest", "options": [] },
    { "require": "feathers-socketio", "options": [] },
    { "require": "feathers-hooks", "options": [] }
  ],
  "use": {
    "/todos": {
      "require": "feathers-memory",
      "options": {
        "paginate": "config.paginate"
      }
    }
  },
  "after": {
    "/": [
      { "require": "feathers-errors/not-found", "options": [] },
      { "require": "feathers-errors/handler", "options": [] }
    ]
  }
}
```

An `app.js` like this:

```js
const feathers = require('feathers');
const path = require('path');
const bodyParser = require('body-parser');
const bootstrap = require('feathers-bootstrap');

const feathersConfig = path.join(__dirname, 'feathers.json');
const app = feathers()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(bootstrap(feathersConfig));

app.start().then(() =>
  console.log(`Application listening on port ${app.config.get('port')}`)
).catch(e => console.error(e));
```

You can run the application via

```
node app
```

Note: The included [node-config](https://github.com/lorenwest/node-config) will show a warning due to the missing `config/` folder.

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
