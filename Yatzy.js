
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
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0
};




//---------- FUNCTIONS -----------------------------------------------------------------------------------------------------------

//___________Top_Functions__________________________________________
/**
 * Sets the (normal) image of a die to the image corresponding to the result value of the die
 * @param {image element of Dice class} die An img element with the class 'Dice'
 */
function setDieImage(die) {
    switch (die.result) {
        case 1:
            die.src = 'img/one.png';
            break;
        case 2:
            die.src = 'img/two.png';
            break;
        case 3:
            die.src = 'img/three.png';
            break;
        case 4:
            die.src = 'img/four.png';
            break;
        case 5:
            die.src = 'img/five.png';
            break;
        case 6:
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
function rollDie(die) {
    //Generate random number and assign to result
    let randNum = Math.floor(Math.random() * 6 + 1);
    die.result = randNum;

}

/**
 * Resets all values in the resultslist to 0;
 */
function resetResultsList() {
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
function unlockDice() {
    for (let die of dice) {
        die.locked = 0;
    }
}

/**
 * Counts the results of all dice and updates the resultList accordingly
 */
function countResults() {
    for (let die of dice) {
        switch (die.result) {
            case 1:
                resultsList.ones++;
                break;
            case 2:
                resultsList.twos++;
                break;
            case 3:
                resultsList.threes++;
                break;
            case 4:
                resultsList.fours++;
                break;
            case 5:
                resultsList.fives++;
                break;
            case 6:
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
function rollUnlockedDice() {
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
function ToggleLocked(die) {
    if (!die.locked && turnCounter.roll !== 0) {
        die.locked = true;

        switch (die.result) {
            case 1:
                die.src = 'img/one_alt.png';
                break;
            case 2:
                die.src = 'img/two_alt.png';
                break;
            case 3:
                die.src = 'img/three_alt.png';
                break;
            case 4:
                die.src = 'img/four_alt.png';
                break;
            case 5:
                die.src = 'img/five_alt.png';
                break;
            case 6:
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
function resetRound() {
    resetAllDiceTo(1);
    turnCounter.roll = 0;
    turnCounter.textContent = 'New round started!'
    rollButton.disabled = false;


}

/**
 * Implements all sub-functions of the roll button, including: Resetting the resultlist, rolling all unlocked dice, counting the results, incrementing the roll counter and checking for amount of rolls left.
 */
function rollButtonAction() {
    resetResultsList();
    rollUnlockedDice();
    countResults();
    updateTurnCounter();

    calcAllScoreFields();
}

/**
 * Returns points for one pair (for the face value giving highest points).
 * Returns 0, if there aren't 2 dice with the same face value.
 */
let onePairPoints = () => {
    let maxIndex = 0, pairs = 2, faceValueCounter = 1;

    for (let i in resultsList) {
        if (resultsList[i] >= pairs) {
            maxIndex = faceValueCounter;
        }
        faceValueCounter++;
    }
    return maxIndex * 2;
}

/**
 * Returns points for two pairs (for the 2 face values giving highest
 * points). Returns 0, if there aren't 2 dice with one face value and 2 dice
 * with a different face value.
 */
let twoPairPoints = () => {
    let pair1 = 0, pair2 = 0, result = 0, faceValueCounter = 1;
    for (let i in resultsList) {
        if (resultsList[i] >= 2) {
            if (pair1 == 0) {
                pair1 = faceValueCounter * 2;
            } else {
                pair2 = faceValueCounter * 2;
                result = pair1 + pair2;
            }

        }
        faceValueCounter++;
    }
    return result;
}


/**
 * Returns points for 3 of a kind. Returns 0, if there aren't 3 dice with
 * the same face value.
 */
let threeSamePoints = () => {
    let maxIndex = 0;
    let three = 3;
    let faceValueCounter = 1;
    for (let i in resultsList) {
        if (resultsList[i] >= three) {
            maxIndex = faceValueCounter;

        }
        faceValueCounter++;
    }
    return maxIndex * three;
}

/**
 * Returns points for 4 of a kind. Returns 0, if there aren't 4 dice with
 * the same face value.
 */
let fourSamePoints = () => {
    let maxIndex = 0;
    let four = 4;
    let faceValueCounter = 1;
    for (let i in resultsList) {
        if (resultsList[i] >= four) {
            maxIndex = faceValueCounter;
        }
        faceValueCounter++;
    }
    return maxIndex * four;

}

/**
 * Returns points for full house. Returns 0, if there aren't 3 dice with one
 * face value and 2 dice a different face value.
 */
fullHousePoints = () => {
    let two = 0, three = 0, result = 0, faceValueCounter = 1;
    for (let i in resultsList) {
        if (resultsList[i] == 2) {
            two = faceValueCounter;
        }
        if (resultsList[i] == 3) {
            three = faceValueCounter;
        }
        if (two != 0 && three != 0) {
            result = two * 2 + three * 3;
        }
        faceValueCounter++;

    }
    return result;
}

/**
 * Returns points for small straight. Returns 0, if the dice are not showing
 * 1,2,3,4,5.
 */
let smallStraightPoints = () => {
    let number = 0, result = 0, faceValueCounter = 1;
    for (let i in resultsList) {
        if (resultsList[i] == 1 && faceValueCounter != 6) {
            number++;
        }
        if (number == 5) {
            result = 1 + 2 + 3 + 4 + 5;
        }
        faceValueCounter++;
    }
    return result;
}

/**
 * Returns points for large straight. Returns 0, if the dice is not showing
 * 2,3,4,5,6.
 */
let largeStraightPoints = () => {
    let number = 0, result = 0, faceValueCounter = 1;
    for (let i in resultsList) {

        if (resultsList[i] == 1 && faceValueCounter!= 1) {
            number++;
        }
        if (number == 5) {
            result = 2 + 3 + 4 + 5 + 6;
        }
        faceValueCounter++;

    }
    return result;
}

/**
 * Returns points for chance.
 */
let chancePoints = () => {
    let sum = 0, faceValueCounter = 1;
    for (let value in resultsList) {
        sum += resultsList[value] * faceValueCounter;
        faceValueCounter++;
    }
    return sum;
}

/**
 * Returns points for yatzy. Returns 0, if there aren't 5 dice with the same
 * face value.
 */
let yatzyPoints = () => {
    let maxIndex = 0;
    let five = 5;
    for (let i in resultsList) {
        if (resultsList[i] == five) {
            maxIndex = 50;
            break;
        }
    }
    return maxIndex;

}

//___________Bottom_Functions__________________________________________
document.querySelector('#ones').calcScore = () => resultsList.ones;
document.querySelector('#twos').calcScore = () => resultsList.twos * 2,
document.querySelector('#threes').calcScore = () => resultsList.threes * 3,
document.querySelector('#fours').calcScore = () => resultsList.fours * 4,
document.querySelector('#fives').calcScore = () => resultsList.fives * 5,
document.querySelector('#sixes').calcScore = () => resultsList.sixes * 6,
document.querySelector('#onePair').calcScore = () => onePairPoints();
document.querySelector('#twoPair').calcScore = () => twoPairPoints();
document.querySelector('#threePair').calcScore = () => threeSamePoints();
document.querySelector('#fourPair').calcScore = () => fourSamePoints();
document.querySelector('#full').calcScore = () => fullHousePoints();
document.querySelector('#small').calcScore = () => smallStraightPoints();
document.querySelector('#large').calcScore = () => largeStraightPoints();
document.querySelector('#chance').calcScore = () => chancePoints();
document.querySelector('#yatzy').calcScore = () => yatzyPoints();



/**
 * Sets all fields to read only, to prevent a player from editing scores directly
 */
function setFieldsReadOnly() {
    for (let field of document.querySelectorAll('input')) {
        field.readOnly = true;
    }
}

/**
 * Resets all fields to 0 value, and unlocks them
 */
function resetAllScores() {
    for (let field of document.querySelectorAll('input')) {
        field.value = 0;
        field.locked = false;
    }
}

/**
 * Iterates through all non-locked score fields and evokes their corresponding calculation function, as stored in the calculationFunctions object.
 */
function calcAllScoreFields() {
    for (let field of document.querySelectorAll('input.score')) {
        if (!field.locked) {

            field.value = field.calcScore();

            

        }
    }
}

function calculateSumAndBonus () {
        let runningSum = 0;
        for (let field of document.querySelectorAll('input.num')) {
            
            if (field.locked) {
                runningSum += parseInt(field.value);
            }
        }
        
        let sumField = document.querySelector('#sum');
        sumField.value = runningSum;

        let bonusField = document.querySelector('#bonus');
        if (parseInt(sumField.value) >= 63) {
            bonusField.value = 50;
        }
        return parseInt(sumField.value)+parseInt(bonusField.value);
}

function calculateTotal () {
    let runningSum = 0;
    for (let field of document.querySelectorAll('input.set')) {
        if (field.locked) {
            runningSum += parseInt(field.value);
        }
    }
    runningSum += calculateSumAndBonus();

    let totalField = document.querySelector('#total');
    totalField.value = runningSum;
}

/**
 * disabled a score field and sets its Locked attribute to true.
 * @param {text input} field 
 */
function lockScoreField(field) {
    if (turnCounter.roll !== 0) {
        field.disabled = true;
        field.locked = true;
    }

}

function lockInScore(field) {
    lockScoreField(field);
    for (let field of document.querySelectorAll('input.calcField')) {
        field.calcScore;
    }
    
    calculateTotal();

    if (checkForGameEnd()) {
        showWinAlert();
    } else {
        resetRound();
    }
    
}

function checkForGameEnd() {
    let scoreFields = document.querySelectorAll('input.score');
    for (let field of scoreFields) {
        if (!field.locked) {
            return false;
        }
    }
    return true;
}

function showWinAlert () {
    alert("Spillet er slut");
    setFieldsReadOnly();
    resetAllScores();
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







