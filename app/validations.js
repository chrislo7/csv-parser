// helper function to validate employee IDs
const validateEmployeeId = (id, index) => {
    // Valid Employee IDs start with a letter and have a minimum of 6 digits after that.
    // this regex is self created. note that the first letter ignores cases.
    var regex = /^[a-z]{1,1}(?:\d.*){6,}$/i;
    if (!regex.test(id)) {
        console.error(`Removed invalid entry on Line ${index + 2}. Reason: Invalid Employee ID`);
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
        console.error(`Removed invalid entry on Line ${index + 2}. Reason: Invalid Phone Number`);
        return false;
    }

    return true;
};

// helper function to validate emails
const validateEmail = (email, index) => {
    // Valid emails are in the form: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regex.test(email)) {
        console.error(`Removed invalid entry on Line ${index + 2}. Reason: Invalid Email`);
        return false;
    }

    return true;
};

module.exports = {
    validateEmployeeId: validateEmployeeId,
    validatePhoneNumber: validatePhoneNumber,
    validateEmail: validateEmail
};