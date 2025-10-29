// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RWAContract.sol";

contract RevenueContract is ReentrancyGuard, Ownable {
    RWAContract public rwaContract;
    
    struct PropertyRevenue {
        uint256 totalRevenue;      // Total revenue collected
        uint256 lastDistribution;  // Timestamp of last distribution
        bool isActive;             // Whether property is actively collecting revenue
        uint256 rentalRate;       // Monthly rental rate in wei
        uint256 stakingRewards;   // Rewards accumulated during staking
        uint256 lastAirdrop;      // Timestamp of last airdrop
        uint256 airdropAmount;    // Amount per airdrop
        bool autoRestake;         // Whether to automatically restake airdrops
        uint256 nextPaymentDate;  // Estimated next payment date
        uint256 lastPaymentAmount; // Amount of last payment
    }

    struct PaymentHistory {
        uint256 timestamp;
        uint256 amount;
        bool isAirdrop;
        bool isRestaked;
    }

    // Platform fee (5% default, max 20%)
    uint256 public platformFee = 500; // 5.00%
    uint256 public constant MAX_PLATFORM_FEE = 2000; // 20.00%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Airdrop settings
    uint256 public constant AIRDROP_INTERVAL = 30 days;
    uint256 public constant MIN_AIRDROP_INTERVAL = 1 days;

    // Property revenue tracking
    mapping(uint256 => PropertyRevenue) public propertyRevenues;
    mapping(uint256 => PaymentHistory[]) public paymentHistory;
    
    // Total platform revenue
    uint256 public totalPlatformRevenue;

    // Events
    event RevenueAdded(uint256 indexed propertyId, uint256 amount);
    event RevenueDistributed(uint256 indexed propertyId, address indexed recipient, uint256 amount);
    event PropertyActivated(uint256 indexed propertyId, uint256 rentalRate);
    event PropertyDeactivated(uint256 indexed propertyId);
    event PlatformFeeUpdated(uint256 newFee);
    event StakingRewardsDistributed(uint256 indexed propertyId, address indexed owner, uint256 amount);
    event MonthlyAirdrop(uint256 indexed propertyId, address indexed recipient, uint256 amount, bool restaked);
    event AirdropSettingsUpdated(uint256 indexed propertyId, uint256 newAmount);
    event AutoRestakeUpdated(uint256 indexed propertyId, bool enabled);

    constructor(address _rwaContract) {
        rwaContract = RWAContract(_rwaContract);
    }

    // Start collecting revenue for a property
    function activateProperty(
        uint256 propertyId, 
        uint256 _rentalRate,
        bool _autoRestake
    ) external {
        require(rwaContract.balanceOf(msg.sender) > 0, "No tokens owned");
        require(!propertyRevenues[propertyId].isActive, "Already active");
        require(_rentalRate > 0, "Invalid rental rate");

        // Calculate monthly airdrop amount (rental rate)
        uint256 airdropAmount = _rentalRate;
        uint256 nextPayment = block.timestamp + AIRDROP_INTERVAL;

        propertyRevenues[propertyId] = PropertyRevenue({
            totalRevenue: 0,
            lastDistribution: block.timestamp,
            isActive: true,
            rentalRate: _rentalRate,
            stakingRewards: 0,
            lastAirdrop: block.timestamp,
            airdropAmount: airdropAmount,
            autoRestake: _autoRestake,
            nextPaymentDate: nextPayment,
            lastPaymentAmount: 0
        });

        emit PropertyActivated(propertyId, _rentalRate);
        emit AirdropSettingsUpdated(propertyId, airdropAmount);
        emit AutoRestakeUpdated(propertyId, _autoRestake);
    }

    // Stop collecting revenue for a property
    function deactivateProperty(uint256 propertyId) external {
        require(rwaContract.balanceOf(msg.sender) > 0, "No tokens owned");
        require(propertyRevenues[propertyId].isActive, "Not active");

        propertyRevenues[propertyId].isActive = false;
        emit PropertyDeactivated(propertyId);
    }

    // Add revenue for a property (can be called by manager for staked properties)
    function addRevenue(uint256 propertyId) external payable nonReentrant {
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        require(revenue.isActive, "Property not active");
        require(msg.value > 0, "No revenue sent");

        bool isStaked = rwaContract.isPropertyStaked(propertyId);
        address owner = msg.sender;

        // Calculate platform fee
        uint256 platformAmount = (msg.value * platformFee) / FEE_DENOMINATOR;
        uint256 propertyAmount = msg.value - platformAmount;

        // Update balances
        totalPlatformRevenue += platformAmount;

        if (isStaked) {
            // For staked properties, accumulate rewards
            revenue.stakingRewards += propertyAmount;
        } else {
            // For non-staked properties, add to regular revenue
        revenue.totalRevenue += propertyAmount;
        }

        revenue.lastDistribution = block.timestamp;

        emit RevenueAdded(propertyId, msg.value);
    }

    // Process monthly airdrop for staked properties
    function processMonthlyAirdrop(uint256 propertyId) external nonReentrant {
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        require(revenue.isActive, "Property not active");
        require(rwaContract.isPropertyStaked(propertyId), "Property not staked");
        require(block.timestamp >= revenue.lastAirdrop + AIRDROP_INTERVAL, "Too early for airdrop");

        uint256 airdropAmount = revenue.airdropAmount;
        require(airdropAmount > 0, "No airdrop amount set");

        // Update last airdrop timestamp and next payment date
        revenue.lastAirdrop = block.timestamp;
        revenue.nextPaymentDate = block.timestamp + AIRDROP_INTERVAL;
        revenue.lastPaymentAmount = airdropAmount;

        // Record payment in history
        paymentHistory[propertyId].push(PaymentHistory({
            timestamp: block.timestamp,
            amount: airdropAmount,
            isAirdrop: true,
            isRestaked: revenue.autoRestake
        }));

        if (revenue.autoRestake) {
            // Automatically add to staking rewards
            revenue.stakingRewards += airdropAmount;
            emit MonthlyAirdrop(propertyId, msg.sender, airdropAmount, true);
        } else {
            // Transfer airdrop to owner
            (bool success, ) = msg.sender.call{value: airdropAmount}("");
            require(success, "Airdrop transfer failed");
            emit MonthlyAirdrop(propertyId, msg.sender, airdropAmount, false);
        }
    }

    // Toggle auto-restake setting
    function toggleAutoRestake(uint256 propertyId) external {
        require(rwaContract.balanceOf(msg.sender) > 0, "No tokens owned");
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        require(revenue.isActive, "Property not active");

        revenue.autoRestake = !revenue.autoRestake;
        emit AutoRestakeUpdated(propertyId, revenue.autoRestake);
    }

    // Get payment history
    function getPaymentHistory(uint256 propertyId) external view returns (PaymentHistory[] memory) {
        return paymentHistory[propertyId];
    }

    // Get next payment estimation
    function getNextPaymentEstimation(uint256 propertyId) external view returns (
        uint256 nextPaymentDate,
        uint256 estimatedAmount
    ) {
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        return (revenue.nextPaymentDate, revenue.airdropAmount);
    }

    // Distribute revenue to property owner
    function distributeRevenue(uint256 propertyId) external nonReentrant {
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        require(revenue.totalRevenue > 0, "No revenue to distribute");

        uint256 amount = revenue.totalRevenue;
        revenue.totalRevenue = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit RevenueDistributed(propertyId, msg.sender, amount);
    }

    // Distribute staking rewards when unstaking
    function distributeStakingRewards(uint256 propertyId) external nonReentrant {
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        require(revenue.stakingRewards > 0, "No staking rewards to distribute");
        require(!rwaContract.isPropertyStaked(propertyId), "Property still staked");

        uint256 amount = revenue.stakingRewards;
        revenue.stakingRewards = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit StakingRewardsDistributed(propertyId, msg.sender, amount);
    }

    // Update platform fee (owner only)
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_PLATFORM_FEE, "Fee too high");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    // Withdraw platform revenue (owner only)
    function withdrawPlatformRevenue() external onlyOwner {
        require(totalPlatformRevenue > 0, "No revenue to withdraw");
        
        uint256 amount = totalPlatformRevenue;
        totalPlatformRevenue = 0;
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Transfer failed");
    }

    // View functions
    function getPropertyRevenue(uint256 propertyId) external view returns (
        uint256 totalRevenue,
        uint256 lastDistribution,
        bool isActive,
        uint256 rentalRate,
        uint256 stakingRewards,
        uint256 lastAirdrop,
        uint256 airdropAmount,
        bool autoRestake,
        uint256 nextPaymentDate,
        uint256 lastPaymentAmount
    ) {
        PropertyRevenue memory rev = propertyRevenues[propertyId];
        return (
            rev.totalRevenue,
            rev.lastDistribution,
            rev.isActive,
            rev.rentalRate,
            rev.stakingRewards,
            rev.lastAirdrop,
            rev.airdropAmount,
            rev.autoRestake,
            rev.nextPaymentDate,
            rev.lastPaymentAmount
        );
    }

    // Check if airdrop is available
    function isAirdropAvailable(uint256 propertyId) external view returns (bool) {
        PropertyRevenue storage revenue = propertyRevenues[propertyId];
        return revenue.isActive && 
               rwaContract.isPropertyStaked(propertyId) && 
               block.timestamp >= revenue.lastAirdrop + AIRDROP_INTERVAL;
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    // Required to receive ETH
    receive() external payable {}
}
