import i18next from 'i18next';

i18next.init({
  // lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: {
        "key": "hello world"
      }
    },
    ja: {
      translation: {
        "key": "こんにちは、世界"
      }
    },
    zh: {
      translation: {
        "key": "你好，世界"
      }
    }
  }
}, function(err, t) {
  // init set content
  updateContent();
});

function updateContent() {
  document.getElementById('output').innerHTML = i18next.t('key');
}

function changeLanguage(lng) {
  i18next.changeLanguage(lng);
}

i18next.on('languageChanged', () => {
  updateContent();
});

// const translations = {};

// async function loadTranslations(lang) {
//   // langに対応するjsonデータを取得し、translationsに格納
//   const response = await fetch(`/utils/locales/${lang}.json`);
//   const data = await response.json();
//   translations[lang] = data;
//   console.log(translations);
// }

// export function translate(key) {
//   // ストレージから言語を取得する
//   const lang = localStorage.getItem('lang') || 'en';
//   // その言語のkeyに対応する値を返す
//   return translations[lang][key] || key;
// }

// window.setLanguage = async function(lang) {
//   if (!translations[lang]) {
//     await loadTranslations(lang);
//   }
//   // 言語をローカルストレージに保存する
//   localStorage.setItem('lang', lang);
//   // htmlのdata-i18n属性を取得しNodeListにする
//   // NodeListの各要素に対して指定した関数を実行
//   // 要素のtextをgetAttribute(指定した属性の値を取得)を翻訳する
//   document.querySelectorAll('[data-i18n]').forEach(el => {
//     el.textContent = translate(el.getAttribute('data-i18n'));
//   });
// };

// document.addEventListener('DOMContentLoaded', () => {
//   const lang = localStorage.getItem('lang') || 'en';
//   setLanguage(lang);
// });