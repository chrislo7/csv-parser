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

// helper function to validate employee IDs
const validateEmployeeId = (id, index) => {
    // Valid Employee IDs start with a letter and have a minimum of 6 digits after that.
    // this regex is self created. note that the first letter ignores cases.
    var regex = /[a-z](?:\d.*){6,}/i;
    if (!regex.test(id)) {
        console.error(`Removed invalid entry on Line ${index + 1}. Reason: Invalid Employee ID`);
        return false;
    }

    return true;
};

// helper function to validate phone numbers
const validatePhoneNumber = (phoneNumber, index) => {
    // Valid Phone numbers are in the form: ^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$

    // self-note: the provided regex does not check for min/max length
    // e.g. having (647)1 as a phone number will pass.
    // however, as this regex was provided as a requirement, no modification will be made to it.
    var regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (!regex.test(phoneNumber)) {
        console.error(`Removed invalid entry on Line ${index + 1}. Reason: Invalid Phone Number`);
        return false;
    }

    return true;
};

// helper function to validate emails
const validateEmail = (email, index) => {
    // Valid emails are in the form: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regex.test(email)) {
        console.error(`Removed invalid entry on Line ${index + 1}. Reason: Invalid Email`);
        return false;
    }

    return true;
};



// validate values
const validateData = (employees) => {
    let validEmployees = employees.filter((employee, index) => {

        // gather results of helper fns to a boolean array.
        // each helper function will print an error statement if it contains an invalid entry.
        let validations = [
            validateEmployeeId(employee.employeeId, index),
            validatePhoneNumber(employee.phoneNumber, index),
            validateEmail(employee.email, index)
        ];

        // only return employee if all validations pass
        if ((validations.every((validation) => validation))) {
            return employee;
        }
    });

    // cleaned array with validated data.
    return validEmployees;
};

module.exports = {
    transformToJson: transformToJson,
    readInput: readInput,
    validateData: validateData
};