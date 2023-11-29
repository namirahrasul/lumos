document.addEventListener('DOMContentLoaded', () => {
 console.log('DOMContentLoaded function executed');
 // Parse the JSON data
 const flashcards = window.flashcardsJSON;

 // const deckName = flashcards[0].deck_name;
 const ratingBtnContainer = document.querySelector('.rating-btn-container');

 // Set the deck name in the placeholder element
 // document.getElementById('deckName').innerHTML = deckName;

 const flashcardFront = document.getElementById('flashcardFront');
 const flashcardBack = document.getElementById('flashcardBack');
 const flashcardFrontText = document.getElementById('flashcardFrontText');
 const flashcardBackText = document.getElementById('flashcardBackText');
 const flashcardId = document.getElementById('flashcardId');
 const flashcardFrontImage = document.getElementById('frontImg');
 const flashcardBackImage = document.getElementById('backImg');
 let isFront = true; // Flag to track front/back of the flashcard
 let currentFlashcardIndex = 0; // Initialize the current flashcard index

 function updateFlashcard() {
  flashcardFrontText.textContent = flashcards[currentFlashcardIndex].front;
  flashcardBackText.textContent = flashcards[currentFlashcardIndex].back;
  if(flashcards[currentFlashcardIndex].front_image !== null){
   flashcardFrontImage.setAttribute('src',`/uploads/${flashcards[currentFlashcardIndex].front_img}`);
   console.log('front image:', flashcardFrontImage);
  }
  if (flashcards[currentFlashcardIndex].back_image !== null) {
   flashcardBackImage.setAttribute('src', `/uploads/${flashcards[currentFlashcardIndex].back_img}`);
   console.log('back image:', flashcardBackImage);
  }
  flashcardId.textContent = flashcards[currentFlashcardIndex].id;
 }

 updateFlashcard(); // Initial update

 const flipButton = document.querySelector('.flip-button');
 const prevButton = document.querySelector('.prev-button');
 const nextButton = document.querySelector('.next-button');
 const rateButtons = document.querySelectorAll('.rate-button');


 // Function to show the front of the flashcard
 function showFront() {
  flashcardFront.style.display = 'block';
  flashcardBack.style.display = 'none';

  console.log('flashcardFront:', flashcardFront);
  // Show the rating buttons
  ratingBtnContainer.style.display = 'none';
 }

 // Function to show the back of the flashcard
 function showBack() {
  flashcardFront.style.display = 'none';
  flashcardBack.style.display = 'block';
  // Show the rating buttons
  ratingBtnContainer.style.display = 'block';
  console.log('flashcardBack:', flashcardBack);
 }

 // Shuffle the flashcards array

 showFront(); // Initially, show the front

 flipButton.addEventListener('click', () => {
  if (isFront) {
   showBack();
  } else {
   showFront();
  }
  isFront = !isFront; // Toggle the flag
 });


 let isLastFlashcard = false;

 nextButton.addEventListener('click', () => {
  currentFlashcardIndex++;

  if (currentFlashcardIndex < flashcards.length) {
   updateFlashcard();
   showFront();
  } else if (currentFlashcardIndex === flashcards.length) {
   // This block will be executed only once when transitioning to the last flashcard
   isLastFlashcard = true;
   console.log('Last flashcard');
   nextButton.textContent = 'Finished';
   nextButton.disabled = true;
   if(isLastFlashcard){
    $('#deckCompleteModal').modal('show');
    
   }
  }
 });

 prevButton.addEventListener('click', () => {
  if (currentFlashcardIndex > 0) {
   currentFlashcardIndex--;
   updateFlashcard();
   showFront(); 

   nextButton.textContent = 'Next';
   nextButton.disabled = false;

  }
 });

 rateButtons.forEach((button) => {
  button.addEventListener('click', () => {
   const rating = button.getAttribute('data-rating');
   console.log('Rated:', rating);
   // You can send an AJAX request to update the flashcard rating here
  });
 });
});