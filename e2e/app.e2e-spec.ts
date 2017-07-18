import { Angular2fbPage } from './app.po';

describe('angular2fb App', () => {
  let page: Angular2fbPage;

  beforeEach(() => {
    page = new Angular2fbPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
