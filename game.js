const AIGUI = document.querySelector(".RightGUI")
const Player2GUI = document.querySelector(".RightGUIPlayer2")
const StartScreenContent = document.querySelector(".StartScreenContent")
const gameContent = document.querySelector(".GameContent")

const Player2Btn = document.querySelector(".vsPlayer")
Player2Btn.addEventListener("click", ()=>{
    StartScreenContent.style.display = "none"
    gameContent.style.display = "flex"
    Player2GUI.style.display = "block"
})

const AIBtn = document.querySelector(".VsAI")
AIBtn.addEventListener("click", ()=>{
    StartScreenContent.style.display = "none"
    gameContent.style.display = "flex"
    AIGUI.style.display = "block"
})

const Gameboard = (() =>{
    let gameboad = [X, X, 0, X, X, X, O, O, X]
    
})()


