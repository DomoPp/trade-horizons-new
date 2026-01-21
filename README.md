# Trade Horizons

Minimal MVP structure for the Trade Horizons turn-based trading game.

## Project Structure
- `database/` MySQL 8 schema + seed data
- `backend/` NestJS REST API
- `frontend/` Angular UI

## Database (MySQL 8.x)
```bash
# create database
mysql -u root -p -e "CREATE DATABASE trade_horizons;"

# apply schema
mysql -u root -p trade_horizons < database/schema.sql

# optional seed data
mysql -u root -p trade_horizons < database/seed.sql
```

## Backend (NestJS)
```bash
cd backend
npm install

# configure env variables if needed
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=yourpassword
export DB_NAME=trade_horizons
export DB_PORT=3306

npm run start:dev
```
API will run on `http://localhost:3000`.

### Minimal Endpoints
- `POST /saves`
- `POST /saves/:id/load`
- `GET /market/state?saveId=&turn=&regionId=`
- `POST /trade/plan`
- `POST /turn/next`

## Frontend (Angular)
```bash
cd frontend
npm install
npm run start
```
App will run on `http://localhost:4200`.

## MVP Flow
1. Create Save
2. View Market
3. Plan Trade
4. Next Turn
5. View Turn Result
