# Voltron

## Introduction

### Purpose

This sample solution demonstrates a full-stack application implemented using [Angular](https://angular.dev), [Nest](https://nestjs.com), [Docker](https://www.docker.com), [Nx](https://nx.dev) and [PM2](https://pm2.keymetrics.io/).

It also uses [Passport](https://www.passportjs.org) and will use [Apollo](https://www.apollographql.com).

### Features

See the description for [`browser-app`](#browser-app) application.

### Applications

The solution has the following applications:

#### monitor-app

`monitor-app` subscribes to a Redis server, and handles messages of the following types:

* `SEND_REGISTER_MAIL` -- send a mail when a user registers with a verification link that the user can use to verify their account
* `SEND_LOGIN_WITH_MAGIC_LOGIN_MAIL` -- send a mail when a user logs in with a magic login with a confirmation link that the user can use to log in
* `SEND_RESET_PASSWORD_MAIL` -- send a mail with a confirmation link that the user can use to reset their password
* `SEND_CONFIRM_EMAIL_ADDRESS_CHANGE_MAIL` -- send a mail with a confirmation link that the user can use to confirm their old email address to change their email address
* `SEND_COMPLETE_EMAIL_ADDRESS_CHANGE_MAIL` -- send a mail with a confirmation link that the user can use to confirm their new email address to change their email address

#### server-app

`server-app` provides the API backend, and exposes the following endpoints:

* `/api/auth/register` -- register a user
* `/api/auth/login/password` -- login a user with a password
* `/api/auth/login/magic-login` -- start logging in a user with a magic link
* `/api/auth/login/facebook` -- start logging in a user with a Facebook account
* `/api/auth/login/google` -- start logging in a user with a Google account
* `/api/auth/accept/magic-login` -- finish logging in a user with a magic link
* `/api/auth/accept/facebook` -- finish logging in a user with a Facebook account
* `/api/auth/accept/google` -- finish logging in a user with a Google account
* `/api/auth/logout` -- logout the user
* `/api/auth/verify/session` -- verify if the user is logged in
* `/api/auth/get/information` -- get information regarding the state of the user's account, e.g., if they are in the middle of changing email addresses
* `/api/auth/update-profile` -- change the display name or user name
* `/api/auth/start-email-address-change` -- starting changing the email address
* `/api/auth/confirm-email-address-change` -- confirm the change of email address from the old email address
* `/api/auth/complete-email-address-change` -- complete the change of email address from the new email address
* `/api/auth/cancel-email-address-change` -- cancel the change of email address
* `/api/auth/resend-email-address-change` -- resend the confirmation link to the old email address or completion link to the new email address 
* `/api/auth/reset/password` -- reset the password
* `/api/auth/set/password` -- set a password if a password is not set
* `/api/auth/unset/password` -- unset a password if a password is set
* `/api/auth/change/password` -- change a password if a password is set

#### browser-app

`browser-app` provides the app frontend, and allows the user to:

* Register an account
* Login to the account using:
  * a password
  * a magic link
  * a Facebook account
  * a Google account
* Update the profile
* Change the email address
* Change the password if one is set
* Set the password if one is not set
* Unset the password if one isset
* Logout of the account
* Switch the theme between light and dark modes

### Libraries

#### common-library

Contains code shared between the server-side and client-side applications.

#### core-library

Contains code shared between the two server-side applications.

#### data-library

Contains code for accessing data in the MongoDB and Redis instances.

#### services-library

Contains code for integrating with external services.

### Known issues

This is a work in progress.

As such some features are not yet working as intended. A brief description of the missing features follows:

#### Missing feature: Publish GraphQL endpoint

This has not been done yet.

## Instructions

> NB: all commands must be run in the root of the repository

### Install Dependencies and Build Artifacts

```bash
npm install
npx nx run-many -t lint -t build
```

### Configure Solution

#### Create Facebook OAuth credentials

Go to [Facebook's Apps](https://developers.facebook.com/apps) page.

Register a new application with the following details.
   * `Authorization callback URL` set to `http://localhost:2180/api/auth/accept/facebook`

Note the **Client ID** and **Client Secret**.

#### Create Google OAuth credentials

Go to [Google's Developer Console](https://console.cloud.google.com) page.

Register a new application.

Create OAuth credentials with the following details:
   * `Authorised JavaScript origins` set to `http://localhost:2180`
   * `Authorised redirect URIs` set to `http://localhost:2180/api/auth/accept/google`

Note the **Client ID** and **Client Secret**.

#### Configure Solution

Run the following command:

```bash
cp .env.sample .env
```

Fill in the values in the `.env` file.

#### Prepare Solution for Development

Run the following command:

```bash
npm run setup-local
```

Answer the questions; tapping through the answers should suffice, but you can customize the offered values.

> The default answers are set up in the `.env` file in the root of the repository.

`setup-local` creates the following files in the repository.

* `apps/monitor-app/.env`
* `apps/server-app/.env`
* `services/.env`
* `services/cerbos/conf.yaml`
* `services/redis/conf`

#### Prepare Solution for Deployment

Run the following command:

```bash
npm run setup-ecosystem
```

Answer the questions; tapping through the answers should suffice, but you can customize the offered values.

> The default answers are set up in the `.env` file in the root of the repository.

`setup-ecosystem` creates the following files in the repository.

* `ecosystem/envs/monitor-app.json`
* `ecosystem/envs/server-app.json`
* `services/.env`
* `services/cerbos/conf.yaml`
* `services/redis/conf`

### Run Solution in Development

#### Start the Docker services

Open a bash prompt:

```bash
cd services
docker compose up -d
```

#### Start the `monitor-app` application

Open a bash prompt:

```bash
nx serve monitor-app
```

#### Start the `server-app` application

Open a bash prompt:

```bash
nx serve server-app
```

#### Start the `browser-app` application

Open a bash prompt:

```bash
nx serve browser-app
```

Navigate to [http://localhost:2080](http://localhost:2080) in the browser.

### Run Solution in Deployment

#### Start the Docker services

Open a bash prompt:

```bash
cd services
docker compose up -d
```

#### Start the backend applications

Open a bash prompt:

```bash
cd ecosystem
pm2 start
```

#### Serve the frontend application

Configure the webserver to serve `dist/apps/browser-app` at `https://example.com`.

Configure the webserver to forward requests for `https://example.com/api` to `http://localhost:2180/api`.

Navigate to `https://example.com` in the browser.
