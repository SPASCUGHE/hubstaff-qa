# hubstaff-qa

Playwright E2E tests against the real Hubstaff marketing site and app.

## Prerequisites

Create a `.env` file in the project root:

```bash
BASEURL=https://hubstaff.com/
MAILSURPAPIKEY=your_mailslurp_api_key
```

Get a free MailSlurp API key at [mailslurp.com](https://www.mailslurp.com/) — used to create a confirmed test user before the suite runs.

## Running the tests

```bash
npm install
npx playwright install chromium
cp .env.example .env
# edit .env with your MailSlurp key
npm test
```

`global.setup.ts` creates `test-user.json` (or reuses it locally). Authenticated specs read that file to sign in.

JUnit report: `reports/junit.xml`

## Test suites (`tests/e2e/`)

| Spec | Scenario |
|------|----------|
| `marketingHomepage.spec.ts` | Public marketing site — sign-in entry point (no auth) |
| `signIn.spec.ts` | Sign in from marketing navigation |
| `signUp.spec.ts` | Full sign-up flow with email confirmation (skipped on CI; setup handles signup) |
| `dashboardNavigation.spec.ts` | Sidebar sections visible after login |
| `addCreateProject.spec.ts` | Create a project in Project management |
| `createPayments.spec.ts` | Create a one-time team payment in Financials |

## QA Results Hub integration

GitHub Actions runs the **E2E suite** and uploads `junit-results` for the QA Results Hub dashboard (`../qa-automation-hub`).

### GitHub Actions secrets

| Secret | Required |
|--------|----------|
| `MAILSURPAPIKEY` | Optional — without it, marketing tests pass and authenticated tests fail (fine for demo) |

See `../qa-automation-hub/docs/hubstaff-qa-integration.md` for hub sync instructions.

## Test results
![screenshot](./results.png)
