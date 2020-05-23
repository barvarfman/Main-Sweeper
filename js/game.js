'use strict'
const backgroundColor = 'rgb(241, 239, 239)'
const MINES = '💣';
const FLAG = '🏁';
const EMPTY = '';
const NORMAL = '😀';
const LOSE = '🤯';
const WIN = '😎';
var gPicLives = '❤️';
var gLives = 0;
var gStartTime;
var gStopwatchIntervalId;
var arrayOfMines = [];
var gFirstClick = 0;
var gBoard;
var gSafeClickCounter;
var gHints = false;
var neigs;
var gHintsCount;
var gStopIntervaL;
var gLevel = {
    SIZE: 4,
    MINES: 2
};

function initGame() {
    setInterval(changeHeadrColor, 100);
    gHintsCount=3;
    gSafeClickCounter = 3;
    gLives = 3;
    gFirstClick = 0;
    gBoard = buildEmptyBoard()
    renderBoard(gBoard)
}

/*Builds the board
Set mines at random locations
Call setMinesNegsCount()
Return the created board*/

function isObjectEqule(arrayOfMines, inI, inJ) {
    for (var i = 0; i < arrayOfMines.length; i++) {
        if ((arrayOfMines[i].i === inI) && (arrayOfMines[i].j === inJ)) return true;
    }
    return false;
}

function buildEmptyBoard() {
    var SIZE = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = 0;
        }
    }
    return board;
}

function checkIJ(i, j, index) {
    if ((i === index.i) && (j === index.j)) return true;
    return false;
}

function buildBoard(indexOfClickCell) {
    for (var m = 0; m < gLevel.MINES; m++) {
        var inI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var inJ = getRandomIntInclusive(0, gLevel.SIZE - 1);

        while ((isObjectEqule(arrayOfMines, inI, inJ)) || checkIJ(inI, inJ, indexOfClickCell)) {
            inI = getRandomIntInclusive(0, gLevel.SIZE - 1);
            inJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        }
        arrayOfMines.push({ i: inI, j: inJ });
    }

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

    var cell;
    var cellCoord = getCellCoord(elCell.id)

    if (event.button === 0) {
        
        if (gFirstClick === 0) {
            gStartTime = Date.now();
            gStopwatchIntervalId = setInterval(getGameTime, 100);
            gBoard = buildBoard(cellCoord)
            gFirstClick++;
        }
        
        if ((gHints)) {
            showArund(cellCoord);
           if(gHintsCount===1){
            gHints=false;
           }
           gHintsCount--;
           return;
            
        }

        if (gBoard[cellCoord.i][cellCoord.j].isMine) {
            var elLives = document.querySelector('.lives')
            if (gLives === 1) cell = MINES;
            else cell = EMPTY;
            gLives--;
            if (gLives === 2) elLives.innerText = gPicLives + gPicLives;
            else if (gLives === 1) elLives.innerText = gPicLives;
            else {
                elLives.innerText = '💔';
            }
        }

        else if ((gBoard[cellCoord.i][cellCoord.j].minesAroundCount) > 0) {
            cell = gBoard[cellCoord.i][cellCoord.j].minesAroundCount;
            gBoard[cellCoord.i][cellCoord.j].isShown = true;
        }
        else {
            cell = EMPTY;
            gBoard[cellCoord.i][cellCoord.j].isShown = true;
            elCell.style.backgroundColor = backgroundColor;
            explorEmptyNeig(cellCoord.i, cellCoord.j);
        }

        if (cell !== EMPTY) {
            elCell.innerHTML = cell;
            elCell.style.backgroundColor = backgroundColor;
            if (cell === MINES) {
                explorAllMines();
                gameOver('l')
            }
            else {
                elCell.innerHTML = cell;
                elCell.style.backgroundColor = backgroundColor;
            }
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
    clearInterval(gStopwatchIntervalId);
    var elBody = document.querySelector('body')
    var elSmily = document.querySelector('.smily');
    if (indexOfWinOrLose === 'v') {
        elBody.style.backgroundImage = 'url(../img/WIN5.JPG)';
        elSmily.innerText = WIN;
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var elCell = document.querySelector(`#cell-${i}-${j}`);
                if (!(gBoard[i][j].isMarked)) {
                    if (gBoard[i][j].isMine) {
                        elCell.innerHTML = MINES;
                        elCell.style.backgroundColor = backgroundColor;
                    }
                    else if ((gBoard[i][j].minesAroundCount) > 0) {
                        elCell.innerHTML = gBoard[i][j].minesAroundCount;
                        elCell.style.backgroundColor = backgroundColor;
                    }
                    else elCell.style.backgroundColor = backgroundColor;
                }
            }
        }

    }
    else {
        elBody.style.backgroundImage = 'url(../img/LOSER2.JPG)';
        elSmily.innerText = LOSE;
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var elCell = document.querySelector(`#cell-${i}-${j}`);
                if (!(gBoard[i][j].isMine)) {
                    if (gBoard[i][j].isMine) {
                        elCell.innerHTML = MINES;
                        elCell.style.backgroundColor = backgroundColor;
                    }
                    else if ((gBoard[i][j].minesAroundCount) > 0) {
                        elCell.innerHTML = gBoard[i][j].minesAroundCount;
                        elCell.style.backgroundColor = backgroundColor;
                    }
                    else elCell.style.backgroundColor = backgroundColor;
                }
            }
        }
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
        elCell.style.backgroundColor = backgroundColor;
    }
}

