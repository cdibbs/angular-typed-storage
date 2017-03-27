import { SimpleMapperPage } from './app.po';

describe('simple-mapper App', function() {
  let page: SimpleMapperPage;

  beforeEach(() => {
    page = new SimpleMapperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
