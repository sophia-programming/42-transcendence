i18next.init({
  lng: localStorage.getItem('lang') || 'en', // ローカルストレージの言語を取得
  debug: true,
  resources: {
    en: {
      translation: {
        title: "My Application",
        navbar: "Navbar",
        home: "Home",
        tournament: "Tournament",
        setupotp: "Setup Otp",
        mypage: "My Page",
        gameplay: "Gameplay",
        login: "Login",
        language: "Language",
        english: "English",
        japanese: "Japanese",
        welcome_home: "Welcome to the Home Page",
        username: "Username",
        password: "Password",
        sign_up: "Signup",
        login_with_42: "Login with 42",
        chinese: "Chinese"
      }
    },
    ja: {
      translation: {
        title: "アプリケーション",
        navbar: "ナビゲーション",
        home: "ホーム",
        tournament: "トーナメント",
        setupotp: "OTPを設定",
        mypage: "マイページ",
        gameplay: "ゲームプレイ",
        login: "ログイン",
        language: "言語",
        english: "英語",
        japanese: "日本語",
        welcome_home: "ホームページへようこそ",
        username: "ユーザー名",
        password: "パスワード",
        sign_up: "アカウント作成",
        login_with_42: "42アカウントでログイン",
        chinese: "中国語"
      }
    },
    zh: {
      translation: {
        title: "我的应用程序",
        navbar: "导航栏",
        home: "主页",
        tournament: "锦标赛",
        setupotp: "设置OTP",
        mypage: "我的页面",
        gameplay: "游戏玩法",
        login: "登录",
        language: "语言",
        english: "英语",
        japanese: "日语",
        welcome_home: "欢迎来到首页",
        username: "用户名",
        password: "密码",
        sign_up: "注册",
        login_with_42: "使用42登录",
        chinese: "中文"
      }
    }
  }
}, (err, t) => {
  if (err) return console.error('i18next init error:', err);
  updateContent(); // 初期翻訳適用
});

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = i18next.t(el.getAttribute('data-i18n'));
  });
}

export function changeLanguage(lng) {
  i18next.changeLanguage(lng, (err, t) => {
    if (err) return console.error('Change language error:', err);
    localStorage.setItem('lang', lng); // 言語を保存
    updateContent(); // 翻訳を更新
  });
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