import { chromium, FullConfig } from "@playwright/test";
import MailSlurp from "mailslurp-client";
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();


import { BasePage } from '../models/basepage';
import signupData from '../test-data/signupdata.json' assert { type: 'json' };

export default async function globalSetup(config: FullConfig) {
    const mailslurp = new MailSlurp({ apiKey: process.env.MAILSURPAPIKEY! });
    const inbox = await mailslurp.createInbox();
    const email = inbox.emailAddress;

    const browser = await chromium.launch();
    const page = await browser.newPage();

    const basePage = new BasePage(page);
    const signupPage = basePage.signupPage;
    const welcomePage = basePage.welcomePage;

    // get test data and override workEmail with the mailSurp email
    const user = { ...signupData.validUser, workEmail: email };

    // fill in the signup form
    await signupPage.signupFreeForFreeTrial(user.firstName, user.lastName, user.workEmail, user.password);

    // wait for email, check the subject and fetch the confirmation link
    const confirmationEmail = await mailslurp.waitForLatestEmail(inbox.id, 30000);
    const confirmationLink = confirmationEmail.body?.match(/https:\/\/account\.hubstaff\.com\/confirm_account\/[^\s"]+/)?.[0];

    if (!confirmationLink) throw new Error('No confirmation link found.');
    await page.goto(confirmationLink);
    await page.waitForURL(signupPage.welcomeUrl, { timeout: 10000 });

    await fs.writeFile(
        'test-user.json',
        JSON.stringify({ email, password: user.password }, null, 2)
    );

    console.log(`Test user created and confirmed: ${email}`);

    await welcomePage.configureOrganizationDashboard();
    console.log('Organization configured!');

    await browser.close();
}