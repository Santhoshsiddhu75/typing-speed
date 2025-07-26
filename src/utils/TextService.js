/**
 * TextService - Provides difficulty-based text passages
 * Uses Quotable API with static fallbacks for reliability
 */

class TextService {
  constructor() {
    this.cache = this.loadCache();
    this.usedTexts = this.loadUsedTexts(); // Track what's been used recently
    this.fallbackTexts = {
      easy: [
        "The quick brown fox jumps over the lazy dog near the old barn.",
        "I love to read books on sunny afternoons in my favorite chair.",
        "She walks to the store every morning before work starts early.",
        "The cat sleeps on the warm windowsill during cold winter days.",
        "We play games in the park after school with our friends.",
        "He likes to cook pasta for dinner when the family visits.",
        "The blue sky has white fluffy clouds that look like animals.",
        "My friend and I ride bikes together through the quiet neighborhood.",
        "The dog runs fast in the green field chasing butterflies happily.",
        "She draws pictures with bright colors using her new art supplies.",
        "The sun shines bright in the morning over the peaceful lake.",
        "I drink coffee and eat toast daily before starting my work.",
        "The bird sings sweet songs at dawn from the tall oak tree.",
        "We watch movies on Friday nights with popcorn and hot chocolate.",
        "The tree has leaves that change colors during the autumn season.",
        "He works hard to finish his homework before dinner time arrives.",
        "The ocean waves crash on the shore creating a soothing sound.",
        "My mom makes the best chocolate cake for special family celebrations.",
        "The flowers bloom in the spring garden after the snow melts.",
        "I like to listen to music while walking through the city.",
        "The library is quiet and peaceful for reading good books.",
        "Children laugh and play on the swings at the playground.",
        "Fresh bread smells wonderful when it comes from the bakery.",
        "The mountain trail offers beautiful views of the valley below.",
        "Swimming in the cool lake feels great on hot summer days.",
        "The market sells fresh fruits and vegetables every Saturday morning.",
        "Grandma tells interesting stories about her childhood adventures every evening.",
        "The train arrives at the station exactly on time each day.",
        "Students study together in the quiet corner of the coffee shop.",
        "The garden needs water and care to grow healthy plants.",
        "Basketball games are fun to watch with friends and family.",
        "The museum has many old paintings and interesting historical artifacts.",
        "Morning walks help me start the day with energy and focus.",
        "The chef prepares delicious meals in the busy restaurant kitchen.",
        "Rainy days are perfect for staying inside and reading novels.",
        "The clock tower chimes every hour throughout the busy day.",
        "Ice cream tastes best when shared with friends on summer evenings.",
        "The lighthouse guides ships safely to shore during stormy nights.",
        "Picnics in the park are fun when the weather is nice.",
        "The farmer grows corn and wheat in the large open fields."
      ],
      medium: [
        "Technology has fundamentally transformed how we communicate and share information globally, creating unprecedented opportunities for collaboration and innovation across diverse industries and cultures.",
        "Scientists continue to explore renewable energy sources to combat climate change effectively, developing solar panels, wind turbines, and battery storage systems that could revolutionize our energy infrastructure.",
        "Modern education systems adapt to incorporate digital learning tools and methodologies, enabling personalized instruction and remote access to educational resources for students worldwide.",
        "Urban planning requires careful consideration of environmental impact and population growth, balancing economic development with sustainable practices and quality of life improvements for residents.",
        "Healthcare professionals work tirelessly to improve patient outcomes through innovative treatments, utilizing cutting-edge medical technology and evidence-based research to advance therapeutic interventions.",
        "The global economy depends on international trade relationships and market stability, with complex supply chains connecting manufacturers, distributors, and consumers across multiple continents.",
        "Environmental conservation efforts focus on protecting endangered species and natural habitats, implementing comprehensive strategies to preserve biodiversity and maintain ecological balance.",
        "Social media platforms influence public opinion and shape contemporary cultural trends, providing new channels for communication while raising important questions about privacy and information accuracy.",
        "Space exploration missions advance our understanding of the universe and planetary systems, utilizing sophisticated instruments and international cooperation to study distant celestial bodies.",
        "Artificial intelligence development raises important questions about ethics and human employment, requiring thoughtful consideration of how automated systems will integrate with existing social structures.",
        "Sustainable agriculture practices help farmers increase yields while protecting soil quality, combining traditional farming knowledge with modern scientific techniques and environmental stewardship.",
        "Cultural diversity enriches communities through shared traditions and varied perspectives, fostering creativity and mutual understanding while celebrating unique heritage and customs.",
        "Medical research breakthroughs offer hope for treating previously incurable diseases, with gene therapy, immunotherapy, and precision medicine opening new avenues for patient care.",
        "Financial markets respond to geopolitical events and economic policy changes, with investors analyzing complex data to make informed decisions about portfolio allocation and risk management.",
        "Educational institutions strive to prepare students for rapidly evolving career landscapes, developing curricula that emphasize critical thinking, adaptability, and lifelong learning skills.",
        "Innovation in transportation technology promises to reduce carbon emissions significantly, with electric vehicles, public transit improvements, and alternative fuel systems gaining widespread adoption.",
        "Community organizations provide essential services and support for local residents, addressing social needs through volunteer programs, charitable initiatives, and grassroots advocacy efforts.",
        "Scientific collaboration across borders accelerates discovery and knowledge sharing, enabling researchers to tackle complex global challenges through coordinated international research projects.",
        "Mental health awareness campaigns help reduce stigma and encourage treatment seeking, promoting understanding of psychological wellbeing and expanding access to professional counseling services.",
        "Renewable energy infrastructure investment creates jobs while addressing climate concerns, supporting economic growth in emerging clean technology sectors and sustainable development initiatives.",
        "Archaeological discoveries continue to reshape our understanding of ancient civilizations and human history, revealing fascinating insights about cultural evolution and technological advancement.",
        "Digital communication technologies have revolutionized business operations and personal relationships, enabling real-time collaboration between individuals and organizations across vast geographical distances.",
        "Climate adaptation strategies require comprehensive planning and community involvement to address rising sea levels, extreme weather events, and changing precipitation patterns effectively.",
        "Biotechnology research advances medical treatments and agricultural productivity through genetic engineering, molecular biology techniques, and innovative laboratory methodologies.",
        "International diplomacy plays a crucial role in maintaining global peace and stability, facilitating negotiations between nations and promoting cooperative solutions to transnational challenges."
      ],
      hard: [
        "Epistemological considerations regarding consciousness necessitate interdisciplinary collaboration between neuroscientists, philosophers, and cognitive psychologists.",
        "Quantum entanglement demonstrates the extraordinary interconnectedness of subatomic particles across vast cosmological distances and temporal frameworks.",
        "Contemporary socioeconomic paradigms reflect the complex interplay between globalization, technological advancement, and geopolitical instability.",
        "Bioethical implications of genetic engineering technologies challenge traditional moral frameworks and regulatory oversight mechanisms.",
        "Phenomenological investigations into subjective experience reveal the intricate relationship between perception, cognition, and existential authenticity.",
        "Postmodern deconstructionist approaches to literary criticism emphasize the multiplicity of interpretive possibilities within textual analysis.",
        "Neuroplasticity research demonstrates the brain's remarkable capacity for structural and functional reorganization throughout developmental periods.",
        "Anthropological studies of indigenous knowledge systems illuminate alternative epistemological frameworks for understanding natural phenomena.",
        "Macroeconomic modeling incorporates stochastic variables to predict market volatility and systemic risk propagation mechanisms.",
        "Interdisciplinary approaches to environmental sustainability require integration of ecological, technological, and socioeconomic considerations.",
        "Computational linguistics algorithms analyze syntactic structures and semantic relationships within natural language processing frameworks.",
        "Psychopharmacological interventions modulate neurotransmitter systems to address psychiatric disorders and cognitive dysfunction.",
        "Geopolitical ramifications of climate change include resource scarcity, population displacement, and international security implications.",
        "Theoretical physics explores fundamental questions about spacetime geometry, quantum field theory, and cosmological evolution.",
        "Sociological analysis of institutional hierarchies reveals power dynamics and structural inequalities within organizational frameworks.",
        "Biotechnological innovations in personalized medicine utilize genomic sequencing to optimize therapeutic interventions.",
        "Philosophical investigations into moral relativism examine cultural variations in ethical reasoning and value systems.",
        "Advanced manufacturing processes incorporate automation, artificial intelligence, and sustainable materials engineering principles.",
        "Cognitive neuroscience research investigates the neural correlates of decision-making, memory formation, and executive functioning.",
        "International law frameworks address transnational challenges including cybersecurity, human rights, and environmental protection."
      ]
    };
  }

