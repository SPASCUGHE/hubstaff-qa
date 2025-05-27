import { Locator, Page } from "@playwright/test";

export class SignupPage {
    readonly page: Page;
    readonly signupBtn: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly workEmailInput: Locator;
    readonly passwordInput: Locator;
    readonly termsCheckBox: Locator;
    readonly createMyAccountBtn: Locator;
    readonly acceptCookieBanner: Locator;
    readonly welcomeTitle: Locator;
    readonly welcomeUrl = "https://app.hubstaff.com/welcome"

    constructor(page: Page) {
        // super(page);
        this.page = page;
        this.signupBtn = page.getByRole('link', { name: 'Free 14-day trial' });
        this.firstNameInput = page.getByTestId("first_name");
        this.lastNameInput = page.getByTestId("last_name");
        this.workEmailInput = page.getByTestId("email");
        this.passwordInput = page.getByTestId("password");
        this.termsCheckBox = page.locator(".hsds-form__checkbox-icon");
        this.createMyAccountBtn = page.getByTestId("create_my_account");
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
      

    async signupFreeForFreeTrial(firstName: string, lastName: string, workEmail: string, password: string) {
        await this.page.goto(process.env.BASEURL!);
        await this.signupBtn.click();
        await this.acceptCookiesIfVisible();
        
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.workEmailInput.fill(workEmail);
        await this.passwordInput.fill(password);
        await this.termsCheckBox.check();
        await this.createMyAccountBtn.click();
    }
}