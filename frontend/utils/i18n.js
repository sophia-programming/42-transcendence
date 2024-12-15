i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector) // ブラウザの言語設定を取得
  .init({
    fallbackLng: 'en', // ブラウザの言語が取得できない場合のデフォルト言語
    debug: false,
    ns: ['navbar', 'home', 'login', 'signup'], // 翻訳キーの名前空間
    backend: {
      loadPath: './utils/locales/{{lng}}/{{ns}}.json', // 見つからない場合fallbackLngを参照
    },
  }, (err, t) => {
    if (err) return console.error('i18next init error:', err);
    updateContent(); // 初期翻訳適用
  });

export function updateContent() {
  // data-i18n属性を持つ全ての要素を翻訳キーを元に翻訳
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = i18next.t(el.getAttribute('data-i18n'));
  });
}

export function changeLanguage(lng) {
  i18next.changeLanguage(lng); // 言語設定を変更し、languageChangedイベント
  localStorage.setItem('lang', lng); // 言語設定をローカルストレージに保存
}

// languageChangedイベントによりトリガー
i18next.on('languageChanged', () => {
  updateContent();
});
