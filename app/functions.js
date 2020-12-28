const fs = require('fs');
const parse = require('csv-parse');

// helper function to transform array of strings into json structure.
const transformToJson = (rows) => {
    // first element of this array will always be headers, e.g. employee id, first name ...etc.
    rows.shift();
    let transformedRows = rows.map((row) => {
        let column = row.split(',');
        let data = {
            employeeId: column[0],
            firstName: column[1],
            lastName: column[2],
            phoneNumber: column[3],
            email: column[4]
        }

        return data;
    });

    return transformedRows;
}

// read data from CSV file
const readInput = (filepath, callback) => {
    var csvData = [];
    fs.createReadStream(filepath)
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        csvData.push(csvrow[0]);   
    })
    .on('end',function() {
        let data = transformToJson(csvData);
        callback(data);
    });
};





module.exports = {
  readInput: readInput
};