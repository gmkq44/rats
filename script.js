document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.querySelector('#score');
    const timeLeftDisplay = document.querySelector('#time-left');
    const startButton = document.querySelector('#start-button');
    const holes = document.querySelectorAll('.hole');

    let score = 0;
    let timeLeft = 60;
    let hitPosition = null;
    let moleTimerId = null;
    let countDownTimerId = null;
    let gameInProgress = false;
    let speed = 800;

    function randomHole() {
        // Clear previous mole/bomb
        holes.forEach(hole => {
            hole.classList.remove('mole', 'bomb', 'up');
        });

        // Pick a random hole
        const randomIndex = Math.floor(Math.random() * holes.length);
        const hole = holes[randomIndex];

        // Decide if it's a mole or a bomb (20% chance of bomb)
        if (Math.random() < 0.2) {
            hole.classList.add('bomb');
        } else {
            hole.classList.add('mole');
        }
        hole.classList.add('up');

        // Store the position of the current mole/bomb
        hitPosition = hole.id;
    }

    function moveMole() {
        moleTimerId = setInterval(randomHole, speed);
    }

    function handleWhack() {
        if (!gameInProgress || this.id !== hitPosition) {
            return; // Don't do anything if game isn't running or it's not the right hole
        }

        // Check if it's a mole or bomb
        if (this.classList.contains('mole')) {
            score++;
        } else if (this.classList.contains('bomb')) {
            score = Math.max(0, score - 5); // Penalize but don't go below 0
        }

        scoreDisplay.textContent = score;

        // Remove the mole/bomb immediately after it's whacked
        this.classList.remove('up');
        hitPosition = null; // Prevent multiple scores on the same mole
    }

    // Add event listeners ONCE at the start
    holes.forEach(hole => hole.addEventListener('click', handleWhack));

    function countDown() {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(countDownTimerId);
            clearInterval(moleTimerId);
            gameInProgress = false;
            alert('游戏结束! 你的最终得分是: ' + score);
            startButton.textContent = '重新开始';
            startButton.disabled = false;
            hitPosition = null; // Reset hit position
            holes.forEach(hole => hole.classList.remove('mole', 'bomb', 'up')); // Clear board
        }
    }

    function startGame() {
        if (gameInProgress) return;

        gameInProgress = true;
        score = 0;
        timeLeft = 60;
        speed = 800;
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;
        startButton.disabled = true;
        startButton.textContent = '游戏中...';

        moveMole();
        countDownTimerId = setInterval(countDown, 1000);
    }

    startButton.addEventListener('click', startGame);
});