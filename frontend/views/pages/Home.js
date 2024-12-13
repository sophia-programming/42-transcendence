import { updateContent } from "../../utils/i18n.js";

const Home = {
  render: async () => {
    return `<h1 data-i18n="home:welcome_home">Welcome to the Home Page</h1>`;
  },
  after_render: async () => {
    updateContent();
  },
};

export default Home;
