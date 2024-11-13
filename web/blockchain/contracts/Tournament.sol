// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tournament {
    struct MatchRecord {
        uint256 timestamp;
        uint8 matchNumber;
        address winner;
        uint8 winnerScore;
        address loser;
        uint8 loserScore;
    }


    // イベントの宣言
    event TournamentStarted();
    event TournamentEnded();
    event MatchRecorded(
        uint8 matchNumber,
        address winner,
        uint8 winnerScore,
        address loser,
        uint8 loserScore
    );


    MatchRecord[] public records; // 全試合の記録を保持する配列
    uint8 public constant MAX_MATCHES = 7;  // 最大試合数
    bool public isActive;

    address public owner;

    constructor() {
        owner = msg.sender;
        isActive = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier tournamentActive() {
        require(isActive, "Tournament is not active");
        _;
    }

    function startTournament() public onlyOwner {
        isActive = true;
        emit TournamentStarted();
    }

    function endTournament() public onlyOwner {
        isActive = false;
        emit TournamentEnded();
    }


    // 試合の記録を追加する関数.(記録が最大数に達した場合はトーナメントを自動的に終了)
    function recordMatch(
        uint8 matchNumber,
        address winner,
        uint8 winnerScore,
        address loser,
        uint8 loserScore
    ) public onlyOwner tournamentActive {
        require(records.length < MAX_MATCHES, "Maximum match limit reached");

        records.push(MatchRecord({
            timestamp: block.timestamp,
            matchNumber: matchNumber,
            winner: winner,
            winnerScore: winnerScore,
            loser: loser,
            loserScore: loserScore
        }));

        emit MatchRecorded(matchNumber, winner, winnerScore, loser, loserScore);

        if (records.length == MAX_MATCHES) {
            endTournament();
        }
    }

    function getMatchRecord(uint8 index) public view returns (MatchRecord memory) {
        require(index < records.length, "Invalid match index");
        return records[index];
    }
}
