const handleErrors = (err) => {
 console.log("Entering handleErrors function");
 console.log("err", err);

 let errors = { email: '', password: '', name: '' };

 // Check if the error is due to user validation failure
 if (err.message.includes('user validation failed')) {
  Object.values(err.errors).forEach(({ properties }) => {
   // Check specific error messages and set corresponding fields
   if (properties.path === 'email') {
    errors.email = properties.message;
   } else if (properties.path === 'password') {
    errors.password = properties.message;
   } else if (properties.path === 'name') {
    errors.name = properties.message;
   }
  });
 }

 // Check if the error is due to a unique constraint violation
 if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
  errors.name = 'Name must be unique.';
 }

 return errors;
};

module.exports = handleErrors;