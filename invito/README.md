# 🎉 Invito — Digital Invitation Platform

Create, customize, and share beautiful event invitations via unique links.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, JWT Auth
- **Storage**: Local (dev) / Cloudinary (prod)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Environment Variables (Server)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token expiry (e.g. "7d") |
| `CLIENT_URL` | Frontend URL for CORS |

## Project Structure
```
invito/
├── client/    # Next.js frontend
├── server/    # Express backend
└── README.md
```
