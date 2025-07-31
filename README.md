# 🔮 Personalized Horoscope API

A comprehensive Node.js backend service that generates and serves personalized daily horoscopes for users based on their zodiac signs. Built with Express.js, MongoDB, and modern security practices.

**⚠️ AI Tool Usage Notice**: This project was developed with assistance from Claude AI (Anthropic) for architecture planning, code implementation, best practices guidance, and documentation. The AI helped with design patterns, error handling, testing strategies, and optimization recommendations.

## 🚀 Features

- **User Authentication**: JWT-based signup/login system with secure password hashing
- **Auto Zodiac Detection**: Automatically calculates zodiac sign from birthdate using precise astronomical dates
- **Daily Horoscopes**: Personalized horoscope content with user name integration
- **History Tracking**: Access to historical horoscopes with smart on-demand generation
- **Rate Limiting**: Built-in API protection (5 requests/minute) to prevent abuse
- **Interactive API Documentation**: Swagger/OpenAPI documentation for easy testing
- **Data Persistence**: MongoDB integration with proper indexing and validation
- **Input Validation**: Robust validation using express-validator
- **Security**: Helmet.js, CORS, JWT authentication, and bcrypt password hashing
- **Docker Support**: Complete containerization with Docker Compose

## 📦 Tech Stack

- **Backend**: Node.js 18+ & Express.js 4.x
- **Database**: MongoDB 7.0 with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Validation**: express-validator for input sanitization
- **Security**: Helmet.js, CORS, express-rate-limit
- **Documentation**: Swagger/OpenAPI 3.0 with swagger-jsdoc
- **Testing**: Jest & Supertest for unit/integration tests
- **Containerization**: Docker & Docker Compose

## 🛠️ Setup Instructions

### Prerequisites

- **Docker & Docker Compose** (recommended for easy setup)
- **Git** for cloning the repository

### Docker Setup (Complete Local Environment)

1. **Clone the repository**
   ```bash
   git clone <your-github-repository-url>
   cd personalized-horoscope-api
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # The default .env.example values work for local Docker setup
   ```

3. **Start the Complete Stack**
   ```bash
   # Start MongoDB + API with one command
   docker-compose -f docker-compose.local.yml up -d
   
   # View startup logs
   docker-compose -f docker-compose.local.yml logs -f
   ```

4. **Verify Services are Running**
   ```bash
   # Check container status
   docker-compose -f docker-compose.local.yml ps
   
   # Test API health
   curl http://localhost:3000/health
   # Expected: {"status":"success","message":"Server is running"}
   ```

## 🧪 Test API with Swagger Documentation

### **Access Interactive API Documentation**
Once Docker containers are running, open your browser and navigate to:

**🌐 http://localhost:3000/api-docs**

This provides a complete interactive interface where you can:
- View all available endpoints
- Test API calls directly in your browser
- See request/response schemas
- Try authentication flows

### **Step-by-Step API Testing with Swagger:**

**1. Open Swagger UI**
```bash
# Open in browser
open http://localhost:3000/api-docs
# Or visit: http://localhost:3000/api-docs
```

**2. Register a New User**
- Click on `POST /api/auth/register`
- Click "Try it out"
- Use this sample data:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "birthdate": "1990-07-15"
}
```
- Click "Execute"
- **Copy the JWT token** from the response for next steps

**3. Authorize Your Session**
- Click the "Authorize" button at the top of Swagger UI
- Enter: `Bearer YOUR_JWT_TOKEN_HERE`
- Click "Authorize"

**4. Test Horoscope Endpoints**
Now you can test all protected endpoints:
- `GET /api/horoscope/today` - Get today's personalized horoscope
- `GET /api/horoscope/history` - View horoscope history (try `?days=7`)
- `GET /api/horoscope/date/{date}` - Get horoscope for specific date (try `2024-07-30`)
- `GET /api/horoscope/stats` - View your reading statistics
- `GET /api/auth/profile` - View your profile

**5. Test Different Features**
- Try registering users with different birthdates to see various zodiac signs
- Test the rate limiting by making multiple quick requests
- Explore error handling with invalid data

### Quick Command Line Testing

If you prefer command line testing:

```bash
# 1. Register user and get token
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "Password123",
    "birthdate": "1990-07-15"
  }')

# 2. Extract token (requires jq or manual copy)
TOKEN=$(echo $RESPONSE | jq -r '.data.token')

# 3. Get today's horoscope
curl -X GET http://localhost:3000/api/horoscope/today \
  -H "Authorization: Bearer $TOKEN"
