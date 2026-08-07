# Smart Farming

This project contains:
- A React frontend for the smart farming dashboard and AI features.
- A Node.js backend for authentication and OTP-based account flows.
- A FastAPI Python service for disease detection, yield prediction, growth monitoring, and weather advisory.

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
uvicorn main:app --host 127.0.0.1 --port 8001
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
