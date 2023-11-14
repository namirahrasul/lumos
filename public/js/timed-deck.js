document.addEventListener('DOMContentLoaded', () => {
 // Parse the JSON data
 const flashcards = JSON.parse('<%- flashcardsJSON %>');
 const deckName = flashcards[0].deck_name;
 const ratingBtnContainer = document.querySelector('.rating-btn-container');
 const stopwatchDisplay = document.getElementById('stopwatchDisplay');

 const pauseResumeButton = document.getElementById('pauseStopwatch');
 pauseResumeButton.textContent = 'Pause';

 // Set the deck name in the placeholder element
 document.getElementById('deckName').textContent = deckName;

 const flashcardFront = document.getElementById('flashcardFront');
 const flashcardBack = document.getElementById('flashcardBack');
 let isFront = true; // Flag to track front/back of the flashcard
 let currentFlashcardIndex = 0; // Initialize the current flashcard index

 function updateFlashcard() {
  flashcardFront.textContent = flashcards[currentFlashcardIndex].front;
  flashcardBack.textContent = flashcards[currentFlashcardIndex].back;
 }

 updateFlashcard(); // Initial update

 const flipButton = document.querySelector('.flip-button');
 const prevButton = document.querySelector('.prev-button');
 const nextButton = document.querySelector('.next-button');
 const rateButtons = document.querySelectorAll('.rate-button');

 // Function to shuffle the flashcards array
 function shuffleFlashcards() {
  for (let i = flashcards.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
 }

 // Function to show the front of the flashcard
 function showFront() {
  flashcardFront.style.display = 'block';
  flashcardBack.style.display = 'none';
  // Show the rating buttons
  ratingBtnContainer.style.display = 'none';
 }

 // Function to show the back of the flashcard
 function showBack() {
  flashcardFront.style.display = 'none';
  flashcardBack.style.display = 'block';
  // Show the rating buttons
  ratingBtnContainer.style.display = 'block';
 }

 shuffleFlashcards(); // Shuffle the flashcards array

 showFront(); // Initially, show the front

 flipButton.addEventListener('click', () => {
  if (isFront) {
   showBack();
  } else {
   showFront();
  }
  isFront = !isFront; // Toggle the flag
 });

 nextButton.addEventListener('click', () => {
  if (currentFlashcardIndex < flashcards.length - 1) {
   currentFlashcardIndex++;
   updateFlashcard();
   showFront(); // Show front when going to the next flashcard
  }
 });

 prevButton.addEventListener('click', () => {
  if (currentFlashcardIndex > 0) {
   currentFlashcardIndex--;
   updateFlashcard();
   showFront(); // Show front when going to the previous flashcard
  }
 });

 rateButtons.forEach((button) => {
  button.addEventListener('click', () => {
   const rating = button.getAttribute('data-rating');
   console.log('Rated:', rating);
   // You can send an AJAX request to update the flashcard rating here
  });
 });

 // Stopwatch code
 let stopwatchInterval;
 let stopwatchRunning = false;
 let stopwatchSeconds = 0;

 function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(sec).padStart(2, '0')}`;
 }

 function updateStopwatch() {
  stopwatchSeconds++;
  stopwatchDisplay.textContent = formatTime(stopwatchSeconds);
 }

 function startStopwatch() {
  if (!stopwatchRunning) {
   stopwatchInterval = setInterval(updateStopwatch, 1000);
   stopwatchRunning = true;
  }
 }

 function toggleStopwatch() {
  if (stopwatchRunning) {
   clearInterval(stopwatchInterval);
   pauseResumeButton.textContent = 'Resume';
  } else {
   stopwatchInterval = setInterval(updateStopwatch, 1000);
   pauseResumeButton.textContent = 'Pause';
  }
  stopwatchRunning = !stopwatchRunning;
 }

 pauseResumeButton.addEventListener('click', () => {
  toggleStopwatch();
 });
 startStopwatch();
});
