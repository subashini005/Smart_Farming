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
- The Node backend uses the port from the PORT environment variable.
- The Python backend should be exposed on the same PORT or via a separate process depending on the hosting platform.
