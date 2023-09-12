const path = require('path');
const _ = require('lodash');
const dotenv = require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
// const env = (process.env.NODE_ENV = process.env.NODE_ENV || 'development');

const requiredProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error(`You must set the ${name} environment variable`);
  }
  return process.env[name];
};

if (!process.env.NODE_ENV) requiredProcessEnv('NODE_ENV');

let envFile;
if (env === 'development') {
  envFile = require('./development');
}
if (env === 'production') {
  envFile = require('./production');
}

// All configurations will extend these options
// ============================================
const all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),
  
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, envFile || {});
