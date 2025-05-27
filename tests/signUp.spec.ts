import { test, expect } from '@playwright/test';
import MailSlurp from 'mailslurp-client';
import { BasePage } from './models/basepage';
import { SignupPage } from './models/signuppage';
import signupData from './test-data/signupdata.json' assert { type: 'json' };

const mailslurp = new MailSlurp({ apiKey: process.env.MAILSURPAPIKEY! })

test.describe('Sign Up', () => {
    let basePage: BasePage;
    let signupPage: SignupPage;

    test.beforeEach(({page}) => {
        basePage = new BasePage(page);
        signupPage = basePage.signupPage;
    })

    test('Sign-up for the 14-day free trial', async ({page}) => {
        // initialize mailSurp to create a temporary index
        const inbox = await mailslurp.createInbox();
        const email = inbox.emailAddress;
        
        // get test data and override workEmail with the mailSurp email
        const user = { ...signupData.validUser, workEmail: email };

        // fill in the signup form
        await signupPage.signupFreeForFreeTrial(user.firstName, user.lastName, user.workEmail, user.password);

        // wait for email, check the subject and fetch the confirmation link
        const confirmationEmail = await mailslurp.waitForLatestEmail(inbox.id, 30000);
        expect(confirmationEmail.subject).toBe("Confirm your Hubstaff account");
        const confirmationLink = confirmationEmail.body?.match(/https:\/\/account\.hubstaff\.com\/confirm_account\/[^\s"]+/)?.[0];
        expect(confirmationLink).toBeTruthy();

        // confirm hubstaff account by navigating to the verification link
        await page.goto(confirmationLink!);
        await expect(page).toHaveURL(signupPage.welcomeUrl);
        await expect(signupPage.welcomeTitle).toHaveText("Welcome to Hubstaff!");
    })
})