  /**
   * Load cached text from localStorage
   */
  loadCache() {
    try {
      const cached = localStorage.getItem('typing-test-text-cache');
      return cached ? JSON.parse(cached) : { easy: [], medium: [], hard: [] };
    } catch (error) {
      console.warn('Failed to load text cache:', error);
      return { easy: [], medium: [], hard: [] };
    }
  }

  /**
   * Load recently used texts from localStorage
   */
  loadUsedTexts() {
    try {
      const used = localStorage.getItem('typing-test-used-texts');
      return used ? JSON.parse(used) : { easy: [], medium: [], hard: [] };
    } catch (error) {
      console.warn('Failed to load used texts:', error);
      return { easy: [], medium: [], hard: [] };
    }
  }

  /**
   * Save recently used texts to localStorage
   */
  saveUsedTexts() {
    try {
      localStorage.setItem('typing-test-used-texts', JSON.stringify(this.usedTexts));
    } catch (error) {
      console.warn('Failed to save used texts:', error);
    }
  }

  /**
   * Save text cache to localStorage
   */
  saveCache() {
    try {
      localStorage.setItem('typing-test-text-cache', JSON.stringify(this.cache));
    } catch (error) {
      console.warn('Failed to save text cache:', error);
    }
  }

  /**
   * Get text passage for specified difficulty with smart rotation
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   * @param {boolean} forceAPI - Force API call even if cache exists
   * @returns {Promise<string>} Text passage
   */
  async getTextPassage(difficulty = 'medium', forceAPI = false) {
    let selectedText = null;

    // 70% chance to try API first (if not forced), 30% chance to use fallback for variety
    const useAPI = forceAPI || Math.random() < 0.7;

    if (useAPI) {
      // Try API first
      try {
        const apiText = await this.fetchFromAPI(difficulty);
        if (apiText && !this.isRecentlyUsed(apiText, difficulty)) {
          selectedText = apiText;
          // Add to cache
          if (!this.cache[difficulty]) this.cache[difficulty] = [];
          this.cache[difficulty].push(apiText);
          
          // Keep cache size reasonable (max 50 per difficulty)
          if (this.cache[difficulty].length > 50) {
            this.cache[difficulty] = this.cache[difficulty].slice(-50);
          }
          
          this.saveCache();
        }
      } catch (error) {
        console.warn('API fetch failed, using fallback:', error);
      }
    }

    // If API failed or we chose fallback, try cache
    if (!selectedText && this.cache[difficulty] && this.cache[difficulty].length > 0) {
      selectedText = this.getUnusedFromArray(this.cache[difficulty], difficulty);
    }

    // If still no text, use fallback
    if (!selectedText) {
      selectedText = this.getUnusedFromArray(this.fallbackTexts[difficulty], difficulty);
    }

    // Track as used
    if (selectedText) {
      this.markAsUsed(selectedText, difficulty);
    }

    return selectedText || "The quick brown fox jumps over the lazy dog."; // Ultimate fallback
  }

