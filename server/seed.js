require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');
const spoonacularService = require('./services/spoonacularService');

// Sample food items with Spoonacular search queries
const sampleFoods = [
    // Indian Restaurant Foods
    { name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 350, category: 'main', searchQuery: 'butter chicken', restaurantIndex: 0 },
    { name: 'Paneer Tikka', description: 'Grilled cottage cheese with Indian spices', price: 280, category: 'appetizer', searchQuery: 'paneer tikka', restaurantIndex: 0 },
    { name: 'Biryani', description: 'Fragrant rice with spiced chicken', price: 320, category: 'main', searchQuery: 'chicken biryani', restaurantIndex: 0 },
    { name: 'Naan', description: 'Soft Indian flatbread', price: 50, category: 'appetizer', searchQuery: 'naan bread', restaurantIndex: 0 },
    { name: 'Gulab Jamun', description: 'Sweet milk-solid dumplings in sugar syrup', price: 100, category: 'dessert', searchQuery: 'gulab jamun', restaurantIndex: 0 },

    // Pizza Restaurant Foods
    { name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil', price: 400, category: 'main', searchQuery: 'margherita pizza', restaurantIndex: 1 },
    { name: 'Pepperoni Pizza', description: 'Pizza topped with pepperoni and cheese', price: 450, category: 'main', searchQuery: 'pepperoni pizza', restaurantIndex: 1 },
    { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 150, category: 'appetizer', searchQuery: 'garlic bread', restaurantIndex: 1 },
    { name: 'Caesar Salad', description: 'Fresh romaine lettuce with Caesar dressing', price: 200, category: 'appetizer', searchQuery: 'caesar salad', restaurantIndex: 1 },
    { name: 'Tiramisu', description: 'Italian coffee-flavored dessert', price: 180, category: 'dessert', searchQuery: 'tiramisu', restaurantIndex: 1 },

    // Burger Restaurant Foods
    { name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, and cheese', price: 250, category: 'main', searchQuery: 'cheeseburger', restaurantIndex: 2 },
    { name: 'Chicken Burger', description: 'Grilled chicken with mayo and veggies', price: 230, category: 'main', searchQuery: 'chicken burger', restaurantIndex: 2 },
    { name: 'French Fries', description: 'Crispy golden fries', price: 120, category: 'snack', searchQuery: 'french fries', restaurantIndex: 2 },
    { name: 'Onion Rings', description: 'Crispy fried onion rings', price: 140, category: 'snack', searchQuery: 'onion rings', restaurantIndex: 2 },
    { name: 'Chocolate Shake', description: 'Creamy chocolate milkshake', price: 150, category: 'beverage', searchQuery: 'chocolate milkshake', restaurantIndex: 2 },

    // Chinese Restaurant Foods
    { name: 'Fried Rice', description: 'Stir-fried rice with vegetables and egg', price: 200, category: 'main', searchQuery: 'fried rice', restaurantIndex: 3 },
    { name: 'Chow Mein', description: 'Stir-fried noodles with vegetables', price: 220, category: 'main', searchQuery: 'chow mein', restaurantIndex: 3 },
    { name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 150, category: 'appetizer', searchQuery: 'spring rolls', restaurantIndex: 3 },
    { name: 'Manchurian', description: 'Deep-fried veggie balls in spicy sauce', price: 180, category: 'appetizer', searchQuery: 'vegetable manchurian', restaurantIndex: 3 },
    { name: 'Fortune Cookie', description: 'Sweet crispy cookie with fortune', price: 30, category: 'dessert', searchQuery: 'fortune cookie', restaurantIndex: 3 },

    // Paradise Biryani House (Hyderabad Special)
    { name: 'Hyderabadi Chicken Biryani', description: 'World famous aromatic rice with spicy chicken', price: 450, category: 'main', searchQuery: 'chicken biryani', restaurantIndex: 4 },
    { name: 'Mutton Biryani', description: 'Traditional Hyderabadi mutton biryani', price: 550, category: 'main', searchQuery: 'lamb biryani', restaurantIndex: 4 },
    { name: 'Double Ka Meetha', description: 'Hyderabadi bread pudding dessert', price: 150, category: 'dessert', searchQuery: 'bread pudding', restaurantIndex: 4 },
    { name: 'Mirchi Ka Salan', description: 'Spicy chili curry side dish for biryani', price: 120, category: 'side', searchQuery: 'curry', restaurantIndex: 4 },
    { name: 'Chicken 65', description: 'Spicy deep-fried chicken appetizer', price: 320, category: 'appetizer', searchQuery: 'fried chicken', restaurantIndex: 4 },

    // Cafe Niloufer (Hyderabad Snacks)
    { name: 'Osmania Biscuits', description: 'Famous sweet and salt tea biscuits', price: 150, category: 'snack', searchQuery: 'biscuit', restaurantIndex: 5 },
    { name: 'Irani Chai', description: 'Traditional Hyderabadi tea', price: 40, category: 'beverage', searchQuery: 'chai tea', restaurantIndex: 5 },
    { name: 'Bun Maska', description: 'Soft bun with generous butter', price: 60, category: 'snack', searchQuery: 'bun', restaurantIndex: 5 },
    { name: 'Malai Bun', description: 'Bun topped with thick cream', price: 80, category: 'snack', searchQuery: 'cream bun', restaurantIndex: 5 },

    // Pista House (Haleem Special)
    { name: 'Hyderabadi Haleem', description: 'Rich stew of meat, lentils and pounded wheat', price: 350, category: 'main', searchQuery: 'stew', restaurantIndex: 6 },
    { name: 'Qubani Ka Meetha', description: 'Apricot dessert served with cream', price: 180, category: 'dessert', searchQuery: 'apricot dessert', restaurantIndex: 6 },
    { name: 'Sheer Khurma', description: 'Vermicelli pudding with milk and dates', price: 160, category: 'dessert', searchQuery: 'vermicelli pudding', restaurantIndex: 6 },
    { name: 'Pathar Ka Gosht', description: 'Mutton cooked on hot stone', price: 420, category: 'appetizer', searchQuery: 'grilled lamb', restaurantIndex: 6 },

    // Additional items for Spice Garden (Indian)
    { name: 'Dal Makhani', description: 'Creamy black lentils cooked overnight', price: 240, category: 'main', searchQuery: 'dal makhani', restaurantIndex: 0 },
    { name: 'Tandoori Chicken', description: 'Chicken marinated in yogurt and spices', price: 380, category: 'main', searchQuery: 'tandoori chicken', restaurantIndex: 0 },
    { name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes', price: 80, category: 'appetizer', searchQuery: 'samosa', restaurantIndex: 0 },
    { name: 'Mango Lassi', description: 'Sweet yogurt drink with mango', price: 120, category: 'beverage', searchQuery: 'mango lassi', restaurantIndex: 0 },
    { name: 'Raita', description: 'Cooling yogurt with cucumber and spices', price: 90, category: 'appetizer', searchQuery: 'raita', restaurantIndex: 0 },

    // Additional items for Pizza Paradise (Italian)
    { name: 'BBQ Chicken Pizza', description: 'Pizza with BBQ sauce, chicken, and onions', price: 480, category: 'main', searchQuery: 'bbq chicken pizza', restaurantIndex: 1 },
    { name: 'Veggie Supreme Pizza', description: 'Loaded with fresh vegetables', price: 420, category: 'main', searchQuery: 'vegetable pizza', restaurantIndex: 1 },
    { name: 'Bruschetta', description: 'Toasted bread with tomatoes and basil', price: 180, category: 'appetizer', searchQuery: 'bruschetta', restaurantIndex: 1 },
    { name: 'Pasta Carbonara', description: 'Creamy pasta with bacon and parmesan', price: 380, category: 'main', searchQuery: 'pasta carbonara', restaurantIndex: 1 },
    { name: 'Panna Cotta', description: 'Italian cream dessert with berry sauce', price: 200, category: 'dessert', searchQuery: 'panna cotta', restaurantIndex: 1 },

    // Additional items for Burger Hub (American)
    { name: 'Veggie Burger', description: 'Plant-based patty with fresh veggies', price: 220, category: 'main', searchQuery: 'veggie burger', restaurantIndex: 2 },
    { name: 'Double Cheese Burger', description: 'Two beef patties with extra cheese', price: 320, category: 'main', searchQuery: 'double cheeseburger', restaurantIndex: 2 },
    { name: 'Chicken Wings', description: 'Spicy buffalo wings with ranch', price: 280, category: 'appetizer', searchQuery: 'chicken wings', restaurantIndex: 2 },
    { name: 'Vanilla Shake', description: 'Classic vanilla milkshake', price: 140, category: 'beverage', searchQuery: 'vanilla milkshake', restaurantIndex: 2 },
    { name: 'Apple Pie', description: 'Warm apple pie with cinnamon', price: 160, category: 'dessert', searchQuery: 'apple pie', restaurantIndex: 2 },

    // Additional items for Dragon Wok (Chinese)
    { name: 'Sweet and Sour Chicken', description: 'Crispy chicken in tangy sauce', price: 280, category: 'main', searchQuery: 'sweet and sour chicken', restaurantIndex: 3 },
    { name: 'Kung Pao Chicken', description: 'Spicy stir-fry with peanuts', price: 300, category: 'main', searchQuery: 'kung pao chicken', restaurantIndex: 3 },
    { name: 'Dumplings', description: 'Steamed pork and veggie dumplings', price: 200, category: 'appetizer', searchQuery: 'dumplings', restaurantIndex: 3 },
    { name: 'Hot and Sour Soup', description: 'Spicy and tangy soup', price: 150, category: 'appetizer', searchQuery: 'hot and sour soup', restaurantIndex: 3 },
    { name: 'Bubble Tea', description: 'Sweet tea with tapioca pearls', price: 120, category: 'beverage', searchQuery: 'bubble tea', restaurantIndex: 3 },

    // Additional items for Paradise Biryani (Hyderabadi)
    { name: 'Veg Biryani', description: 'Aromatic rice with mixed vegetables', price: 350, category: 'main', searchQuery: 'vegetable biryani', restaurantIndex: 4 },
    { name: 'Tandoori Roti', description: 'Whole wheat flatbread from tandoor', price: 40, category: 'appetizer', searchQuery: 'roti', restaurantIndex: 4 },
    { name: 'Raita', description: 'Cooling yogurt accompaniment', price: 80, category: 'appetizer', searchQuery: 'raita yogurt', restaurantIndex: 4 },
    { name: 'Kheer', description: 'Rice pudding with cardamom', price: 130, category: 'dessert', searchQuery: 'rice pudding', restaurantIndex: 4 },

    // Additional items for Cafe Niloufer (Cafe)
    { name: 'Samosa', description: 'Crispy potato-filled pastry', price: 50, category: 'snack', searchQuery: 'samosa', restaurantIndex: 5 },
    { name: 'Khari Biscuit', description: 'Flaky puff pastry biscuit', price: 100, category: 'snack', searchQuery: 'puff pastry', restaurantIndex: 5 },
    { name: 'Masala Chai', description: 'Spiced Indian tea', price: 50, category: 'beverage', searchQuery: 'masala chai', restaurantIndex: 5 },
    { name: 'Dilkush', description: 'Sweet coconut-filled pastry', price: 70, category: 'snack', searchQuery: 'coconut pastry', restaurantIndex: 5 },

    // Additional items for Pista House (Haleem Special)
    { name: 'Chicken Biryani', description: 'Fragrant rice with tender chicken', price: 380, category: 'main', searchQuery: 'chicken biryani', restaurantIndex: 6 },
    { name: 'Badam Ki Jali', description: 'Almond-flavored sweet pastry', price: 140, category: 'dessert', searchQuery: 'almond pastry', restaurantIndex: 6 },
    { name: 'Lukhmi', description: 'Savory meat-filled pastry', price: 100, category: 'snack', searchQuery: 'meat pastry', restaurantIndex: 6 }
];

const sampleRestaurants = [
    {
        name: 'Spice Garden',
        description: 'Authentic Indian cuisine with traditional flavors',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        cuisineType: 'Indian',
        rating: 4.5,
        deliveryTime: '30-40 mins'
    },
    {
        name: 'Pizza Paradise',
        description: 'Wood-fired pizzas and Italian delights',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
        cuisineType: 'Italian',
        rating: 4.7,
        deliveryTime: '25-35 mins'
    },
    {
        name: 'Burger Hub',
        description: 'Juicy burgers and crispy fries',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        cuisineType: 'American',
        rating: 4.3,
        deliveryTime: '20-30 mins'
    },
    {
        name: 'Dragon Wok',
        description: 'Delicious Chinese and Asian fusion',
        image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800',
        cuisineType: 'Chinese',
        rating: 4.4,
        deliveryTime: '35-45 mins'
    },
    {
        name: 'Paradise Biryani',
        description: 'The World\'s Favourite Biryani',
        image: 'https://b.zmtcdn.com/data/pictures/chains/4/90274/33719920cc940c6194b611832049e295.jpg',
        cuisineType: 'Hyderabadi',
        rating: 4.8,
        deliveryTime: '40-50 mins'
    },
    {
        name: 'Cafe Niloufer',
        description: 'Heritage Tea & Bakery of Hyderabad',
        image: 'https://b.zmtcdn.com/data/pictures/chains/2/92412/1c618b082e652a926a84f33b1e360f04.jpg',
        cuisineType: 'Cafe',
        rating: 4.9,
        deliveryTime: '20-30 mins'
    },
    {
        name: 'Pista House',
        description: 'Famous for Haleem and Biryani',
        image: 'https://b.zmtcdn.com/data/pictures/chains/6/90276/7858c898c66a877526703565f490f23f.jpg',
        cuisineType: 'Hyderabadi',
        rating: 4.6,
        deliveryTime: '35-45 mins'
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Restaurant.deleteMany({});
        await FoodItem.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create food items with nutrition data from Spoonacular
        console.log('🍕 Fetching nutrition data from Spoonacular...');
        const createdFoodItems = [];

        for (const food of sampleFoods) {
            try {
                console.log(`  Fetching nutrition for: ${food.name}...`);

                let nutritionData = null;
                try {
                    // Search and get nutrition from Spoonacular
                    nutritionData = await spoonacularService.searchAndGetNutrition(food.searchQuery);
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (apiError) {
                    console.warn(`  ⚠️ API Error for ${food.name}: ${apiError.message}. Using default data.`);
                }

                const foodItem = new FoodItem({
                    name: food.name,
                    description: food.description,
                    price: food.price,
                    category: food.category,
                    image: nutritionData?.image || `https://source.unsplash.com/400x300/?${food.searchQuery.replace(' ', ',')}`,
                    spoonacularId: nutritionData?.spoonacularId || null,
                    nutrition: nutritionData?.nutrition || {
                        calories: Math.floor(Math.random() * 500) + 200,
                        protein: Math.floor(Math.random() * 30) + 5,
                        carbs: Math.floor(Math.random() * 60) + 20,
                        fats: Math.floor(Math.random() * 25) + 5,
                        fiber: Math.floor(Math.random() * 10) + 2
                    },
                    isAvailable: true
                });

                await foodItem.save();
                // Store restaurantIndex separately for filtering
                createdFoodItems.push({ item: foodItem, restaurantIndex: food.restaurantIndex });
                console.log(`  ✅ Created: ${food.name} (${foodItem.nutrition.calories} cal)`);
            } catch (error) {
                console.error(`  ❌ Critical Error creating ${food.name}:`, error.message);
            }
        }

        // Create restaurants and assign food items
        console.log('🏪 Creating restaurants...');
        for (let i = 0; i < sampleRestaurants.length; i++) {
            const restaurantData = sampleRestaurants[i];
            const restaurantFoods = createdFoodItems.filter(entry => entry.restaurantIndex === i);

            const restaurant = new Restaurant({
                ...restaurantData,
                foodItems: restaurantFoods.map(entry => entry.item._id)
            });

            await restaurant.save();
            console.log(`  ✅ Created restaurant: ${restaurant.name} with ${restaurantFoods.length} items`);
        }

        console.log('✅ Database seeding completed successfully!');
        console.log(`📊 Created ${createdFoodItems.length} food items and ${sampleRestaurants.length} restaurants`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
