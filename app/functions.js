const fs = require('fs');
const parse = require('csv-parse');

const Employee = require('./employee.js');

// helper function to transform array of strings into json structure.
const transformToJson = (rows) => {
    let expectedHeaders = 'EmployeeID,First Name,Last Name,Phone Number,Email';
    // error handling.
    if (!rows.length) {
        throw new Error('Input file contains empty data.');
    } else if (rows[0] != expectedHeaders) {
        throw new Error(
        `Ensure data headers matches: 'EmployeeID,First Name,Last Name,Phone Number,Email'`);
    }

    // first element of this array will always be headers, e.g. employee id, first name ...etc.
    rows.shift();
    let transformedRows = rows.map((row) => {
        let columns = row.split(',');
        return new Employee(...columns);
    });

    return transformedRows;
}

// read data from CSV file
const readInput = (filepath) => {
    // Error handling.
    if (!filepath) {
        throw new Error('No input file provided.');
    } else if (filepath.slice(-3) != 'csv') {
        throw new Error(`Filetype ${filepath.slice(-3)} is not supported. Please use a .csv file.`);
    }

    let csvData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filepath)
        .pipe(parse({ delimiter: ':' }))
        .on('error', (error) => reject(error))
        .on('data', (csvRow) => csvData.push(csvRow[0]))
        .on('end', () => resolve(transformToJson(csvData)));
    });
};

// helper function to validate phone numbers
const validatePhoneNumber = (phoneNumber) => {
    console.log('test');
};

// helper function to validate emails
const validateEmail = (email) => {
    console.log('test');
};

// helper function to validate employee IDs
const validateEmployeeId = (id) => {
    console.log('test');
};

// validate values
const validateData = (arr) => {
    // Valid Phone numbers are in the form: ^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$
    // Valid emails are in the form: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
    // Valid Employee IDs start with a letter and have a minimum of 6 digits after that.
    // Print the line number and reason for each invalid entry.
    console.log(arr);
};

module.exports = {
    transformToJson: transformToJson,
    readInput: readInput,
    validateData: validateData
};