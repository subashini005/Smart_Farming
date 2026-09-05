# Smart Farming

This project contains:
- A React frontend for the smart farming dashboard and AI features.
- A Node.js backend for authentication and OTP-based account flows.
- A FastAPI Python service for soil sutability, disease detection, yield prediction, growth monitoring, and weather advisory.

## Local development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Node backend
```bash
cd backend
npm install
node server.js
```

### Python backend
```bash
cd backend/Python
pip install -r ../../requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001
```

## Deployment notes
- Set the frontend environment variables:
  - VITE_NODE_API_URL
  - VITE_PYTHON_API_URL
- The Node backend uses the port from the `PORT` environment variable.
- The Python backend should be exposed on the same `PORT` or via a separate process depending on the hosting platform.

## Render deployment
1. Add `render.yaml` to the repository.
2. Deploy two services:
   - `smart-farming-node` using `backend` as `rootDir`, `npm install` and `npm start`.
   - `smart-farming-python` using `backend/Python` as `rootDir`, `pip install -r requirements.txt` and `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Add `EMAIL_USER`, `EMAIL_PASS`, and other sensitive vars to each Render service as environment variables.

## Vercel deployment
1. Deploy the `frontend` folder to Vercel.
2. Set `VITE_NODE_API_URL` to the Node backend URL and `VITE_PYTHON_API_URL` to the Python backend URL.
3. Add `vercel.json` in `frontend` with static build settings.

## Netlify deployment
1. Deploy both backend services first using `render.yaml`.
2. Confirm the Node service responds to `/login` and the Python service responds to `/docs`.
3. Create a Netlify site from this repository.
4. Netlify will use `netlify.toml`, build from `frontend`, and publish `frontend/dist`.
5. In **Site configuration > Environment variables**, add the actual public backend URLs:
  - `VITE_NODE_API_URL=https://<your-node-service>.onrender.com`
  - `VITE_PYTHON_API_URL=https://<your-python-service>.onrender.com`
6. Add `EMAIL_USER` and `EMAIL_PASS` to the Node Render service. For Gmail, `EMAIL_PASS` must be an App Password, not the normal account password.
7. Redeploy Netlify after changing environment variables because Vite injects them during the build.

The frontend uses `HashRouter`, so the Netlify SPA redirect is included for direct route access. Never commit `frontend/.env` or `backend/.env`; use the example files as templates only.
