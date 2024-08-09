# Repository Scanner

This GraphQL API provides functionality to scan repositories (currently only Github) and return useful information about them.

## Installation

1. Use npm to install dependencies.

```bash
npm install
```

2. Create .env file (see .env.example for reference) and add Github credentials.

3. Change the PREFIX_NAME constant in services/github.js to correspond to your specific repository names.

## Usage

Use `npm start` to run the API in development mode.

```bash
npm start
```

Use `npm run start:prod` to run the API in production mode.

```bash
npm run start:prod
```

### Notes

I decided not to include linters, Typescipt, DI, unit tests, config management (dev, stage, prod), pagination and sorting for the 'repositoryList' request. Also I escaped the usage of separated utils and constant folders.
