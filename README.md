# Quiz Rush: Sunthon Phu

A fast-paced quiz game testing your knowledge of Sunthon Phu, Thailand's greatest poet. Answer 15 questions per round under time pressure with combo scoring and a global leaderboard.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand-free, React hooks only
- **Font:** Kanit (Google Fonts)
- **Database:** Upstash Redis (REST API)
- **Animation:** Framer Motion

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Set up environment variables. Create `.env.local` in the project root:

```
UPSTASH_REDIS_REST_URL=your_url_here
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

You can get these from [Upstash Console](https://console.upstash.com) after creating a Redis database.

3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    quiz/page.tsx         # Quiz gameplay
    leaderboard/page.tsx  # Leaderboard view
    api/leaderboard/      # Redis API routes
  components/
    QuizCard.tsx          # Question + answer options
    Timer.tsx             # Countdown timer bar
    ScoreDisplay.tsx      # Score and combo display
    ComboIndicator.tsx    # Combo popup animation
    ResultSummary.tsx     # End-of-game results
    NameInputModal.tsx    # Username input for leaderboard
    LeaderboardTable.tsx  # Leaderboard table
  hooks/
    useQuizEngine.ts      # Game state machine
    useTimer.ts           # Countdown timer
  lib/
    types.ts              # TypeScript interfaces
    shuffle.ts            # Fisher-Yates shuffle
    scoring.ts            # Score + combo multiplier
    prepareQuestion.ts    # Question preparation
  data/
    questions.json        # 100 questions (20 per category)
```

## Game Rules

- Each round has 15 randomly selected questions
- You have 15 seconds per question
- Answering correctly earns base points + speed bonus
- Consecutive correct answers build a combo multiplier (up to 2x)
- Questions are shuffled and deduplicated within a session
- Your final score is submitted to a global leaderboard

## Categories

| Category | Description |
|----------|-------------|
| Life | Sunthon Phu's biography and life events |
| Works | His poems and literary contributions |
| Era | Historical context of his time |
| Poetry | Forms, techniques, and literary style |
| People | Figures connected to his life and work |

## Deployment

The easiest way to deploy is on [Vercel](https://vercel.com):

1. Push to GitHub
2. Import the repository on Vercel
3. Add your Upstash Redis environment variables
4. Deploy

The leaderboard requires Upstash Redis. Make sure your environment variables are set in the Vercel project settings before deploying.
