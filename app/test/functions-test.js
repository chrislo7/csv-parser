const chai = require('chai')
const fs = require('fs')
const assets = require('../functions.js');

const assert = require('chai').assert;
const expect = require('chai').expect;

describe('readInput', () => {
    let results;

    // expected error testing.
    it ('should throw an error if no input file provided', () => {
        expect(() => {
            assets.readInput();
        })
        .to.throw(Error, 'No input file provided');
    });
    it ('should throw an error if input is not .csv', () => {
        expect(() => {
            assets.readInput('input/input-test.xml', (data) => { results = data });
        })
        .to.throw(Error, 'Filetype xml is not supported. Please use a .csv file.');
    });

    assets.readInput('input/input-test.csv', (data) => { results = data });

    it ('should take input from text file', () => {
        assert.exists(results);
    });
    it ('should return an array.', () => {
        expect(results).to.be.an('array');
    });
    it ('should contain an array of objects with the defined keys', () => {
        results.forEach((obj) => {
            expect(obj).to.include.all.keys('employeeId', 'firstName', 'lastName', 'phoneNumber', 'email');
        });
    });
});

describe('transformToJson', () => {
//     [ 'Employee Id,First Name,Last Name,Phone Number,Email',
//   'G123456,Wayner,Gretzly,(123) 111-2222,the-great-1@gmail.com',
//   'H3332221,Jacques,Nicklaus,(222) 343-3434,the-golden-bear@hotmail.com',
//   'T45454545,Rickey,Mantle,(321)332-9132,the-mick@msn.com' ]

    // Expected error handling
    it ('should throw an error if parameter was an empty array', () => {
        expect(() => {
            assets.transformToJson([]);
        })
        .to.throw(Error, 'Input file contains empty data.');
    });
    it ('should throw an error if headers do not match expected results', () => {
        expect(() => {
            assets.transformToJson(['Employee Id, First Name, Last Name, Phone Number, Email, Address']);
        })
        .to.throw(Error,
            'Error with data headers. \n'
            + 'Ensure it matches the following: '
            + 'Employee Id, First Name, Last Name, Phone Number, Email'
        );
    });
});