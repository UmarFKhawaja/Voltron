#!/usr/bin/env node

const { mkdirSync, writeFileSync } = require('fs');
const { EOL } = require('os');
const { dirname } = require('path');
const { hashSync } = require('bcryptjs');
const chalk = require('chalk');
const inquirer = require('inquirer');

const {
  PASSWORD = '',
  SECRET = '',
  NODEMAILER_HOST = 'localhost',
  NODEMAILER_USERNAME = 'voltron',
  NODEMAILER_PASSWORD = '',
  FACEBOOK_CLIENT_ID = '',
  FACEBOOK_CLIENT_SECRET = '',
  GOOGLE_CLIENT_ID = '',
  GOOGLE_CLIENT_SECRET = '',
  DOMAIN_NAME = 'example.com'
} = process.env;

const op = {
  bcrypt: (value) => hashSync(value),
  base64: (value) => Buffer.from(value).toString('base64')
};

const substituteValue = (answers) => (_, match) => {
  const [name, ...transforms] = match.split('|').map((part) => part.trim());
  const value = transforms.reduce((value, transform) => op[transform](value), answers[name]);

  return value;
};

const processLines = (lines, answers) => lines
  .map((line) => {
    return line
      .replace(/\{\{([A-Za-z0-9_ |]+)}}/ig, substituteValue(answers));
  })
  .join(EOL);

const processValues = (values, answers) => Object.entries(values)
  .reduce((values, [name, value]) => {
    values[name] = value.replace(/\{\{([A-Za-z0-9_ |]+)}}/ig, substituteValue(answers));

    return values;
  }, {});

const environment = process.argv[2];

