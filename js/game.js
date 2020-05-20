'use strict'


const MINES = '#';
const FLAG = '!';
const EMPTY = '';
const ONE = '1';
const TOW = '2';

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

function buildBoard() {
    var minIforMine1 = getRandomIntInclusive(0, 3);
    var minJforMine1 = getRandomIntInclusive(0, 3);
    var minIforMine2 = getRandomIntInclusive(0, 3);
    var minJforMine2 = getRandomIntInclusive(0, 3);
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
            if ((i === minIforMine1) && (j === minJforMine1) || (i === minIforMine2) && (j === minJforMine2)) {
                board[i][j].isMine = true;
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
    var x = "";
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMarked) x = FLAG;
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td id="${tdId}" class="cell" onclick="cellClicked(this)" onmousedown="mouseClicked(event)">${x}</td>`
            x = "";
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.container');
    elContainer.innerHTML = strHTML;

}


//Called when a cell (td) is
//clicked

function cellClicked(elCell) {
    var cell;
    var cellCoord = getCellCoord(elCell.id)
    if (gBoard[cellCoord.i][cellCoord.j].isMine) cell=MINES; /*onMaine(elCell);*/
    else if ((gBoard[cellCoord.i][cellCoord.j].minesAroundCount) > 0) {
        cell = gBoard[cellCoord.i][cellCoord.j].minesAroundCount;
    }
    else {
        cell = EMPTY;
        elCell.style.backgroundColor = 'white'
    }

    if (cell !== EMPTY) elCell.innerHTML = cell;

}

/*Called on right click to mark a
cell (suspected to be a mine)
Search the web (and
implement) how to hide the
context menu on right click*/


function cellMarked(elCell) {


}

/*Game ends when all mines are
marked, and all the other cells
are shown*/

function checkGameOver() {


}


/*When user clicks a cell with no
mines around, we need to open
not only that cell, but also its
neighbors.
NOTE: start with a basic
implementation that only opens
the non-mine 1
st degree
neighbors
BONUS: if you have the time
later, try to work more like the
real algorithm (see description
at the Bonuses section below)*/


function expandShown(board, elCell, i, j) {


}

console.log('concting!');

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

function mouseClicked(event) {
    var indexOfRightClick;
    if (event.button === 2) {
        indexOfRightClick = getCellCoord(event.target.id);
        if (gBoard[indexOfRightClick.i][indexOfRightClick.j].isMarked) {
            gBoard[indexOfRightClick.i][indexOfRightClick.j].isMarked = false;
        }
        else gBoard[indexOfRightClick.i][indexOfRightClick.j].isMarked = true;


        renderBoard();
    }
}

/*function onMaine(elCell) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
           if(gBoard[i][j].isMine){

           }
        }
    }

}*/