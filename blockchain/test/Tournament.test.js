const Tournament = artifacts.require("Tournament");

contract("Tournament", (accounts) => {
    it("should start and end the tournament", async () => {
        const tournament = await Tournament.deployed();

        // トーナメントの開始
        await tournament.startTournament({ from: accounts[0] });
        let isActive = await tournament.isActive();
        assert.equal(isActive, true, "Tournament should be active");

        // トーナメントの終了
        await tournament.endTournament({ from: accounts[0] });
        isActive = await tournament.isActive();
        assert.equal(isActive, false, "Tournament should be inactive");
    });

    it("should record a match", async () => {
        const tournament = await Tournament.deployed();
        await tournament.startTournament({ from: accounts[0] });

        // 試合記録の追加
        await tournament.recordMatch(1, accounts[1], 10, accounts[2], 8, { from: accounts[0] });
        const matchRecord = await tournament.getMatchRecord(0);
        assert.equal(matchRecord.winner, accounts[1], "Winner should be recorded correctly");
        assert.equal(matchRecord.loser, accounts[2], "Loser should be recorded correctly");

        // 試合が最大数に達した後にトーナメントが終了することの確認
        for (let i = 1; i < 7; i++) {
            await tournament.recordMatch(i + 1, accounts[1], 10, accounts[2], 8, { from: accounts[0] });
        }
        isActive = await tournament.isActive();
        assert.equal(isActive, false, "Tournament should be inactive after max matches");
    });
});
