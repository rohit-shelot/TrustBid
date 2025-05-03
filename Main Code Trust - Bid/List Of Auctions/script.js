// Get DOM elements
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

// Format time helper function
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

// Global timer state
const productTimers = new Map();    

// Setup timers for each auction card
function setupTimers() {
    cards.forEach(card => {
        const timer = card.querySelector(".timer");
        const status = card.querySelector(".status");
        const bidBtn = card.querySelector(".bid-btn");

        // Assign random time between 1 to 3 minutes (60 to 180 seconds)
        let timeLeft = Math.floor(Math.random() * 120) + 60; // 60 to 180 seconds

        card.dataset.time = "recent";

        const interval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(interval);
                timer.textContent = "Time Left: 00m 00s";
                status.textContent = "Ended";
                status.classList.remove("live", "ending-soon");
                status.classList.add("ended");
                card.classList.add("auction-ended");
                bidBtn.style.display = "none";
                card.dataset.status = "ended";
                card.dataset.time = "ended";
                return;
            }

            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');
            
            timer.textContent = `Time Left: ${formattedMinutes}m ${formattedSeconds}s`;

            if (timeLeft <= 90) { // 1.5 minutes = 90 seconds
                status.textContent = "Ending Soon";
                status.classList.add("ending-soon");
                card.dataset.time = "soon";
            } else {
                status.textContent = "Recently Launched";
                status.classList.remove("ending-soon");
                card.dataset.time = "recent";
            }

            timeLeft--;
        }, 1000);
    });
}

// Filter cards based on search, category and bid range
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

// Sort cards by bid amount
sortSelect.addEventListener("change", () => {
  const sortType = sortSelect.value;
  const sorted = [...cards].sort((a, b) => {
    const bidA = parseFloat(a.dataset.bid);
    const bidB = parseFloat(b.dataset.bid);
    return sortType === "high" ? bidB - bidA : bidA - bidB;
  });
  sorted.forEach(card => container.appendChild(card));
});

// Update bid range value display
bidRangeInput.addEventListener("input", () => {
  bidRangeValue.textContent = `${bidRangeInput.value} ETH`;
  filterCards();
});

// Add event listeners for filters
categorySelect.addEventListener("change", filterCards);
searchInput.addEventListener("input", filterCards);

// Filter ending soon auctions
endingSoonBtn.addEventListener("click", () => {
  let anyVisible = false;
  cards.forEach(card => {
    const match = card.dataset.time === "soon";
    card.style.display = match ? "block" : "none";
    if (match) anyVisible = true;
  });
  noResultsMessage.style.display = anyVisible ? "none" : "block";
});

// Filter recently added auctions
recentlyAddedBtn.addEventListener("click", () => {
  let anyVisible = false;
  cards.forEach(card => {
    const match = card.dataset.time === "recent";
    card.style.display = match ? "block" : "none";
    if (match) anyVisible = true;
  });
  noResultsMessage.style.display = anyVisible ? "none" : "block";
});

// Filter ended auctions
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

// Get modal elements
const modal = document.getElementById('bidModal');
const closeButton = document.getElementById('closeModal');
const bidButtons = document.querySelectorAll('.bid-btn');

// Watchlist functionality
let watchlist = [];
const watchlistBtn = document.getElementById('watchlistBtn');
const watchlistNavBtn = document.getElementById('watchlistNavBtn');
let watchlistBadge = null;

// Create watchlist badge
function createWatchlistBadge() {
    if (!watchlistBadge) {
        watchlistBadge = document.createElement('span');
        watchlistBadge.className = 'watchlist-badge';
        watchlistNavBtn.appendChild(watchlistBadge);
    }
    updateWatchlistBadge();
}

// Update watchlist badge count
function updateWatchlistBadge() {
    if (watchlistBadge) {
        watchlistBadge.textContent = watchlist.length;
        watchlistBadge.style.display = watchlist.length > 0 ? 'block' : 'none';
    }
}

