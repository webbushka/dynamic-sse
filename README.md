# Mathler - Daily Math Puzzle Game

A Wordle-inspired math puzzle game built with Remix, where players guess
6-character mathematical equations that equal a target number. Connect your
wallet to save scores and compete on the global leaderboard!

## 🎮 How to Play

1. **Daily Challenge**: Each day features a new target number
2. **Guess the Equation**: Create a 6-character math equation that equals the
   target
3. **Get Feedback**:
   - 🟢 Green = Correct character in correct position
   - 🟡 Yellow = Correct character in wrong position
   - ⚫ Gray = Character not in the equation
4. **Win**: Solve it in 6 attempts or less!

### Example

- **Target**: 32
- **Possible Solutions**: `31-2+3`, `4*8+0`, `30+1+1`

## 🚀 Features

- **Daily Puzzles**: New challenge every day with varying difficulty
- **Wallet Integration**: Connect wallet to save scores and compete
- **Global Leaderboard**: Compete with players worldwide
- **Game History**: Track your progress and statistics
- **Tip System**: Support the developer with crypto tips
- **Responsive Design**: Play on desktop or mobile
- **Real-time Validation**: Instant feedback on equation validity

## 🏗️ Architecture

### Tech Stack

- **Frontend**: [Remix](https://remix.run/) - Full-stack React framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Reusable component
  library
- **Database**: [SQLite](https://sqlite.org/) with [Prisma](https://prisma.io/)
  ORM
- **Wallet**: [Dynamic](https://dynamic.xyz/) - Authentication
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons

### Project Architecture

[![The Epic Stack](https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/246885449-1b00286c-aa3d-44b2-9ef2-04f694eb3592.png)](https://www.epicweb.dev/epic-stack)

## 🗄️ Database Schema

### Problems Table

Stores daily math puzzles with their solutions.

```sql
Problem {
  id          String   @id @default(cuid())
  answer      Int      # Target number (e.g., 32)
  expression  String   # Solution equation (e.g., "31-2+3")
  date        DateTime @unique # Puzzle date
  createdAt   DateTime @default(now())
}
```

### Leaderboard Table

Tracks player scores and game statistics.

```sql
LeaderboardEntry {
  id         String   @id @default(cuid())
  userId     String   # Wallet address
  problemId  String   # Reference to Problem
  score      Int      # Calculated score (lower = better)
  attempts   Int      # Number of guesses used
  durationMs Int      # Time taken in milliseconds
  createdAt  DateTime @default(now())

  @@unique([userId, problemId]) # One entry per user per problem
}
```

## 🎯 Core Game Logic

### Equation Validation

```typescript
// Must be exactly 6 characters
// Valid characters: 0-9, +, -, *, /
// Must not start/end with operators
// Must not have consecutive operators
// Must evaluate to the target number

isValidEquation('31-2+3', 32) // ✅ true
isValidEquation('4*8+0', 32) // ✅ true
isValidEquation('123456', 32) // ❌ false (no operators)
```

### Feedback System

```typescript
// Compare guess against correct answer
// Return color-coded feedback for each character
getFeedback('31-2+3', '4*8+0')
// Returns array of {char, status} objects
// status: "correct" | "wrong-position" | "not-used"
```

### Scoring Algorithm

```typescript
// Lower score = better performance
score = attempts * 100 + Math.floor(durationMs / 1000)

// Examples:
// 2 attempts, 45 seconds = 245 points
// 4 attempts, 120 seconds = 520 points
```

## 🔄 Data Flow

### Game Flow

1. **Load Daily Problem**: Fetch today's target number from database
2. **Player Input**: Validate 6-character equation in real-time
3. **Submit Guess**: Server validates equation and returns feedback
4. **Game End**: Submit score to leaderboard (if wallet connected)

### Authentication Flow

1. **Connect Wallet**: Integrate with Dynamic for auth
2. **Metadata Storage**: Use Dynamics metadata to store user info
3. **Fetch User Data**: Retrieve user profile and game history
4. **Submit Scores**: Save scores to leaderboard with wallet address and to
   Dynamic metadata

### Leaderboard System

1. **Global Rankings**: Aggregate all players by average score
2. **User Stats**: Individual performance metrics
3. **Game History**: Chronological list of user's games
4. **Real-time Updates**: Scores update immediately after games

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
   git clone https://github.com/webbushka/dynamic-sse.git
   cd dynamic-sse
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
# Generate Prisma client

npx prisma generate

# Initialize database with sample data

npx prisma db push
```

4. **Start development server**

```bash
npm run dev
```

5. **Open your browser** Navigate to `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root directory based on the provided template:

```bash
cp .env.example .env
```

## 🧪 Testing

### Run the test suite

```bash
npm test
```

### Manual Testing Checklist

- [ ] Daily problem loads correctly
- [ ] Equation validation works for all cases
- [ ] Feedback colors display properly
- [ ] Scores submit successfully
- [ ] Leaderboard updates in real-time
- [ ] Wallet connection flow works
- [ ] Game state persists across sessions
