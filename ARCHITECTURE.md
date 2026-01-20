# BlackJack Learning Platform - Architecture Document

## Project Overview
A web-based BlackJack learning platform for beginners that provides:
- Fully functional BlackJack gameplay
- Basic strategy recommendations
- Running count display (card counting)
- AI assistance and hints
- Educational feedback

---

## Tech Stack

### Frontend
**Framework:** React + TypeScript
- **Why:** Component-based, great for interactive UI, type safety
- **State Management:** Zustand or Redux Toolkit (for game state, card counting)
- **UI Library:** 
  - Tailwind CSS (styling)
  - Framer Motion (card animations)
  - shadcn/ui (pre-built components)
- **Visualization:** 
  - Canvas API or Three.js for card animations
  - Chart.js for statistics/analytics

**Alternative:** Svelte/SvelteKit (lighter, faster, easier learning curve)

### Backend
**Framework:** FastAPI (Python)
- **Why:** Fast, async, automatic API docs, perfect for ML integration
- **API Design:** RESTful + WebSocket for real-time updates
- **Authentication:** JWT tokens (if you add user accounts later)

**Alternative Options:**
- Flask (simpler, but less modern)
- Node.js/Express (if you want JS throughout)
- Django (if you need admin panel/ORM)

### Database
**Option 1:** PostgreSQL
- Store user profiles, game history, statistics
- Learning progress tracking

**Option 2:** SQLite (for MVP)
- Simpler setup, good for starting out

**Option 3:** Firebase/Supabase
- Managed backend, auth built-in, real-time features
- Faster to market

### AI/ML Components
**For Strategy & Hints:**
- Rule-based system (basic strategy chart)
- OpenAI API (for natural language hints/explanations)
- Local ML model (if you want offline AI suggestions)

### Hosting

**Frontend:**
- Vercel (best for React/Next.js, free tier)
- Netlify (alternative, also great)
- Cloudflare Pages (fast CDN)

**Backend:**
- Railway (easy Python deployment, generous free tier)
- Render (free tier, auto-deploys from GitHub)
- Fly.io (edge deployment, fast)
- AWS/GCP/Azure (more complex, scalable)

**Database:**
- Render/Railway (includes database)
- Supabase (free PostgreSQL)
- PlanetScale (MySQL, generous free tier)

**Full Stack Option:**
- Vercel (frontend) + Vercel Serverless Functions (backend)
- Next.js full-stack app

---

## Architecture Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│  ┌──────────────┬──────────────┬──────────────────────┐ │
│  │  Game UI     │  Strategy    │  Card Counter        │ │
│  │  Component   │  Advisor     │  Display             │ │
│  └──────────────┴──────────────┴──────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐│
│  │         State Management (Zustand/Redux)             ││
│  └──────────────────────────────────────────────────────┘│
└────────────────────────┬────────────────────────────────┘
                         │ REST API / WebSocket
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                      │
│  ┌──────────────┬──────────────┬──────────────────────┐ │
│  │  Game Logic  │  Strategy    │  AI Service          │ │
│  │  Engine      │  Engine      │  (OpenAI/Local)      │ │
│  └──────────────┴──────────────┴──────────────────────┘ │
│  ┌──────────────┬──────────────┬──────────────────────┐ │
│  │  Card Count  │  Statistics  │  User Management     │ │
│  │  Calculator  │  Analyzer    │  (optional)          │ │
│  └──────────────┴──────────────┴──────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                DATABASE (PostgreSQL)                     │
│  • User Profiles     • Game History    • Statistics     │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
blackjack-learning-platform/
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── game/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Deck.tsx
│   │   │   │   ├── Hand.tsx
│   │   │   │   ├── GameTable.tsx
│   │   │   │   └── ActionButtons.tsx
│   │   │   ├── strategy/
│   │   │   │   ├── StrategyChart.tsx
│   │   │   │   ├── StrategyAdvisor.tsx
│   │   │   │   └── DecisionHint.tsx
│   │   │   ├── counting/
│   │   │   │   ├── CardCounter.tsx
│   │   │   │   ├── RunningCount.tsx
│   │   │   │   └── TrueCount.tsx
│   │   │   └── ai/
│   │   │       ├── AIAssistant.tsx
│   │   │       └── HintPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useGameState.ts
│   │   │   ├── useCardCounting.ts
│   │   │   └── useStrategy.ts
│   │   ├── store/
│   │   │   ├── gameStore.ts
│   │   │   ├── countingStore.ts
│   │   │   └── settingsStore.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── websocket.ts
│   │   ├── utils/
│   │   │   ├── cardUtils.ts
│   │   │   └── animations.ts
│   │   └── types/
│   │       └── game.types.ts
│   └── package.json
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── main.py             # FastAPI app entry
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── game.py     # Game endpoints
│   │   │   │   ├── strategy.py # Strategy endpoints
│   │   │   │   ├── ai.py       # AI endpoints
│   │   │   │   └── stats.py    # Statistics endpoints
│   │   │   └── websocket.py    # WebSocket handlers
│   │   ├── core/
│   │   │   ├── game_engine.py  # Core game logic
│   │   │   ├── deck.py         # Deck management
│   │   │   ├── hand.py         # Hand calculations
│   │   │   └── rules.py        # BlackJack rules
│   │   ├── strategy/
│   │   │   ├── basic_strategy.py   # Basic strategy matrix
│   │   │   ├── card_counting.py    # Counting systems (Hi-Lo, etc.)
│   │   │   └── recommendations.py  # Decision engine
│   │   ├── ai/
│   │   │   ├── assistant.py    # AI prompt engineering
│   │   │   └── explanations.py # Generate explanations
│   │   ├── models/
│   │   │   ├── game.py         # Pydantic models
│   │   │   └── user.py
│   │   ├── database/
│   │   │   ├── db.py           # Database connection
│   │   │   └── models.py       # SQLAlchemy models
│   │   └── utils/
│   │       └── helpers.py
│   ├── requirements.txt
│   └── .env
│
├── docs/                        # Documentation
│   ├── api.md
│   ├── strategy-guide.md
│   └── counting-systems.md
│
└── docker-compose.yml          # For local development
```

---

## Core Modules & Logic

### 1. Game Engine Module

**Responsibilities:**
- Deck management (shuffle, deal, reshuffle)
- Hand calculations (total, soft/hard, blackjack detection)
- Game flow (player turn, dealer turn, resolution)
- Rule enforcement (dealer stands on 17, split rules, etc.)

**Key Classes:**
```python
class Card:
    - suit: str
    - rank: str
    - value: int | List[int]  # Ace = [1, 11]

