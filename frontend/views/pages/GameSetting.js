import { updateContent } from "../../../utils/i18n.js";

const Setting = {
  render: async () => {
    return `<h1 class="mt-3 px-3" data-i18n="setting:setting">Setting</h1>
    <h2 class="mt-5 px-3" data-i18n="setting:ball_velocity">Ball Velocity</h2>
    <div class="btn-group px-5" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" class="btn-check" name="velocity" id="velocity-fast" autocomplete="off" />
      <label class="btn btn-outline-primary" for="velocity-fast" data-i18n="setting:fast">Fast</label>

      <input type="radio" class="btn-check" name="velocity" id="velocity-normal" autocomplete="off" checked />
      <label class="btn btn-outline-primary" for="velocity-normal" data-i18n="setting:normal">Normal</label>

      <input type="radio" class="btn-check" name="velocity" id="velocity-slow" autocomplete="off" />
      <label class="btn btn-outline-primary" for="velocity-slow" data-i18n="setting:slow">Slow</label>
    </div>

    </br>

    <h2 class="mt-3 px-3" data-i18n="setting:ball_size">Ball Size</h2>
    <div class="btn-group px-5" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" class="btn-check" name="ball-size" id="size-big" autocomplete="off" />
      <label class="btn btn-outline-primary" for="size-big" data-i18n="setting:big">Big</label>

      <input type="radio" class="btn-check" name="ball-size" id="size-normal" autocomplete="off" checked />
      <label class="btn btn-outline-primary" for="size-normal" data-i18n="setting:normal">Normal</label>

      <input type="radio" class="btn-check" name="ball-size" id="size-small" autocomplete="off" />
      <label class="btn btn-outline-primary" for="size-small" data-i18n="setting:small">Small</label>
    </div>

    </br>

    <h2 class="mt-3 px-3" data-i18n="setting:map_select">Map Select</h2>
    <div class="btn-group px-5" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" class="btn-check" name="map" id="map-a" autocomplete="off" checked />
      <label class="btn btn-outline-primary" for="map-a">A</label>

      <input type="radio" class="btn-check" name="map" id="map-b" autocomplete="off" />
      <label class="btn btn-outline-primary" for="map-b">B</label>

      <input type="radio" class="btn-check" name="map" id="map-c" autocomplete="off" />
      <label class="btn btn-outline-primary" for="map-c">C</label>
    </div>
    
    </br>

    <div class="d-flex justify-content-center">
      <button id="play-button" type="button" class="btn btn-secondary mt-5 mx-auto p-2" style="width: 200px; height: 45px" data-i18n="setting:let's_play">Let's play!</button>
    </div>`;
  },
  after_render: async () => {
    updateContent();

    document.getElementById("play-button").addEventListener("click", async () => {
      // 各設定値を取得
      const velocity = document.querySelector('input[name="velocity"]:checked').id.replace("velocity-", "");
      const ballSize = document.querySelector('input[name="ball-size"]:checked').id.replace("size-", "");
      const map = document.querySelector('input[name="map"]:checked').id.replace("map-", "");

      // 送信データを構築
      const settings = {
        ball_velocity: velocity,
        ball_size: ballSize,
        map: map,
      };

      try {
        // PUTリクエストを送信
        const response = await fetch("http://localhost:8000/api/gamesetting/1/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 成功時の処理
        console.log("Settings updated successfully:", settings);
        window.location.hash = "#/gameplay"; // Gameplay画面へ遷移
      } catch (error) {
        console.error("Failed to update settings:", error);
      }
    });
  },
};

export default Setting;