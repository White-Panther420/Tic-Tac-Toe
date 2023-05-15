const GUI = document.querySelector(".GUI")
const player1GUI = document.querySelector(".LeftGUI")
const AIGUI = document.querySelector(".RightGUI")
const Player2GUI = document.querySelector(".RightGUIPlayer2")
const StartScreenContent = document.querySelector(".StartScreenContent")
const DifficultyScreenContent = document.querySelector(".DifficultyScreen")
const gameContent = document.querySelector(".GameContent")
const gameBoardDiv = document.querySelector(".GameBoard")
const player1Score = document.querySelector(".LeftScore");
const player2Score = document.querySelector(".Player2Score");
const AIScore = document.querySelector(".RightScore")
const restartBtn = document.querySelector(".Restart")
const QuitBtn = document.querySelector(".QuitBtn")
let AISelection = false; //Used to identify the correct right-side GUI
let winRound = false;  //Used to stop user from clicking on squares
let winGame = false;
let currentTurn = 0;  //Will keep track of turn
let AIDifficulty = ""
let movesCount = 1; //Keep track of moves to later determine a draw
/******************************Start Screen******************************/
const Player2Btn = document.querySelector(".vsPlayer")
Player2Btn.addEventListener("click", ()=>{
    restartBtn.style.display = "flex"
    AISelection = false;
    StartScreenContent.style.display = "none"
    gameContent.style.display = "flex"
    Player2GUI.style.display = "block"
    displayGame.displayBoard();
})

const AIBtn = document.querySelector(".VsAI")
AIBtn.addEventListener("click", ()=>{
    AISelection = true;
    DifficultyScreenContent.style.display = "flex"
    StartScreenContent.style.display = "none"
})
/******************************Start Screen******************************/

/****************************Difficulty Screen***************************/
const EasyBtn = document.querySelector(".Easy")
EasyBtn.addEventListener("click", ()=>{
    startGame()
    AIDifficulty = "Easy"
})
const MediumBtn = document.querySelector(".Medium")
MediumBtn.addEventListener("click", ()=>{
    startGame()
    AIDifficulty = "Medium"
})
const UnbeatableBtn = document.querySelector(".Unbeatable")
UnbeatableBtn.addEventListener("click", ()=>{
    startGame()
    AIDifficulty = "Unbeatable"
})
const startGame = ()=>{
    DifficultyScreenContent.style.display = "none"
    restartBtn.style.display = "flex"
    gameContent.style.display = "flex"
    AIGUI.style.display = "block"
    displayGame.displayBoard();
    if(currentTurn === 1){
        gameController.AIMove()
    }
}
/****************************Difficulty Screen***************************/


