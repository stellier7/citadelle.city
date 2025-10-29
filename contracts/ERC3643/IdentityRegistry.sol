// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./ONCHAINID.sol";

contract IdentityRegistry is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    ONCHAINID public identityContract;
    mapping(address => bool) public isRegistered;
    mapping(address => address) public identityOf;

    event IdentityRegistered(address indexed investor, address indexed identity);
    event IdentityRemoved(address indexed investor, address indexed identity);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _admin, address _identityContract) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(REGISTRAR_ROLE, _admin);

        identityContract = ONCHAINID(_identityContract);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    function registerIdentity(address _investor, address _identity) external onlyRole(REGISTRAR_ROLE) {
        require(_investor != address(0), "Invalid investor address");
        require(_identity != address(0), "Invalid identity address");
        require(!isRegistered[_investor], "Investor already registered");

        isRegistered[_investor] = true;
        identityOf[_investor] = _identity;

        emit IdentityRegistered(_investor, _identity);
    }

    function removeIdentity(address _investor) external onlyRole(REGISTRAR_ROLE) {
        require(isRegistered[_investor], "Investor not registered");

        address identity = identityOf[_investor];
        delete isRegistered[_investor];
        delete identityOf[_investor];

        emit IdentityRemoved(_investor, identity);
    }

    function isVerified(address _investor) external view returns (bool) {
        if (!isRegistered[_investor]) return false;
        address identity = identityOf[_investor];
        return identity != address(0);
    }

    function getIdentity(address _investor) external view returns (address) {
        return identityOf[_investor];
    }
} 