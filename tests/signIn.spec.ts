import { test, expect } from '@playwright/test';
import { BasePage } from './models/basepage';
import { SignInPage } from './models/signinpage';
import signupData from './test-data/signupdata.json' assert { type: 'json' };
import fs from 'fs/promises';
import { WelcomePage } from './models/welcomeage';


test.describe('Sign In', () => {
    let basePage: BasePage;
    let signInPage: SignInPage;
    let welcomePage: WelcomePage;

    test.beforeEach(({page}) => {
        basePage = new BasePage(page);
        signInPage = basePage.singInPage;
        welcomePage = basePage.welcomePage;
    })

    test('Sign in from the Marketing page navigation bar', async ({page}) => {
        const { email, password } = JSON.parse(await fs.readFile('test-user.json', 'utf-8'));

        await signInPage.login(email, password);

        await expect(page.url()).toContain(welcomePage.getingStartedUrl);
        await expect(welcomePage.gettingStartedPage).toBeVisible();
        await expect(welcomePage.dashboardPageTitle).toContainText('Welcome, John!')
    })
})
