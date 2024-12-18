import { updateContent } from "../../utils/i18n.js";
import trophyImage from '../static/images/trophy.jpeg';

const WinnerPage = {
  render: async () => {
    const username = "someone";
    return `
    <div class="container">
        <div class="winner-box">
            <img src="${trophyImage}" alt="トロフィー" class="trophy-image">
            <div class="winner-text">
                Winner: ${username}
            </div>
            <a href="/" class="btn btn-primary btn-lg mt-3" data-link>
                トーナメント情報へ
            </a>
        </div>
    </div>
    
    <style>
        .container {
            padding: 20px;
        }
        
        .winner-box {
            background-color: black;
            padding: 50px;
            border-radius: 25px;
            margin-top: 50px;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }
    
        .trophy-image {
            max-width: 300px;
            width: 100%;
            height: auto;
            margin-bottom: 30px;
            transition: transform 0.3s ease;
        }
    
        .winner-text {
            color: #007bff;
            font-size: 2.5rem;
            margin-bottom: 20px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
    </style>
    `;
  },
  after_render: async () => {
    updateContent();
  },
};

export default WinnerPage;
