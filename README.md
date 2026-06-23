# hubstaff-qa


## Prerequisites
Create your own `.env` file in the main route and add the following:

```bash
BASEURL = 'hubstaff baseUrl'
MAILSURPAPIKEY = 'api-key'
```
Navigate to `https://www.mailslurp.com/` and create a free account and confirm.
Copy the APIKEY that will be passed into .env file.
Mailsurp - 3rd party service used for email confirmation

## Running the tests

### Smoke tests (default — used in CI)

Fast, reliable tests. No MailSlurp or Hubstaff login required.

```bash
npm install
npx playwright install chromium
npm test
```

JUnit report: `reports/junit.xml`

### Full Hubstaff E2E (optional, local only)

Requires `.env` with `MAILSURPAPIKEY` and `BASEURL`.

```bash
cp .env.example .env
# edit .env with your MailSlurp key
npm run test:e2e
```

## QA Results Hub integration

GitHub Actions runs **smoke tests** and uploads `junit-results` for the QA Results Hub dashboard (`../qa-automation-hub`).

See `../qa-automation-hub/docs/hubstaff-qa-integration.md` for sync instructions.

### GitHub Actions

No secrets required for smoke tests. Push to `main` and the workflow runs automatically.

## Test results
![screenshot](./results.png)