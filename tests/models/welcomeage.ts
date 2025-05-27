import { Locator, Page } from "@playwright/test";

export class WelcomePage {
    readonly page: Page;
    readonly createOrganizationBtn: Locator;
    readonly organizationNameInput: Locator;
    readonly nextBtn: Locator;
    readonly justExploringGoal: Locator;
    readonly getStartedBtn: Locator;
    readonly pickAPlanLaterBtn: Locator;
    readonly gettingStartedPage: Locator;
    readonly dashboardPageTitle: Locator;
    readonly getingStartedUrl = "https://app.hubstaff.com/getting_started/"

    constructor(page: Page) {
        this.page = page;
        this.createOrganizationBtn = page.locator(".create-org-btn");
        this.organizationNameInput = page.locator("#organization_name");
        this.nextBtn = page.getByRole('button', { name: 'Next' });
        this.justExploringGoal = page.locator('label[for="organization_goal_other"]');
        this.getStartedBtn = page.locator("#submit-button");
        this.pickAPlanLaterBtn = page.getByRole('link', { name: 'Pick a plan later' });
        this.gettingStartedPage = page.locator('.getting-started-page');
        this.dashboardPageTitle = page.locator('#getting-started-header');
    }
      
    async configureOrganizationDashboard() {
        await this.createOrganizationBtn.click();
        await this.organizationNameInput.fill("Test Organization");
        await this.nextBtn.click();
        await this.justExploringGoal.click();
        await this.getStartedBtn.click();
        await this.pickAPlanLaterBtn.click();
    }
}