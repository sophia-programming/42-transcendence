// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tournament {
    struct Match {
        uint256 timestamp;
        uint256 matchNumber;
        uint256 winnerId;
        uint256 winnerScore;
        uint256 loserId;
        uint256 loserScore;
    }

    Match[] public matches;
    bool public isActive;
    uint256 public constant MAX_MATCHES = 7;

    event MatchRecorded(
        uint256 timestamp,
        uint256 matchNumber,
        uint256 winnerId,
        uint256 winnerScore,
        uint256 loserId,
        uint256 loserScore
    );

    constructor() {
        isActive = false;
    }

    function startTournament() public {
        require(!isActive, "Tournament is already active");
        isActive = true;
    }

    function recordMatch(
        uint256 matchNumber,
        uint256 winnerId,
        uint256 winnerScore,
        uint256 loserId,
        uint256 loserScore
    ) public {
        // 最大試合数のチェックを最初に行う
        require(matches.length < MAX_MATCHES, "Tournament is already complete");
        require(isActive, "Tournament is not active");
        // require(matchNumber < MAX_MATCHES, "Invalid match number");

        Match memory newMatch = Match({
            timestamp: block.timestamp,
            matchNumber: matchNumber,
            winnerId: winnerId,
            winnerScore: winnerScore,
            loserId: loserId,
            loserScore: loserScore
        });

        matches.push(newMatch);

        emit MatchRecorded(
            block.timestamp,
            matchNumber,
            winnerId,
            winnerScore,
            loserId,
            loserScore
        );

        // 最大試合数に達したらトーナメントを終了
        if (matches.length >= MAX_MATCHES) {
            isActive = false;
        }
    }

    function getMatchCount() public view returns (uint256) {
        return matches.length;
    }

    function getMatch(uint256 index) public view returns (
        uint256 timestamp,
        uint256 matchNumber,
        uint256 winnerId,
        uint256 winnerScore,
        uint256 loserId,
        uint256 loserScore
    ) {
        require(index < matches.length, "Match does not exist");
        Match memory matchData = matches[index];
        return (
            matchData.timestamp,
            matchData.matchNumber,
            matchData.winnerId,
            matchData.winnerScore,
            matchData.loserId,
            matchData.loserScore
        );
    }
}