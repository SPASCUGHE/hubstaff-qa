import { Page } from "@playwright/test";
import { SignInPage } from "./signinpage";
import { SignupPage } from "./signuppage";
import { WelcomePage } from "./welcomeage";

export class BasePage {
    readonly signupPage: SignupPage;
    readonly singInPage: SignInPage;
    readonly welcomePage: WelcomePage;

    constructor(page: Page) {
        this.signupPage = new SignupPage(page);
        this.singInPage = new SignInPage(page);
        this.welcomePage = new WelcomePage(page);
    }
}