const files = [
  {
    name: 'apps/monitor-app/.env',
    kind: 'lines',
    method: processLines,
    environments: [
      'local'
    ],
    lines: [
      'CERBOS_HOST=localhost',
      'CERBOS_HTTP_PORT=23592',
      'CERBOS_GRPC_PORT=23593',
      '',
      'MONGO_HOST=localhost',
      'MONGO_PORT=27217',
      'MONGO_USERNAME=voltron',
      'MONGO_PASSWORD={{PASSWORD}}',
      'MONGO_DATABASE=voltron',
      '',
      'REDIS_HOST=localhost',
      'REDIS_PORT=26379',
      'REDIS_USERNAME=',
      'REDIS_PASSWORD={{PASSWORD}}',
      '',
      'NODEMAILER_HOST={{NODEMAILER_HOST}}',
      'NODEMAILER_PORT=587',
      'NODEMAILER_USE_TLS=false',
      'NODEMAILER_USERNAME={{NODEMAILER_USERNAME}}',
      'NODEMAILER_PASSWORD={{NODEMAILER_PASSWORD}}',
      ''
    ]
  },
  {
    name: 'ecosystem/envs/monitor-app.json',
    kind: 'values',
    method: processValues,
    environments: [
      'ecosystem'
    ],
    values: {
      NODE_ENV: 'production',
      NODE_TLS_REJECT_UNAUTHORIZED: '1',
      CERBOS_HOST: 'localhost',
      CERBOS_HTTP_PORT: '23592',
      CERBOS_GRPC_PORT: '23593',
      MONGO_HOST: 'localhost',
      MONGO_PORT: '27217',
      MONGO_USERNAME: 'voltron',
      MONGO_PASSWORD: '{{PASSWORD}}',
      MONGO_DATABASE: 'voltron',
      REDIS_HOST: 'localhost',
      REDIS_PORT: '26379',
      REDIS_USERNAME: '',
      REDIS_PASSWORD: '{{PASSWORD}}',
      NODEMAILER_HOST: '{{NODEMAILER_HOST}}',
      NODEMAILER_PORT: '587',
      NODEMAILER_USE_TLS: 'false',
      NODEMAILER_USERNAME: '{{NODEMAILER_USERNAME}}',
      NODEMAILER_PASSWORD: '{{NODEMAILER_PASSWORD}}'
    }
  },
  {
    name: 'apps/server-app/.env',
    kind: 'lines',
    method: processLines,
    environments: [
      'local'
    ],
    lines: [
      'AUTH_STRATEGY_JWT_SECRET={{SECRET}}',
      'AUTH_STRATEGY_JWT_EXPIRES_IN=1d',
      '',
      'AUTH_STRATEGY_MAGIC_LOGIN_SECRET={{SECRET}}',
      'AUTH_STRATEGY_MAGIC_LOGIN_EXPIRES_IN=10m',
      'AUTH_STRATEGY_MAGIC_LOGIN_BASE_URL={{FRONTEND_PUBLIC_URL}}',
      '',
      'AUTH_STRATEGY_FACEBOOK_CLIENT_ID={{FACEBOOK_CLIENT_ID}}',
      'AUTH_STRATEGY_FACEBOOK_CLIENT_SECRET={{FACEBOOK_CLIENT_SECRET}}',
      'AUTH_STRATEGY_FACEBOOK_ACCEPT_URL={{BACKEND_PUBLIC_URL}}',
      'AUTH_STRATEGY_FACEBOOK_REDIRECT_URL={{FRONTEND_PUBLIC_URL}}',
      '',
      'AUTH_STRATEGY_GOOGLE_CLIENT_ID={{GOOGLE_CLIENT_ID}}',
      'AUTH_STRATEGY_GOOGLE_CLIENT_SECRET={{GOOGLE_CLIENT_SECRET}}',
      'AUTH_STRATEGY_GOOGLE_ACCEPT_URL={{BACKEND_PUBLIC_URL}}',
      'AUTH_STRATEGY_GOOGLE_REDIRECT_URL={{FRONTEND_PUBLIC_URL}}',
      '',
      'AUTH_ACTIONS_BASE_URL={{FRONTEND_PUBLIC_URL}}',
      '',
      'CERBOS_HOST=localhost',
      'CERBOS_HTTP_PORT=23592',
      'CERBOS_GRPC_PORT=23593',
      '',
      'MONGO_HOST=localhost',
      'MONGO_PORT=27217',
      'MONGO_USERNAME=voltron',
      'MONGO_PASSWORD={{PASSWORD}}',
      'MONGO_DATABASE=voltron',
      '',
      'REDIS_HOST=localhost',
      'REDIS_PORT=26379',
      'REDIS_USERNAME=',
      'REDIS_PASSWORD={{PASSWORD}}',
      ''
    ]
  },
  {
    name: 'ecosystem/envs/server-app.json',
    kind: 'values',
    method: processValues,
    environments: [
      'ecosystem'
    ],
    values: {
      NODE_ENV: 'production',
      NODE_TLS_REJECT_UNAUTHORIZED: '1',
      PORT: '2280',
      AUTH_STRATEGY_JWT_SECRET: '{{SECRET}}',
      AUTH_STRATEGY_JWT_EXPIRES_IN: '1d',
      AUTH_STRATEGY_MAGIC_LOGIN_SECRET: '{{SECRET}}',
      AUTH_STRATEGY_MAGIC_LOGIN_EXPIRES_IN: '10m',
      AUTH_STRATEGY_MAGIC_LOGIN_BASE_URL: '{{FRONTEND_PUBLIC_URL}}',
      AUTH_STRATEGY_FACEBOOK_CLIENT_ID: '{{FACEBOOK_CLIENT_ID}}',
      AUTH_STRATEGY_FACEBOOK_CLIENT_SECRET: '{{FACEBOOK_CLIENT_SECRET}}',
      AUTH_STRATEGY_FACEBOOK_ACCEPT_URL: '{{BACKEND_PUBLIC_URL}}',
      AUTH_STRATEGY_FACEBOOK_REDIRECT_URL: '{{FRONTEND_PUBLIC_URL}}',
      AUTH_STRATEGY_GOOGLE_CLIENT_ID: '{{GOOGLE_CLIENT_ID}}',
      AUTH_STRATEGY_GOOGLE_CLIENT_SECRET: '{{GOOGLE_CLIENT_SECRET}}',
      AUTH_STRATEGY_GOOGLE_ACCEPT_URL: '{{BACKEND_PUBLIC_URL}}',
      AUTH_STRATEGY_GOOGLE_REDIRECT_URL: '{{FRONTEND_PUBLIC_URL}}',
      AUTH_ACTIONS_BASE_URL: '{{FRONTEND_PUBLIC_URL}}',
      CERBOS_HOST: 'localhost',
      CERBOS_HTTP_PORT: '23592',
      CERBOS_GRPC_PORT: '23593',
      MONGO_HOST: 'localhost',
      MONGO_PORT: '27217',
      MONGO_USERNAME: 'voltron',
      MONGO_PASSWORD: '{{PASSWORD}}',
      MONGO_DATABASE: 'voltron',
      REDIS_HOST: 'localhost',
      REDIS_PORT: '26379',
      REDIS_USERNAME: '',
      REDIS_PASSWORD: '{{PASSWORD}}'
    }
  },
  {
    name: 'services/.env',
    kind: 'lines',
    method: processLines,
    environments: [
      'ecosystem',
      'local'
    ],
    lines: [
      'COMPOSE_PROJECT_NAME=voltron',
      '',
      'MONGO_USERNAME=voltron',
      'MONGO_PASSWORD={{PASSWORD}}',
      'MONGO_DATABASE=voltron',
      'MONGO_PORT=27217',
      '',
      'REDIS_PORT=26379',
      '',
      'CERBOS_HTTP_PORT=23592',
      'CERBOS_GRPC_PORT=23593',
      ''
    ]
  },
  {
    name: 'services/cerbos/conf.yaml',
    kind: 'lines',
    method: processLines,
    environments: [
      'ecosystem',
      'local'
    ],
    lines: [
      'server:',
      '  httpListenAddr: :3592',
      '  grpcListenAddr: :3593',
      '  adminAPI:',
      '    enabled: true',
      '    adminCredentials:',
      '      username: voltron',
      '      passwordHash: {{PASSWORD | bcrypt | base64}}',
      'storage:',
      '  driver: disk',
      '  disk:',
      '    directory: /config/policies',
      '    watchForChanges: true',
      ''
    ]
  },
  {
    name: 'services/redis/conf',
    kind: 'lines',
    method: processLines,
    environments: [
      'ecosystem',
      'local'
    ],
    lines: [
      'port 6379',
      'appendonly yes',
      'requirepass {{PASSWORD}}',
      ''
    ]
  }
];

