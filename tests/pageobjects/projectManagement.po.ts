import { Locator, Page } from "@playwright/test";

export class ProjectManagementPage {
    readonly page: Page;
    readonly addProjectBtn: Locator;
    readonly projectNameTxtArea: Locator;
    readonly saveProjectBtn: Locator;
    readonly notificationMessage: Locator;
    readonly savedProjectNames: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addProjectBtn = page.locator('a.btn-primary:has-text("Add project")');
        this.projectNameTxtArea = page.getByPlaceholder('Add project names separated by new lines');
        this.saveProjectBtn = page.getByRole('button', { name: 'Save' });
        this.savedProjectNames = page.locator('.project-name');
        this.notificationMessage = page.locator('.jGrowl-notification:has-text("Project created")');
    }

    async addNewProject(projectName: string) {
        await this.addProjectBtn.click();
        await this.projectNameTxtArea.fill(projectName);
        await this.saveProjectBtn.click();
    }
}