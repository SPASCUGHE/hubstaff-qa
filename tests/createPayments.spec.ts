import { test, expect } from '@playwright/test';
import { BasePage } from './models/basepage';
import { SignInPage } from './models/signinpage';
import fs from 'fs/promises';
import { WelcomePage } from './models/welcomeage';
import { SideBar } from './pageobjects/sideBar.po';
import { ProjectManagementPage } from './pageobjects/projectManagement.po';
import { FinancialsPage } from './pageobjects/financials.po';

const menuItemFinancials = "Financials";
const expectedRows = [
    ['John Doe', 'Bonus', '0:00:00', 'Pending', '$100.00']
  ];

test.describe('Payments', () => {
    let basePage: BasePage;
    let signInPage: SignInPage;
    let welcomePage: WelcomePage;
    let sideBarNavigation: SideBar;
    let financialsPage: FinancialsPage;

    test.beforeEach(({page}) => {
        basePage = new BasePage(page);
        signInPage = basePage.singInPage;
        welcomePage = basePage.welcomePage;
        sideBarNavigation = new SideBar(page);
        financialsPage = new FinancialsPage(page);
    })

    test('Create a team payment: one-time amount aka "bonus" payment', async () => {
        const { email, password } = JSON.parse(await fs.readFile('test-user.json', 'utf-8'));

        await signInPage.login(email, password);

        // navigate to create payment and one time amount tab
        await sideBarNavigation.navigateTo(menuItemFinancials);
        await financialsPage.createPaymentsSubMenuItem.click();
        await financialsPage.oneTimeAmount.click();

        // fill in the necessary input
        await financialsPage.selectAllLink.click();
        await financialsPage.amountInput.fill("100");
        await financialsPage.paymentNoteTxtArea.fill("Bonus payment");

        // create the payment
        await financialsPage.createPaymentBtn.click();
        await financialsPage.submitPaymentBtn.click();
        await financialsPage.notNowBtn.click();

        // assert payment summary
        const rowCount = await financialsPage.paymentTableRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = financialsPage.paymentTableRows.nth(i);
            const expectedCells = expectedRows[i];
            
            for (let j = 0; j < expectedCells.length; j++) {
                const cell = row.locator('td').nth(j);
                await expect(cell).toContainText(expectedCells[j]);
            }
        }
    })
})