```

## 📚 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - User registration with auto zodiac detection
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/profile` - Get authenticated user profile

### Horoscope Services
- `GET /api/horoscope/today` - Get today's personalized horoscope
- `GET /api/horoscope/history?days=7` - Get historical horoscopes (1-30 days)
- `GET /api/horoscope/date/YYYY-MM-DD` - Get horoscope for specific date
- `GET /api/horoscope/stats` - Get user statistics and reading streaks

### Utility
- `GET /health` - System health check
- `GET /api-docs` - Interactive API documentation

## 🏗️ Project Structure

```
personalized-horoscope-api/
├── models/
│   ├── User.js              # User model with zodiac calculation
│   └── Horoscope.js         # Horoscope storage model
├── routes/
│   ├── auth.js              # Authentication endpoints
│   └── horoscope.js         # Horoscope service endpoints
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── validation.js        # Input validation middleware
│   └── errorHandler.js      # Global error handling
├── services/
│   └── horoscopeService.js  # Core horoscope generation logic
├── docker-compose.local.yml # Local development setup
├── Dockerfile.local         # Development container
├── server.js                # Application entry point
└── README.md               # Project documentation
```

## Docker Management Commands

```bash
# View container logs
docker-compose -f docker-compose.local.yml logs api
docker-compose -f docker-compose.local.yml logs mongodb

# Restart services
docker-compose -f docker-compose.local.yml restart

# Stop services
docker-compose -f docker-compose.local.yml down

# Clean restart (removes all data)
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d

# Monitor resource usage
docker stats
```

## Troubleshooting

**Services won't start:**
```bash
# Check what's using port 3000
lsof -i :3000

# Clean restart
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
```

**MongoDB connection issues:**
```bash
# Check MongoDB logs
docker-compose -f docker-compose.local.yml logs mongodb

# Test MongoDB connection
docker-compose -f docker-compose.local.yml exec mongodb mongosh -u root -p password123 --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

**API not responding:**
```bash
# Check API logs
docker-compose -f docker-compose.local.yml logs api

# Rebuild and restart
docker-compose -f docker-compose.local.yml up --build -d
```

## 🎯 Design Decisions

### 1. **Architecture Choices**

**RESTful API Design**: Chose REST over GraphQL for simplicity and widespread tooling support. REST is more suitable for this use case with clear resource boundaries (users, horoscopes).

**JWT Authentication**: Selected JWT over session-based auth for stateless scalability. JWT tokens enable horizontal scaling without shared session storage.

**MongoDB Selection**: Chose MongoDB over SQL databases for:
- Flexible schema for evolving horoscope content
- Natural JSON document storage matching API responses
- Easy horizontal scaling capabilities
- Built-in aggregation pipeline for analytics

### 2. **Data Storage Strategy**

**Lazy Horoscope Generation**: Only store horoscopes when users actually request them, reducing storage costs and improving performance.

**Unique Constraints**: Implemented compound unique index (userId + date) to prevent duplicate horoscopes while allowing efficient queries.

**Smart History**: Generate historical horoscopes on-demand without storage, maintaining consistent user experience.

### 3. **Security Implementation**

**Multi-layered Security**:
- bcrypt with 12 salt rounds for password hashing
- JWT with configurable expiration
- Rate limiting (5 req/min) to prevent abuse
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Helmet.js for security headers

### 4. **Zodiac Calculation Logic**

**Astronomical Accuracy**: Used precise date ranges for zodiac signs based on astronomical data rather than simplified month-based calculations.

**Timezone Handling**: Implemented robust date parsing to handle various timezone inputs correctly.

**Pre-save Hooks**: Utilized Mongoose middleware to automatically calculate zodiac signs, ensuring data consistency.

### 5. **Content Generation**

**Rich Content Pool**: Created 5+ variations per zodiac sign to prevent repetitive experiences.

**Personalization**: Integrated user names and zodiac-specific affirmations for enhanced engagement.

**Extensible Design**: Built content service to easily add more personalization factors (mood, preferences, etc.).

## 🚀 Improvements I'd Make with More Time

### 1. **Enhanced Personalization Engine**

```javascript
// Advanced user profiling
const UserProfile = {
  personalityTraits: ['adventurous', 'analytical', 'creative'],
  lifeGoals: ['career', 'relationship', 'health'],
  currentChallenges: ['stress', 'decision-making'],
  preferredTopics: ['love', 'career', 'money', 'health'],
  readingHistory: [], // Track engagement patterns
  moodIndicators: [], // Recent app interactions
}

