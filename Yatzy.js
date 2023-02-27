// TODO
/*
- Fix SUM feltets beregningsfunktion
- resterende feltberegninger ift point
- Check for hvornår spillet slutter
- Alert som viser point
- Mulighed for at genstarte spil
*/


//---------- VARIABLES -----------------------------------------------------------------------------------------------------------
/**
 * Each die is assigned two attributes, as follows:
 * result : An integer between 1 & 6 (inclusive). Represents the current face of the die. 
 * locked : An integer representing the turn in which the die was locked. 0 if the die is unlocked.
 */
const dice = document.querySelectorAll('.Dice');

const rollButton = document.querySelector('#roll');

/**
 * The turncounter is assigned one attribute:
 * roll : an integer respresenting the number of rolls the player has made in the current round.
 */
const turnCounter = document.querySelector('#turn');

/**
 * This object saves the aggregated current results of all die faces, for easier calculation of scores.
 */
const resultsList = {
    ones : 0,
    twos : 0,
    threes: 0,
    fours : 0,
    fives : 0,
    sixes : 0
};




//---------- FUNCTIONS -----------------------------------------------------------------------------------------------------------

//___________Top_Functions__________________________________________
/**
 * Sets the (normal) image of a die to the image corresponding to the result value of the die
 * @param {image element of Dice class} die An img element with the class 'Dice'
 */
function setDieImage (die) {
    switch (die.result) {
        case 1 : 
            die.src = 'img/one.png';
            break;
        case 2 : 
            die.src = 'img/two.png';
            break;
        case 3 : 
            die.src = 'img/three.png';
            break;
        case 4 : 
            die.src = 'img/four.png';
            break;
        case 5 : 
            die.src = 'img/five.png';
            break;
        case 6 : 
            die.src = 'img/six.png';
            break;
        default:
            console.log(`Incorrect assignment of image nr ${die.result} to die ${die}`);
    }
}

/**
 * Generates a random number between 1 & 6, and assigns it to the Result attribute of the given die.
 * @param {image element of Dice class} die An img element with the class 'Dice'
 */
function rollDie (die) {
    //Generate random number and assign to result
    let randNum = Math.floor(Math.random()*6+1);
    die.result = randNum;

}

/**
 * Resets all values in the resultslist to 0;
 */
function resetResultsList () {
    resultsList.ones = 0;
    resultsList.twos = 0;
    resultsList.threes = 0;
    resultsList.fours = 0;
    resultsList.fives = 0;
    resultsList.sixes = 0;
}

/**
 * Unlocks all dice and sets their value to the given result, changing their image to match
 * @param {int} result a valid result of a six-sided die
 */
function resetAllDiceTo(result) {
    unlockDice();
    for (let die of dice) {
        die.result = result;
        setDieImage(die);
    }
}

/**
 * Unlocks all dice
 */
function unlockDice () {
    for (let die of dice) {
        die.locked = 0;
    }
}

/**
 * Counts the results of all dice and updates the resultList accordingly
 */
function countResults () {
    for (let die of dice) {
        switch (die.result) {
        case 1 : 
            resultsList.ones++;
            break;
        case 2 : 
            resultsList.twos++;
            break;
        case 3 : 
            resultsList.threes++;
            break;
        case 4 : 
            resultsList.fours++;
            break;
        case 5 : 
            resultsList.fives++;
            break;
        case 6 : 
        resultsList.sixes++;
            break;
        default:
            console.log(`Something went wrong counting result for ${die}`);
        }
    }
    
}

/**
 * Rolls all unlocked dice, and sets their images.
 */
function rollUnlockedDice () {
    for (let die of dice) {
        if (!die.locked) {
            rollDie(die);
            setDieImage(die);
        }
    }
    
}

/**
 * Locks a die, preventing it from being rolled. If the die is already locked and was locked during the same turn, unlocks it. Does nothing before player has rolled the dice.
 * @param {image element of Dice class} die An img element with the class 'Dice'
 */
