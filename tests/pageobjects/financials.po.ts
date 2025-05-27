import { Locator, Page } from "@playwright/test";

export class FinancialsPage {
    readonly page: Page;
    readonly createPaymentsSubMenuItem: Locator;
    readonly oneTimeAmount: Locator;
    readonly selectAllLink: Locator;
    // readonly closeMemberList: Locator;
    readonly amountInput: Locator;
    readonly paymentNoteTxtArea: Locator;
    readonly createPaymentBtn: Locator;
    readonly submitPaymentBtn: Locator;
    readonly notNowBtn: Locator;
    readonly paymentTableRows: Locator

    constructor(page: Page) {
        this.page = page;
        this.createPaymentsSubMenuItem = page.locator('[data-submenu-id="organization_team_payments"]');
        this.oneTimeAmount = page.getByRole('link', { name: 'One-time amount' });
        this.selectAllLink = page.getByRole('link', { name: 'Select all' });
        this.amountInput = page.locator('#team_payment_total_amount');
        this.paymentNoteTxtArea = page.locator('#team_payment_note');
        this.createPaymentBtn = page.getByRole('link', { name: 'Create payment' });
        this.submitPaymentBtn = page.locator('input[type="submit"][value="Create payment"]');
        this.notNowBtn = page.locator('#export_payment').getByText('Not now');
        this.paymentTableRows = page.locator('table.has-actions tbody tr:not(.payment_total)');
    }

}