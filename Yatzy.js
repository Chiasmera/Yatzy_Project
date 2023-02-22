// TODO
/*
- Tæl counter op når det rulles med terningerne
- disable roll knap når tre rul er foretaget
- Lav funktion til at starte ny serie af rul efter point er scoret
- alt hvad der indebærer at beregne point
*/



//---------- VARIABLES -----------------------------------------------------------------------------------------------------------
const dice = document.querySelectorAll('.Dice');
const resultsList = {
    ones : 0,
    twos : 0,
    threes: 0,
    fours : 0,
    fives : 0,
    sixes : 0
};
let rollCounter = 0;

//---------- FUNCTIONS -----------------------------------------------------------------------------------------------------------
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
        die.locked = false;
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
 * Rolls all unlocked dice, sets their images and sums up the results in the ResultList
 */
function rollUnlockedDice () {
    resetResultsList();

    for (let die of dice) {
        if (!die.locked) {
            rollDie(die);
            setDieImage(die);
        }
    }
    countResults();
}

/**
 * Locks a die, preventing it from being rolled
 * @param {image element of Dice class} die An img element with the class 'Dice'
 */
function lockDie (die) {
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

}

//---------- EVENT LISTENERS SETUP -----------------------------------------------------------------------------------------------------------
const rollButton = document.querySelector('#roll');
rollButton.addEventListener('click', () => rollUnlockedDice())

for (let die of dice) {
    die.addEventListener('click', (e) => lockDie(e.target))
}


//---------- INITIAL SETUP -----------------------------------------------------------------------------------------------------------
resetAllDiceTo(1);
