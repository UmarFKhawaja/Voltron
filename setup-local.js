#!/usr/bin/env node

const { mkdirSync, writeFileSync } = require('fs');
const { EOL } = require('os');
const { dirname } = require('path');
const { hashSync } = require('bcryptjs');
const inquirer = require('inquirer');

const {
  PASSWORD = '',
  SECRET = '',
  NODEMAILER_HOST = 'localhost',
  NODEMAILER_USERNAME = 'voltron',
  NODEMAILER_PASSWORD = '',
  GITHUB_CLIENT_ID = '',
  GITHUB_CLIENT_SECRET = '',
  GOOGLE_CLIENT_ID = '',
  GOOGLE_CLIENT_SECRET = ''
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

const files = [
  {
    name: 'apps/monitor-app/.env',
    lines: [
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
      'CERBOS_HTTP_PORT=23592',
      'CERBOS_GRPC_PORT=23593',
      ''
    ]
  },
  {
    name: 'apps/server-app/.env',
    lines: [
      'JWT_SECRET={{SECRET}}',
      'JWT_EXPIRES_IN=1d',
      '',
      'MAGIC_LOGIN_SECRET={{SECRET}}',
      'MAGIC_LOGIN_EXPIRES_IN=10m',
      'MAGIC_LOGIN_BASE_URL=http://localhost:2080',
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
      'CERBOS_HTTP_PORT=23592',
      'CERBOS_GRPC_PORT=23593',
      '',
      'NODEMAILER_HOST={{NODEMAILER_HOST}}',
      'NODEMAILER_PORT=587',
      'NODEMAILER_USE_TLS=false',
      'NODEMAILER_USERNAME={{NODEMAILER_USERNAME}}',
      'NODEMAILER_PASSWORD={{NODEMAILER_PASSWORD}}',
      '',
      'GITHUB_CLIENT_ID={{GITHUB_CLIENT_ID}}',
      'GITHUB_CLIENT_SECRET={{GITHUB_CLIENT_SECRET}}',
      'GITHUB_ACCEPT_URL=http://localhost:2180',
      'GITHUB_REDIRECT_URL=http://localhost:2080',
      '',
      'GOOGLE_CLIENT_ID={{GOOGLE_CLIENT_ID}}',
      'GOOGLE_CLIENT_SECRET={{GOOGLE_CLIENT_SECRET}}',
      'GOOGLE_ACCEPT_URL=http://localhost:2180',
      'GOOGLE_REDIRECT_URL=http://localhost:2080',
      ''
    ]
  },
  {
    name: 'services/.env',
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
      '    directory: /policies',
      '    watchForChanges: true',
      ''
    ]
  },
  {
    name: 'services/redis/conf',
    lines: [
      'port 6379',
      'appendonly yes',
      'requirepass {{PASSWORD}}',
      ''
    ]
  }
];

const questions = [
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
    name: 'GITHUB_CLIENT_ID',
    message: 'What\'s the client ID for GitHub?',
    default: GITHUB_CLIENT_ID
  },
  {
    type: 'input',
    name: 'GITHUB_CLIENT_SECRET',
    message: 'What\'s the client secret for GitHub?',
    default: GITHUB_CLIENT_SECRET
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
    files.forEach((file) => {
      const content = processLines(file.lines, answers);

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
