const sortSelect = document.getElementById("sortBid");
const categorySelect = document.getElementById("filterCategory");
const endingSoonBtn = document.getElementById("endingSoon");
const recentlyAddedBtn = document.getElementById("recentlyAdded");
const resetBtn = document.getElementById("resetFilters");
const endedBtn = document.getElementById("ended");

const searchInput = document.getElementById("searchInput");
const bidRangeInput = document.getElementById("bidRange");
const bidRangeValue = document.getElementById("bidRangeValue");

const container = document.querySelector(".auction-grid");
const cards = Array.from(document.querySelectorAll(".auction-card"));
const noResultsMessage = document.getElementById("noResults");

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

function setupTimers() {
  cards.forEach(card => {
    const timer = card.querySelector(".timer");
    const status = card.querySelector(".status");
    const bidBtn = card.querySelector(".bid-btn");

    let timeLeft = Math.floor(Math.random() * 90) + 90;

    card.dataset.time = timeLeft <= 90 ? "soon" : "recent";

    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        timer.textContent = "Auction Ended";
        status.textContent = "Ended";
        status.classList.remove("live", "ending-soon");
        status.classList.add("ended");
        card.classList.add("auction-ended");
        bidBtn.style.display = "none";
        card.dataset.status = "ended";
        card.dataset.time = "ended";
        return;
      }

      timer.textContent = `Time Left : ${formatTime(timeLeft)}`;

      if (timeLeft <= 90) {
        status.textContent = "Ending Soon";
        status.classList.add("ending-soon");
        card.dataset.time = "soon";
      } else {
        status.textContent = "Recently Added";
        card.dataset.time = "recent";
      }

      timeLeft--;
    }, 1000);
  });
}

function filterCards() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;
  const maxBid = parseFloat(bidRangeInput.value);

  cards.forEach(card => {
    const cardText = card.textContent.toLowerCase();
    const bid = parseFloat(card.dataset.bid);
    const category = card.dataset.category;

    const matchesSearch = cardText.includes(searchTerm);
    const matchesCategory = selectedCategory === "Filter by Category" || category === selectedCategory;
    const matchesBid = bid <= maxBid;

    card.style.display = matchesSearch && matchesCategory && matchesBid ? "block" : "none";
  });
}

sortSelect.addEventListener("change", () => {
  const sortType = sortSelect.value;
  const sorted = [...cards].sort((a, b) => {
    const bidA = parseFloat(a.dataset.bid);
    const bidB = parseFloat(b.dataset.bid);
    return sortType === "high" ? bidB - bidA : bidA - bidB;
  });
  sorted.forEach(card => container.appendChild(card));
});

bidRangeInput.addEventListener("input", () => {
  bidRangeValue.textContent = `${bidRangeInput.value} ETH`;
  filterCards();
});

categorySelect.addEventListener("change", filterCards);
searchInput.addEventListener("input", filterCards);

endingSoonBtn.addEventListener("click", () => {
  let anyVisible = false;
  cards.forEach(card => {
    const match = card.dataset.time === "soon";
    card.style.display = match ? "block" : "none";
    if (match) anyVisible = true;
  });
  noResultsMessage.style.display = anyVisible ? "none" : "block";
});

recentlyAddedBtn.addEventListener("click", () => {
  let anyVisible = false;
  cards.forEach(card => {
    const match = card.dataset.time === "recent";
    card.style.display = match ? "block" : "none";
    if (match) anyVisible = true;
  });
  noResultsMessage.style.display = anyVisible ? "none" : "block";
});

endedBtn.addEventListener("click", () => {
  let anyVisible = false;
  cards.forEach(card => {
    const match = card.dataset.status === "ended";
    card.style.display = match ? "block" : "none";
    if (match) anyVisible = true;
  });
  noResultsMessage.style.display = anyVisible ? "none" : "block";
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  categorySelect.selectedIndex = 0;
  sortSelect.selectedIndex = 0;
  bidRangeInput.value = 25;
  bidRangeValue.textContent = "25 ETH";
  cards.forEach(card => {
    card.style.display = "block";
  });
  noResultsMessage.style.display = "none";
});

setupTimers();

// Modal logic
document.querySelectorAll(".bid-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const card = this.closest(".auction-card");

    // Fetch the initial time left from the auction card's data attribute
    const timeLeft = parseInt(card.dataset.timeLeft);

    // Update the modal with the card's details
    document.getElementById("modalImage").src = card.querySelector("img").src;
    document.getElementById("modalBrand").textContent = card.querySelector("h3").textContent;
    document.getElementById("modalModel").textContent = card.querySelector("p").textContent;
    document.getElementById("modalCondition").textContent = "Condition: " + card.querySelector(".condition_status").textContent;
    document.getElementById("modalLocation").textContent = "Location: " + card.querySelector(".actual_location").textContent;
    document.getElementById("modalDescription").textContent = "Description: " + card.querySelector(".acutal_desc").textContent;
    document.getElementById("modalBaseBid").textContent = card.dataset.bid;

    // Start the timer for the modal with the same value as the auction card's timer
    updateModalTimer(timeLeft);

    // Show the modal
    document.getElementById("bidModal").style.display = "block";
  });
});

// Modal timer function
function updateModalTimer(timeLeft) {
  const timerElement = document.getElementById("modalTimer");

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const interval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(interval);
      timerElement.textContent = "Auction Ended";
    } else {
      timerElement.textContent = `Time Left: ${formatTime(timeLeft)}`;
      timeLeft--;
    }
  }, 1000);
}
// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("bidModal").style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", function (event) {
  const modal = document.getElementById("bidModal");
  if (modal && event.target === modal) {
    modal.style.display = "none";
  }
});

// Optional watchlist feature
document.getElementById("watchlistBtn").addEventListener("click", () => {
  alert("Added to your watchlist!");
});

// Placeholder countdown inside modal
setInterval(() => {
  const now = new Date();
  const hrs = String(23 - now.getHours()).padStart(2, '0');
  const mins = String(59 - now.getMinutes()).padStart(2, '0');
  const secs = String(59 - now.getSeconds()).padStart(2, '0');
  document.getElementById("modalTimer").textContent = `${hrs}:${mins}:${secs}`;
}, 1000);