function explorEmptyNeig(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === cellI && j === cellJ) continue;
            var elCell = document.querySelector(`#cell-${i}-${j}`);

            if (gBoard[i][j].minesAroundCount > 0) {
                elCell.innerHTML = (gBoard[i][j].minesAroundCount);
                elCell.style.backgroundColor = backgroundColor;
                gBoard[i][j].isShown = true;
            }

            else {
                elCell.style.backgroundColor = backgroundColor;
                gBoard[i][j].isShown = true;
            }
        }
    }

}

function getGameTime() {
    var currTime = Date.now()
    var timePass = Math.round(((currTime - gStartTime) / 1000), 1);
    document.querySelector('.stopwatch').innerText = timePass;
}

function safeClick(elBtn) {
    var unSwonCells = [];
    var randomCell;
    var elCell;
    var elDiv;
    elDiv = document.querySelector('.safeClickCuonter');
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if ((gBoard[i][j].isShown === false) && (gBoard[i][j].isMine === false)) unSwonCells.push({ i: i, j: j });
        }
    }
    randomCell = unSwonCells[getRandomIntInclusive(0, unSwonCells.length - 1)];
    elCell = document.querySelector(`#cell-${randomCell.i}-${randomCell.j}`);
    if (gSafeClickCounter > 0) {
        elCell.style.backgroundColor = 'lightseagreen'
        elDiv.innerText = gSafeClickCounter - 1;
    }
    gSafeClickCounter--;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeHeadrColor() {
    var span;
    var color;
    for (var i = 1; i < 11; i++) {
        span = document.querySelector('.s1');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s2');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s3');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s4');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s5');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s6');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s7');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s8');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s9');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s10');
        color = getRandomColor();
        span.style.color = color;
        span = document.querySelector('.s11');
        color = getRandomColor();
        span.style.color = color;
    }

}

function showArund(cellCoord) {
     neigs = [];
    var elCell;
    for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === cellCoord.i && j === cellCoord.j) continue;
          
            if(gBoard[i][j].isShown===false) neigs.push({ i: i, j: j });
        }
    }
    neigs.push(cellCoord);
    console.log(neigs);
    for (i = 0; i < neigs.length; i++) {
        elCell = document.querySelector(`#cell-${neigs[i].i}-${neigs[i].j}`);
        if (gBoard[neigs[i].i][neigs[i].j].minesAroundCount > 0) elCell.innerHTML = (gBoard[neigs[i].i][neigs[i].j].minesAroundCount);
        else if (gBoard[neigs[i].i][neigs[i].j].isMine) elCell.innerHTML = MINES;
        else  elCell.style.backgroundColor = backgroundColor;
    }
    gStopIntervaL=setInterval(backToHide,1000);
}

function backToHide(){
   clearInterval(gStopIntervaL);
    var elCell;
    for(var i=0; i<neigs.length; i++){
        elCell = document.querySelector(`#cell-${neigs[i].i}-${neigs[i].j}`);
         elCell.innerHTML='';
         elCell.style.backgroundColor='lightgrey';
     }

}

 function hints(){
    gHints=true;

}