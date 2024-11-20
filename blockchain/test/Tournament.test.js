const Tournament = artifacts.require("Tournament");

contract("Tournament", (accounts) => {
    let tournament;

    beforeEach(async () => {
        tournament = await Tournament.new();
    });

    // トーナメントの開始に関してisActiveになって始まるか
    it("should start the tournament", async () => {
        await tournament.startTournament({ from: accounts[0] });
        const isActive = await tournament.isActive();
        assert.equal(isActive, true, "Tournament should be active");
    });

    // 下記のスコアで記録できるかどうか、assertで値が一致するかどうかをテストしている。
    it("should record a match", async () => {
        await tournament.startTournament({ from: accounts[0] });

        const matchNumber = 0;
        const winnerId = 1;
        const winnerScore = 10;
        const loserId = 2;
        const loserScore = 8;

        await tournament.recordMatch(
            matchNumber,
            winnerId,
            winnerScore,
            loserId,
            loserScore,
            { from: accounts[0] }
        );

        const match = await tournament.getMatch(0);
        assert.equal(match.matchNumber, matchNumber, "Match number should be recorded correctly");
        assert.equal(match.winnerId, winnerId, "Winner ID should be recorded correctly");
        assert.equal(match.winnerScore, winnerScore, "Winner score should be recorded correctly");
        assert.equal(match.loserId, loserId, "Loser ID should be recorded correctly");
        assert.equal(match.loserScore, loserScore, "Loser score should be recorded correctly");
    });

    // トーナメントがMAX_lengthに達したら終わるようになっているか->７回分値を追加して確認する。
    // 試合終了後はisactive=falseになるようにしているので確認する。
    // Matchの最大数の確認をして7回になっているかを確認する
    it("should end tournament after max matches", async () => {
        await tournament.startTournament({ from: accounts[0] });

        for (let i = 0; i < 7; i++) {
            await tournament.recordMatch(
                i,
                1,
                10,
                2,
                8,
                { from: accounts[0] }
            );
        }

        const isActive = await tournament.isActive();
        assert.equal(isActive, false, "Tournament should be inactive after max matches");
        
        const matchCount = await tournament.getMatchCount();
        assert.equal(matchCount.toNumber(), 7, "Should have recorded 7 matches");
    });

    // isactive=falseの時はrecordできないかどうかの確認
    it("should not allow recording matches when tournament is not active", async () => {
        try {
            await tournament.recordMatch(0, 1, 10, 2, 8, { from: accounts[0] });
            assert.fail("Should have thrown an error");
        } catch (error) {
            console.log("Error message for inactive tournament:", error.message);
            assert(error.message.includes("Tournament is not active"), "Wrong error message");
        }
    });

    // もう一度７回分追加して今度はデータが新規で追加できないを確認する。
    it("should not allow recording matches after max matches reached", async () => {
        await tournament.startTournament({ from: accounts[0] });

        // 7試合分のデータを記録
        for (let i = 0; i < 7; i++) {
            await tournament.recordMatch(i, 1, 10, 2, 8, { from: accounts[0] });
        }

        try {
            await tournament.recordMatch(7, 1, 10, 2, 8, { from: accounts[0] });
            assert.fail("Should have thrown an error");
        } catch (error) {
            // エラーメッセージをログ出力
            console.log("Actual error message:", error.message);
            // Solidityのrequireメッセージは "VM Exception while processing transaction: revert" の後に付加される
            assert(
                error.message.includes("Maximum number of matches reached") || 
                error.message.includes("Tournament is already complete"),
                `Wrong error message. Got: ${error.message}`
            );
        }
    });
});