// SPDX-License-Identifier: MIT
pragma solidity >=0.7.3;

contract DocumentVerification {
    address public owner;

    struct Document {
        address uploader;
        string hash; // IPFS or SHA-256 hash of the document
        uint256 timestamp;
        bool isVerified;
    }

    mapping(uint256 => Document) public documents;
    uint256 public documentCount;

    event DocumentUploaded(string docId, address indexed uploader, uint256 timestamp, uint256 documentCount);
    event DocumentVerified(string docId, address indexed verifier, bool isVerified);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function uploadDocument(string memory _hash) external {
        documentCount++;
        // string memory docId = generateUniqueId();
        documents[documentCount] = Document(msg.sender, _hash,  block.timestamp, false);
        emit DocumentUploaded("1234", msg.sender, block.timestamp, documentCount);
    }

    function verifyDocument(string memory _hash, uint256 _docId) external {
        // require(bytes(_docId).length > 0, "Document ID cannot be empty");
        require(_docId > 0, "Document ID cannot be empty");
        require(bytes(_hash).length > 0 && bytes(_hash).length <= 64, "Invalid hash length");
        Document storage doc = documents[_docId];

        require(doc.uploader != address(0), "Document with this ID does not exist");


        require(keccak256(bytes(doc.hash)) == keccak256(bytes(_hash)), "Document hash does not match");
        doc.isVerified = true;
        
        emit DocumentVerified("1234", msg.sender, true);
    }

    function generateUniqueId() internal view returns (string memory) {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, block.timestamp, documentCount));
        return toAsciiString(hash);
    }

    function toAsciiString(bytes32 _bytes32) internal pure returns (string memory) {
        bytes memory bytesArray = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            uint8 value = uint8(_bytes32[i]);
            bytes1 high = bytes1(uint8(value) / 16);
            bytes1 low = bytes1(uint8(value) % 16);
            bytesArray[i * 2] = char(high);
            bytesArray[i * 2 + 1] = char(low);
        }
        return string(bytesArray);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
