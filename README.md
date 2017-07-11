# Pathway API

## Setup
I'm using Node.js v8.1.3 and npm version 5.0.3, I've specified this using [NVM](https://github.com/creationix/nvm) and the .nvmrc file. It may also work with other versions of node.

Install dependencies with
```
npm install
```

## Running tests
```
npm run test
```

## Developing

PATHWAY_JWT_SECRET_KEY will need to be set as an environment variable, this is for [node-jwt-simple](https://github.com/hokaccha/node-jwt-simple) 

To setup the database run 
```
npm run setup-dev-database
```

The api can then be run with 
```
npm run start
```

## Client Retry
When posting to the medication_record endpoint it returns the dates of medication changes, the client can check these dates match the dates stored in its local database and resend any missing records

Similarly the daily_checkin endpoint returns the amount of daily checkins made, if this does not match the amount stored in the clients local database the client can GET daily_checkin/checkin_times to find which records are missing from the server.

## Next Steps
At the moment the api is missing a full authentication system, there should also be more tests around validation / error handling.