// ML-driven content generation
const generatePersonalizedHoroscope = async (user, date) => {
  const profile = await getUserProfile(user.id);
  const astrologicalData = await getAstrologicalData(date);
  const personalizedContent = await mlModel.predict({
    zodiac: user.zodiacSign,
    profile: profile,
    astrologicalData: astrologicalData,
    historicalEngagement: profile.readingHistory
  });
  return personalizedContent;
};
```

### 2. **Real-time Astronomical Data Integration**

- **NASA APIs**: Integrate real planetary positions and lunar phases
- **Astronomical Events**: Include eclipses, meteor showers, retrograde periods
- **Location-based Astrology**: Use user location for house calculations
- **Dynamic Content**: Adjust horoscopes based on current celestial events

### 3. **Advanced Analytics & Insights**

```javascript
// User engagement analytics
const EngagementMetrics = {
  readingFrequency: 'daily', // daily, weekly, occasional
  preferredReadingTime: '09:00', // when users typically read
  contentPreferences: ['career', 'love'], // most engaging topics
  readingDuration: 45, // seconds spent reading
  shareFrequency: 0.3, // how often they share content
  feedbackSentiment: 0.8 // positive feedback ratio
};

// Predictive analytics
const PredictiveInsights = {
  churnRisk: 0.2, // likelihood to stop using
  engagementScore: 8.5, // overall engagement rating
  nextBestAction: 'send_weekly_summary', // recommended action
  contentRecommendations: ['meditation_tips', 'career_advice']
};
```

### 4. **Performance & Scalability Optimizations**

**Caching Strategy**:
```javascript
// Redis caching layers
const CacheStrategy = {
  userProfiles: '24h', // User profile data
  horoscopeTemplates: '1w', // Base horoscope content
  astrologicalData: '1h', // Planetary positions
  personalizedContent: '1d', // Generated horoscopes
};

// Database optimizations
const OptimizationStrategy = {
  readReplicas: 'route read queries to replicas',
  sharding: 'shard by user_id for horizontal scaling',
  indexing: 'compound indexes on common query patterns',
  archiving: 'archive old horoscopes to cold storage'
};
```

**Microservices Architecture**:
```yaml
services:
  user-service:     # User management & auth
  content-service:  # Horoscope generation
  astro-service:    # Astronomical data
  analytics-service: # User insights & metrics
  notification-service: # Push notifications
  api-gateway:      # Request routing & rate limiting
```

### 5. **Advanced Features**

**Real-time Notifications**:
- Push notifications for daily horoscopes
- Personalized optimal reading times
- Special astronomical event alerts

**Social Features**:
- Horoscope sharing with friends
- Zodiac compatibility readings
- Community discussions and insights

**Subscription Tiers**:
```javascript
const SubscriptionTiers = {
  free: {
    dailyHoroscopes: true,
    historyDays: 7,
    personalizedContent: false
  },
  premium: {
    dailyHoroscopes: true,
    historyDays: 365,
    personalizedContent: true,
    astrologicalInsights: true,
    prioritySupport: true
  }
};
```

## 📈 Scaling for Fully Personalized Horoscopes

### Current System vs. Personalized System Comparison

| Aspect | Current (Zodiac-based) | Fully Personalized |
|--------|----------------------|-------------------|
| **Content Generation** | Random selection from 5 templates | AI/ML-driven unique content |
| **User Data Required** | Birthdate only | Comprehensive profile + behavior |
| **Computational Cost** | Minimal (O(1)) | High (O(n) with ML inference) |
| **Storage Requirements** | ~1KB per horoscope | ~10KB per horoscope + profile data |
| **Database Queries** | Simple key lookups | Complex aggregations + ML features |
| **Response Time** | <50ms | 200-500ms (with caching) |

### Scaling Architecture for Personalization

#### 1. **Data Architecture Evolution**

```javascript
// Enhanced user data model
const PersonalizedUserSchema = {
  // Basic info (current)
  name: String,
  email: String,
  birthdate: Date,
  zodiacSign: String,
  
  // Extended profile data
  personalityProfile: {
    mbtiType: String, // Myers-Briggs type
    enneagramType: Number, // Enneagram personality type
    values: [String], // Core values and interests
    lifePhase: String, // student, career-building, family, retirement
  },
  
  // Behavioral data
  engagementPatterns: {
    readingTimes: [String], // preferred reading times
    devicePreferences: String, // mobile, desktop, tablet
    contentInteractions: [{ // which parts they read/skip
      section: String,
      engagement: Number
    }]
  },
  
  // Contextual data
  currentLifeContext: {
    relationship_status: String,
    career_stage: String,
    major_life_events: [String], // recent changes
    goals: [String], // current focus areas
    challenges: [String] // current concerns
  }
};
```

#### 2. **Microservices Architecture**

```yaml
# Scalable personalization architecture
services:
  # Core services
  user-profile-service:
    purpose: "Manage user profiles and behavioral data"
    database: "MongoDB (user data) + Redis (hot profiles)"
    scaling: "Shard by user_id"
    
  personality-analyzer-service:
    purpose: "Analyze user personality and preferences"
    technology: "Python + scikit-learn + TensorFlow"
    scaling: "Horizontal with GPU instances"
    
  content-generation-service:
    purpose: "Generate personalized horoscope content"
    technology: "Node.js + OpenAI API / Custom NLP models"
    scaling: "Auto-scaling with request queues"
    
  astronomical-data-service:
    purpose: "Real-time planetary positions and aspects"
    data_sources: "NASA APIs, Swiss Ephemeris"
    caching: "Redis with 1-hour TTL"
    
  personalization-engine:
    purpose: "ML-driven content customization"
    technology: "Python + TensorFlow/PyTorch"
    infrastructure: "Kubernetes with GPU nodes"
