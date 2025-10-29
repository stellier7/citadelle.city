// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./IdentityRegistry.sol";

contract Compliance is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    IdentityRegistry public identityRegistry;
    mapping(address => bool) public frozenAddresses;
    mapping(address => bool) public blacklistedAddresses;
    mapping(address => uint256) public transferLimits;

    event AddressFrozen(address indexed _address);
    event AddressUnfrozen(address indexed _address);
    event AddressBlacklisted(address indexed _address);
    event AddressRemovedFromBlacklist(address indexed _address);
    event TransferLimitSet(address indexed _address, uint256 _limit);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _admin, address _identityRegistry) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(COMPLIANCE_ROLE, _admin);

        identityRegistry = IdentityRegistry(_identityRegistry);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    function freezeAddress(address _address) external onlyRole(COMPLIANCE_ROLE) {
        require(!frozenAddresses[_address], "Address already frozen");
        frozenAddresses[_address] = true;
        emit AddressFrozen(_address);
    }

    function unfreezeAddress(address _address) external onlyRole(COMPLIANCE_ROLE) {
        require(frozenAddresses[_address], "Address not frozen");
        frozenAddresses[_address] = false;
        emit AddressUnfrozen(_address);
    }

    function blacklistAddress(address _address) external onlyRole(COMPLIANCE_ROLE) {
        require(!blacklistedAddresses[_address], "Address already blacklisted");
        blacklistedAddresses[_address] = true;
        emit AddressBlacklisted(_address);
    }

    function removeFromBlacklist(address _address) external onlyRole(COMPLIANCE_ROLE) {
        require(blacklistedAddresses[_address], "Address not blacklisted");
        blacklistedAddresses[_address] = false;
        emit AddressRemovedFromBlacklist(_address);
    }

    function setTransferLimit(address _address, uint256 _limit) external onlyRole(COMPLIANCE_ROLE) {
        transferLimits[_address] = _limit;
        emit TransferLimitSet(_address, _limit);
    }

    function canTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) external view returns (bool) {
        if (frozenAddresses[_from] || frozenAddresses[_to]) return false;
        if (blacklistedAddresses[_from] || blacklistedAddresses[_to]) return false;
        if (!identityRegistry.isVerified(_from) || !identityRegistry.isVerified(_to)) return false;
        if (transferLimits[_from] > 0 && _amount > transferLimits[_from]) return false;
        return true;
    }
} 