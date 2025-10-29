// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Compliance.sol";

contract PermissionedToken is Initializable, ERC20Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    Compliance public compliance;
    bool public paused;

    event ComplianceUpdated(address indexed _compliance);
    event Paused(address indexed _account);
    event Unpaused(address indexed _account);

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
        __ERC20_init(_name, _symbol);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);

        compliance = Compliance(_compliance);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    function setCompliance(address _compliance) external onlyRole(ADMIN_ROLE) {
        require(_compliance != address(0), "Invalid compliance address");
        compliance = Compliance(_compliance);
        emit ComplianceUpdated(_compliance);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        require(!paused, "Already paused");
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        require(paused, "Not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }

    function mint(address _to, uint256 _amount) external onlyRole(MINTER_ROLE) {
        require(!paused, "Token is paused");
        require(compliance.canTransfer(address(0), _to, _amount), "Transfer not allowed");
        _mint(_to, _amount);
    }

    function burn(uint256 _amount) external {
        require(!paused, "Token is paused");
        _burn(msg.sender, _amount);
    }

    function transfer(address _to, uint256 _amount) public override returns (bool) {
        require(!paused, "Token is paused");
        require(compliance.canTransfer(msg.sender, _to, _amount), "Transfer not allowed");
        return super.transfer(_to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) public override returns (bool) {
        require(!paused, "Token is paused");
        require(compliance.canTransfer(_from, _to, _amount), "Transfer not allowed");
        return super.transferFrom(_from, _to, _amount);
    }
} 