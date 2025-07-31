const express = require('express');
const Horoscope = require('../models/Horoscope');
const { authenticateToken } = require('../middleware/auth');
const HoroscopeService = require('../services/horoscopeService');

const router = express.Router();

/**
 * @swagger
 * /api/horoscope/today:
 *   get:
 *     summary: Get today's horoscope for authenticated user
 *     tags: [Horoscope]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's horoscope retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     horoscope:
 *                       type: object
 *                       properties:
 *                         zodiacSign:
 *                           type: string
 *                         content:
 *                           type: string
 *                         date:
 *                           type: string
 *                         affirmation:
 *                           type: string
 *                         luckyNumbers:
 *                           type: array
 *                           items:
 *                             type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    // Check if horoscope already exists for today
    let horoscope = await Horoscope.findOne({
      userId,
      date: today
    });

    // If no horoscope exists for today, create one
    if (!horoscope) {
      const content = HoroscopeService.getPersonalizedHoroscope(
        req.user.zodiacSign,
        req.user.name
      );

      horoscope = new Horoscope({
        userId,
        zodiacSign: req.user.zodiacSign,
        content,
        date: today
      });

      await horoscope.save();
    }

    // Get additional elements
    const affirmation = HoroscopeService.getDailyAffirmation(req.user.zodiacSign);
    const luckyNumbers = HoroscopeService.getLuckyNumbers(req.user.zodiacSign, today);

    res.status(200).json({
      status: 'success',
      data: {
        horoscope: {
          zodiacSign: horoscope.zodiacSign,
          content: horoscope.content,
          date: horoscope.date,
          affirmation,
          luckyNumbers,
          createdAt: horoscope.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error fetching today\'s horoscope:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching horoscope'
    });
  }
});

/**
 * @swagger
 * /api/horoscope/history:
 *   get:
 *     summary: Get last 7 days horoscope history for authenticated user
 *     tags: [Horoscope]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *           default: 7
 *         description: Number of days to fetch (max 30)
 *     responses:
 *       200:
 *         description: Horoscope history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const days = Math.min(parseInt(req.query.days) || 7, 30); // Max 30 days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const horoscopes = await Horoscope.find({
      userId,
      date: { $gte: startDate }
    })
    .sort({ date: -1 })
    .select('-userId -__v');

    // Fill in missing days with generated horoscopes (but don't save them)
    const horoscopeMap = new Map();
    horoscopes.forEach(h => {
      const dateKey = h.date.toISOString().split('T')[0];
      horoscopeMap.set(dateKey, h);
    });

    const completeHistory = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateKey = date.toISOString().split('T')[0];
      
      if (horoscopeMap.has(dateKey)) {
        const existingHoroscope = horoscopeMap.get(dateKey);
        completeHistory.push({
          zodiacSign: existingHoroscope.zodiacSign,
          content: existingHoroscope.content,
          date: existingHoroscope.date,
          affirmation: HoroscopeService.getDailyAffirmation(req.user.zodiacSign),
          luckyNumbers: HoroscopeService.getLuckyNumbers(req.user.zodiacSign, date),
          createdAt: existingHoroscope.createdAt,
          saved: true
        });
      } else {
        // Generate horoscope for missing day (but don't save)
        const content = HoroscopeService.getPersonalizedHoroscope(
          req.user.zodiacSign,
          req.user.name
        );
        
        completeHistory.push({
          zodiacSign: req.user.zodiacSign,
          content,
          date,
          affirmation: HoroscopeService.getDailyAffirmation(req.user.zodiacSign),
          luckyNumbers: HoroscopeService.getLuckyNumbers(req.user.zodiacSign, date),
          saved: false
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        horoscopes: completeHistory,
        totalDays: days,
        savedCount: horoscopes.length,
        generatedCount: days - horoscopes.length
      }
    });
  } catch (error) {
    console.error('Error fetching horoscope history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching horoscope history'
    });
  }
});

/**
 * @swagger
 * /api/horoscope/date/{date}:
 *   get:
 *     summary: Get horoscope for a specific date
 *     tags: [Horoscope]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Horoscope for specific date retrieved successfully
 *       400:
 *         description: Invalid date format
 *       401:
 *         description: Unauthorized
 */
router.get('/date/:date', authenticateToken, async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user._id;
    
    // Validate date format
    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format. Please use YYYY-MM-DD format.'
      });
    }

    // Don't allow future dates beyond today
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (requestedDate > today) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot fetch horoscope for future dates.'
      });
    }

    requestedDate.setHours(0, 0, 0, 0);

    // Check if horoscope exists
    let horoscope = await Horoscope.findOne({
      userId,
      date: requestedDate
    });

    // If no horoscope exists and it's today, create one
    const isToday = requestedDate.toDateString() === new Date().toDateString();
    
    if (!horoscope && isToday) {
      const content = HoroscopeService.getPersonalizedHoroscope(
        req.user.zodiacSign,
        req.user.name
      );

      horoscope = new Horoscope({
        userId,
        zodiacSign: req.user.zodiacSign,
        content,
        date: requestedDate
      });

      await horoscope.save();
    }

    // If still no horoscope, generate one but don't save
    if (!horoscope) {
      const content = HoroscopeService.getPersonalizedHoroscope(
        req.user.zodiacSign,
        req.user.name
      );

      return res.status(200).json({
        status: 'success',
        data: {
          horoscope: {
            zodiacSign: req.user.zodiacSign,
            content,
            date: requestedDate,
            affirmation: HoroscopeService.getDailyAffirmation(req.user.zodiacSign),
            luckyNumbers: HoroscopeService.getLuckyNumbers(req.user.zodiacSign, requestedDate),
            saved: false
          }
        }
      });
    }

    // Return saved horoscope
    res.status(200).json({
      status: 'success',
      data: {
        horoscope: {
          zodiacSign: horoscope.zodiacSign,
          content: horoscope.content,
          date: horoscope.date,
          affirmation: HoroscopeService.getDailyAffirmation(req.user.zodiacSign),
          luckyNumbers: HoroscopeService.getLuckyNumbers(req.user.zodiacSign, requestedDate),
          createdAt: horoscope.createdAt,
          saved: true
        }
      }
    });
  } catch (error) {
    console.error('Error fetching horoscope for date:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching horoscope'
    });
  }
});

/**
 * @swagger
 * /api/horoscope/stats:
 *   get:
 *     summary: Get user's horoscope statistics
 *     tags: [Horoscope]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Horoscope.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalHoroscopes: { $sum: 1 },
          firstHoroscope: { $min: '$date' },
          latestHoroscope: { $max: '$date' }
        }
      }
    ]);

    const result = stats[0] || {
      totalHoroscopes: 0,
      firstHoroscope: null,
      latestHoroscope: null
    };

    // Calculate streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check for consecutive days
    let checkDate = new Date(today);
    while (true) {
      const horoscope = await Horoscope.findOne({
        userId,
        date: checkDate
      });
      
      if (horoscope) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalHoroscopes: result.totalHoroscopes,
          firstHoroscope: result.firstHoroscope,
          latestHoroscope: result.latestHoroscope,
          currentStreak,
          zodiacSign: req.user.zodiacSign,
          memberSince: req.user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error fetching horoscope stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching statistics'
    });
  }
});

module.exports = router;