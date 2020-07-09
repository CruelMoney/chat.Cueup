import 'dotenv/config';
import { expect } from 'chai';
import { enrichMessage } from '../../services/metadataScraper';

describe('Metadata', () => {
  it('Works', async () => {
    const message = { content: 'bal bla bla https://google.com blablabla' };
    await enrichMessage(message);
    expect(message.metadata.url).to.be.equal('https://www.google.com/');
  });
});
