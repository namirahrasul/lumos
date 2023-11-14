const zxcvbn = require('zxcvbn')
window.onload = function () {
  // Handle pre-filled passwords?
 var password = document.getElementById('newPassword')
   var password = document.getElementById('newPassword')
  var registerButton = document.getElementById('changePasswordButton')
  var pwStrength = document.getElementById('pwStrength')
  var pwAdvice = document.getElementById('pwAdvice')

  // When the value of the password box changes...
  password.addEventListener('input', pwCheck)

  // Function to update password strength and suggestions
  function pwCheck() {
    var result = zxcvbn(password.value, { userInputs: [] })

    // Compute a percentage for the progress bar
    var percent = (result.score / 4) * 100

    // Add a little stub if 0%
    if (percent == 0) {
      percent += 3
    }

    // If the password is unacceptable...
    if (result.score < 2) {
      // Disable the button
      registerButton.setAttribute('disabled', 'disabled')

      // Make the bar red
      pwStrength.classList.remove('bg-success')
      pwStrength.classList.add('bg-danger')

      // Parse suggestions
      var advice = ''
      for (var i = 0; i < result.feedback.suggestions.length; i++) {
        advice += result.feedback.suggestions[i] + '. '
      }

      // Add warnings
      if (result.feedback.warning) {
        advice += result.feedback.warning + '.'
      }

      // Change text on form
      pwAdvice.textContent = advice

      // If the password is acceptable
    } else {
      // Make register button clickable
      registerButton.removeAttribute('disabled')

      // Make bar green
      pwStrength.classList.remove('bg-danger')
      pwStrength.classList.add('bg-success')

      // Clear suggestion text
      pwAdvice.textContent = ''
    }

    // Set bar to the proper length
    pwStrength.style.width = percent + '%'
  }
}
