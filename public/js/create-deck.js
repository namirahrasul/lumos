document.addEventListener('DOMContentLoaded', () => {
 let count = 0;
 const no_categories = subjectsFromServer.length;

 const selectElements = [];
 const inputElements = [];

 function createTextInput(lastCount) {
  const input = document.createElement('input');
  input.classList.add('form-control');
  input.setAttribute('type', 'text');
  input.setAttribute('name', `nametext${lastCount}`);
  input.setAttribute('id', `nametext${lastCount}`);
  return input;
 }

 function createCategoryDropdown(count) {
  const dropdown = document.createElement('select');
  dropdown.classList.add('form-control');
  dropdown.setAttribute('name', `select${count}`);
  dropdown.setAttribute('id', `select${count}`);

  for (let elem = 0; elem < no_categories; elem++) {
   const option = document.createElement('option');
   option.setAttribute('value', subjectsFromServer[elem].name);
   option.textContent = subjectsFromServer[elem].name;
   dropdown.appendChild(option);
  }

  const option = document.createElement('option');
  option.setAttribute('value', 'other');
  option.textContent = 'Other';
  dropdown.appendChild(option);

  return dropdown;
 }

 function addNewInput(lastCount) {
  const input = createTextInput(lastCount);
  inputElements.push(input);
  const lastCategory = document.querySelector(`.category${lastCount}`);
  lastCategory.appendChild(input);
 }

 function addNewCategory() {
  count++;
  const deckForm = document.getElementById('deck-form');
  const div = document.createElement('div');
  div.classList.add('form-group');
  div.classList.add(`category${count}`);
  const label = document.createElement('label');
  label.setAttribute('for', `category${count}`);
  label.textContent = 'Category ' + count;
  div.appendChild(label);

  const dropdown = createCategoryDropdown(count);
  selectElements.push(dropdown);
  div.appendChild(dropdown);

  deckForm.appendChild(div);
 }

 const addCategoryButton = document.getElementById('add-category');
 addCategoryButton.addEventListener('click', function () {
  addNewCategory();
 });

 document.addEventListener('change', (event) => {
  const selectedSelect = event.target;
  if (selectedSelect.value === 'other') {
   const index = selectElements.indexOf(selectedSelect);
   if (index !== -1) {
    addNewInput(index + 1);
   }
  }
 });

 async function createDeck() {

  console.log("inside createDeck")

  const form = document.getElementById('deck-form')
  const formData = new URLSearchParams(new FormData(form));
  console.log("data: ", formData);

  for (let entry of formData.entries()) {
   console.log(entry);
  }

  try {
   const res = await fetch('/deck/new', {
    method: 'POST',
    body: formData,
    headers: {
     'Content-Type': 'application/x-www-form-urlencoded', // or 'multipart/form-data' depending on your needs
    },
   });
   console.log('Request Headers:', res.headers);
   if (res.ok) {
    console.log("res.ok");
    createDeckModalBody.textContent = 'Deck was created successfully';
    createDeckModalFooter.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="closeCreateDeck">Close</button>';
    const closeCreateDeck = document.getElementById('closeCreateDeck');
    $('#createDeckModal').modal('show');
    closeCreateDeck.addEventListener('click', () => {
     location.reload();
    });
   } else if (res.status === 500) {

    createDeckModalBody.textContent = 'Error: Deck was not created successfully';
    createDeckModalFooter.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="closeCreateDeck">Close</button>';
    const closeCreateDeck = document.getElementById('closeCreateDeck');
    $('#createDeckModal').modal('show');
    closeCreateDeck.addEventListener('click', () => {
     location.reload();
    });

   }


  } catch (err) {
   console.log(err.message);
  }
 }

 const form = document.getElementById('deck-form')
 form.addEventListener('submit', (event) => {
  console.log("form submit")
  event.preventDefault();
  createDeck();
 });

 // Function to handle remove button click
 function removeFileInput(inputId) {
  const fileInput = document.getElementById(inputId);
  fileInput.value = ''; // Clear the file input
 }


 // Add event listeners for remove buttons
 const removeFrontImgBtn = document.getElementById('removeFrontImg');
 const removeBackImgBtn = document.getElementById('removeBackImg');

 if (removeFrontImgBtn && removeBackImgBtn) {
  removeFrontImgBtn.addEventListener('click', () => {
   console.log('Remove Front Image Clicked');
   removeFileInput('front_img');
  });

  removeBackImgBtn.addEventListener('click', () => {
   console.log('Remove Back Image Clicked');
   removeFileInput('back_img');
  });
 }

});