class Deck:
    - cards: List[Card]
    - shuffle()
    - deal() -> Card
    - cards_remaining() -> int
    - reset()

class Hand:
    - cards: List[Card]
    - add_card(card)
    - get_value() -> int
    - is_soft() -> bool
    - is_blackjack() -> bool
    - can_split() -> bool
    - can_double() -> bool

class GameState:
    - player_hands: List[Hand]
    - dealer_hand: Hand
    - deck: Deck
    - current_bet: float
    - stage: GameStage  # BETTING, DEALING, PLAYER_TURN, etc.
```

### 2. Strategy Module

**Basic Strategy Engine:**
- Matrix-based decision lookup
- Input: Player total, Dealer up card, hand type (hard/soft/pair)
- Output: Recommended action (Hit, Stand, Double, Split)

**Implementation:**
```python
class BasicStrategy:
    - hard_totals_matrix: Dict
    - soft_totals_matrix: Dict
    - pairs_matrix: Dict
    
    def get_recommendation(
        player_total: int,
        dealer_upcard: int,
        is_soft: bool,
        is_pair: bool
    ) -> Action
```

**Strategy Charts:**
- Hard totals (5-20 vs dealer 2-A)
- Soft totals (A,2 through A,9 vs dealer 2-A)
- Pairs (2,2 through A,A vs dealer 2-A)

### 3. Card Counting Module

**Systems to Implement:**
1. **Hi-Lo (start here)**
   - Low cards (2-6): +1
   - Neutral (7-9): 0
   - High cards (10-A): -1

2. **Running Count:** Sum of all card values seen
3. **True Count:** Running count / Decks remaining
4. **Betting Strategy:** Adjust based on true count

**Implementation:**
```python
class CardCounter:
    - system: CountingSystem  # Hi-Lo, KO, etc.
    - running_count: int
    - cards_seen: int
    - decks_in_shoe: int
    
    def update(card: Card) -> None
    def get_running_count() -> int
    def get_true_count() -> float
    def get_betting_advice() -> str
```

### 4. AI Assistant Module

**Features:**
- Natural language explanations for strategy decisions
- Context-aware hints
- Mistake analysis
- Learning recommendations

**Implementation Options:**

**Option A: Rule-Based (Free)**
```python
class AIAssistant:
    def explain_decision(game_state, recommended_action):
        # Template-based explanations
        # "You should Hit because your total is 12 and 
        #  the dealer shows a 7, which is a strong card..."
```

**Option B: OpenAI Integration (Better UX)**
```python
class AIAssistant:
    def get_hint(game_state) -> str:
        prompt = generate_prompt(game_state)
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "system",
                "content": "You are a BlackJack teacher..."
            }]
        )
        return response
```

### 5. Statistics & Analytics Module

**Track:**
- Win/Loss ratio
- Hands played
- Strategy accuracy (% correct decisions)
- Counting accuracy
- Profit/Loss over time
- Common mistakes

---

## API Design

### REST Endpoints

```
POST   /api/game/new              # Start new game
POST   /api/game/{id}/action      # Hit, Stand, Double, Split
GET    /api/game/{id}             # Get game state
POST   /api/game/{id}/bet         # Place bet

