import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should be able to add and remove an item', async () => {
    // Init
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    // Search author
    const input = await $('input[type="search"]');
    await input.sendKeys('Haruki Murakami');
    await browser.wait(ExpectedConditions.presenceOf($('.book--title')), 1000);

    // Add first available book to reading list
    const addToListButton = $$('[data-testing="book-item"] button').filter(
      async (item) => {
        return (await item.getAttribute('disabled')) !== 'true';
      }
    );
    await addToListButton.first().click();

    // Open reading list
    await $('[data-testing="toggle-reading-list"]').click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );

    // Count how many books are in list
    const readingListLength = await $$('.mat-warn').count();

    // Remove most recent item
    const removalButton = await $$('.mat-warn').last();
    const titleToRemove = await $$('.reading-list-item--details--title')
      .last()
      .getText();

    await removalButton.click();

    // Count remaining items in list
    const remainingTitles = await $$(
      '.reading-list-item--details--title'
    ).filter(async (item) => {
      const title = await item.getText();
      return title === titleToRemove;
    });
    expect(await $$('.mat-warn').count()).toEqual(readingListLength - 1);
    expect(remainingTitles).toEqual([]);
  });

  it('Then: I should be able to "undo" add to list via snackbar', async () => {
    // Init Page
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    // Search Author
    const input = await $('input[type="search"]');
    await input.sendKeys('Clive Barker');
    await browser.wait(ExpectedConditions.presenceOf($('.book--title')), 1000);

    // Add first available book to reading list and keep track of the title
    const addToListButton = $$('[data-testing="book-item"]')
      .filter(async (item) => {
        return (await item.$('button').getAttribute('disabled')) !== 'true';
      })
      .first();
    const testingTitle = await addToListButton.$('.book--title').getText();
    await addToListButton.$('button').click();

    // Click 'Undo' snack bar message
    // Because Snackbar is displayed outside of angular root,
    // we need work around protractor not having access to it.
    // https://github.com/scttcper/ngx-toastr/issues/109
    browser.waitForAngularEnabled(false);
    const undoButton = $('.mat-simple-snackbar-action');
    await undoButton.click();

    // Open the Reading list and ensure the title in question is not present
    await $('[data-testing="toggle-reading-list"]').click();
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    const remainingTitles = await $$(
      '.reading-list-item--details--title'
    ).filter(async (item) => {
      const title = await item.getText();
      return title === testingTitle;
    });
    expect(remainingTitles).toEqual([]);
  });

  it('Then: I should be able undo removing an item from list', async () => {
    // Init Page
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    // Search Author
    const input = await $('input[type="search"]');
    await input.sendKeys('Dan Simmons');
    await browser.wait(ExpectedConditions.presenceOf($('.book--title')), 1000);

    // Add first available book to reading list and keep track of the title
    const addToListButton = $$('[data-testing="book-item"]')
      .filter(async (item) => {
        return (await item.$('button').getAttribute('disabled')) !== 'true';
      })
      .first();
    const testingTitle = await addToListButton.$('.book--title').getText();
    await addToListButton.$('button').click();

    // Open reading list
    await $('[data-testing="toggle-reading-list"]').click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );

    // Remove most recent item
    const removalButton = await $$('.mat-warn').last();
    const titleToRemove = await $$('.reading-list-item--details--title')
      .last()
      .getText();

    await removalButton.click();

    // Click 'Undo' snack bar message
    // Because Snackbar is displayed outside of angular root,
    // we need work around protractor not having access to it.
    // https://github.com/scttcper/ngx-toastr/issues/109
    browser.waitForAngularEnabled(false);
    const undoButton = $('.mat-simple-snackbar-action');
    await undoButton.click();

    const remainingTitles = await $$(
      '.reading-list-item--details--title'
    ).filter(async (item) => {
      const title = await item.getText();
      return title === testingTitle;
    });

    // Ensure title is still in reading list
    expect(testingTitle).toEqual(titleToRemove);
    expect(await remainingTitles[0].getText()).toEqual(testingTitle);
  });
});
