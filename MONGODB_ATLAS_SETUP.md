# MongoDB Atlas Setup Guide for Nutrikart

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Verify your email

## Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Name your cluster (e.g., "Nutrikart-Cluster")
6. Click "Create"

## Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `nutrikart_user` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

## Step 4: Whitelist Your IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP for better security
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 4.1 or later
5. Copy the connection string

It will look like:
```
mongodb+srv://nutrikart_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update Your .env File
1. Open `d:\Pullaiah\nutrikart\server\.env`
2. Replace the MONGODB_URI line with your connection string
3. Replace `<password>` with your actual password
4. Add `/nutrikart` before the `?` to specify the database name

Example:
```
MONGODB_URI=mongodb+srv://nutrikart_user:YourPassword123@cluster0.xxxxx.mongodb.net/nutrikart?retryWrites=true&w=majority
```

## Step 7: Seed Your Database
After updating the .env file, run:
```powershell
cd d:\Pullaiah\nutrikart\server
node seed.js
```

This will populate your MongoDB Atlas database with:
- 7 restaurants
- 64 food items with nutrition data

## Step 8: Restart Your Server
```powershell
# Stop current server (Ctrl+C)
node server.js
```

## Verification
Your app should now show:
```
✅ Connected to MongoDB Atlas
🚀 Server is running on http://localhost:5000
```

Visit http://localhost:5173 to see your app with data!

## Troubleshooting

### Connection Error
- Check your username and password are correct
- Ensure you replaced `<password>` with actual password
- Verify IP address is whitelisted
- Check internet connection

### No Data Showing
- Run `node seed.js` to populate database
- Check MongoDB Atlas dashboard to verify data exists

## Security Notes
- Never commit .env file to Git
- Use environment variables in production
- Restrict IP access in production
- Use strong passwords
