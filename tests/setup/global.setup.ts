import { chromium, FullConfig } from "@playwright/test";
import MailSlurp from "mailslurp-client";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

import { BasePage } from "../models/basepage";
import signupData from "../test-data/signupdata.json" assert { type: "json" };

export default async function globalSetup() {
  if (process.argv.includes("--list")) {
    return;
  }

  const isCi = !!process.env.CI;

  if (!process.env.MAILSURPAPIKEY) {
    if (isCi) {
      throw new Error(
        "MAILSURPAPIKEY GitHub secret is missing. " +
          "Add it under repo Settings → Secrets and variables → Actions.",
      );
    }

    try {
      await fs.access("test-user.json");
      console.log("MAILSURPAPIKEY not set — reusing local test-user.json");
      return;
    } catch {
      throw new Error(
        "MAILSURPAPIKEY is required in .env (see .env.example). " +
          "Get a free key at https://www.mailslurp.com/",
      );
    }
  }

  console.log("Creating confirmed test user via MailSlurp…");
  const mailslurp = new MailSlurp({ apiKey: process.env.MAILSURPAPIKEY });
  const inbox = await mailslurp.createInbox();
  const email = inbox.emailAddress;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const basePage = new BasePage(page);
  const signupPage = basePage.signupPage;
  const welcomePage = basePage.welcomePage;

  const user = { ...signupData.validUser, workEmail: email };

  await signupPage.signupFreeForFreeTrial(
    user.firstName,
    user.lastName,
    user.workEmail,
    user.password,
  );

  const confirmationEmail = await mailslurp.waitForLatestEmail(inbox.id, 60_000);
  const confirmationLink = confirmationEmail.body?.match(
    /https:\/\/account\.hubstaff\.com\/confirm_account\/[^\s"]+/,
  )?.[0];

  if (!confirmationLink) {
    await browser.close();
    throw new Error("No confirmation link found in MailSlurp inbox.");
  }

  await page.goto(confirmationLink);
  await page.waitForURL(signupPage.welcomeUrl, { timeout: 30_000 });

  await fs.writeFile(
    "test-user.json",
    JSON.stringify({ email, password: user.password }, null, 2),
  );

  console.log(`Test user created: ${email}`);

  await welcomePage.configureOrganizationDashboard();
  console.log("Organization configured.");

  await browser.close();
}
