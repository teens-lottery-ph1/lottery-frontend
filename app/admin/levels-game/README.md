# 🎮 Level Game System: Technical Documentation

This directory manages the administrative side of the **Paid Level Game System**. Unlike the VIP rewards system, this is a competitive, pool-filled model where users pay to join levels and receive payouts as subsequent levels are completed.

---

## 🏗 System Mechanics

The game follows a **4^n growth model** for pools:
- **Level 1**: Requires 4 users
- **Level 2**: Requires 16 users
- **Level 3**: Requires 64 users
- ... and so on.

### The Payout Chain:
1. Users join **Level 1** by paying an `Entry Fee`.
2. When **Level 2** fills (16 users), the users in **Level 1** are eligible for their payout.
3. This creates a sustainable loop where the filling of **Level N+1** triggers the completion and payout of **Level N**.

---

## 🕹 Admin Flow: Creating a Game

When an admin creates a new game via the dashboard, the following data is sent to the backend:

### POST `/api/admin/levels/create`
**Request Payload:**
```json
{
  "name": "Super Quick Friday",
  "gameType": "Quick Game",
  "entryFee": 500,
  "poolsConfig": {
    "l1": 4,
    "l2": 16,
    "l3": 64
  }
}
```

### Backend Action:
1. **Initialize Game**: Creates a new game record in the database.
2. **Generate Pools**: Automatically sets up empty pool records for for Level 1, 2, and 3.
3. **Price Calculation**: Calculates the `Reward` for each level based on the `Entry Fee` and the pool size (minus administrative commissions).

---

## 📊 Level Management & Fetching

### Fetching Levels (Admin)
- **Endpoint**: `GET /api/admin/levels?gameTypeId=...&search=...`
- **Response**: Returns a list of all active levels, their current user count, required users, and completion status.
- **Filters**:
  - `gameTypeId`: Filter by game type (Quick/Mega).
  - `search`: Partial match on game name.

### Force Completion
Admins have the power to manually trigger a completion if a pool is stuck or needs adjustment.
- **Endpoint**: `POST /api/admin/levels/force-complete`
- **Payload**: `{ "levelId": "uuid-123" }`

---

## 👤 User Interaction (Level Game)

### Joining a Level
When a user clicks **[ JOIN ]** on the Levels page:
1. **POST `/api/levels/join`**: Checks if the user has enough `Available Balance`.
2. **Debit & Entry**: Deducts the fee from user's wallet and creates an entry in the specified level's pool.
3. **State Update**: The level's `currentUsers` count increases.

### Payouts & History
- **Entries**: Fetched via `GET /api/levels/my-entries`. Transitions from `Active` to `Paid` once the trigger level completes.
- **Wallet**: Payouts are credited directly to the user's `Available Balance`.

---

## 🔌 API Integration Checklist

To move from mock functionality to real data, update the following in the frontend:
1. [ ] Replace `setGameLevels([])` with actual `fetch()` results in `useEffect`.
2. [ ] Map `handleJoinLevel` to a `fetch` request with error handling.
3. [ ] Update Stat cards with dynamic data from `GET /api/admin/level-games/stats`.
