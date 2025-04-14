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

  // Format time helper
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Timer setup
  function setupTimers() {
    cards.forEach(card => {
      const timer = card.querySelector(".timer");
      const status = card.querySelector(".status");
      const bidBtn = card.querySelector(".bid-btn");

      // Random time: between 90s (1.5min) and 180s (3min)
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

  // Filters and Sorting
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

  // Sorting
  sortSelect.addEventListener("change", () => {
    const sortType = sortSelect.value;
    const sorted = [...cards].sort((a, b) => {
      const bidA = parseFloat(a.dataset.bid);
      const bidB = parseFloat(b.dataset.bid);
      return sortType === "high" ? bidB - bidA : bidA - bidB;
    });
    sorted.forEach(card => container.appendChild(card));
  });

  // Bid range update
  bidRangeInput.addEventListener("input", () => {
    bidRangeValue.textContent = `${bidRangeInput.value} ETH`;
    filterCards();
  });

  // Category, search
  categorySelect.addEventListener("change", filterCards);
  searchInput.addEventListener("input", filterCards);

  // Show Ending Soon
  endingSoonBtn.addEventListener("click", () => {
    let anyVisible = false;
    cards.forEach(card => {
      const match = card.dataset.time === "soon";
      card.style.display = match ? "block" : "none";
      if (match) anyVisible = true;
    });
    noResultsMessage.style.display = anyVisible ? "none" : "block";
  });

  // Show Recently Added
  recentlyAddedBtn.addEventListener("click", () => {
    let anyVisible = false;
    cards.forEach(card => {
      const match = card.dataset.time === "recent";
      card.style.display = match ? "block" : "none";
      if (match) anyVisible = true;
    });
    noResultsMessage.style.display = anyVisible ? "none" : "block";
  });

  // Show Ended
  endedBtn.addEventListener("click", () => {
    let anyVisible = false;
    cards.forEach(card => {
      const match = card.dataset.status === "ended";
      card.style.display = match ? "block" : "none";
      if (match) anyVisible = true;
    });
    noResultsMessage.style.display = anyVisible ? "none" : "block";
  });

  // Reset all filters
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

  // Setup timers
  setupTimers();