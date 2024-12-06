import { translate } from "/utils/i18n.js";

const Home = {
  render: async () => {
    return `<h1>${translate("welcome_home")}</h1>`;
  },
  after_render: async () => {},
};

export default Home;
