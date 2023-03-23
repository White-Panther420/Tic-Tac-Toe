const AIGUI = document.querySelector(".RightGUI")
const Player2GUI = document.querySelector(".RightGUIPlayer2")
const StartScreenContent = document.querySelector(".StartScreenContent")
const gameContent = document.querySelector(".GameContent")
const gameBoardSquares = document.querySelectorAll(".Square");
let opponentSelection = "";
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
    const board = ['', '', '','', '', '','', '', ''];
    const getBoard = () => board; 
    //Display gameBoard
    displayArray = (board) => {
        let i=0;
        gameBoardSquares.forEach(square => {
            square.setAttribute("data-state", i)
            square.setAttribute("style", "background-color: #000000; color: white; border: none; width:100px; height:100px;");
            square.textContent = board[i];
            i++;
        });
    }
    return{getBoard, displayArray};
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
    return{name, token}
};

const gameController = (() => {
    const board = gameBoard.getBoard();
    gameBoard.displayArray(board);
    console.log("OP SELECTION: " + opponentSelection);
    const players = [Player("Player 1"), Player("Pkayer 2")];
    let activeTurn = (currentTurn) =>{
        if(currentTurn === 0)
            return 1; //Player 1 turn
        else    
            return 0; //Player 2 / AI turn
    };

    const playRound = () => {
        let win = false;
        let currentTurn = 0;
        gameBoardSquares.forEach(square => {
            square.addEventListener("click", () =>{
                if(square.textContent !== ""){
                    //Flash red, illegal move
                    square.setAttribute("style", "background-color: red; color: white; border: none; width:100px; height:100px;");
                    console.log("ILLEGAL MOVE");
                }
                else{
                    console.log("CURRENT MOVE: " + players[currentTurn].token());
                    squarePosition = square.getAttribute("data-state")
                    square.textContent = players[currentTurn].token();
                    board[squarePosition] = players[currentTurn].token(); //Update game board
                    // if(wonRound(board, squarePosition)){
                    //     win = true
                    // }
                    currentTurn = activeTurn(currentTurn);  //Switch turn
                    console.log("LEGAL MOVE: " + players[currentTurn].token());
                    console.log("CURRENT BOARD: " + board);
                    console.log("CURRENT TURN: " + currentTurn);
                }
            })
        });
        
    };

    const wonRound = (board, squarePosition) => {
        switch(squarePosition+1){
            case 1:
                console.log("WON: " + squarePosition)
                return true;
            case 2:
                console.log("WON: " + squarePosition)
                return true;
            case 3:
                console.log("WON: " + squarePosition)
                return true;
            case 4:
                console.log("WON: " + squarePosition)
                return true;
            case 5:
                console.log("WON: " + squarePosition)
                return true;
            case 6:
                console.log("WON: " + squarePosition)
                return true;
            case 7:
                console.log("WON: " + squarePosition)
                return true;
            case 8:
                console.log("WON: " + squarePosition)
                return true;
            case 9:
                console.log("WON: " + squarePosition)
                return true;
            default:
                console.log("STILL IN THE GANE")
                return false;
        }
    }

    return{playRound};
})();



gameController.playRound();
