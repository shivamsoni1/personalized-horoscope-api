// MongoDB initialization script
db = db.getSiblingDB('horoscope_db');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password', 'birthdate', 'zodiacSign'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 50,
          description: 'User name is required and must be between 2-50 characters'
        },
        email: {
          bsonType: 'string',
          pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
          description: 'Valid email is required'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password must be at least 6 characters'
        },
        birthdate: {
          bsonType: 'date',
          description: 'Birthdate is required'
        },
        zodiacSign: {
          bsonType: 'string',
          enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
          description: 'Valid zodiac sign is required'
        }
      }
    }
  }
});

db.createCollection('horoscopes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'zodiacSign', 'content', 'date'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'User ID is required'
        },
        zodiacSign: {
          bsonType: 'string',
          enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
          description: 'Valid zodiac sign is required'
        },
        content: {
          bsonType: 'string',
          minLength: 10,
          description: 'Horoscope content is required'
        },
        date: {
          bsonType: 'date',
          description: 'Date is required'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ zodiacSign: 1 });
db.users.createIndex({ createdAt: 1 });

db.horoscopes.createIndex({ userId: 1, date: -1 });
db.horoscopes.createIndex({ zodiacSign: 1, date: -1 });
db.horoscopes.createIndex({ userId: 1, date: 1 }, { unique: true });
db.horoscopes.createIndex({ createdAt: 1 });

// Insert sample data for testing (optional)
if (db.users.countDocuments() === 0) {
  print('Inserting sample data...');
  
  // Sample user (password: Password123 - hashed)
  db.users.insertOne({
    name: 'Sample User',
    email: 'sample@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3oWwJyv.o6', // Password123
    birthdate: new Date('1990-07-15'),
    zodiacSign: 'Cancer',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  print('Sample data inserted successfully');
}

print('Database initialization completed');