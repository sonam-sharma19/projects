let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

const guessInput = document.getElementById("guess");
const checkBtn = document.getElementById("checkBtn");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");
const attemptText = document.getElementById("attempts");

checkBtn.addEventListener("click", function(){

    let userGuess = Number(guessInput.value);

    if(userGuess < 1 || userGuess > 100){
        message.textContent = "❌ Enter a number between 1 and 100";
        return;
    }

    attempts++;
    attemptText.textContent = attempts;

    if(userGuess === randomNumber){
        message.textContent = "🎉 Correct! You guessed it!";
    }
    else if(userGuess < randomNumber){
        message.textContent = "📉 Too Low!";
    }
    else{
        message.textContent = "📈 Too High!";
    }

});

restartBtn.addEventListener("click", function(){

    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    attemptText.textContent = attempts;
    message.textContent = "";
    guessInput.value = "";

});