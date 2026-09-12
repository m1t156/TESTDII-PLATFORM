# TESTDII Backend

Backend server cho hệ sinh thái trắc nghiệm tính cách gamified TESTDII.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt (password hashing), helmet, CORS

## Project Structure

```
testdi-backend/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── constants.js     # Global constants
├── models/              # Mongoose models (schemas)
│   ├── User.js
│   ├── Question.js
│   ├── Character.js
│   ├── SBTIResult.js
│   ├── PersonalityArchetype.js
│   ├── UserProgress.js
│   └── Notification.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── testController.js
│   ├── characterController.js
│   ├── progressController.js
│   ├── notificationController.js
│   └── adminController.js
├── routes/              # API endpoints
│   ├── auth.js
│   ├── tests.js
│   ├── characters.js
│   ├── progress.js
│   ├── notifications.js
│   └── admin.js
├── middleware/          # Express middleware
│   ├── auth.js          # JWT verification
│   └── errorHandler.js  # Error handling
├── utils/               # Utility functions
│   ├── sbtiCalculator.js
│   ├── TestDefinition.js
│   ├── SBTITestDefinition.js
│   ├── TestFactory.js
│   ├── tokenGenerator.js
│   └── validator.js
├── seeders/             # Database seeders
│   ├── seedData.js
│   └── sbtiQuestionsData.js
└── .env                 # Environment variables (git ignored)
```

## Setup & Installation

### 1. Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
```

Update `.env` with your values:
```
MONGODB_URI_LOCAL=mongodb://localhost:27017/testdi_db
PORT=5000
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### 4. Seed Database (Optional)
```bash
npm run seed
```

This will:
- Create 31 SBTI questions (placeholder)
- Create 27 character placeholders
- Create 27 personality archetype placeholders

### 5. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Start Production Server
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/guest` - Generate guest ID
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (protected)

### SBTI Test
- `GET /api/tests/sbti/questions` - Get all SBTI questions
- `POST /api/tests/sbti/submit` - Submit test answers
- `GET /api/tests/sbti/result/:resultId` - Get specific result
- `GET /api/tests/sbti/latest` - Get latest result for user/guest

### Characters
- `GET /api/characters` - Get all characters
- `GET /api/characters/:characterId` - Get character by ID
- `GET /api/characters/type/:personalityType` - Get character by type
- `GET /api/characters/:characterId/palettes` - Get character palettes

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Save/update progress
- `POST /api/progress/unlock` - Unlock element

### Notifications
- `POST /api/notifications/subscribe` - Subscribe to notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe
- `GET /api/notifications/subscriptions` - Get subscriptions for email

### Admin (Protected)
- `GET /api/admin/questions` - Get all questions
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:questionId` - Update question
- `DELETE /api/admin/questions/:questionId` - Delete question
- `GET /api/admin/analytics` - Get analytics

## Database Schema

### SBTI Calculation
- **31 Questions**: 30 regular + 1 bonus
- **5 Dimensions**: SELF, EMOTIONS, ATTITUDE, ACTION, SOCIAL
- **15 Measures**: 3 per dimension (S1-S3, E1-E3, A1-A3, AC1-AC3, SO1-SO3)
- **DNA Tattoo**: 15-character string (L/M/H pattern)
- **27 Archetypes**: Matched via Manhattan distance

### User Progress Tracking
- Guest users: tracked via `guestId` (localStorage on frontend)
- Registered users: tracked via `userId` (JWT)
- Progress includes: selected character, palette, unlocked elements

## SBTI Test Definition

The system uses a **Strategy Pattern** for extensibility:

```javascript
// TestDefinition (abstract base)
// ├─ SBTITestDefinition (current)
// └─ MBTITestDefinition (future)
// └─ DISCTestDefinition (future)
```

To add a new test type:
1. Create `utils/NewTestDefinition.js` extending `TestDefinition`
2. Add to `TestFactory.getTest(testType)`
3. Create questions with correct test type
4. Create personality archetypes

## Important Notes

### Guest vs Registered Users
- **Guest**: Uses `guestId` stored in localStorage (frontend)
- **Registered**: Uses JWT token from login

### SBTI DNA Pattern
- Each measure scored 2-6 points (from 2 questions)
- Converted to L (2-3) / M (4) / H (5-6)
- 15 measures → 15-char DNA (e.g., "LLMHMHLLMHLMHM")
- Matched to 27 archetypes via Manhattan distance

### Image Storage
- Store URLs only (CDN recommended)
- Blurred and unlocked versions for each character
- Frontend handles de-blur animation

## TODO

- [ ] Add admin role verification middleware
- [ ] Implement actual 27 SBTI archetypes from Google Sheets
- [ ] Add email notification sending
- [ ] Implement special types (DRUNK, HHHH) handling
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add comprehensive error handling
- [ ] Write unit tests
- [ ] Write integration tests

## Development

### Run Tests
```bash
npm test
```

### Watch Tests
```bash
npm run test:watch
```

### View MongoDB Logs
```bash
# If using MongoDB locally
mongod --logpath log.txt
```

## Deployment

See `Deployment Guide` for production setup (coming soon)

## License

TODO: Add license

## Support

For questions or issues, please contact the development team.
