const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Horoscope:
 *       type: object
 *       required:
 *         - userId
 *         - zodiacSign
 *         - content
 *         - date
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID who requested the horoscope
 *         zodiacSign:
 *           type: string
 *           description: Zodiac sign for this horoscope
 *         content:
 *           type: string
 *           description: Horoscope content/text
 *         date:
 *           type: string
 *           format: date
 *           description: Date for which horoscope was generated
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const horoscopeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  zodiacSign: {
    type: String,
    required: true,
    enum: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
horoscopeSchema.index({ userId: 1, date: -1 });
horoscopeSchema.index({ zodiacSign: 1, date: -1 });

// Ensure one horoscope per user per day
horoscopeSchema.index({ userId: 1, date: 1 }, { unique: true });

const Horoscope = mongoose.model('Horoscope', horoscopeSchema);

module.exports = Horoscope;