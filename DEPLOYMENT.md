# 🚀 Deploying Sabor Español to Render

## Prerequisites
- GitHub repository with your code
- MongoDB Atlas account (for production database)
- Render account (free tier available)

## � Quick Deployment Steps

### 1. **Deploy Backend API**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure service:
   - **Name**: `sabor-espanol-api`
   - **Runtime**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

**Environment Variables:**
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

### 2. **Deploy Frontend**
1. Create another service: **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `sabor-espanol-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
   - **Plan**: `Free`

**Frontend Environment Variable:**
```
REACT_APP_API_BASE_URL=https://sabor-espanol-api.onrender.com
```

### 3. **MongoDB Atlas Setup**
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for Render)
4. Get connection string
5. Add to Render backend environment variables

## 🔧 Build Configuration
- ✅ Health check endpoint: `/api/health`
- ✅ CORS configured for cross-origin requests
- ✅ Production-ready build scripts
- ✅ Environment variable support

## 📱 Post-Deployment URLs
- **Backend API**: `https://sabor-espanol-api.onrender.com`
- **Frontend**: `https://sabor-espanol-frontend.onrender.com`
- **Health Check**: `https://sabor-espanol-api.onrender.com/api/health`

## � Important Notes
- **Free Tier**: Services sleep after 30 minutes of inactivity
- **Cold Start**: First request may take 30+ seconds
- **Custom Domain**: Available in Render settings

---
**Ready to deploy?** Push your code to GitHub and follow the steps above! 🚀