# NutriFlow AI

A responsive nutrition consultancy website built with HTML, CSS, vanilla JavaScript, and a Node.js/Express backend.

## Features
- Responsive landing page with custom SVG logo
- About, services, sample meal inspiration, and contact sections
- Browser-based BMI estimate with an educational disclaimer
- Consultation request form connected to an Express API
- Server-side validation and JSON-file persistence

## Requirements
- Node.js 18 or newer
- npm

## Run locally
1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` in your browser.

The Express server serves the frontend and API from the same origin. Do not open `index.html` directly as a file; run the server so the consultation form can reach the API.

## API
- `GET /api/health` — basic server health check
- `POST /api/consultations` — saves a consultation request

Example request body:
```json
{
  "name": "Asha",
  "email": "asha@example.com",
  "interest": "Nutrition consultation",
  "message": "I'd like to discuss healthy meal planning."
}
```

## Important before public launch
- Replace the demo contact email with your real business email.
- JSON storage is suitable only for a small local demo. Use a database such as MongoDB or PostgreSQL for production.
- Add HTTPS, rate limiting, spam protection, secure admin authentication, backups, privacy/consent language, and a proper data-retention policy before collecting real client data.
- Do not collect sensitive health details through this basic form.
- BMI and meal examples are general educational content, not diagnosis or individualized medical advice.
- “AI” is currently part of the brand name; this starter project does not connect to an AI model. Add a secure server-side AI integration only after choosing a provider, reviewing privacy requirements, and storing API keys in environment variables (never in frontend JavaScript).