const questions = [
  ...(!environment ? [
    {
      type: 'list',
      name: 'ENVIRONMENT',
      message: 'What environment should be configured?',
      choices: ['local', 'ecosystem'],
      default: 'local'
    }
  ] : []),
  {
    type: 'input',
    name: 'PASSWORD',
    message: 'What\'s the password to secure services like MongoDB, Redis, Cerbos, etc.?',
    default: PASSWORD
  },
  {
    type: 'input',
    name: 'SECRET',
    message: 'What\'s the secret to secure JWT tokens issued?',
    default: SECRET
  },
  {
    type: 'input',
    name: 'NODEMAILER_HOST',
    message: 'What\'s the host for the SMTP service?',
    default: NODEMAILER_HOST
  },
  {
    type: 'input',
    name: 'NODEMAILER_USERNAME',
    message: 'What\'s the username for the SMTP service?',
    default: NODEMAILER_USERNAME
  },
  {
    type: 'input',
    name: 'NODEMAILER_PASSWORD',
    message: 'What\'s the password for the SMTP service?',
    default: NODEMAILER_PASSWORD
  },
  {
    type: 'input',
    name: 'FACEBOOK_CLIENT_ID',
    message: 'What\'s the client ID for Facebook?',
    default: FACEBOOK_CLIENT_ID
  },
  {
    type: 'input',
    name: 'FACEBOOK_CLIENT_SECRET',
    message: 'What\'s the client secret for Facebook?',
    default: FACEBOOK_CLIENT_SECRET
  },
  {
    type: 'input',
    name: 'GOOGLE_CLIENT_ID',
    message: 'What\'s the client ID for Google?',
    default: GOOGLE_CLIENT_ID
  },
  {
    type: 'input',
    name: 'GOOGLE_CLIENT_SECRET',
    message: 'What\'s the client secret for Google?',
    default: GOOGLE_CLIENT_SECRET
  }
];

inquirer
  .prompt(questions)
  .then((answers) => {
    const FRONTEND_PUBLIC_URL = environment === 'local'
      ? 'http://localhost:2080'
      : `https://${DOMAIN_NAME}`;

    const BACKEND_PUBLIC_URL = environment === 'local'
      ? 'http://localhost:2180'
      : `https://${DOMAIN_NAME}`;

    return {
      FRONTEND_PUBLIC_URL,
      BACKEND_PUBLIC_URL,
      ...answers
    };
  })
  .then((answers) => {
    files
      .filter((file) => file.environments.includes(environment))
      .forEach((file) => {
        let content = '';

        switch (file.kind) {
          case 'lines':
            content = file.method(file.lines, answers);
            break;

          case 'values':
            content = JSON.stringify(file.method(file.values, answers), null, 2) + EOL;
            break;
        }

        if (!content) {
          return;
        }

        console.info(chalk.green(`Writing ${file.name}`));

        mkdirSync(dirname(file.name), {
          recursive: true
        });
        writeFileSync(file.name, content, 'utf-8');
      });
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.error(error);
    } else {
      console.error(error);
    }
  });
