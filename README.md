# Finity - Kids Financial Literacy Web App

A playful, Monopoly-inspired classroom economy simulator that teaches 7-12 year olds about supply & demand, delayed gratification, compound growth, and financial decision-making.

## Features

- **Mission Marketplace**: Students request missions with dynamic supply & demand pricing
- **Three-Token System**: Spend (immediate use), Save (goal-based savings), and Grow (locked, compound growth)
- **Compound Growth Visualization**: See how Grow tokens increase over time with 2% weekly growth
- **Savings Goals**: Students can set custom savings goals and track progress
- **Reward Shop**: Spend tokens on classroom rewards
- **Teacher Dashboard**: Assign missions and approve completions
- **AI Explanations**: Optional AI integration for kid-friendly financial concepts
- **Mrs. Pennyworth Chatbot**: Interactive AI assistant for financial questions and guidance

## Tech Stack

- Next.js 15+
- TypeScript
- Tailwind CSS
- App Router
- In-memory data storage (no database)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
TEACHER_PIN=1234
```

To get an OpenRouter API key:
- Visit [OpenRouter.ai](https://openrouter.ai)
- Sign up or log in
- Generate an API key from your account settings
- Add it to `.env.local`

**Note**: OpenRouter is an API gateway that provides access to various AI models including Google's Gemini. The OpenRouter API key is optional—the app will use fallback text if no API key is provided.

### Running the App

Development mode:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Production build:

```bash
npm run build
npm start
```

## Usage

### For Students

1. Select your name from the home page and enter your PIN
2. Browse the Mission Marketplace and request missions
3. Wait for your teacher to assign missions
4. Complete missions and wait for teacher approval
5. Earn tokens split into three types:
   - **Spend**: Use immediately in the Reward Shop (50%)
   - **Save**: Work toward custom savings goals (20%)
   - **Grow**: Locked tokens that grow at 2% weekly (30%)
6. Set a savings goal on the Save page
7. View your Grow token projections
8. Ask Mrs. Pennyworth for financial guidance
9. Spend tokens in the Reward Shop

### For Teachers

1. Click "Teacher Login" on the home page
2. Enter the PIN (default: 1234)
3. View mission requests and assign them to students
4. Approve completed missions to award tokens
5. Monitor student progress and token balances
6. View student savings goals and spending behavior

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── student/[id]/      # Student dashboard and pages
│   │   ├── grow/          # Growth projections page
│   │   ├── save/          # Savings goals page
│   │   └── shop/          # Reward shop page
│   ├── teacher/           # Teacher dashboard
│   └── api/               # API routes
│       └── gemini/        # AI explanation endpoints
├── components/
│   ├── ui/                # Reusable UI components
│   ├── MrsPennyworthPanel.tsx  # Chatbot interface
│   ├── GrowthComparisonChart.tsx
│   └── TransferTokensCard.tsx
├── lib/
│   ├── store.ts           # In-memory data store
│   ├── growthCalculator.ts
│   ├── openrouter.ts      # AI API integration
│   └── constants.ts
└── types/
    └── index.ts           # TypeScript types
```

## Key Concepts Taught

1. **Supply & Demand**: Mission rewards decrease when more students request them
2. **Delayed Gratification**: Grow tokens are locked but increase over time
3. **Saving Goals**: Set personal savings targets and track progress
4. **Compound Growth**: 2% weekly growth on Grow tokens
5. **Financial Decisions**: Choose between spending now, saving for goals, or growing wealth over time

## Configuration

### Environment Variables

- `OPENROUTER_API_KEY`: Optional. OpenRouter API key for AI-generated explanations. OpenRouter provides access to models like Google's Gemini. Get a free key at [OpenRouter.ai](https://openrouter.ai)
- `TEACHER_PIN`: Required. 4-digit PIN for teacher access (default: 1234)

### Customization

- Edit `src/lib/store.ts` to modify initial students, missions, and rewards
- Adjust growth rate in `src/lib/growthCalculator.ts` (default: 2% weekly)
- Customize token split ratio in `src/lib/constants.ts` (default: 50% Spend, 20% Save, 30% Grow)
- Customize colors in `tailwind.config.ts`

## Demo Flow

1. **Home Page**: Select a student and enter their PIN
2. **Dashboard**: View token balances and pending missions
3. **Marketplace**: Request a mission (observe supply/demand pricing)
4. **Teacher Login**: Switch to teacher mode, assign missions
5. **Student View**: See assigned missions
6. **Teacher Approval**: Approve mission, award three-token split
7. **Savings Page**: Set and track custom savings goals
8. **Growth Visualization**: View compound growth projections
9. **Reward Shop**: Purchase rewards with Spend tokens
10. **Chatbot**: Ask Mrs. Pennyworth about financial topics

## Token Types & Defaults

| Token | Purpose | Icon | Color | Percentage |
|-------|---------|------|-------|----------|
| **Spend** | Immediate purchases | 🪙 | Amber | 50% |
| **Save** | Goal-based savings | 💰 | Sky Blue | 20% |
| **Grow** | Compound growth (locked) | 🌱 | Green | 30% |

## License

MIT

## Contributing

This is an educational web app. Feel free to fork and customize for your classroom!
