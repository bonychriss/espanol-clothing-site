# Render Deployment Instructions

## 🚀 Separate Deployment Configuration

### Backend (Web Service)
**Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  NODE_ENV=production
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  PORT=10000
  ```

### Frontend (Static Site)
**Directory**: `client`
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Environment Variables**:
  ```
  **Frontend**:
```
REACT_APP_API_URL=https://sabor-espanol-project-backend.onrender.com
```
  ```

## 📋 Deployment Steps

### 1. Deploy Backend First
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set **Root Directory** to `server`
4. Configure environment variables
5. Deploy and note the backend URL

### 2. Deploy Frontend Second
1. Create a new **Static Site** on Render
2. Connect the same GitHub repository
3. Set **Root Directory** to `client`
4. Update `client/.env.production` with your backend URL
5. Configure environment variables
6. Deploy

### 3. Update CORS Settings
✅ Backend URL configured: `https://sabor-espanol-project-backend.onrender.com`
✅ Frontend URL configured: `https://sabor-espanol-project-frontend.onrender.com`
✅ CORS settings updated in `server/index.js`

## 🔧 Post-Deployment
- Test all API endpoints
- Verify frontend can connect to backend
- Update any hardcoded URLs
- Set up custom domains if needed