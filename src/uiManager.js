import { ZodiacData } from './zodiacData';

export class UIManager {
  constructor(game) {
    this.game = game;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Welcome screen
    document.getElementById('start-btn').addEventListener('click', () => {
      document.getElementById('welcome-screen').classList.remove('active');
      document.getElementById('name-screen').classList.add('active');
    });

    // Name and zodiac selection screen
    document.getElementById('generate-btn').addEventListener('click', () => {
      const name = document.getElementById('player-name').value;
      const zodiac = document.getElementById('zodiac-select').value;
      
      if (name && zodiac) {
        document.getElementById('name-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        this.game.showConstellation(zodiac);
      }
    });

    // Star click handler
    window.addEventListener('starClicked', (event) => {
      this.showStarInfo(event.detail);
    });

    // Close info panel
    document.getElementById('close-info').addEventListener('click', () => {
      document.getElementById('info-panel').classList.add('hidden');
    });

    // Change zodiac
    document.getElementById('change-zodiac').addEventListener('click', () => {
      document.getElementById('game-screen').classList.remove('active');
      document.getElementById('name-screen').classList.add('active');
      document.getElementById('info-panel').classList.add('hidden');
    });
  }

  showStarInfo(data) {
    const infoPanel = document.getElementById('info-panel');
    const zodiacData = ZodiacData[data.zodiacSign];

    document.getElementById('zodiac-name').textContent = data.zodiacSign.charAt(0).toUpperCase() + data.zodiacSign.slice(1);
    document.getElementById('characteristics').textContent = zodiacData.characteristics;
    document.getElementById('lucky-color').textContent = zodiacData.luckyColor;
    document.getElementById('lucky-number').textContent = zodiacData.luckyNumber;
    document.getElementById('population').textContent = zodiacData.population;
    document.getElementById('guidance').textContent = 
      `Peace: ${zodiacData.guidance.peace}\n` +
      `Love: ${zodiacData.guidance.love}\n` +
      `Money: ${zodiacData.guidance.money}`;

    infoPanel.classList.remove('hidden');
  }
}