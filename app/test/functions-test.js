const chai = require('chai')
const fs = require('fs')
const assets = require('../functions.js');

const assert = require('chai').assert;
const expect = require('chai').expect;

describe('readInput', () => {
    let results;
    assets.readInput('input/input-test.csv', (data) => {
        results = data;
    });

    it ('should take input from text file', () => {
        assert.exists(results);
    });
    it ('should return an array.', () => {
        expect(results).to.be.an('array');
    });
    it ('should contain an array of objects', () => {
        results.forEach((obj) => {
            expect(obj).to.include.all.keys('employeeId', 'firstName', 'lastName', 'phoneNumber', 'email');
        });
    });
});