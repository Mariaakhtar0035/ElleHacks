# Kids Financial Literacy Web App

A playful, Monopoly-inspired classroom economy simulator that teaches 7-12 year olds about supply & demand, delayed gratification, compound growth, and financial decision-making.

## Features

- **Mission Marketplace**: Students request missions with dynamic supply & demand pricing
- **Token System**: 70/30 split between Spend (immediate use) and Grow (locked, compound growth)
- **Compound Growth Visualization**: See how Grow tokens increase over time with 2% weekly growth
- **Reward Shop**: Spend tokens on classroom rewards
- **Teacher Dashboard**: Assign missions and approve completions
- **AI Explanations**: Optional Gemini AI integration for kid-friendly financial concepts

## Tech Stack

- Next.js 15
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
GEMINI_API_KEY=your_api_key_here
TEACHER_PIN=1234
```

Note: The Gemini API key is optional. The app will use fallback text if no API key is provided.

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

1. Select your name from the home page
2. Browse the Mission Marketplace and request missions
3. Wait for your teacher to assign missions
4. Complete missions and wait for teacher approval
5. Earn tokens (70% Spend, 30% Grow)
6. View your Grow token projections
7. Spend tokens in the Reward Shop

### For Teachers

1. Click "Teacher Login" on the home page
2. Enter the PIN (default: 1234)
3. View mission requests and assign them to students
4. Approve completed missions to award tokens
5. Monitor student progress and token balances

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── student/[id]/      # Student dashboard and pages
│   ├── teacher/           # Teacher dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # Reusable UI components
│   └── TeacherPINModal.tsx
├── lib/
│   ├── store.ts           # In-memory data store
│   ├── growthCalculator.ts
│   └── gemini.ts          # AI integration
└── types/
    └── index.ts           # TypeScript types
```

## Key Concepts Taught

1. **Supply & Demand**: Mission rewards decrease when more students request them
2. **Delayed Gratification**: Grow tokens are locked but increase over time
3. **Compound Growth**: 2% weekly growth on Grow tokens
4. **Financial Decisions**: Choose between spending now vs. saving for later

## Configuration

### Environment Variables

- `GEMINI_API_KEY`: Optional. Google Gemini API key for AI-generated explanations
- `TEACHER_PIN`: Required. 4-digit PIN for teacher access (default: 1234)

### Customization

- Edit `src/lib/store.ts` to modify initial students, missions, and rewards
- Adjust growth rate in `src/lib/growthCalculator.ts` (default: 2% weekly)
- Customize colors in `tailwind.config.ts`

## Demo Flow

1. **Home Page**: Select a student (Alex, Jordan, or Sam)
2. **Marketplace**: Request a mission (observe supply/demand)
3. **Teacher Login**: Switch to teacher, assign mission
4. **Student View**: See assigned mission in "My Missions"
5. **Teacher Approval**: Approve mission, award tokens
6. **Growth Visualization**: View compound growth projections
7. **Reward Shop**: Purchase a reward with Spend tokens

## License

MIT

## Contributing

This is a hackathon demo project. Feel free to fork and customize for your classroom!
