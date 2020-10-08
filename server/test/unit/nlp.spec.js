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
      const exp = 'Hey ho heres my number {{number hidden}}';
      expect(fixed).to.equal(exp);
    });
    it('Replaces indonesian number', () => {
      const SUT = 'Hey ho heres my WA +62 813 53857201‬.';
      const fixed = nlp.replaceNumbers(SUT);
      const exp = 'Hey ho heres my WA {{number hidden}}';
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

    it('Finds naughty number 4', () => {
      const SUT = '5.5.4.6.3.8.7.6.4.';
      const found = nlp.containsNumber(SUT);
      expect(found).to.be.true;
    });

    it('Catches numbers only', () => {
      const SUT = ' 1 ';
      const found = nlp.containsNumber(SUT);
      expect(found).to.be.true;

      const SUT2 = ' 1 big speaker';
      const found2 = nlp.containsNumber(SUT2);
      expect(found2).to.be.false;
    });

    it('Catches numbers as text only', () => {
      const SUT = 'one';
      const found = nlp.containsNumber(SUT);
      expect(found).to.be.true;
      const SUT2 = 'two';
      const found2 = nlp.containsNumber(SUT2);
      expect(found2).to.be.true;
    });
  });

  describe('Email', () => {
    it('Detects email', () => {
      const SUT = 'Hey ho heres my email chrdengso@gmail.com.';
      const found = nlp.containsEmail(SUT);
      expect(found).to.be.true;
    });

    it('Detects naughty strings', () => {
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
      const SUT5 = 'DJ_oncue @ yahoo';
      const found5 = nlp.containsEmail(SUT5);
      expect(found5).to.be.true;
      const SUT6 = '@';
      const found6 = nlp.containsEmail(SUT6);
      expect(found6).to.be.true;
      const SUT7 = 'yaho';
      const found7 = nlp.containsEmail(SUT7);
      expect(found7).to.be.true;
      const SUT8 = 'g mail';
      const found8 = nlp.containsEmail(SUT8);
      expect(found8).to.be.true;
      const SUT9 = 'gmail';
      const found9 = nlp.containsEmail(SUT9);
      expect(found9).to.be.true;
      const SUT10 = 'icloud';
      const found10 = nlp.containsEmail(SUT10);
      expect(found10).to.be.true;
      const SUT11 = 'outlook';
      const found11 = nlp.containsEmail(SUT11);
      expect(found11).to.be.true;
      const SUT12 = 'hotmail';
      const found12 = nlp.containsEmail(SUT12);
      expect(found12).to.be.true;
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
    it('Detects url 2', () => {
      const SUT = 'Hey ho heres my we https://www.cude.io Hey ho heres my we';
      const found = nlp.containsURL(SUT);
      console.log({ found });
      expect(found).to.be.true;
    });
    it('Detects url 3', () => {
      const SUT = 'Hey ho heres my we www.cude.io Hey ho heres my we';
      const found = nlp.containsURL(SUT);
      expect(found).to.be.true;
    });
    it('Detects url 4', () => {
      const SUT = 'Hey ho heres my we https://cude.io Hey ho heres my we';
      const found = nlp.containsURL(SUT);
      expect(found).to.be.true;
    });
    it('Detects url 5', () => {
      const SUT = 'Hey ho heres my we http://cude.io Hey ho heres my we';
      const found = nlp.containsURL(SUT);
      expect(found).to.be.true;
    });
    it('It matches email', () => {
      const SUT = 'Hey ho heres my website chrdengso@gmail.com.';
      const found = nlp.containsURL(SUT);
      expect(found).to.be.true;
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
