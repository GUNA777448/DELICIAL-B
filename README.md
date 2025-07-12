# Delicial Server - Backend API

This is the backend API for the Delicial restaurant application.

## 🚀 Deployment on Render

### Prerequisites
- MongoDB Atlas account (for database)
- Gmail account (for email notifications)
- Render account

### Step 1: Set up MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password

### Step 2: Set up Gmail for Email Notifications
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use this app password in EMAIL_PASS

### Step 3: Deploy on Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure the following settings:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/delicial
JWT_SECRET=your_very_secure_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
TO_EMAIL=admin@delicial.com
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Step 4: Update Frontend
Update your frontend axios base URL to point to your Render deployment:
```javascript
// In client/src/utils/axios.js
const instance = axios.create({
  baseURL: "https://your-render-app.onrender.com/api",
});
```

## 🔧 Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`

3. Start the development server:
```bash
npm run dev
```

## 📧 Email Configuration

The server sends email notifications for:
- Order confirmations
- Reservation confirmations
- Admin notifications

Make sure to configure your Gmail credentials properly.

## 🔒 Security Notes

- Never commit your `.env` file
- Use strong JWT secrets in production
- Enable HTTPS in production
- Configure CORS properly for your domains 