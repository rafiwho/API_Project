const environment = {};

environment.staging = {
  httpPort: 3000,
  envName: 'staging',
  secretKey: 'hsjsalkdjfklas'
};

environment.production = {
  httpPort: 5000,
  envName: 'production',
  secretKey: 'hsjsalkdjlajsiofldjsiofklas'
};

const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

const environmentToExport = typeof (environment[currentEnvironment]) === 'object' ? environment[currentEnvironment] : environment.staging;

module.exports = environmentToExport;