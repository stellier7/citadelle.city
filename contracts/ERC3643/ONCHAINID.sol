// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract ONCHAINID is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CLAIM_ISSUER_ROLE = keccak256("CLAIM_ISSUER_ROLE");

    struct Claim {
        uint256 topic;
        uint256 scheme;
        address issuer;
        bytes signature;
        bytes data;
        string uri;
    }

    mapping(bytes32 => Claim) private claims;
    mapping(uint256 => bytes32[]) private claimsByTopic;

    event ClaimAdded(
        bytes32 indexed claimId,
        uint256 indexed topic,
        uint256 scheme,
        address indexed issuer,
        bytes signature,
        bytes data,
        string uri
    );
    event ClaimRemoved(bytes32 indexed claimId, uint256 indexed topic, uint256 scheme, address indexed issuer, bytes signature, bytes data, string uri);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _admin) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    function addClaim(
        uint256 _topic,
        uint256 _scheme,
        address _issuer,
        bytes calldata _signature,
        bytes calldata _data,
        string calldata _uri
    ) external onlyRole(CLAIM_ISSUER_ROLE) returns (bytes32) {
        bytes32 claimId = keccak256(abi.encodePacked(_issuer, _topic));
        claims[claimId] = Claim({
            topic: _topic,
            scheme: _scheme,
            issuer: _issuer,
            signature: _signature,
            data: _data,
            uri: _uri
        });
        claimsByTopic[_topic].push(claimId);

        emit ClaimAdded(claimId, _topic, _scheme, _issuer, _signature, _data, _uri);
        return claimId;
    }

    function removeClaim(bytes32 _claimId) external onlyRole(CLAIM_ISSUER_ROLE) {
        Claim memory claim = claims[_claimId];
        require(claim.issuer != address(0), "Claim does not exist");

        delete claims[_claimId];
        uint256[] memory indices = new uint256[](claimsByTopic[claim.topic].length);
        uint256 index = 0;
        for (uint256 i = 0; i < claimsByTopic[claim.topic].length; i++) {
            if (claimsByTopic[claim.topic][i] == _claimId) {
                indices[index] = i;
                index++;
            }
        }
        for (uint256 i = 0; i < index; i++) {
            claimsByTopic[claim.topic][indices[i]] = claimsByTopic[claim.topic][claimsByTopic[claim.topic].length - 1];
            claimsByTopic[claim.topic].pop();
        }

        emit ClaimRemoved(_claimId, claim.topic, claim.scheme, claim.issuer, claim.signature, claim.data, claim.uri);
    }

    function getClaim(bytes32 _claimId) external view returns (Claim memory) {
        return claims[_claimId];
    }

    function getClaimIdsByTopic(uint256 _topic) external view returns (bytes32[] memory) {
        return claimsByTopic[_topic];
    }
} 