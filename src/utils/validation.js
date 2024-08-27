function isEmpty(input) {
  return input === '';
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  return passwordRegex.test(password);
}

function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

export { isEmpty, validateEmail, validatePassword, validatePhoneNumber };
