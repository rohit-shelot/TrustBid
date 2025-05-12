// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TrustBid {
    
    struct Auction {
        address payable owner;
        string title;
        string description;
        uint256 basePrice;
        uint256 endTime;
        bool isActive;
        address highestBidder;
        uint256 highestBid;
    }

    uint256 public auctionCount;
    mapping(uint256 => Auction) public auctions;

    event AuctionCreated(uint256 auctionId, address owner, string title, uint256 basePrice, uint256 endTime);
    event NewBidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);

    modifier onlyAuctionOwner(uint256 _auctionId) {
        require(msg.sender == auctions[_auctionId].owner, "Not the auction owner");
        _;
    }

    modifier auctionExists(uint256 _auctionId) {
        require(_auctionId < auctionCount, "Auction does not exist");
        _;
    }

    modifier isAuctionActive(uint256 _auctionId) {
        require(auctions[_auctionId].isActive, "Auction is not active");
        require(block.timestamp < auctions[_auctionId].endTime, "Auction has ended");
        _;
    }

    function createAuction(
        string memory _title,
        string memory _description,
        uint256 _basePrice,
        uint256 _durationInSeconds
    ) external {
        require(_basePrice > 0, "Base price must be greater than 0");
        require(_durationInSeconds > 0, "Duration must be positive");

        auctions[auctionCount] = Auction({
            owner: payable(msg.sender),
            title: _title,
            description: _description,
            basePrice: _basePrice,
            endTime: block.timestamp + _durationInSeconds,
            isActive: true,
            highestBidder: address(0),
            highestBid: 0
        });

        emit AuctionCreated(auctionCount, msg.sender, _title, _basePrice, block.timestamp + _durationInSeconds);
        auctionCount++;
    }

    function bid(uint256 _auctionId) external payable auctionExists(_auctionId) isAuctionActive(_auctionId) {
    Auction storage auction = auctions[_auctionId];
    require(msg.sender != auction.owner, "Owner cannot bid");

    // Check against basePrice if no bids yet
    if (auction.highestBid == 0) {
        require(msg.value >= auction.basePrice, "Bid must be at least the base price");
    } else {
        // Otherwise, check against highestBid
        require(msg.value > auction.highestBid, "Bid must be higher than current highest bid");
    }

    // Refund previous highest bidder if any
    if (auction.highestBidder != address(0)) {
        (bool sent, ) = auction.highestBidder.call{value: auction.highestBid}("");
        require(sent, "Refund to previous bidder failed");
    }

    auction.highestBidder = msg.sender;
    auction.highestBid = msg.value;

    emit NewBidPlaced(_auctionId, msg.sender, msg.value);
}


    function endAuction(uint256 _auctionId) external auctionExists(_auctionId) onlyAuctionOwner(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp >= auction.endTime, "Auction not ended yet");
        require(auction.isActive, "Auction already ended");

        auction.isActive = false;

        if (auction.highestBidder != address(0)) {
            (bool sent, ) = auction.owner.call{value: auction.highestBid}("");
            require(sent, "Transfer to auction owner failed");

            emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
        }
    }

    function getAuctionDetails(uint256 _auctionId) external view auctionExists(_auctionId) returns (
        address owner,
        string memory title,
        string memory description,
        uint256 basePrice,
        uint256 highestBid,
        address highestBidder,
        uint256 endTime,
        bool isActive
    ) {
        Auction memory auction = auctions[_auctionId];
        return (
            auction.owner,
            auction.title,
            auction.description,
            auction.basePrice,
            auction.highestBid,
            auction.highestBidder,
            auction.endTime,
            auction.isActive
        );
    }

    function getTimeLeft(uint256 _auctionId) external view auctionExists(_auctionId) returns (uint256 secondsLeft) {
        Auction memory auction = auctions[_auctionId];
        if (block.timestamp >= auction.endTime) {
            return 0;
        }
        return auction.endTime - block.timestamp;
    }
}

