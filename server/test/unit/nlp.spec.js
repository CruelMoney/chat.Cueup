import 'dotenv/config';
import { expect } from 'chai';
import * as nlp from '../../services/nlp';

describe('NLP', () => {
  describe('Phone number', () => {
    it('Detects number', () => {
      const SUT = 'Hey ho heres my number 24658061.';
      const found = nlp.containsNumber(SUT);
      expect(found).to.be.true;
    });
    it('No false positive', () => {
      const SUT = 'Hey ho heres blabla do you want me to pay asd 4000usd.';
      const found = nlp.containsNumber(SUT);
      expect(found).to.be.false;
    });
    it('Replaces number', () => {
      const SUT = 'Hey ho heres my number 24658061.';
      const fixed = nlp.replaceNumbers(SUT);
      const exp = 'Hey ho heres my number {{number hidden}}.';
      expect(fixed).to.equal(exp);
    });
    it('Replaces indonesian number', () => {
      const SUT = 'Hey ho heres my WA +62 813 53857201‬.';
      const fixed = nlp.replaceNumbers(SUT);
      const exp = 'Hey ho heres my WA {{number hidden}}‬.';
      expect(fixed).to.equal(exp);
    });

    it('Replaces naughty number', () => {
      const SUT =
        'Hey ho heres my WA Plus seven, nine six three, five six eight, five two, five five.';
      const fixed = nlp.replaceNumbers(SUT);
      const exp = 'Hey ho heres my WA Plus {{number hidden}}';
      expect(fixed).to.equal(exp);
    });
    it('Replaces naughty number 2', () => {
      const SUT =
        'Hey ho heres my WA Plus seven Nine six    three Five six eight five two five five';
      const fixed = nlp.replaceNumbers(SUT);
      const exp = 'Hey ho heres my WA Plus {{number hidden}}';
      expect(fixed).to.equal(exp);
    });

    it('Replaces naughty number 3', () => {
      const SUT =
        'I have sent you a message on what’s app just in case my number is plus four four, seven four, six three five, six eight nine , eight six ';
      const fixed = nlp.replaceNumbers(SUT);
      const exp =
        'I have sent you a message on what’s app just in case my number is plus {{number hidden}}';
      expect(fixed).to.equal(exp);
    });
  });

  describe('Email', () => {
    it('Detects email', () => {
      const SUT = 'Hey ho heres my email chrdengso@gmail.com.';
      const found = nlp.containsEmail(SUT);
      expect(found).to.be.true;
    });

    it('Detects naughty emails', () => {
      const SUT = 'Hey ho heres my email chrdengso[at]gmail.com. asdasda';
      const found = nlp.containsEmail(SUT);
      expect(found).to.be.true;
      const SUT2 = 'Hey ho heres my email chrdengso(AT)gmail.com. asdasda';
      const found2 = nlp.containsEmail(SUT2);
      expect(found2).to.be.true;
      const SUT3 = 'Hey ho heres my email chrdengso @ evi.com. asdasda';
      const found3 = nlp.containsEmail(SUT3);
      expect(found3).to.be.true;
      const SUT4 = 'Hey ho heres my email chrdengso @ hotmail.com. asdasda';
      const found4 = nlp.containsEmail(SUT4);
      expect(found4).to.be.true;
    });
    it('No false positive', () => {
      const SUT = 'Hey ho heres blabla do you want me to pay asd 4000usd.';
      const found = nlp.containsEmail(SUT);
      expect(found).to.be.false;
    });
    it('Replaces email', () => {
      const SUT = 'Hey ho heres my email chrdengso@gmail.com.';
      const fixed = nlp.replaceEmails(SUT);
      const exp = 'Hey ho heres my email {{email hidden}}.';
      expect(fixed).to.equal(exp);
    });
  });

  describe('URL', () => {
    it('Detects url', () => {
      const SUT = 'Hey ho heres my website http://www.cude.io';
      const found = nlp.containsURL(SUT);
      expect(found).to.be.true;
    });
    it('No false positive', () => {
      const SUT = 'Hey ho heres my website chrdengso@gmail.com.';
      const found = nlp.containsURL(SUT);
      expect(found).to.be.false;
    });
    it('Replaces URL', () => {
      const SUT = 'Hey ho heres my website www.cude.io. jhbjhb';
      const fixed = nlp.replaceURLs(SUT);
      const exp = 'Hey ho heres my website {{URL hidden}}. jhbjhb';
      expect(fixed).to.equal(exp);
    });
  });

  // it('Replaces everything', () => {
  //   const SUT =
  //     'Hey ho heres my website www.cude.io. And my email is chrdengso@gmail.com. my number is 81 23 12 32.';
  //   const fixed = nlp.replaceAll(SUT);
  //   const exp =
  //     'Hey ho heres my website {{URL hidden}}. And my email is {{email hidden}} number is {{number hidden}}.';
  //   expect(fixed).to.equal(exp);
  // });
});
