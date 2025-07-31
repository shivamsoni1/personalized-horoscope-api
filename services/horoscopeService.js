// Mock horoscope data for each zodiac sign
const horoscopeData = {
    Aries: [
      "Today brings exciting opportunities for leadership. Your natural enthusiasm will inspire others around you.",
      "The stars align to boost your confidence. Take that bold step you've been considering.",
      "Adventure calls to you today. Embrace new experiences with your characteristic courage.",
      "Your energy is infectious today. Channel it into creative projects for amazing results.",
      "A chance encounter may lead to something significant. Stay open to unexpected possibilities."
    ],
    Taurus: [
      "Stability and comfort are your focus today. Take time to enjoy life's simple pleasures.",
      "Your practical approach will solve a lingering problem. Trust your methodical nature.",
      "Beauty surrounds you today. Indulge in art, music, or nature to feed your soul.",
      "Patience will be rewarded. The slow and steady approach wins the race today.",
      "Financial matters look favorable. Your conservative approach to money serves you well."
    ],
    Gemini: [
      "Communication flows easily today. Your words have the power to bridge differences.",
      "Curiosity leads to fascinating discoveries. Follow your interests wherever they may lead.",
      "Social connections bring unexpected benefits. Network and make new friends today.",
      "Your adaptability is your greatest strength. Embrace change with your characteristic flexibility.",
      "Mental stimulation is key today. Engage in learning something completely new."
    ],
    Cancer: [
      "Home and family take center stage. Create a nurturing environment for yourself and loved ones.",
      "Your intuition is particularly strong today. Trust those gut feelings and emotional insights.",
      "Past experiences offer valuable lessons. Reflect on how far you've come in your journey.",
      "Emotional connections deepen today. Share your feelings with someone you trust.",
      "Self-care is essential. Listen to your body and give it the rest and nourishment it needs."
    ],
    Leo: [
      "Your natural charisma shines brightly today. Step into the spotlight and share your talents.",
      "Creative expression brings joy and recognition. Let your artistic side flourish.",
      "Leadership opportunities present themselves. Your confident approach inspires others.",
      "Generosity and warmth attract positive energy. Share your abundance with others.",
      "Romance and fun are highlighted. Plan something special with someone you care about."
    ],
    Virgo: [
      "Attention to detail pays off today. Your meticulous approach yields perfect results.",
      "Organization and planning set you up for success. Create systems that serve your goals.",
      "Health and wellness deserve focus. Small improvements in routine make big differences.",
      "Your analytical skills solve complex problems. Others seek your practical wisdom.",
      "Service to others brings deep satisfaction. Look for ways to help and support your community."
    ],
    Libra: [
      "Balance and harmony guide your decisions today. Seek the middle ground in conflicts.",
      "Partnerships flourish under today's energy. Collaboration brings mutual benefits.",
      "Beauty and aesthetics inspire you. Surround yourself with things that please your senses.",
      "Diplomatic skills help resolve tensions. Your fair approach earns respect from all sides.",
      "Justice and fairness motivate your actions. Stand up for what's right with grace and poise."
    ],
    Scorpio: [
      "Deep transformation is possible today. Embrace the power of renewal and rebirth.",
      "Your intensity and focus achieve remarkable results. Channel your passion productively.",
      "Hidden truths come to light. Your investigative nature uncovers important information.",
      "Emotional depth strengthens relationships. Share your authentic self with trusted allies.",
      "Mysterious opportunities present themselves. Trust your instincts to guide you forward."
    ],
    Sagittarius: [
      "Adventure and exploration call to your spirit. Expand your horizons through new experiences.",
      "Philosophical insights illuminate your path. Seek wisdom through study and contemplation.",
      "Optimism and enthusiasm attract good fortune. Your positive outlook inspires others.",
      "Travel or foreign connections bring opportunities. Embrace different cultures and perspectives.",
      "Teaching and sharing knowledge fulfill your purpose. Your wisdom helps others grow."
    ],
    Capricorn: [
      "Hard work and determination lead to achievement. Your persistent efforts finally pay off.",
      "Traditional approaches prove most effective. Stick to tried and tested methods today.",
      "Career advancement is highlighted. Your professional reputation opens new doors.",
      "Responsibility and maturity earn respect. Others look to you for guidance and stability.",
      "Long-term planning yields concrete results. Your patient strategy builds lasting success."
    ],
    Aquarius: [
      "Innovation and original thinking set you apart. Your unique perspective offers solutions.",
      "Humanitarian causes capture your attention. Make a positive difference in your community.",
      "Technology and progress facilitate your goals. Embrace modern tools and methods.",
      "Friendship and group activities bring joy. Connect with like-minded individuals today.",
      "Independence and freedom guide your choices. March to the beat of your own drum."
    ],
    Pisces: [
      "Intuition and imagination flow freely today. Trust your creative and psychic abilities.",
      "Compassion and empathy strengthen bonds. Your understanding nature heals and comforts.",
      "Artistic pursuits bring deep satisfaction. Express your emotions through creative outlets.",
      "Spiritual insights guide your journey. Meditation and reflection reveal inner truths.",
      "Dreams and visions hold important messages. Pay attention to symbolic communications."
    ]
  };
  
  class HoroscopeService {
    // Get random horoscope for a zodiac sign
    static getRandomHoroscope(zodiacSign) {
      const horoscopes = horoscopeData[zodiacSign];
      if (!horoscopes) {
        throw new Error('Invalid zodiac sign');
      }
      
      const randomIndex = Math.floor(Math.random() * horoscopes.length);
      return horoscopes[randomIndex];
    }
  
    // Get horoscope with personalization elements
    static getPersonalizedHoroscope(zodiacSign, userName) {
      let baseHoroscope = this.getRandomHoroscope(zodiacSign);
      
      // Add personalization elements
      const personalizations = [
        `${userName}, ${baseHoroscope.toLowerCase()}`,
        `Dear ${userName}, ${baseHoroscope.toLowerCase()}`,
        `${baseHoroscope} Remember, ${userName}, your ${zodiacSign} energy is particularly strong today.`,
        `${baseHoroscope} As a ${zodiacSign}, ${userName}, you have the power to make this a remarkable day.`
      ];
      
      const randomPersonalization = Math.floor(Math.random() * personalizations.length);
      return personalizations[randomPersonalization];
    }
  
    // Generate daily affirmation based on zodiac sign
    static getDailyAffirmation(zodiacSign) {
      const affirmations = {
        Aries: "I embrace my natural leadership with courage and confidence.",
        Taurus: "I find beauty and stability in every moment of my day.",
        Gemini: "I communicate with clarity and connect meaningfully with others.",
        Cancer: "I nurture myself and others with love and compassion.",
        Leo: "I shine my light brightly and inspire those around me.",
        Virgo: "I approach each task with precision and dedication.",
        Libra: "I create harmony and balance in all my relationships.",
        Scorpio: "I transform challenges into opportunities for growth.",
        Sagittarius: "I explore life with optimism and boundless curiosity.",
        Capricorn: "I build my dreams with patience and determination.",
        Aquarius: "I embrace my uniqueness and contribute to positive change.",
        Pisces: "I trust my intuition and express my creativity freely."
      };
      
      return affirmations[zodiacSign] || "I embrace the unique qualities that make me who I am.";
    }
  
    // Get lucky numbers based on zodiac sign and date
    static getLuckyNumbers(zodiacSign, date) {
      const zodiacNumbers = {
        Aries: [3, 9, 21, 27],
        Taurus: [2, 6, 15, 24],
        Gemini: [5, 7, 14, 23],
        Cancer: [2, 7, 11, 16],
        Leo: [1, 8, 19, 28],
        Virgo: [6, 14, 18, 29],
        Libra: [6, 15, 24, 33],
        Scorpio: [4, 13, 18, 27],
        Sagittarius: [3, 9, 21, 30],
        Capricorn: [8, 10, 19, 26],
        Aquarius: [4, 11, 22, 29],
        Pisces: [7, 12, 16, 25]
      };
      
      const baseNumbers = zodiacNumbers[zodiacSign] || [7, 14, 21, 28];
      const dayOfMonth = date.getDate();
      
      // Add some randomness based on the date
      return baseNumbers.map(num => (num + dayOfMonth) % 50 + 1);
    }
  }
  
  module.exports = HoroscopeService;