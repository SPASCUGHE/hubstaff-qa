import { Page } from "@playwright/test";

export class SideBar {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(menuName: string) {
        await this.page.getByRole('menuitem', { name: menuName }).click();
    }
}