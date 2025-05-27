import { test, expect } from '@playwright/test';
import { BasePage } from './models/basepage';
import { SignInPage } from './models/signinpage';
import fs from 'fs/promises';
import { WelcomePage } from './models/welcomeage';
import { SideBar } from './pageobjects/sideBar.po';
import { ProjectManagementPage } from './pageobjects/projectManagement.po';

const menuItemProjectManagement = "Project management";


test.describe('Projects', () => {
    let basePage: BasePage;
    let signInPage: SignInPage;
    let welcomePage: WelcomePage;
    let sideBarNavigation: SideBar;
    let projectManagementPage: ProjectManagementPage;

    test.beforeEach(({page}) => {
        basePage = new BasePage(page);
        signInPage = basePage.singInPage;
        welcomePage = basePage.welcomePage;
        sideBarNavigation = new SideBar(page);
        projectManagementPage = new ProjectManagementPage(page);
    })

    test('Add/Create project', async () => {
        const { email, password } = JSON.parse(await fs.readFile('test-user.json', 'utf-8'));

        await signInPage.login(email, password);

        await sideBarNavigation.navigateTo(menuItemProjectManagement);
        await projectManagementPage.addNewProject(`Test Project - ${process.pid}`);

        await expect(projectManagementPage.notificationMessage).toBeVisible();
        const allProjectNames = await projectManagementPage.savedProjectNames.allTextContents();
        await expect(allProjectNames).toContain(`Test Project - ${process.pid}`);
    })
})
