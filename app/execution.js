const fn = require('./functions.js');

const paths = process.argv.slice(2);
let input = paths[0];
let output;

if (paths.length > 1) {
    output = paths[1];
}

let inputData = fn.readInput(input).then((res) => {
    let validatedData = fn.validateData(res);
    return validatedData;
});
setTimeout(() => {
    console.log(inputData);
}, 10);