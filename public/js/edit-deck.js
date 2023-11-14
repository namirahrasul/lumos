
document.addEventListener('DOMContentLoaded', () => {
  const flipButtons = document.querySelectorAll('.flip-button');
  const editButtons = document.querySelectorAll('.edit-button');
  const deleteButtons = document.querySelectorAll('.delete-button');
  const createButton = document.getElementById('create-btn');
  const confirmCreateButton = document.getElementById('confirmCreate')
  const createFlashcardModalBody = document.getElementById('newFlashcardModalBody');
  const createFlashcardModalFooter = document.getElementById('newFlashcardModalFooter');
  const editFlashcardModalBody = document.getElementById('editFlashcardModalBody');
  const editFlashcardModalFooter = document.getElementById('editFlashcardModalFooter');
  const confirmDeleteButton = document.getElementById('confirmDelete');
  const deleteFlashcardModalBody = document.getElementById('flashcardDeleteModalBody');
  const deleteFlashcardModalFooter = document.getElementById('flashcardDeleteModalFooter');
  const editFlashcardModal = new bootstrap.Modal(document.getElementById('editFlashcardModal'));

  // Listen for the show.bs.modal event
  editFlashcardModal._element.addEventListener('show.bs.modal', function (event) {
    // Extract the flashcard information from the clicked button
    const button = event.relatedTarget;
    const flashcardId = button.getAttribute('data-flashcard-id');
    const flashcardContainer = document.getElementById(`flashcard-container-${flashcardId}`);
    const front = flashcardContainer.querySelector('.flashcard-front p').textContent.trim();
    const back = flashcardContainer.querySelector('.flashcard-back p').textContent.trim();

    // Set the extracted information as placeholder text
    const editForm = document.getElementById('edit-flashcard-form');
    editForm.querySelector('#front').setAttribute('placeholder', front);
    editForm.querySelector('#back').setAttribute('placeholder', back);

    // Add the flashcard ID as a data attribute to the submit button
    const confirmEditButton = editForm.querySelector('#confirmEdit');
    confirmEditButton.setAttribute('data-flashcard-id', flashcardId);
  });


  function flipFlashcard(button) {
    const flashcardContainer = button.closest(".flashcard");
    const front = flashcardContainer.querySelector(".flashcard-front");
    const back = flashcardContainer.querySelector(".flashcard-back");

    if (front.style.display === "none") {
      front.style.display = "inline"; // Show the front
      back.style.display = "none"; // Hide the back
    } else {
      front.style.display = "none"; // Hide the front
      back.style.display = "inline"; // Show the back
    }
  }
  console.log("before create flashcard modal");


  function newFlashcard() {
    const form = document.getElementById('create-flashcard-form');

    form.addEventListener('submit', async event => {
      event.preventDefault();

      const data = new FormData(form);
      const formDataForFetch = new FormData();

      // Iterate over form elements
      for (const [key, value] of data.entries()) {
        // Check if the value is a File object
        if (value instanceof File) {
          formDataForFetch.append(key, value, value.name);
        } else {
          // For non-File elements, append to FormData for fetch request
          formDataForFetch.append(key, value);
        }
      }

      try {
        const res = await fetch('/flashcard/new', {
          method: 'POST',
          body: formDataForFetch,
        });

        if (res.ok) {
          console.log("res.ok");
          createFlashcardModalBody.textContent = 'Flashcard was created successfully';
          createFlashcardModalFooter.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="closeCreateFlashcard">Close</button>';
          const closeCreateFlashcard = document.getElementById('closeCreateFlashcard');
          closeCreateFlashcard.addEventListener('click', () => {
            location.reload();
          });
        } else if (res.status === 500) {
          createFlashcardModalBody.textContent = 'Error: Flashcard was not created successfully';
          createFlashcardModalFooter.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="closeCreateFlashcard">Close</button>';
          const closeCreateFlashcard = document.getElementById('closeCreateFlashcard');
          closeCreateFlashcard.addEventListener('click', () => {
            location.reload();
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  }

  confirmCreateButton.addEventListener('click', () => {
    newFlashcard();
  })



  flipButtons.forEach(button => {
    button.addEventListener('click', () => {
      flipFlashcard(button);
    });
  });


  function editFlashcard(flashcardId) {
    const form = document.getElementById('edit-flashcard-form');
    
    form.addEventListener('submit', async event => {
      event.preventDefault();
      
      const data = new FormData(form);
      const formDataForFetch = new FormData();

      // Iterate over form elements
      for (const [key, value] of data.entries()) {
        // Check if the value is a File object
        if (value instanceof File) {
          formDataForFetch.append(key, value, value.name);
        } else {
          // For non-File elements, append to FormData for fetch request
          formDataForFetch.append(key, value);
        }
      }

      try {
        const res = await fetch('/flashcard/edit/' + flashcardId, {
          method: 'POST',
          body: formDataForFetch,
        });

        if (res.ok) {
          console.log("res.ok");
          editFlashcardModalBody.textContent = 'Flashcard was edited successfully';
          editFlashcardModalFooter.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="closeEditFlashcard">Close</button>';
          const closeEditFlashcard = document.getElementById('closeEditFlashcard');
          closeEditFlashcard.addEventListener('click', () => {
            location.reload();
          });
        } else if (res.status === 500) {
          editFlashcardModalBody.textContent = 'Error: Flashcard was not edited successfully';
          editFlashcardModalFooter.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="closeEditFlashcard">Close</button>';
          const closeEditFlashcard = document.getElementById('closeEditFlashcard');
          closeEditFlashcard.addEventListener('click', () => {
            location.reload();
          });

        }


      } catch (err) {
        console.log(err.message);
      }
    });
  }

  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log("edit button")
      $('#editFlashcardModal').modal('show');
      flashcardId = button.getAttribute('data-flashcard-id');
      console.log("flashcardId ", flashcardId);
      editFlashcard(flashcardId);
    });
  });

  async function deleteFlashcard(flashcardId) {
  

    
      let urlParams = '/flashcard/delete/' + flashcardId;

      try {
        const res = await fetch(urlParams, {
          method: 'POST',
        });

        if (res.ok) {
          console.log("res.ok");
          deleteFlashcardModalBody.textContent = 'Flashcard was deleted successfully';
          deleteFlashcardModalFooter.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="closeDeleteFlashcard">Close</button>';
          const closeEditFlashcard = document.getElementById('closeDeleteFlashcard');
          closeEditFlashcard.addEventListener('click', () => {
            location.reload();
          });
        } else if (res.status === 500) {
          editFlashcardModalBody.textContent = 'Error: Flashcard was not edited successfully';
          editFlashcardModalFooter.innerHTML = '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="closeDeleteFlashcard">Close</button>';
          const closeEditFlashcard = document.getElementById('closeDeleteFlashcard');
          closeEditFlashcard.addEventListener('click', () => {
            location.reload();
          });

        }


      } catch (err) {
        console.log(err.message);
      }
    }

  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log("edit button")
      $('#deleteFlashcardModal').modal('show');
      flashcardId = button.getAttribute('data-flashcard-id');
      console.log("flashcardId ", flashcardId);
      confirmDelete.addEventListener('click', () => {
        deleteFlashcard(flashcardId);
      })
    });
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