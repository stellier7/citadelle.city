// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./ERC3643/PermissionedToken.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract RWAContract is 
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PermissionedToken 
{
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    
    struct Property {
        string name;
        string location;
        uint256 price;
        uint256 squareMeters;
        string legalIdentifier;
        address submitter;
        uint256 submissionDate;
        bool isVerified;
        bool isTokenized;
        bool isStaked;
        uint256 stakingStartTime;
        uint256 stakingEndTime;
    }

    // Property storage
    mapping(uint256 => Property) public properties;
    mapping(string => uint256) public legalIdentifierToId;
    uint256 public propertyCount;

    // Events
    event PropertySubmitted(
        uint256 indexed propertyId,
        string name,
        string legalIdentifier,
        address submitter
    );
    event PropertyVerified(uint256 indexed propertyId, address verifier);
    event PropertyTokenized(uint256 indexed propertyId, address owner);
    event PropertyStaked(uint256 indexed propertyId, address owner, uint256 endTime);
    event PropertyUnstaked(uint256 indexed propertyId, address owner);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory _name,
        string memory _symbol,
        address _admin,
        address _compliance
    ) public initializer {
        __PermissionedToken_init(_name, _symbol, _admin, _compliance);
        __ReentrancyGuard_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(VERIFIER_ROLE, _admin);
        _grantRole(COMPLIANCE_ROLE, _admin);
        _grantRole(MANAGER_ROLE, _admin);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    function submitProperty(
        string memory _name,
        string memory _location,
        uint256 _price,
        uint256 _squareMeters,
        string memory _legalIdentifier
    ) external {
        require(bytes(_legalIdentifier).length > 0, "Invalid legal identifier");
        require(legalIdentifierToId[_legalIdentifier] == 0, "Property already exists");

        uint256 propertyId = ++propertyCount;
        
        properties[propertyId] = Property({
            name: _name,
            location: _location,
            price: _price,
            squareMeters: _squareMeters,
            legalIdentifier: _legalIdentifier,
            submitter: msg.sender,
            submissionDate: block.timestamp,
            isVerified: false,
            isTokenized: false,
            isStaked: false,
            stakingStartTime: 0,
            stakingEndTime: 0
        });

        legalIdentifierToId[_legalIdentifier] = propertyId;

        emit PropertySubmitted(propertyId, _name, _legalIdentifier, msg.sender);
    }

    function verifyProperty(uint256 _propertyId) external onlyRole(VERIFIER_ROLE) {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Invalid property ID");
        require(!properties[_propertyId].isVerified, "Already verified");

        properties[_propertyId].isVerified = true;
        emit PropertyVerified(_propertyId, msg.sender);
    }

    function tokenizeProperty(uint256 _propertyId) external onlyRole(COMPLIANCE_ROLE) {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Invalid property ID");
        Property storage property = properties[_propertyId];
        
        require(property.isVerified, "Property not verified");
        require(!property.isTokenized, "Already tokenized");

        property.isTokenized = true;
        mint(property.submitter, 1); // Mint one token for full ownership

        emit PropertyTokenized(_propertyId, property.submitter);
    }

    function stakeProperty(uint256 _propertyId, uint256 _stakingDuration) external {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Invalid property ID");
        Property storage property = properties[_propertyId];
        
        require(property.isTokenized, "Property not tokenized");
        require(!property.isStaked, "Already staked");
        require(balanceOf(msg.sender) > 0, "Not the owner");
        require(_stakingDuration > 0, "Invalid staking duration");

        property.isStaked = true;
        property.stakingStartTime = block.timestamp;
        property.stakingEndTime = block.timestamp + _stakingDuration;

        emit PropertyStaked(_propertyId, msg.sender, property.stakingEndTime);
    }

    function unstakeProperty(uint256 _propertyId) external {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Invalid property ID");
        Property storage property = properties[_propertyId];
        
        require(property.isStaked, "Not staked");
        require(balanceOf(msg.sender) > 0, "Not the owner");
        require(block.timestamp >= property.stakingEndTime, "Staking period not ended");

        property.isStaked = false;
        property.stakingStartTime = 0;
        property.stakingEndTime = 0;

        emit PropertyUnstaked(_propertyId, msg.sender);
    }

    // View functions
    function getProperty(uint256 _propertyId) external view returns (Property memory) {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Invalid property ID");
        return properties[_propertyId];
    }

    function getPropertyByLegalId(string memory _legalIdentifier) external view returns (Property memory) {
        uint256 propertyId = legalIdentifierToId[_legalIdentifier];
        require(propertyId > 0, "Property not found");
        return properties[propertyId];
    }

    function isPropertyStaked(uint256 _propertyId) external view returns (bool) {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Invalid property ID");
        return properties[_propertyId].isStaked;
    }

    // Override required function
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(PermissionedToken, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