```

#### 3. **Performance Optimization Strategy**

```javascript
// Multi-level caching for personalized content
const CachingStrategy = {
  // Level 1: User profile cache (hot data)
  userProfiles: {
    storage: 'Redis',
    ttl: '1 hour',
    pattern: 'user:profile:{userId}',
    size: '~50KB per user'
  },
  
  // Level 2: Personalization features cache
  mlFeatures: {
    storage: 'Redis',
    ttl: '6 hours', 
    pattern: 'ml:features:{userId}:{date}',
    size: '~10KB per user per day'
  },
  
  // Level 3: Generated content cache
  personalizedContent: {
    storage: 'Redis + MongoDB',
    ttl: '24 hours',
    pattern: 'horoscope:personalized:{userId}:{date}',
    size: '~15KB per horoscope'
  },
  
  // Level 4: Astronomical data cache
  astrologicalData: {
    storage: 'Redis',
    ttl: '1 hour',
    pattern: 'astro:data:{date}:{location}',
    size: '~5KB per location per hour'
  }
};
```

#### 4. **Cost Optimization Strategy**

```javascript
const CostOptimization = {
  // Tiered processing
  userTiers: {
    new_users: 'basic personalization (rule-based)',
    engaged_users: 'medium ML personalization', 
    premium_users: 'full AI personalization'
  },
  
  // Smart resource allocation
  processing: {
    peak_hours: 'full ML processing (6 AM - 10 AM)',
    off_peak: 'cached content + basic updates',
    batch_jobs: 'night processing for next day'
  },
  
  // Storage optimization
  dataLifecycle: {
    hot_data: '7 days in memory cache',
    warm_data: '30 days in SSD storage',
    cold_data: '1 year in object storage',
    archive: 'compressed long-term storage'
  }
};
```

### Expected Performance Metrics

| Metric | Current System | Personalized System |
|--------|----------------|-------------------|
| **Response Time** | 50-100ms | 200-500ms (cached) |
| **Daily Active Users** | 10K | 10K (same) |
| **Content Generation Cost** | $0.01/user/month | $0.50/user/month |
| **Storage per User** | 1MB/year | 100MB/year |
| **Server Costs** | $500/month | $5,000/month |
| **ML/AI Costs** | $0 | $2,000/month |
| **User Engagement** | +0% baseline | +200-400% expected |

This comprehensive scaling plan transforms the current zodiac-based system into a fully personalized AI-driven horoscope platform while maintaining performance and managing costs effectively.

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Test API endpoints interactively
open http://localhost:3000/api-docs
```

## 🔐 Security Features

- **Password Security**: bcrypt with 12 salt rounds
- **JWT Authentication**: Configurable token expiration
- **Rate Limiting**: 5 requests per minute per IP
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin policies
- **Security Headers**: Helmet.js implementation
- **Error Sanitization**: No sensitive data in error responses

## 📈 Monitoring & Health

- **Health Endpoint**: `/health` for load balancer checks
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring
- **Database Health**: Connection status monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **API Documentation**: Visit `/api-docs` for interactive testing
- **Health Check**: Monitor `/health` endpoint status

---

**Built with ❤️ using Node.js, Express.js, and MongoDB**

**AI Assistance**: Developed with Claude AI for architecture, implementation, and optimization guidance