GET    /api/strategy/recommend    # Get strategy recommendation
POST   /api/strategy/validate     # Check if action was optimal

GET    /api/counting/running      # Get running count
GET    /api/counting/true         # Get true count
POST   /api/counting/update       # Update count (for validation)

POST   /api/ai/hint               # Get AI hint
POST   /api/ai/explain            # Explain a decision

GET    /api/stats/session         # Current session stats
GET    /api/stats/history         # Historical stats
```

### WebSocket Events

```
# Client -> Server
"place_bet"
"hit"
"stand"
"double"
"split"

# Server -> Client
"game_state_update"
"card_dealt"
"round_complete"
"count_update"
"hint_available"
```

---

## Data Models

### Game State
```typescript
interface GameState {
  id: string;
  playerHands: Hand[];
  dealerHand: Hand;
  deck: {
    cardsRemaining: int;
    decksUsed: int;
  };
  currentBet: number;
  stage: 'betting' | 'dealing' | 'player_turn' | 'dealer_turn' | 'complete';
  availableActions: Action[];
  runningCount: number;
  trueCount: number;
}

interface Hand {
  cards: Card[];
  value: number;
  isSoft: boolean;
  isBlackjack: boolean;
  canSplit: boolean;
  canDouble: boolean;
  result?: 'win' | 'loss' | 'push';
}

