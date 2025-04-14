const totalTime = 600; // 10 minutes in seconds
let timeLeft = totalTime;

const fillBar = document.querySelector('.timebar_fill');
const timeText = document.getElementById('time-left');

function updateBar() {
const percentage = ((totalTime - timeLeft) / totalTime) * 100;
fillBar.style.width = `${percentage}%`;

const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;
timeText.textContent = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

if (timeLeft > 0) {
    timeLeft--;
    setTimeout(updateBar, 1000);
} else {
    timeText.textContent = 'Auction Ended';
}
}

updateBar();
