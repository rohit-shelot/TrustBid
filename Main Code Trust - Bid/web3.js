// Contract ABI
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "basePrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			}
		],
		"name": "AuctionCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "AuctionEnded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_auctionId",
				"type": "uint256"
			}
		],
		"name": "bid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_basePrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_durationInSeconds",
				"type": "uint256"
			}
		],
		"name": "createAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_auctionId",
				"type": "uint256"
			}
		],
		"name": "endAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "NewBidPlaced",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "auctionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "auctions",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "basePrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "highestBidder",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "highestBid",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_auctionId",
				"type": "uint256"
			}
		],
		"name": "getAuctionDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "basePrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "highestBid",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "highestBidder",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_auctionId",
				"type": "uint256"
			}
		],
		"name": "getTimeLeft",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "secondsLeft",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Contract address
const contractAddress = "0xf9a56b87016307622b4bc3f2096d633034876d31";

// Initialize Web3
let web3;
let contract;
let accounts;

async function initWeb3() {
    // Check if Web3 is injected by MetaMask
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected to MetaMask");
            
            // Initialize contract
            contract = new web3.eth.Contract(contractABI, contractAddress);
            return true;
        } catch (error) {
            console.error("User denied account access");
            return false;
        }
    } else {
        console.error("MetaMask not detected");
        return false;
    }
}

// Function to create a new auction
async function createAuction(title, description, basePrice, durationInSeconds) {
    try {
        const result = await contract.methods.createAuction(
            title,
            description,
            web3.utils.toWei(basePrice.toString(), 'ether'),
            durationInSeconds
        ).send({ from: accounts[0] });
        return result;
    } catch (error) {
        console.error("Error creating auction:", error);
        throw error;
    }
}

// Function to place a bid
async function placeBid(auctionId, bidAmount) {
    try {
        const result = await contract.methods.placeBid(auctionId)
            .send({ 
                from: accounts[0],
                value: web3.utils.toWei(bidAmount.toString(), 'ether')
            });
        return result;
    } catch (error) {
        console.error("Error placing bid:", error);
        throw error;
    }
}

// Function to end an auction
async function endAuction(auctionId) {
    try {
        const result = await contract.methods.endAuction(auctionId)
            .send({ from: accounts[0] });
        return result;
    } catch (error) {
        console.error("Error ending auction:", error);
        throw error;
    }
}

// Function to get auction details
async function getAuctionDetails(auctionId) {
    try {
        const result = await contract.methods.getAuctionDetails(auctionId).call();
        return {
            owner: result[0],
            title: result[1],
            description: result[2],
            basePrice: web3.utils.fromWei(result[3], 'ether'),
            highestBid: web3.utils.fromWei(result[4], 'ether'),
            highestBidder: result[5],
            endTime: result[6],
            isActive: result[7]
        };
    } catch (error) {
        console.error("Error getting auction details:", error);
        throw error;
    }
}

// Function to get total number of auctions
async function getAuctionCount() {
    try {
        const count = await contract.methods.auctionCount().call();
        return count;
    } catch (error) {
        console.error("Error getting auction count:", error);
        throw error;
    }
}

// Export functions for use in other files
window.trustBid = {
    initWeb3,
    createAuction,
    placeBid,
    endAuction,
    getAuctionDetails,
    getAuctionCount
}; 