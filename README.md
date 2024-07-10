# Voltron

## Introduction

### Purpose

This sample solution demonstrates a full-stack application implemented using [Angular](https://angular.dev), [Nest](https://nestjs.com), [Docker](https://www.docker.com) and [Nx](https://nx.dev).

It also uses [Passport](https://www.passportjs.org) and [Apollo](https://www.apollographql.com).

### Features

See the description for `browser-app` application.

### Applications

The solution has the following applications:

#### monitor-app

`monitor-app` subscribes to a Redis server, and handles messages of the following types:

* `SEND_REGISTER_MAIL` -- send a mail when a user registers with a verification link that the user can use to verify their account
* `SEND_LOGIN_WITH_MAGIC_LOGIN_MAIL` -- send a mail when a user logs in with a magic login with a confirmation link that the user can use to log in

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
* Set the password if one is not set
* Unset the password if one isset
* Change the password if one is set
* Logout of the account
* Switch the theme between light and dark modes
* Access a protected area if logged in

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

#### Missing feature: Manage profile

Once this capability is implemented, the user will be able to:

* Change email address

When changing their email address, the change will be completed in 2 steps. First, an email will be sent to their old email address to confirm that the change has been initiated by them. When they confirm the change, an email will be sent to their new email address to confirm it is correct and in their control.

> A user who does not have a password set and does not have their account linked to an OAuth account can still login using magic login, where an email is sent to them with a link to complete the login process.
> 
> Not having a password is considered more secure because there is no password that can be guessed. Authentication is achieved by proving access to the registered email address.

#### Incomplete feature: Connect with OAuth

Once this capability is fully implemented, when the user connects their account to an OAuth provider, the user will be return to the `/app/manage-profile` page rather than the `/` page.

#### Incomplete feature: Send mail

An email is not sent out to the user when registering or logging in with magic login.

The email address where the link will be sent and the link itself are printed on the console by the `monitor-app`.

Note that the mail is generated on the `server-app` and the mail event is published to Redis. This mail event is then picked up by the `monitor-app` and the details published on its console.

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

1. Go to [Facebook's Apps](https://developers.facebook.com/apps) page.
2. Register a new application with the following details.
   1. `Authorization callback URL` set to `http://localhost:2180/api/auth/accept/facebook`
3. Note the **Client ID** and **Client Secret**.

#### Create Google OAuth credentials

1. Go to [Google's Developer Console](https://console.cloud.google.com) page.
2. Register a new application.
3. Create OAuth credentials with the following details:
   1. `Authorised JavaScript origins` set to `http://localhost:2180`
   2. `Authorised redirect URIs` set to `http://localhost:2180/api/auth/accept/google`
4. Note the **Client ID** and **Client Secret**.

#### Configure .env for `npm run setup-local`

1. Run the following command:

```bash
cp .env.sample .env
```

2. Fill in the values in the `.env` file.
3. Run the following command:

```bash
npm run setup-local
```

4. Answer the questions; tapping through the answers should suffice.

### Run Solution

#### Start the Docker services

1. Open a bash prompt:

```bash
cd services
docker compose up -d
```

#### Start the `monitor-app` application

1. Open a bash prompt:

```bash
nx serve monitor-app
```

#### Start the `server-app` application

1. Open a bash prompt:

```bash
nx serve server-app
```

#### Start the `browser-app` application

1. Open a bash prompt:

```bash
nx serve browser-app
```

2. Navigate to [http://localhost:2080](http://localhost:2080) in the browser.
