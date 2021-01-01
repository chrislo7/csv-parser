const assets = require('../validations');

const expect = require('chai').expect;

describe('validateEmployeeId', () => {
    it ('should return true if id starts with a letter and followed by a minimum of 6 digits', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmployeeId('G123456', 1);
        expect(results).to.be.true;
    });
    it ('should return true if id starts with a letter and followed by more than 6 digits', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmployeeId('G123456789', 1);
        expect(results).to.be.true;
    });
    it ('should return false if id does not start with a letter', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmployeeId('123456');
        expect(results).to.be.false;
    });
    it ('should return false if id contains less than 6 digits', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmployeeId('G1234');
        expect(results).to.be.false;
    });
    it ('should return false if id contains more than 1 letter', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmployeeId('ABCD123456', 1);
        expect(results).to.be.false;
    });
    it ('should return false if empty string', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmployeeId('', 1);
        expect(results).to.be.false;
    });
});


describe('validatePhoneNumber', () => {
    it ('should return true if a regular phone number was passed in', () => {
        // passing in placeholder '1' as line index
        let results = assets.validatePhoneNumber('6471234567', 1);
        expect(results).to.be.true;
    });
    it ('should return true if phone number contains brackets', () => {
        // passing in placeholder '1' as line index
        let results = assets.validatePhoneNumber('(647)1234567', 1);
        expect(results).to.be.true;
    });
    it ('should return true if phone number contains country codes', () => {
        // passing in placeholder '1' as line index
        let results = assets.validatePhoneNumber('+16471234567', 1);
        expect(results).to.be.true;
    });
    it ('should return true if phone number contains periods as separators', () => {
        // passing in placeholder '1' as line index
        let results = assets.validatePhoneNumber('647.123.4567', 1);
        expect(results).to.be.true;
    });
    it ('should return true if phone number contains spaces as separators', () => {
        // passing in placeholder '1' as line index
        let results = assets.validatePhoneNumber('647 123 4567', 1);
        expect(results).to.be.true;
    });
    it ('should return true if phone number contains hyphens as separators', () => {
        // passing in placeholder '1' as line index
        let results = assets.validatePhoneNumber('647-123-4567', 1);
        expect(results).to.be.true;
    });
    it ('should return false if phone number contains letters', () => {
        // passing in placeholder '1' as line index
        let results = assets.validatePhoneNumber('647-GGG-4567', 1);
        expect(results).to.be.false;
    });
});

describe('validateEmail', () => {
    it ('should return true if a regular email was passed in', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmail('chris@chris.com', 1);
        expect(results).to.be.true;
    });
    it ('should return true if email contains special characters', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmail('chris.lo@chris.com', 1);
        expect(results).to.be.true;
    });
    it ('should return true if email contains special characters and numbers', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmail('chrislo-777@chris.com', 1);
        expect(results).to.be.true;
    });
    it ('should return true if email contains special characters and numbers', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmail('chrislo-777@chris.com', 1);
        expect(results).to.be.true;
    });
    it ('should return false if email does not contain a username', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmail('@chris.com', 1);
        expect(results).to.be.false;
    });
    it ('should return false if email does not contain a domain', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmail('chris', 1);
        expect(results).to.be.false;
    });
    it ('should return false if email contains an incomplete domain e.g. .com only', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmail('chris@.com', 1);
        expect(results).to.be.false;
    });
    it ('should return false if email contains an incomplete domain e.g. gmail only', () => {
        // passing in placeholder '1' as line index
        let results = assets.validateEmail('chris@gmail', 1);
        expect(results).to.be.false;
    });
});