const assets = require('../modules/functions.js');

const assert = require('chai').assert;
const expect = require('chai').expect;

const Employee = require('../modules/employee.js');

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
            assets.readInput('input/input-test.xml', (data) => results = data);
        })
        .to.throw(Error, 'Filetype xml is not supported. Please use a .csv file.');
    });

    assets.readInput('input/input-test.csv', (data) => {
        results = data;

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
});

describe('transformInput', () => {
    let testArr = [ 'EmployeeID,First Name,Last Name,Phone Number,Email'];

    // Expected error handling
    it ('should throw an error if parameter was an empty array', () => {
        expect(() => {
            assets.transformInput([]);
        })
        .to.throw(Error, 'Input file contains empty data.');
    });
    it ('should throw an error if headers do not match expected results', () => {
        let extraHeaderArray = testArr;
        extraHeaderArray[0] += ',Address';
        expect(() => {
            assets.transformInput(extraHeaderArray);
        })
        .to.throw(Error,
            `Ensure data headers matches: 'EmployeeID,First Name,Last Name,Phone Number,Email'`);
    });

    // add data to testArr
    testArr.push('G123456,Wayner,Gretzly,(123) 111-2222,the-great-1@gmail.com');
    testArr.push('H3332221,Jacques,Nicklaus,(222) 343-3434,the-golden-bear@hotmail.com');
    testArr.push('T45454545,Rickey,Mantle,(321)332-9132,the-mick@msn.com');

    // test results from transformInput
    let employees = assets.transformInput(testArr);
    it ('should return an array', () => {
        expect(employees).to.be.an('array');
    });
    it ('should contain an array of the Employee class', () => {
        employees.forEach((employee) => {
            expect(employee instanceof Employee).to.be.true;
        });
    });
});

describe('validateData', () => {
    let employees = [
        {
            employeeId: 'G123456',
            firstName: 'Chris',
            lastName: 'Lo',
            phoneNumber: '647123456',
            email: 'chris@chris.com'
        },
        {
            employeeId: 'G123456',
            firstName: 'Bobby',
            lastName: 'Jackson',
            phoneNumber: '(647)-111-4444',
            email: 'chris@chris.com'
        }
    ];
    it ('should return all employees if all validations pass', () => {
        let results = assets.validateData(employees);
        expect(results).to.have.lengthOf(2);
    });

    it ('should remove invalid entries', () => {
        let unverifiedEmployees = employees;
        unverifiedEmployees.push(
            {
                // missing a letter before 6 digits
                employeeId: '123456',
                firstName: 'john',
                lastName: 'doe',
                phoneNumber: '1234567890',
                email: 'john@john.com'
            },
            {
                employeeId: 'G223344',
                firstName: 'jane',
                lastName: 'doe',
                phoneNumber: '(123)4567890',
                // missing domain name
                email: 'jane@c'
            },
            {
                employeeId: 'G112233',
                firstName: 'karen',
                lastName: 'joe',
                // phone number contains a letter
                phoneNumber: '613.555.777G',
                email: 'karen@karen.com'
            }
        );
        let results = assets.validateData(unverifiedEmployees);
        expect(results).to.have.lengthOf(2);
    });
});