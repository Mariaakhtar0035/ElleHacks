# Quick Start Guide

## Kids Financial Literacy Web App

This is a complete, ready-to-demo classroom economy simulator built with Next.js 15, TypeScript, and Tailwind CSS.

## What's Included

✅ **Complete Application** with all features implemented:
- Mission Marketplace with supply & demand pricing
- Student dashboards for Alex, Jordan, and Sam
- Token system (70% Spend, 30% Grow)
- Compound growth visualization (2% weekly)
- Reward shop with instant purchases
- Teacher dashboard with PIN protection
- Gemini AI integration (optional, with fallbacks)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env.local` file is already created with default values:

```env
GEMINI_API_KEY=your_api_key_here
TEACHER_PIN=1234
```

**Note**: The Gemini API key is optional. The app will work perfectly with fallback text if you don't have an API key.

### 3. Run the Development Server

```bash
npm run dev
```

The app will start on `http://localhost:3000` (or the next available port).

### 4. Build for Production

```bash
npm run build
npm start
```

## Demo Flow (5 Minutes)

### Step 1: Student Selects Identity (30 seconds)
- Open the home page
- Click on "Alex" to enter as a student
- Show the dashboard with initial token balances

### Step 2: Request a Mission (1 minute)
- Navigate to "Marketplace"
- Request "Tech Helper for Week" mission
- Show how the reward stays at 150 tokens (no other requests yet)
- Request another mission to demonstrate supply/demand
- Have Jordan request the same mission
- Show how the reward decreases when multiple students want it

### Step 3: Teacher Assigns Mission (1 minute)
- Click "Teacher Login" at the bottom of the home page
- Enter PIN: `1234`
- View mission requests in the teacher dashboard
- Assign "Tech Helper for Week" to Alex
- Show the mission disappears from marketplace

### Step 4: View Assigned Mission (30 seconds)
- Return to Alex's dashboard
- Navigate to "My Missions"
- Show the assigned mission with "IN_PROGRESS" status

### Step 5: Teacher Approves Mission (1 minute)
- Return to teacher dashboard
- Find Alex's mission in "Pending Approvals"
- Click "Approve & Award Tokens"
- Show the 70/30 token split message

### Step 6: View Token Growth (1 minute)
- Return to Alex's dashboard
- Show updated token balances in header
- Navigate to "Grow Tokens"
- Demonstrate compound growth projections:
  - 1 month
  - 6 months
  - 1 year
- Explain the 2% weekly growth

### Step 7: Spend Tokens (1 minute)
- Navigate to "Reward Shop"
- Purchase "Test Hint Card" (30 tokens)
- Show token deduction
- Try to purchase "Homework Pass" (80 tokens)
- Show "Not Enough Tokens" message

## Key Features to Highlight

### 1. Supply & Demand
- Rewards decrease when more students request the same mission
- Minimum reward is 50% of base reward
- Visual indicators show popular missions

### 2. Token System
- 70% goes to Spend tokens (immediate use)
- 30% goes to Grow tokens (locked, compound growth)
- Clear visual distinction with colors (green/blue)

### 3. Compound Growth
- 2% weekly growth rate
- Visual projections for 1 month, 6 months, 1 year
- Bar chart showing growth over time
- Percentage increase calculations

### 4. Teacher Controls
- PIN-protected access (default: 1234)
- View all mission requests
- Assign missions to specific students
- Approve completed missions
- Monitor student progress

### 5. Kid-Friendly Design
- Playful, Monopoly-inspired aesthetic
- Bright colors and rounded corners
- Emoji icons throughout
- Simple, clear language
- Responsive design for all devices

## Troubleshooting

### Port Already in Use
If port 3000 is in use, Next.js will automatically use the next available port (e.g., 3001, 3002).

### Build Errors
Make sure you have Node.js 18+ installed:
```bash
node --version
```

### Environment Variables Not Working
Make sure your `.env.local` file is in the root directory (not in `src/`).

### Gemini API Not Working
The app will automatically fall back to static text if:
- No API key is provided
- API key is invalid
- API request fails

This is intentional and the app will work perfectly without it!

## Architecture

### Data Storage
- **In-memory only** - no database required
- Data resets when server restarts
- Perfect for demos and testing

### Key Files
- `src/lib/store.ts` - All data and business logic
- `src/lib/growthCalculator.ts` - Compound growth calculations
- `src/lib/gemini.ts` - AI integration with fallbacks
- `src/types/index.ts` - TypeScript type definitions

### Pages
- `/` - Home page with student selection
- `/student/[id]` - Student dashboard
- `/student/[id]/marketplace` - Mission marketplace
- `/student/[id]/missions` - My missions
- `/student/[id]/grow` - Growth visualization
- `/student/[id]/shop` - Reward shop
- `/teacher` - Teacher dashboard

## Customization

### Change Initial Data
Edit `src/lib/store.ts` to modify:
- Student names and starting balances
- Mission titles, descriptions, and rewards
- Reward items and costs

### Adjust Growth Rate
Edit `src/lib/growthCalculator.ts`:
```typescript
const WEEKLY_RATE = 0.02; // Change this value
```

### Change Teacher PIN
Edit `.env.local`:
```env
TEACHER_PIN=your_pin_here
```

### Customize Colors
Edit `tailwind.config.ts` to change the color scheme.

## Support

This is a hackathon demo project. For questions or issues, refer to the README.md file.

## License

MIT - Feel free to use and modify for your classroom!