/**********************************Game**********************************/
const gameBoard = (() => {
    const board = [] // [['X', 'O', 'X'], ['X', 'O', 'X'], ['X', 'O', 'X']];
    //Creating a 3x3 board
    const createNewBoard =  () => {
        for(let i=0; i<3; i++){
            board[i] = [];
            for(let j=0; j<3; j++){
                board[i][j] = "";
            }
        }
        return board;
    };
    const getBoard = () => board; 
    return{getBoard, createNewBoard};
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
    const updateScore = () =>{
        return ++score;
    }
    const clearScore = () =>{
        return score = 0;
    }
    return{name, token, updateScore, clearScore}
};

const gameController = (() => {
    const board = gameBoard.createNewBoard();
    let playerName;
    if(AISelection){
        playerName = "Player 2"
    }
    else{
        playerName = "AI"
    }
    const players = [Player("Player 1"), Player(playerName)];
    let activeTurn = (currentTurn) =>{
        if(currentTurn === 0)
            return 1; //Player 2 / AI turn
        else
            return 0; //Player 1 turn
    };

    const playTurn = (square) => {
        winGame = false
        let squarePosition = square.getAttribute("data-state")
        let row = Math.floor(squarePosition/3)+1;
        let col = (squarePosition%3) + 1;
        let token = players[currentTurn].token();
        
        //Add class to square based on token to modify token appearence 
        if(token === "X"){
            square.classList.add("Player1X")
        }
        else if(AISelection){
            square.classList.add("AIO")
        }
        else{
            square.classList.add("Player2O")
        }

        //Update game board
        square.textContent = token
        board[row-1][col-1] = token 
        console.log("NUMBER OF MOVES: " + movesCount)
        if(wonRound(board, row, col, token)){
            let currPlayerScore = players[currentTurn].updateScore()  //Store the winner's score
            displayGame.updateScoreGUI(token, currPlayerScore)
            displayGame.printWinMsg(token, currPlayerScore)
            winRound = true
            movesCount = 1
            if(winGame){
                displayGame.removeRestartOption()
            }
            currentTurn = activeTurn(currentTurn);  //Switch turn
            return;
        }
        if(movesCount === 9){
            displayGame.printDrawMSG()
            movesCount = 1
            currentTurn = activeTurn(currentTurn);  //Switch turn
            return;
        }

        movesCount++;
        currentTurn = activeTurn(currentTurn);  //Switch turn
        if(currentTurn === 1 && AISelection){
            AIMove()
        }
    }

    const AIMove = ()=>{
        const boardForAI = document.querySelectorAll(".Square");
        if(AIDifficulty === "Easy"){
            let position = easyAIMove(boardForAI)
            boardForAI[position].click();
        }
        else if(AIDifficulty === "Medium"){
            mediumAIMove(boardForAI)
        }

    }

    const easyAIMove = (boardForAI)=>{
        let legalMove = false
        let movePosition;
        while(!legalMove){
            movePosition = Math.floor(Math.random() * 9);   //Generate random number 0-8
            if(boardForAI[movePosition].textContent === ""){
                legalMove = true
            }
        }
        return movePosition
    }

    const mediumAIMove = (boardForAI)=>{
        let AIToken = players[1].token()
        let player1Token = players[0].token()
        let position =  checkAlmostWon(AIToken) //Check if AI is about to win
        if(position === -1){  //No near win for AI
            position = checkAlmostWon(player1Token) //Check if player is about to win
            if(position === -1){  //Neither is about to win so we make a random legal move
                position = easyAIMove(boardForAI) //Make random legal move
                boardForAI[position].click();
            }
            else{
                boardForAI[position].click();  //Player is about to win so we move appropriately 
            }
        }
        else{ // AI is about to win so we move appropriately 
            boardForAI[position].click();
        }
    }

    const checkAlmostWon = (token) =>{
        let col = board.length
        let row = board[0].length
        let emptySpot = -1;
        let tokensFound;
        //Check for possible horizontal wins
        for(let i=0; i<col; i++){
            tokensFound = 0
            for(let j=0; j<row; j++){
                if(board[i][j] === token){
                    tokensFound++
                }
                else{
                    if(board[i][j] !== ""){
                        emptySpot = -1
                    }
                    else{
                        emptySpot = i * col + j  //Track last empty spot
                    }
                }
            }
            if(tokensFound === 2 && emptySpot != -1){
                return emptySpot
            }
        }

        //Check for possible vertical wins
        for(let i=0; i<row; i++){
            tokensFound = 0
            for(let j=0; j<col; j++){
                if(board[j][i] === token){
                    tokensFound++
                }
                else{
                    if(board[j][i] !== ""){
                        emptySpot = -1
                    }
                    else{
                        emptySpot = j * row + i  //Track last empty spot
                    }
                }
            }
            if(tokensFound === 2 && emptySpot != -1){
                return emptySpot
            }
        }
        
        //Check for possible diagonal wins       
        tokensFound = 0;
        for(let i=0; i<col; i++){
            if(board[i][i] === token){
                tokensFound++
            }
            else{
                if(board[i][i] !== ""){
                    emptySpot = -1
                }
                else{
                    emptySpot = i * row + i  //Track last empty spot
                }
            }
        }
        if(tokensFound === 2 && emptySpot != -1){
            return emptySpot
        }

        //Check for possible reverse diagonal wins       
        tokensFound = 0;
        for(let i=0; i<3; i++){
            if(board[i][(3-1)-i] === token){
                tokensFound++
            }
            else{
                if(board[i][(3-1)-i] !== ""){
                    emptySpot = -1
                }
                else{
                    emptySpot = i * row + ((3-1)-i)  //Track last empty spot
                }
            }
        }
        if(tokensFound !== 2){
            return emptySpot = -1
        }
        else{
            return emptySpot
        }
    }

    const wonRound = (board, row, col, token) => {
        //checking for horizontal win
        for(let i=0; i<3; i++){
            if(board[i][col-1] !== token){
                break; //We don't have three of the same tokens in a row
            }
            if(i === 2){
                console.log(board)
                return true;
            }
        }
        //Checking for vertical win
        for(let j=0; j<3; j++){
            if(board[row-1][j] !== token){
                break; //We don't have three of the same tokens in a row
            }
            if(j === 2){
                console.log(board)
                return true;
            }
        }
        //Checking for diagonal win
        if(col-1 === row-1){
            for(let i=0; i<3; i++){
                if(board[i][i] !== token){
                    break; //We don't have three of the same tokens in a row
                }
                if(i === 2){
                    console.log(board)
                    return true;
                }
            }
        }

        //Checking for reverse diagonal win
        if((col-1) + (row-1) === 2){
            for(let i=0; i<3; i++){
                if(board[i][(3-1)-i] !== token){
                    break; //We don't have three of the same tokens in a row
                }
                if(i === 2){
                    return true;
                }
            }
        }
    }
    
    const resetScore = ()=>{  //Allows quitBtn to also reset score on backend. Not just GUI
        players[0].clearScore()
        players[1].clearScore();
    }

    return{playTurn, AIMove, resetScore};
})();

const displayGame = (() => {
    restartBtn.addEventListener("click", () =>{
        restartGame();
        if(currentTurn == 1 && AISelection){
            gameController.AIMove()
        }
    })
    QuitBtn.addEventListener("click", ()=>{
        gameController.resetScore();
        endGame();
    })

    const displayBoard = () =>{
        for(let i=0; i<9; i++){
            let square = document.createElement("div");
            square.classList.add("Square");
            square.setAttribute("style", "background-color: black; border: none; width:100px; height:100px;");
            square.setAttribute("data-state", i)
            gameBoardDiv.appendChild(square);
            square.addEventListener("click", func)
            function func(){
                if(winRound || (winRound && square.textContent !== "")){ 
                    //Prevent user from clicking on any square once game is over
                    square.removeEventListener("click", func)
                }
                else if(winGame)
                {
                    square.removeEventListener("click", func)
                }
                else if(square.textContent !== ""){
                    //Flash red, illegal move
                    square.setAttribute("style", "background-color: red; color: white; border: none; width:100px; height:100px;");
                    console.log("ILLEGAL MOVE");
                }
                else{
                    gameController.playTurn(square)
                }
            }
        }
    }
    const updateScoreGUI = (token, score) =>{
        if(token === 'X'){
            player1Score.textContent = score;
        }
        else if(AISelection){
            AIScore.textContent = score
        }
        else{
            player2Score.textContent = score;
        }
    }

    const printWinMsg = (token, score) =>{
        let playerName;
        const winMsg = document.querySelector(".win_p");
        winMsg.classList.add("winMsg")
        if(token === 'O' && !AISelection){
            playerName = "Player 2";
            GUI.insertBefore(winMsg, Player2GUI)
        }
        else if(token === 'O' && AISelection){
            playerName = "AU"
            GUI.insertBefore(winMsg, AIGUI)
        }
        else{
            playerName = "Player 1"
            if(AISelection)
                GUI.insertBefore(winMsg, AIGUI)
            else
                GUI.insertBefore(winMsg, Player2GUI)
        }
        if(score === 5){
            winMsg.textContent = `${playerName} has won the game!!!!`
            winGame = true
        }
        else{
            winMsg.textContent = `${playerName} has won the round!`
        }
    }

    const printDrawMSG = () =>{
        const drawMsg = document.querySelector(".draw_p")
        drawMsg.classList.add("drawMsg")
        drawMsg.textContent = "This game is a draw!"
        player1GUI.parentNode.insertBefore(drawMsg, player1GUI.nextSibling);
    }

    const endGame = ()=>{
        movesCount = 1;
        gameContent.style.display = "none"
        const winMsgElement = document.querySelector(".win_p")
        const drawMsgElement = document.querySelector(".draw_p")
        winMsgElement.classList.remove("winMsg")
        drawMsgElement.classList.remove("drawMsg")
        gameBoard.createNewBoard();
        gameBoardDiv.textContent = ""
        player1Score.textContent = "0"
        if(AISelection){
            AIGUI.style.display = "none"
            AIScore.textContent = "0"
        }
        else{
            Player2GUI.style.display = "none"
            player2Score.textContent = "0"
        }
        StartScreenContent.style.display = "flex"
        winGame = false;
        winRound = false;
    }

    const restartGame = () =>{
        movesCount = 1;
        gameBoardDiv.textContent = "";
        const winMsgElement = document.querySelector(".win_p")
        const drawMsgElement = document.querySelector(".draw_p")
        winMsgElement.classList.remove("winMsg")
        drawMsgElement.classList.remove("drawMsg")
        winRound = false;
        gameBoard.createNewBoard();
        displayBoard();
    }

    const removeRestartOption = () =>{
        restartBtn.style.display = "none"
    }

    return{displayBoard, updateScoreGUI, printWinMsg, printDrawMSG, removeRestartOption}
})();