interface Card {
  rank: string;  // '2'-'10', 'J', 'Q', 'K', 'A'
  suit: string;  // '♠', '♥', '♦', '♣'
  value: number | number[];
}
```

---

## Development Phases

### Phase 1: MVP (2-3 weeks)
**Goal:** Basic playable BlackJack

- [ ] Backend: Core game engine
  - Deck, Card, Hand classes
  - Basic game flow
  - API endpoints for game actions
  
- [ ] Frontend: Basic UI
  - Card display
  - Action buttons (Hit, Stand)
  - Simple animations
  
- [ ] Basic strategy lookup (no UI yet)

### Phase 2: Strategy Advisor (1-2 weeks)
**Goal:** Add basic strategy recommendations

- [ ] Implement strategy matrices
- [ ] Strategy recommendation endpoint
- [ ] UI: Strategy chart overlay
- [ ] Visual hints (highlight correct action)
- [ ] Strategy accuracy tracking

### Phase 3: Card Counting (1-2 weeks)
**Goal:** Running count display

- [ ] Hi-Lo counting implementation
- [ ] Running count display
- [ ] True count calculation
- [ ] Count accuracy validation
- [ ] Betting recommendations

### Phase 4: AI Assistant (1-2 weeks)
**Goal:** Natural language help

- [ ] AI explanation engine (rule-based or API)
- [ ] Hint system
- [ ] Mistake analyzer
- [ ] Learning path suggestions

### Phase 5: Polish & Analytics (1-2 weeks)
**Goal:** Production ready

- [ ] User accounts & authentication
- [ ] Session persistence
- [ ] Statistics dashboard
- [ ] Mobile responsive
- [ ] Performance optimization
- [ ] Testing & bug fixes

### Phase 6: Deployment
- [ ] CI/CD pipeline
- [ ] Environment setup
- [ ] Monitoring & logging
- [ ] Domain & SSL

---

## Technology Decisions

### Decision Matrix

| Aspect | Option 1 | Option 2 | Recommendation |
|--------|----------|----------|----------------|
| **Frontend** | React + TypeScript | Svelte | **React** (larger ecosystem, more resources) |
| **Backend** | FastAPI | Flask | **FastAPI** (async, auto docs, modern) |
| **Database** | PostgreSQL | Firebase | **PostgreSQL** (more control, scalable) |
| **Hosting** | Vercel + Railway | All-in AWS | **Vercel + Railway** (easier, cheaper for MVP) |
| **AI** | Rule-based | OpenAI API | **Both** (rule-based for MVP, OpenAI for premium) |
| **State Mgmt** | Zustand | Redux Toolkit | **Zustand** (simpler, less boilerplate) |

### MVP Tech Stack (Recommended)

**Frontend:**
- React + TypeScript
- Vite (fast build tool)
- Tailwind CSS
- Zustand (state)
- React Query (API calls)

**Backend:**
- FastAPI
- SQLite (for MVP, migrate to PostgreSQL later)
- Pydantic (validation)

**Deployment:**
- Vercel (frontend)
- Railway (backend + database)

**Cost:** Free tier for everything until you get significant traffic

---

## Key Features Breakdown

### 1. Basic Strategy Advisor
**What it does:**
- Shows the mathematically optimal move
- Displays strategy chart
- Highlights correct action
- Tracks accuracy

**User Options:**
- Toggle hints on/off
- Show/hide strategy chart
- Difficulty mode (no hints, hints only after mistake)

### 2. Card Counting Display
**What it shows:**
- Running count
- True count
- Decks remaining
- Betting recommendation

**Educational Features:**
- Explain Hi-Lo system
- Practice mode (count validation)
- Count history graph

### 3. AI Assistant
**Capabilities:**
- "Why should I hit here?"
- "Explain the running count"
- "What mistakes did I make?"
- "How do I improve?"

**Implementation:**
- Chat interface (sidebar or modal)
- Contextual hints (pop-ups)
- Post-game analysis

### 4. Learning Modes
**Beginner Mode:**
- Strategy hints always visible
- Explain every decision
- Slower pace

**Practice Mode:**
- Quiz mode (suggest action before showing)
- Track accuracy
- Replay hands

**Expert Mode:**
- No hints
- Performance tracking
- Speed mode

---

## Security Considerations

### Backend:
- Input validation (Pydantic models)
- Rate limiting (prevent API abuse)
- CORS configuration
- Environment variables for secrets
- SQL injection prevention (use ORMs)

### Frontend:
- XSS prevention (React handles most)
- HTTPS only
- Secure token storage (httpOnly cookies)

---

## Performance Considerations

### Frontend:
- Lazy load components
- Memoize expensive calculations
- Virtual scrolling for history
- Optimize animations (CSS transforms)
- Code splitting

### Backend:
- Cache strategy lookups
- Connection pooling
- Async operations
- CDN for static assets
- Compress responses

---

## Testing Strategy

### Backend:
- Unit tests (game logic, strategy)
- Integration tests (API endpoints)
- pytest framework

### Frontend:
- Component tests (React Testing Library)
- E2E tests (Playwright)
- Visual regression tests

---

## Monitoring & Analytics

### Application Monitoring:
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (UptimeRobot)

### User Analytics:
- Game metrics (hands played, win rate)
- Feature usage (strategy advisor usage, AI questions)
- User flow (where do users drop off?)

---

## Future Enhancements

### V2 Features:
- Multiplayer tables
- Tournaments
- Advanced counting systems (KO, Omega II)
- Mobile apps (React Native)
- Offline mode (PWA)
- Custom rule variations
- Achievement system
- Leaderboards

### Monetization Options (if desired):
- Premium AI features
- Advanced analytics
- Ad-free experience
- Downloadable strategy cards
- Private coaching sessions

---

## Next Steps

### Immediate Actions:
1. **Set up project structure** (mono-repo or separate repos)
2. **Initialize both frontend & backend** with boilerplate
3. **Implement core game engine** (Deck, Card, Hand classes)
4. **Create basic API** (new game, hit, stand)
5. **Build basic UI** (card display, buttons)
6. **Test end-to-end** (can you play a hand?)

### Week 1 Goals:
- Working game engine
- Basic API
- Simple card UI
- Can play a complete hand

---

## Questions to Consider

1. **User Accounts?**
   - Yes: Track progress, save stats (more complex)
   - No: Session-based only (simpler MVP)

2. **Multiple Decks?**
   - Single deck (simpler math)
   - 6-deck shoe (more realistic casino)

3. **Betting System?**
   - Play money only
   - Track virtual bankroll
   - Real money (requires licensing - DON'T do this)

4. **Rule Variations?**
   - Standard Vegas rules
   - European rules
   - Make configurable?

5. **Mobile First?**
   - Yes: Design for mobile primarily
   - No: Desktop first, mobile later

---

## Resources

### Learning Materials:
- **BlackJack Strategy:** wizardofodds.com
- **Card Counting:** blackjackapprenticeship.com
- **Game Logic:** Python BlackJack tutorials
- **React Patterns:** react.dev

### APIs & Services:
- **OpenAI API:** openai.com/api
- **Hosting:** vercel.com, railway.app
- **Database:** supabase.com, planetscale.com

### Design Inspiration:
- Existing BlackJack apps
- Casino game UIs
- Educational game platforms

---

## Summary

**Recommended Path:**

1. **Start Simple:** Build working game first (Phase 1)
2. **Add Strategy:** Then add basic strategy advisor (Phase 2)
3. **Add Counting:** Then card counting features (Phase 3)
4. **Add AI:** Finally AI assistant (Phase 4)

**Tech Stack:**
- React + TypeScript + Tailwind (Frontend)
- FastAPI + PostgreSQL (Backend)
- Vercel + Railway (Hosting)

**Timeline:** 8-12 weeks for full featured MVP

**Philosophy:** 
- Modularity is key (separate concerns)
- API-first design (backend can work standalone)
- Test as you go (don't accumulate tech debt)
- Ship early, iterate often

---

Ready to start building? Let me know which phase you want to tackle first!
