import { GuyhoquetPage } from './app.po';

describe('guyhoquet App', function() {
  let page: GuyhoquetPage;

  beforeEach(() => {
    page = new GuyhoquetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
