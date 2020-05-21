'use strict'


const MINES = '💣';
const FLAG = '🏁';
const EMPTY = '';
var gStartTime;
var gStopwatchIntervalId;
var arrayOfMines = [];
var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gBoard;

var gGame = {
    // Boolean, when true we let the user play
    isOn: false,
    // How many cells are shown
    shownCount: 0,
    // How many cells are marked (with a flag)
    markedCount: 0,
    //  How many seconds passed
    secsPassed: 0
}


function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}


/*Builds the board
Set mines at random locations
Call setMinesNegsCount()
Return the created board*/

function isObjectEqule(arrayOfMines, inI, inJ) {
    for (var i = 0; i < arrayOfMines.length; i++) {
        if ((arrayOfMines[i].i === inI) && (arrayOfMines[i].j === inJ)) return false;
    }
    return true;
}

function buildBoard() {
    for (var m = 0; m < gLevel.MINES; m++) {
        var inI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var inJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        if (isObjectEqule(arrayOfMines, inI, inJ)) arrayOfMines.push({ i: inI, j: inJ });

        else {
            var inI = getRandomIntInclusive(0, gLevel.SIZE - 1);
            var inJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
            arrayOfMines.push({ i: inI, j: inJ });
        }
    }
    console.log(arrayOfMines);
    var SIZE = gLevel.SIZE;
    var mines = 0
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            for (m = 0; m < arrayOfMines.length; m++) {
                if ((i === arrayOfMines[m].i) && (j === arrayOfMines[m].j)) board[i][j].isMine = true;
            }


        }
    }


    // updating minds count for each cell after they are all made
    for (i = 0; i < gLevel.SIZE; i++) {
        for (j = 0; j < gLevel.SIZE; j++) {

            mines = setMinesNegsCount(board, i, j);
            board[i][j].minesAroundCount = mines;
        }
    }
    return board;
}

/*Count mines around each cell
and set the cell's
minesAroundCount.*/


function setMinesNegsCount(board, cellI, cellJ) {
    var minesCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine === true) minesCount++
        }
    }
    return minesCount;
}




//Render the board as a <table>
//to the page


function renderBoard() {

    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard.length; j++) {
            var tdId = `cell-${i}-${j}`;
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td id="${tdId}" class="${className}"  onmousedown="cellClicked(this,event)"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.container');
    elContainer.innerHTML = strHTML;

}


//Called when a cell (td) is
//clicked

function cellClicked(elCell, event) {
    window.oncontextmenu = (e) => {
        e.preventDefault();
    }
    gStartTime = Date.now();
    gStopwatchIntervalId = setInterval(getGameTime, 100);
    var cell;
    var cellCoord = getCellCoord(elCell.id)


    if (event.button === 0) {
        if (gBoard[cellCoord.i][cellCoord.j].isMine) {
            cell = MINES;
        }
        else if ((gBoard[cellCoord.i][cellCoord.j].minesAroundCount) > 0) {
            cell = gBoard[cellCoord.i][cellCoord.j].minesAroundCount;
        }
        else {
            cell = EMPTY;
            elCell.style.backgroundColor = 'white';
            explorEmptyNeig(cellCoord.i, cellCoord.j);
        }


        if (cell !== EMPTY) {
            elCell.innerHTML = cell;
            if (cell === MINES) {
                explorAllMines();
                gameOver('l')
            }
            else elCell.innerHTML = cell;
        }
    }

    //right click on/off flag
    else if (event.button === 2) {
        if (gBoard[cellCoord.i][cellCoord.j].isMarked) {
            elCell.innerHTML = '';
            gBoard[cellCoord.i][cellCoord.j].isMarked = false;
        }
        else {
            elCell.innerHTML = FLAG;
            gBoard[cellCoord.i][cellCoord.j].isMarked = true;
            if (allMainsMarked()) gameOver('v');
        }
    }
}



function allMainsMarked() {

    var countMarkedMines = 0;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if ((gBoard[i][j].isMine === true) && (gBoard[i][j].isMarked === true)) countMarkedMines++;
        }
    }
    if (countMarkedMines === gLevel.MINES) return true;
    return false;
}

/*Game ends when all mines are
marked, and all the other cells
are shown*/

function gameOver(indexOfWinOrLose) {
    var elDiv = document.querySelector('.gameover');
    if (indexOfWinOrLose === 'v') {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var elCell = document.querySelector(`#cell-${i}-${j}`);
                if (!(gBoard[i][j].isMarked)) {
                    if (gBoard[i][j].isMine) elCell.innerHTML = MINES;
                    else if ((gBoard[i][j].minesAroundCount) > 0) elCell.innerHTML = gBoard[i][j].minesAroundCount;
                    else elCell.style.backgroundColor = 'white';
                }
            }
        }

        elDiv.innerText = 'you win';
    }
    else {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var elCell = document.querySelector(`#cell-${i}-${j}`);
                if (!(gBoard[i][j].isMine)) {
                    if (gBoard[i][j].isMine) elCell.innerHTML = MINES;
                    else if ((gBoard[i][j].minesAroundCount) > 0) elCell.innerHTML = gBoard[i][j].minesAroundCount;
                    else elCell.style.backgroundColor = 'white';
                }
            }
        }

        elDiv.innerText = 'you lose';
    }
}


function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    // console.log('coord', coord);
    return coord;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function level(elBtn) {
    var dataOfEl = +elBtn.getAttribute('data');
    if (dataOfEl === 1) {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        initGame();
    }
    else if (dataOfEl === 2) {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        initGame();
    }
    else {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        initGame();
    }

}


function explorAllMines() {
    for (var m = 0; m < gLevel.MINES; m++) {
        var i = arrayOfMines[m].i
        var j = arrayOfMines[m].j
        var elCell = document.querySelector(`#cell-${i}-${j}`);
        elCell.innerText = MINES;
    }
}

function explorEmptyNeig(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === cellI && j === cellJ) continue;
            var elCell = document.querySelector(`#cell-${i}-${j}`);
            if (gBoard[i][j].isMine) elCell.innerHTML = MINES;
            else if (gBoard[i][j].minesAroundCount > 0) elCell.innerHTML = (gBoard[i][j].minesAroundCount);
            else elCell.style.backgroundColor = 'white';
        }
    }

}


function getGameTime() {
    var currTime = Date.now()
    var timePass = (currTime - gStartTime) / 1000;
    document.querySelector('.stopwatch').innerText = timePass;
}