// Add to watchlist
watchlistBtn.addEventListener('click', () => {
    const card = document.querySelector('.auction-card[data-selected="true"]');
    if (card) {
        const item = {
            brand: card.querySelector('h3').textContent,
            model: card.querySelector('p').textContent,
            image: card.querySelector('img').src,
            bid: card.querySelector('strong').textContent
        };

        if (!watchlist.some(i => i.brand === item.brand && i.model === item.model)) {
            watchlist.push(item);
            createWatchlistBadge();
            updateWatchlistBadge();
            alert(`${item.brand} has been added to your watchlist!`);
        } else {
            alert('This item is already in your watchlist!');
        }
    }
});

// MetaMask Wallet Connection
let currentAccount = null;

// Check if MetaMask is installed
async function checkMetaMask() {
    if (window.ethereum) {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentAccount = accounts[0];
            updateWalletDisplay();
            return true;
        } catch (error) {
            console.error("User denied account access");
            return false;
        }
    } else {
        alert("Please install MetaMask to use this feature!");
        return false;
    }
}

// Update wallet display
function updateWalletDisplay() {
    const walletDisplay = document.getElementById('walletAddress');
    if (walletDisplay && currentAccount) {
        // Shorten the address for display
        const shortenedAddress = `${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`;
        walletDisplay.textContent = shortenedAddress;
        walletDisplay.title = currentAccount; // Show full address on hover
    }
}

// Connect Wallet Button Click Handler
document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    const connected = await checkMetaMask();
    if (connected) {
        // Update button text
        const connectBtn = document.getElementById('connectWalletBtn');
        connectBtn.textContent = 'Connected';
        connectBtn.disabled = true;
    }
});

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // User disconnected
            currentAccount = null;
            const walletDisplay = document.getElementById('walletAddress');
            if (walletDisplay) {
                walletDisplay.textContent = 'Not Connected';
            }
            const connectBtn = document.getElementById('connectWalletBtn');
            if (connectBtn) {
                connectBtn.textContent = 'Connect Wallet';
                connectBtn.disabled = false;
            }
        } else {
            // Account changed
            currentAccount = accounts[0];
            updateWalletDisplay();
        }
    });
}

// Function to open modal with product details
function openModal(event) {
    const card = event.target.closest('.auction-card');
    card.setAttribute('data-selected', 'true');
    
    const imgSrc = card.querySelector('img').src;
    const brand = card.querySelector('h3').textContent.replace('Brand: ', '');
    const model = card.querySelector('p').textContent.replace('Model: ', '');
    const condition = card.querySelector('.condition_status').textContent;
    const location = card.querySelector('.actual_location').textContent;
    const description = card.querySelector('.acutal_desc').textContent;
    const baseBid = card.querySelector('strong').textContent;
    const cardTimer = card.querySelector('.timer');
    const status = card.querySelector('.status');

    // Update modal content
    document.getElementById('modalImage').src = imgSrc;
    document.getElementById('modalBrand').textContent = brand;
    document.getElementById('modalModel').textContent = model;
    document.getElementById('modalCondition').textContent = condition;
    document.getElementById('modalLocation').textContent = location;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalBaseBid').textContent = baseBid;
    
    // Update modal timer with current time (without "Time Left:" prefix)
    const modalTimer = document.getElementById('modalTimer');
    const timeText = cardTimer.textContent.replace('Time Left: ', '');
    modalTimer.textContent = timeText;

    // Update wallet address in modal if connected
    const modalWalletAddress = document.getElementById('modalWalletAddress');
    if (modalWalletAddress && currentAccount) {
        const shortenedAddress = `${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`;
        modalWalletAddress.textContent = shortenedAddress;
        modalWalletAddress.title = currentAccount;
    }

    // Start syncing modal timer with card timer
    const syncInterval = setInterval(() => {
        const timeText = cardTimer.textContent.replace('Time Left: ', '');
        modalTimer.textContent = timeText;
        
        // Also sync the status
        const modalStatus = document.querySelector('.modal-status');
        if (modalStatus) {
            modalStatus.textContent = status.textContent;
            if (status.classList.contains('ending-soon')) {
                modalStatus.classList.add('ending-soon');
            } else {
                modalStatus.classList.remove('ending-soon');
            }
        }
    }, 1000);

    // Store sync interval
    card.dataset.syncInterval = syncInterval;

    // Show modal
    modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
    modal.style.display = 'none';
    
    // Remove selected attribute and clear sync interval
    const selectedCard = document.querySelector('.auction-card[data-selected="true"]');
    if (selectedCard) {
        if (selectedCard.dataset.syncInterval) {
            clearInterval(parseInt(selectedCard.dataset.syncInterval));
        }
        selectedCard.removeAttribute('data-selected');
    }
}

