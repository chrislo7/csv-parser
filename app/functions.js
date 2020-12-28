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
        `Ensure data headers matches: 'EmployeeID, First Name, Last Name, Phone Number, Email'`);
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
const readInput = (filepath, callback) => {
    // Error handling.
    if (!filepath) {
        throw new Error('No input file provided.');
    } else if (filepath.slice(-3) != 'csv') {
        throw new Error(`Filetype ${filepath.slice(-3)} is not supported. Please use a .csv file.`);
    }

    var csvData = [];
    fs.createReadStream(filepath)
    .pipe(parse({ delimiter: ':' }))
    .on('data', (csvrow) => { csvData.push(csvrow[0]) })
    .on('end', () => {
        let data = transformToJson(csvData);
        callback(data);
    });
};

// // validate values
// const validateValues = (values) => {

// };




module.exports = {
  readInput: readInput,
  transformToJson: transformToJson
};