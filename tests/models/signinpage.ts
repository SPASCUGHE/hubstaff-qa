import { Locator, Page } from "@playwright/test";

export class SignInPage {
    readonly page: Page;
    readonly landingPageSignInBtn: Locator;
    readonly userEmail: Locator;
    readonly userPassword: Locator;
    readonly signInBtn: Locator;
    readonly acceptCookieBanner: Locator;
    readonly welcomeTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.landingPageSignInBtn = page.getByTestId("sign_in_button");
        this.userEmail = page.locator("#user_email");
        this.userPassword = page.locator("#user_password");
        this.signInBtn = page.locator(".sign-in");
        this.acceptCookieBanner = page.locator("#CybotCookiebotDialogBodyLevelButtonAccept");
        this.welcomeTitle = page.locator(".title");
    }

    async acceptCookiesIfVisible() {
        try {
            await this.acceptCookieBanner.waitFor({ state: 'visible', timeout: 10000 });
            await this.acceptCookieBanner.click();
          } catch {
            console.log('Cookie banner not visible within timeout, continuing...');
          }
      }
      

    async login(email: string, password: string) {
        await this.page.goto('/');
        await this.landingPageSignInBtn.click();
        await this.userEmail.fill(email);
        await this.userPassword.fill(password);
        await this.signInBtn.click();
    }
}