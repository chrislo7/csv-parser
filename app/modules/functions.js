const fs = require('fs');
const parse = require('csv-parse');
const dotenv = require('dotenv');
const mysql = require('mysql');
const moment = require('moment');

const Employee = require('./employee.js');
const ValidationService = require('./validations.js');

// helper function to transform array of strings into json structure.
const transformInput = (rows) => {
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
};

// helper to transform array of objects into csv format.
const transformOutput = (rows) => {
    // first row of csv data should contain the new headers.
    let header = 'EmployeeID, Fname, Lname, Phone, Date Created, Date Updated';

    // error handling.
    if (!rows.length) {
        throw new Error('Database contains no data.');
    }

    transformedData = rows.map((row) => {
        // better formatting for time
        let createdAt = moment(row.created_at).subtract(5, 'hours').format('YYYY-DD-MM hh:mm:ss A');
        let updatedAt = moment(row.updated_at).subtract(5, 'hours').format('YYYY-DD-MM hh:mm:ss A');

        let employee = `${row.employee_id}, ${row.first_name}, ${row.last_name}, ${row.phone_number}, ${createdAt}, ${updatedAt}`;
        return employee;
    });

    // add header text and joins strings by \n for each element.
    transformedData.unshift(header);
    return transformedData.join('\n');
};

const createDatabaseConnection = () => {
    // create database connection here.
    dotenv.config();
    const connection = mysql.createConnection({
        host: 'localhost',
        port: process.env.PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    return connection;
};

// helper function to write to SQL
const writeToDatabase = (data) => {
    return new Promise((resolve) => {

        console.log("Establishing connection with mysql database...");
        const connection = createDatabaseConnection();
        connection.connect((err) => {
            if (err) throw err;

            console.log("Connected!");
            console.log('Writing to database...');

            let sql = `INSERT INTO employee (employee_id, first_name, last_name, phone_number, email, created_at, updated_at) VALUES `;

            data.forEach((employee, index) => {
                sql += `('${employee.employeeId}', '${employee.firstName}', '${employee.lastName}', '${employee.phoneNumber}', '${employee.email}', null, null)`;

                // only insert commas if not the last employee in the list.
                if (index != data.length - 1) {
                    sql += ', ';
                }
            });
            // on duplicate of employee id, update the provided values instead.
            // in addition, do not modify the created_at column.
            sql += ` ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), last_name = VALUES(last_name), phone_number = VALUES(phone_number), email = VALUES(email), updated_at = null`;

            connection.query(sql, (err, result) => {
                if (err) throw err;
                console.log(`Success! ${data.length} record(s) affected.`);
                connection.end();
                resolve();
            });
        });
    });
};

// helper function to read from SQL
const readFromDatabase = () => {
    return new Promise((resolve, reject) => {

        console.log("Re-establishing connection with mysql database...");
        const connection = createDatabaseConnection();
        connection.connect((err) => {
            if (err) reject(err);
    
            console.log("Connected!");
            console.log('Reading from database...');

            let sql = `SELECT employee_id, first_name, last_name, phone_number, created_at, updated_at FROM employee`;

            connection.query(sql, (err, result) => {
                if (err) reject(err);

                console.log(`Success! ${result.length} record(s).`);
                connection.end();

                resolve(result);
            });

        });
    });
};

// helper function to write to an output path;
const writeFile = (filepath) => {
    // Headers as followed:
    readFromDatabase().then((res) => {
        let transformedData = transformOutput(res);

        fs.writeFile(filepath, transformedData, 'utf8', (err) => {
            if (err) throw err;
            console.log(`CSV file created at ${filepath}`);
        });
    });
};

// read data from CSV file
const readInput = (filepath) => {
    console.log('Reading input data...');

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
        .on('end', () => resolve(transformInput(csvData)));
    });
};

// write data to CSV file and database.
const writeOutput = async (data, filepath) => {
    await writeToDatabase(data).then(() => {
        if (filepath) {
            console.log('Output path detected. Writing to CSV file...');
            writeFile(filepath);
        }
    });
};

// validate values
const validateData = (employees) => {
    console.log('Validating data...');

    let validEmployees = employees.filter((employee, index) => {

        // gather results of helper fns to a boolean array.
        // each helper function will print an error statement if it contains an invalid entry.
        let validations = [
            ValidationService.validateEmployeeId(employee.employeeId, index),
            ValidationService.validatePhoneNumber(employee.phoneNumber, index),
            ValidationService.validateEmail(employee.email, index)
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
    transformInput: transformInput,
    readInput: readInput,
    writeOutput: writeOutput,
    validateData: validateData
};