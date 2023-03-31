const AIGUI = document.querySelector(".RightGUI")
const Player2GUI = document.querySelector(".RightGUIPlayer2")
const StartScreenContent = document.querySelector(".StartScreenContent")
const gameContent = document.querySelector(".GameContent")
const gameBoardDiv = document.querySelector(".GameBoard")
let opponentSelection = " ";
/******************************Start Screen******************************/
const Player2Btn = document.querySelector(".vsPlayer")
Player2Btn.addEventListener("click", ()=>{
    opponentSelection = "Player 2";
    console.log("AN OP SEL: " + opponentSelection);
    StartScreenContent.style.display = "none"
    gameContent.style.display = "flex"
    Player2GUI.style.display = "block"
})

const AIBtn = document.querySelector(".VsAI")
AIBtn.addEventListener("click", ()=>{
    opponentSelection = "AI"
    StartScreenContent.style.display = "none"
    gameContent.style.display = "flex"
    AIGUI.style.display = "block"
})
/******************************Start Screen******************************/

/**********************************Game**********************************/
const gameBoard = (() => {
    const board = [] // [['X', 'O', 'X'], ['X', 'O', 'X'], ['X', 'O', 'X']];
    //Creating a 3x3 board
    for(let i=0; i<3; i++){
        board[i] = [];
        for(let j=0; j<3; j++){
            board[i][j] = "";
        }
    }
    console.log("NEW BOARD: " << board)
    const getBoard = () => board; 
    return{getBoard};
})();

const Player = (name) => {
    const getName = () => name;
    const token = () =>{
        if(name === "Player 1"){
            return 'X'
        }
        else if(name === "Player 2" || name === "AI"){
            return 'O'
        }
    }
    let score = 0;
    return{name, token}
};

const gameController = (() => {
    const board = gameBoard.getBoard();
    const players = [Player("Player 1"), Player("Player 2")];
    let win = false;
    let score = 0;
    let currentTurn = 0;
    let movesCount = 0;
    let activeTurn = (currentTurn) =>{
        if(currentTurn === 0)
            return 1; //Player 1 turn
        else    
            return 0; //Player 2 / AI turn
    };

    const playRound = (square) => {
        let squarePosition = square.getAttribute("data-state")
        let row = Math.floor(squarePosition/3)+1;
        let col = (squarePosition%3) + 1;
        square.textContent = players[currentTurn].token();
        console.log(`MY ROW: ${row-1}, MY COL: ${col-1}`)
        board[col-1][row-1] = players[currentTurn].token(); //Update game board
        
        if(wonRound(board, row, col, players[currentTurn].token())){
            if(activeTurn === 0){

            }
            win = true
            score++;
            console.log("SCORE! " + score);
        }
        if(movesCount === 9){
            console.log("DRAW!")
            return;
        }
        currentTurn = activeTurn(currentTurn);  //Switch turn
        movesCount++;
    }
    const wonRound = (board, row, col, token) => {
        console.log("MADE IT HERE");
        console.log(`ROW: ${row}, COL: ${col}`)
        //checking for horizontal win
        for(let i=0; i<3; i++){
            if(board[i][row-1] !== token){
                break; //We don't have three of the same tokens in a row
            }
            if(i === 2){
                console.log("YAY!! YOU WON HORIZONTALLY!!");
                console.log(board)
                return true;
            }
            console.log("ARRAY CINTENT: " + board[row-1][i])
        }
        //Checking for vertical win
        for(let j=0; j<3; j++){
            if(board[col-1][j] !== token){
                break; //We don't have three of the same tokens in a row
            }
            if(j === 2){
                console.log("YAY!! YOU WON VERTICALLY!!");
                console.log(board)
                return true;
            }
        }
        //Checking for diagonal win
        if(row-1 === col-1){
            for(let i=0; i<3; i++){
                if(board[i][i] !== token){
                    break; //We don't have three of the same tokens in a row
                }
                if(i === 2){
                    console.log("YAY!! YOU WON DIAGONALLY!!");
                    console.log(board)
                    return true;
                }
            }
        }

        if((row-1) + (col-1) === 2){
            console.log("WE HERE!")
            for(let i=0; i<3; i++){
                console.log("AHHSD")
                if(board[i][(3-1)-i] !== token){
                    break; //We don't have three of the same tokens in a row
                }
                if(i === 2){
                    console.log("YAY!! YOU WON REVERSE DIAGONALLY!!");
                    console.log(board)
                    return true;
                }
            }
        }
        console.log(board)


        // switch(squarePosition+1){
        //     case 1:
                
        //         if(board[0] === token && board[1] === token && board[2] === token){
        //             console.log("WON: " + squarePosition)
        //             return true;
        //         }
        //     case 2:
        //         console.log("WON: " + squarePosition)
        //         return true;
        //     case 3:
        //         console.log("WON: " + squarePosition)
        //         return true;
        //     case 4:
        //         console.log("WON: " + squarePosition)
        //         return true;
        //     case 5:
        //         console.log("WON: " + squarePosition)
        //         return true;
        //     case 6:
        //         console.log("WON: " + squarePosition)
        //         return true;
        //     case 7:
        //         console.log("WON: " + squarePosition)
        //         return true;
        //     case 8:
        //         console.log("WON: " + squarePosition)
        //         return true;
        //     case 9:
        //         console.log("WON: " + squarePosition)
        //         return true;
        //     default:
        //         console.log("STILL IN THE GANE")
        //         return false;
        // }
    }

    return{playRound};
})();

const displayGame = (() => {
    const displayGUI = () =>{
        for(let i=0; i<9; i++){
            let square = document.createElement("div");
            square.classList.add("Square");
            square.setAttribute("style", "background-color: black; color: white; border: none; width:100px; height:100px;");
            square.setAttribute("data-state", i)
            gameBoardDiv.appendChild(square);
            square.addEventListener("click", () =>{
                if(square.textContent !== ""){
                    //Flash red, illegal move
                    square.setAttribute("style", "background-color: red; color: white; border: none; width:100px; height:100px;");
                    console.log("ILLEGAL MOVE");
                }
                else{
                    gameController.playRound(square)
                }
            });
        }
    }
    return{displayGUI}
})();

displayGame.displayGUI();