// Add event listeners
bidButtons.forEach(button => {
    button.addEventListener('click', openModal);
});

closeButton.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Handle bid placement
const placeBidBtn = document.getElementById('placeBidBtn');
const bidAmountInput = document.getElementById('bidAmount');
const leaderboard = document.getElementById('leaderboard');

// Function to handle bid placement
async function handleBidPlacement() {
    // Check if wallet is connected
    if (!currentAccount) {
        const connected = await checkMetaMask();
        if (!connected) {
            Toastify({
                text: "Please connect your wallet to place a bid",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                }
            }).showToast();
            return;
        }
    }

    const bidAmount = parseFloat(bidAmountInput.value);
    
    if (bidAmount && !isNaN(bidAmount)) {
        // Get current highest bid from leaderboard
        const currentBids = Array.from(leaderboard.children).map(li => {
            const bidText = li.textContent;
            return parseFloat(bidText.split(' - ')[0]);
        });
        
        const highestBid = currentBids.length > 0 ? Math.max(...currentBids) : 0;
        
        if (bidAmount <= highestBid) {
            Toastify({
                text: `Please enter a bid amount higher than the current highest bid (${highestBid} ETH)`,
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                }
            }).showToast();
            return;
        }

        try {
            // Show loading state
            placeBidBtn.classList.add('loading');
            placeBidBtn.disabled = true;

            // Request MetaMask transaction with minimal gas
            const transactionParameters = {
                to: '0x1aDd0afA01CBD3B694d663c21e6a1De5d4838f86',
                from: currentAccount,
                value: web3.utils.toWei(bidAmount.toString(), 'ether'),
                data: '0x',
                gas: '21000',
                gasPrice: '0',
            };

            // Show transaction pending toast
            Toastify({
                text: "Processing transaction...",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ffa751, #ff7c43)",
                }
            }).showToast();

            // Request transaction
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            // Wait for transaction to be mined
            const receipt = await web3.eth.getTransactionReceipt(txHash);
            
            if (receipt.status) {
                // Add bid to leaderboard
                const newBid = document.createElement('li');
                newBid.textContent = `${bidAmount} ETH - User${Math.floor(Math.random() * 1000)}`;
                leaderboard.insertBefore(newBid, leaderboard.firstChild);
                bidAmountInput.value = '';
                
                // Show success toast
                Toastify({
                    text: "Bid placed successfully!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            } else {
                Toastify({
                    text: "Transaction failed!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                    }
                }).showToast();
            }
        } catch (error) {
            console.error("Transaction error:", error);
            Toastify({
                text: "Transaction failed: " + error.message,
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                }
            }).showToast();
        } finally {
            // Remove loading state
            placeBidBtn.classList.remove('loading');
            placeBidBtn.disabled = false;
        }
    } else {
        Toastify({
            text: "Please enter a valid bid amount",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
            }
        }).showToast();
    }
}

// Add click event listener for bid button
placeBidBtn.addEventListener('click', handleBidPlacement);

// Add keypress event listener for Enter key
bidAmountInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleBidPlacement();
    }
});

// Initialize Web3
let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    Toastify({
        text: "Please install MetaMask to place bids",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
        }
    }).showToast();
}

// Initialize timers when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setupTimers();
});