  /**
   * Fetch text from Quotable API
   * @param {string} difficulty 
   * @returns {Promise<string|null>}
   */
  async fetchFromAPI(difficulty) {
    const params = this.getAPIParams(difficulty);
    const url = `https://api.quotable.io/quotes?${params}`;

    try {
      const response = await fetch(url, { 
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Get a random quote from results
        const randomQuote = data.results[Math.floor(Math.random() * data.results.length)];
        return randomQuote.content;
      }
      
      return null;
    } catch (error) {
      console.warn('Quotable API error:', error);
      return null;
    }
  }

  /**
   * Get API parameters based on difficulty
   * @param {string} difficulty 
   * @returns {string}
   */
  getAPIParams(difficulty) {
    const params = new URLSearchParams();
    
    switch (difficulty) {
      case 'easy':
        params.append('minLength', '20');
        params.append('maxLength', '80');
        params.append('tags', 'wisdom|friendship|happiness');
        break;
      case 'medium':
        params.append('minLength', '80');
        params.append('maxLength', '150');
        params.append('tags', 'wisdom|science|history');
        break;
      case 'hard':
        params.append('minLength', '150');
        params.append('maxLength', '300');
        params.append('tags', 'wisdom|philosophy|science');
        break;
      default:
        params.append('minLength', '80');
        params.append('maxLength', '150');
    }
    
    params.append('limit', '10'); // Get multiple quotes to choose from
    
    return params.toString();
  }

  /**
   * Get random item from array
   * @param {Array} array 
   * @returns {any}
   */
  getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get unused text from array, avoiding recently used ones
   * @param {Array} array 
   * @param {string} difficulty 
   * @returns {string|null}
   */
  getUnusedFromArray(array, difficulty) {
    if (!array || array.length === 0) return null;

    // Filter out recently used texts
    const usedTexts = this.usedTexts[difficulty] || [];
    const availableTexts = array.filter(text => !usedTexts.includes(text));

    // If we've used everything, reset the used list (but keep the last 5)
    if (availableTexts.length === 0) {
      this.usedTexts[difficulty] = usedTexts.slice(-5);
      this.saveUsedTexts();
      // Return a random text from the full array
      return this.getRandomFromArray(array);
    }

    return this.getRandomFromArray(availableTexts);
  }

  /**
   * Check if text was recently used
   * @param {string} text 
   * @param {string} difficulty 
   * @returns {boolean}
   */
  isRecentlyUsed(text, difficulty) {
    const usedTexts = this.usedTexts[difficulty] || [];
    return usedTexts.includes(text);
  }

  /**
   * Mark text as recently used
   * @param {string} text 
   * @param {string} difficulty 
   */
  markAsUsed(text, difficulty) {
    if (!this.usedTexts[difficulty]) {
      this.usedTexts[difficulty] = [];
    }

    // Add to used texts
    this.usedTexts[difficulty].push(text);

    // Keep only last 15 used texts (prevent immediate repetition)
    if (this.usedTexts[difficulty].length > 15) {
      this.usedTexts[difficulty] = this.usedTexts[difficulty].slice(-15);
    }

    this.saveUsedTexts();
  }

  /**
   * Preload cache with API content
   * @param {string} difficulty 
   * @param {number} count 
   */
  async preloadCache(difficulty, count = 10) {
    for (let i = 0; i < count; i++) {
      try {
        await this.getTextPassage(difficulty, true);
        // Small delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to preload cache item ${i + 1}:`, error);
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = { easy: [], medium: [], hard: [] };
    localStorage.removeItem('typing-test-text-cache');
  }

  /**
   * Clear used texts tracking
   */
  clearUsedTexts() {
    this.usedTexts = { easy: [], medium: [], hard: [] };
    localStorage.removeItem('typing-test-used-texts');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      easy: this.cache.easy?.length || 0,
      medium: this.cache.medium?.length || 0,
      hard: this.cache.hard?.length || 0
    };
  }
}

// Export singleton instance
const textService = new TextService();
export default textService;