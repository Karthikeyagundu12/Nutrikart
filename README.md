# Nutrikart - Food Delivery App

A modern, vibrant food delivery web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time nutrition tracking powered by Spoonacular API.

## 🌟 Features

- 🍕 Browse restaurants and food items
- 📊 Real-time nutrition information (calories, protein, carbs, fats, fiber)
- 🛒 Shopping cart functionality
- 💰 Cash on Delivery (COD) payment
- 🎨 Modern, colorful UI with glassmorphism effects
- 📱 Fully responsive design
- 🔄 Spoonacular API integration for accurate nutrition data

## 🛠️ Technology Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Spoonacular API

**Frontend:**
- React.js
- Vite
- React Router
- Axios

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Spoonacular API key (get it from [spoonacular.com/food-api](https://spoonacular.com/food-api))

## 🚀 Getting Started

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already created with your API key):
```
MONGODB_URI=mongodb://localhost:27017/nutrikart
PORT=5000
NODE_ENV=development
SPOONACULAR_API_KEY=your_api_key_here
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
nutrikart/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Spoonacular service
│   ├── .env            # Environment variables
│   ├── server.js       # Express server
│   └── seed.js         # Database seeding
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app component
│   └── index.html
└── README.md
```

## 🔌 API Endpoints

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/:id/foods` - Get food items for a restaurant

### Nutrition
- `GET /api/nutrition/search?query=food_name` - Search food in Spoonacular
- `GET /api/nutrition/:spoonacularId` - Get nutrition by Spoonacular ID
- `GET /api/nutrition/food/:foodId` - Get cached nutrition for a food item

### Orders
- `POST /api/orders` - Create new order (COD)
- `GET /api/orders/:id` - Get order by ID

## 🎨 Design Features

- Vibrant gradient backgrounds (orange-pink theme)
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Color-coded nutrition badges
- Interactive hover effects
- Responsive grid layouts

## 📝 License

ISC

## 👨‍💻 Author

Built with ❤️ for Nutrikart
