// Letters
const letters = "abcdefghijklmnopqrstuvwxyz";

// Get Array From Letters
let lettersArray = [...letters];
let lettersAndSpace;
let randomValueValue;
let counterAnswerLett = 0;

// Select Letter Container
let letterSContainer = document.querySelector(".letters");
// Set Wrong Attempts And The Statues
let wrongAttempts = 0;
let theStateus;
// select The Draw Elements
let theDraw = document.querySelector(".hangman-draw");

// Generate The Letters
lettersArray.forEach((let) => {
  //Create Span Element For The Letter
  let span = document.createElement("span");

  // Create Letter Text Node
  let theLetter = document.createTextNode(let);

  // Appen The Leter On Span
  span.appendChild(theLetter);

  // Add Class To Span
  span.className = "letter-box";

  // Append Span To The Lettest Container
  letterSContainer.appendChild(span);
});

// Tregar The Function
document.onload = startGame();
async function getApiData() {
  const response = await getDataFromJson(
    "https://random-word-api.herokuapp.com/word?number=1"
  );
  try {
    console.log(response);
  } catch (error) {
    console.log(error + "This Error");
  }
}
getApiData();
// Create Function Start Game
async function startGame() {
  // Object OF Words + Categories
  const words = await getDataFromJson("./data.json");

  // Create The Array Keys And Check If Not Empty
  let allKeys = Object.keys(words);

  if (allKeys.length === 0) {
    console.error(" No Words Avilable !");
    return;
  }
  // Get Random Prop Number + Prop Name + Prop Value + Word Index + Word
  let randomPropNumber = Math.floor(Math.random() * allKeys.length);
  let randomPropName = allKeys[randomPropNumber];
  let randomPropValue = words[randomPropName];
  let randomValueNumber = Math.floor(Math.random() * randomPropValue.length);
  randomValueValue = randomPropValue[randomValueNumber];
  console.log(randomValueValue);
  // Set Category Inof
  document.querySelector(".game-info .category span").innerHTML =
    randomPropName;

  // Select Letters Guess Element
  let lettersGuessContainer = document.querySelector(".letters-guess");

  // Convert Chosen Word To Array
  lettersAndSpace = [...randomValueValue];

  // Create Spans Deppend On Word
  lettersAndSpace.forEach((let) => {
    // Create Empty Span
    let span = document.createElement("span");

    // If The Letter IS Space
    if (let === " ") {
      span.classList.add("has-space");
      counterAnswerLett++;
    }
    // Append Span To The Letters Guess Container
    lettersGuessContainer.appendChild(span);
  });
}
async function getDataFromJson(json) {
  try {
    const response = await fetch(json);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Http error Status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error IS :${Error} `);
    return {};
  }
}

// Handle Clicking On Letters
document.addEventListener("click", (e) => {
  theStateus = false;

  if (e.target.classList.contains("letter-box")) {
    // Select Spans Guess
    let spansGuess = document.querySelectorAll(".letters-guess span");
    e.target.classList.add("clicked");

    // Gett Clicked Letter
    let theClickedLetter = e.target.innerHTML.toLowerCase();

    //(lettersAndSpace) Get The Chosen Word AS Array

    lettersAndSpace.forEach((wordLetter, index) => {
      if (wordLetter.toLowerCase() === theClickedLetter) {
        // Add One To Var
        counterAnswerLett++;
        // Set Status To Correct
        theStateus = true;
        // Play Sound
        document.querySelector("#sucsess").play();
        spansGuess[index].innerHTML = theClickedLetter;
        if (counterAnswerLett === spansGuess.length) {
          endGame();
        }
      }
    });

    // Out Side'

    // If Letter IS Wrong
    if (theStateus !== true) {
      // Incress The Wrong Attempts
      wrongAttempts++;

      // Check IF The Wrogn Attempts Not Equl 9
      if (wrongAttempts > 8) {
        endGame();
      }
      // Play Sound
      document.querySelector("#failed").play();

      // Add Class Wrong ON The Draw Element
      theDraw.classList.add(`wrong-${wrongAttempts}`);
    }
  }
});

function endGame() {
  // Disbled The Game
  letterSContainer.classList.add("disbled");
  // Create Popup Div
  let div = document.createElement("div");

  // Add Class To Div
  div.classList = "popup";

  // Create Text
  let divText;
  if (theStateus) {
    let levelGame =
      wrongAttempts <= 2 ? "Exlant" : wrongAttempts <= 5 ? "Good" : "Normal";
    divText = document.createTextNode(`You Are Good Your Level : ${levelGame}`);
  } else {
    divText = document.createTextNode(
      `Game Over The Word IS ${randomValueValue}`
    );
  }

  // Apend text To Div
  div.appendChild(divText);

  // Append To the Body
  document.body.appendChild(div);
}
