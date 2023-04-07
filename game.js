const question = document.getElementById("question");
// converting the nodelist to an arrany by using Array.form function
const choices = Array.from(document.getElementsByClassName("choice-text"));
console.log(choices);
// working with taking each questions and answer
// first take the current question
// our questions sets will be an object
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressbarFull = document.getElementById('progressbarFull');
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
// we need some pre work to done before receiving answer from user
let acceptingAnswers = false;
// initial score 
let score = 0;
// grab the current questions no
let questionCounter = 0;
let avalableQuestions = [];

let questions = [];
// fetch("questions.json")
fetch("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")

    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map( loadedQuestion => {
            const formatedQuestion = {
                question: loadedQuestion.question
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formatedQuestion.answer = Math.floor(Math.random()*3) + 1;
            answerChoices.splice(formatedQuestion.answer -1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, indext) => {
                formatedQuestion["choice" + (indext+1)] = choice;
            })

            return formatedQuestion;
        });
        // questions = loadedQuestions;
        // game.classList.remove('hidden');
        // loader.classList.add('hidden');
        startGame();
    })

    .catch(err => {
        console.log(err);
    });

// CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;


// Lets create function to start the game
startGame = () => {

    questionCounter = 0;
    score = 0;
    // use spread operator to grap all the question from the question array
    avalableQuestions = [...questions];
    // we need a function to get new question
    console.log(avalableQuestions);
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');

};

getNewQuestion = () => {

    //if there is no question remain
    if(avalableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
       // add score to local storage
       localStorage.setItem("mostRecentScore", score);
        //go to end page
        return window.location.assign('/end.html');
    }

    // increment the question counter each time
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // update the progress bar
    progressbarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    // we need a random interger between 1 to 3 to selecet one question from available questions
    const questionIndex = Math.floor(Math.random() * avalableQuestions.length);
    // assigne the current question index
    currentQuestion = avalableQuestions[questionIndex];
    // grab the inner text from the id question.innerText and set new text by grabbing text from currentQuestion.question
    question.innerText = currentQuestion.question;

    // Now we will grab choice text from the questions for showing choices text
    choices.forEach(choice => {
        // this will grab the number property that has been assign with the data prefix property to each element
        const number = choice.dataset['number'];
        // now we will asign to the each chioce text to their corrosponding choice text maching with number property
        // the 'choice will match with' the choice text of  "choice1": and number will match the number which will give us choice1",
        choice.innerText = currentQuestion['choice' + number];


    });
    // we need to delete or splice out the questions that just pop up from the available questions so that each time the available questions are decreasing 
    avalableQuestions.splice(questionIndex,1);
    acceptingAnswers = true;

};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        // if system/we are not ready to take the fact that user are clicking
        if(!acceptingAnswers) return;
        // just making some delay to click
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        // chech if the selected answer is match with the correct answer
        // we will apply css class based on the answer is correct or incorrect
        // const classToApply = "incorrect";
        // if (selectedAnswer == currentQuestion.answer){
        //     classToApply = "correct";
        // }

        // ternary statement
        // condition (An expression whose value is used as a condition) ? exprIfTrue : exprIfFalse
        const classToApply = 
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        
        if(classToApply === "correct"){
            incrementScore(CORRECT_BONUS);
        }
            //console.log(classToApply);
        selectedChoice.parentElement.classList.add(classToApply);

        console.log(selectedChoice.parentElement.classList);
        
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);


    });
});

incrementScore = num => {

    score += num;
    scoreText.innerText = score;
};

// startGame();