function ToggleLocked (die) {
    if(!die.locked && turnCounter.roll !== 0) {
        die.locked = true;

        switch (die.result) {
            case 1 : 
                die.src = 'img/one_alt.png';
                break;
            case 2 : 
                die.src = 'img/two_alt.png';
                break;
            case 3 : 
                die.src = 'img/three_alt.png';
                break;
            case 4 : 
                die.src = 'img/four_alt.png';
                break;
            case 5 : 
                die.src = 'img/five_alt.png';
                break;
            case 6 : 
                die.src = 'img/six_alt.png';
                break;
            default:
                console.log(`Something went wrong setting locked image for ${die}`);
        }
    } else if (die.locked) {
        die.locked = false;
        setDieImage(die);

    }
    

}

/**
 * Check if all 3 rolls for this try have been used, and if so, disable the roll button
 */
function updateTurnCounter() {
    turnCounter.roll++;
    turnCounter.textContent = `Turn ${turnCounter.roll}`;

    if (turnCounter.roll >= 3) {
        rollButton.disabled = true;
    }
}

/**
 * Resets all dice and sets the turn counter to 0;
 */
function resetRound () {
    resetAllDiceTo(1);
    turnCounter.roll = 0;
    turnCounter.textContent = 'New round started!'
    rollButton.disabled = false;


}

/**
 * Implements all sub-functions of the roll button, including: Resetting the resultlist, rolling all unlocked dice, counting the results, incrementing the roll counter and checking for amount of rolls left.
 */
function rollButtonAction () {
    resetResultsList();
    rollUnlockedDice();
    countResults();
    updateTurnCounter();

    calcAllScoreFields();
}

//___________Bottom_Functions__________________________________________
document.querySelector('#ones').calcScore = () => resultsList.ones;
document.querySelector('#twos').calcScore = () => resultsList.twos *2,
document.querySelector('#threes').calcScore = () => resultsList.threes *3,
document.querySelector('#fours').calcScore = () => resultsList.fours *4,
document.querySelector('#fives').calcScore = () => resultsList.fives *5,
document.querySelector('#sixes').calcScore = () => resultsList.sixes *6,
document.querySelector('#sum').calcScore = () => {
    //TODO - Fix this. It does not calculate properly
    let runningSum = 0;
    for (let field of document.querySelectorAll('input.num')) {
        if (field.locked) {
          runningSum =+ field.value;
          
        }
    }
    return runningSum;
};
document.querySelector('#bonus').calcScore = () => 0;
document.querySelector('#onePair').calcScore = () =>0;
document.querySelector('#twoPair').calcScore = () =>0;
document.querySelector('#threePair').calcScore = () =>0;
document.querySelector('#fourPair').calcScore = () =>0;
document.querySelector('#full').calcScore = () =>0;
document.querySelector('#small').calcScore = () =>0;
document.querySelector('#large').calcScore = () =>0;
document.querySelector('#chance').calcScore = () =>0;
document.querySelector('#yatzy').calcScore = () =>0;
document.querySelector('#total').calcScore = () =>0;


/**
 * Sets all fields to read only, to prevent a player from editing scores directly
 */
function setFieldsReadOnly () {
    for (let field of document.querySelectorAll('input')) {
        field.readOnly = true;
    }
}

/**
 * Resets all fields to 0 value, and unlocks them
 */
function resetAllScores () {
    for (let field of document.querySelectorAll('input')) {
        field.value = 0;
        field.locked = false;
    }
}

/**
 * Iterates through all non-locked score fields and evokes their corresponding calculation function, as stored in the calculationFunctions object.
 */
function calcAllScoreFields () {
    for (let field of document.querySelectorAll('input')) {
        if (!field.locked){
           field.value = field.calcScore();
        }
    }
}

/**
 * disabled a score field and sets its Locked attribute to true.
 * @param {text input} field 
 */
function lockScoreField (field) {
    if (turnCounter.roll !== 0) {
        field.disabled = true;
        field.locked = true;
    }

}

function lockInScore (field) {
    lockScoreField(field);
    for (let field of document.querySelectorAll('input.calcField')) {
        field.calcScore;
    }
    resetRound();
}


//---------- EVENT LISTENERS SETUP -----------------------------------------------------------------------------------------------------------
rollButton.addEventListener('click', () => rollButtonAction())

for (let die of dice) {
    die.addEventListener('click', (e) => ToggleLocked(e.target))
}

for (let field of document.querySelectorAll('input.score')) {
    field.addEventListener('click', (e) => lockInScore(e.target))
}


//---------- INITIAL SETUP -----------------------------------------------------------------------------------------------------------
setFieldsReadOnly();
resetAllScores();
resetRound();





