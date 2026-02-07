# 🍴 Vendor Onboarding & Restaurant Management Flow

## Complete Implementation Guide

This document outlines the **complete vendor onboarding and restaurant management system** for Nutrikart.

---

## 🔹 Step 1: Role Selection & Vendor Login

### User Flow:
1. **User signs up** and selects their role
2. If they choose **"Login as Vendor"**, they are redirected to the **Vendor Portal** (`/vendor`)
3. The Vendor Portal is **completely separate** from the customer interface

### Implementation:
- **Route**: `/vendor` → `VendorPortal.jsx`
- **Features**:
  - Login form for existing vendors
  - Registration form for new vendors
  - Separate authentication using `vendorToken`

### Vendor Registration Fields:
- Owner Name (required)
- Email (required)
- Password (required)
- Phone Number (required)
- GST Number (optional)
- FSSAI License (optional)

---

## 🔹 Step 2: Vendor Dashboard

After successful login, vendors land on the **Vendor Dashboard** (`/vendor/dashboard`).

### Initial State:
- If the vendor has **no restaurant registered**, they see the **"Add Your Restaurant"** option
- This is the **primary and only option** available initially

---

## 🔹 Step 3: Restaurant Registration (Mandatory)

When the vendor clicks **"Add Restaurant"**, they must complete a **mandatory registration form**.

### Required Information:

#### 📋 Basic Restaurant Details (Mandatory)
- Restaurant Name *
- Contact Number *
- Email ID *
- Restaurant Type * (Veg / Non-Veg / Both / Cloud Kitchen / Cafe / Bakery)
- Description *
- Cuisine Type * (Indian, Chinese, Italian, Mexican, Continental, Fast Food, South Indian, North Indian)
- Delivery Time (in minutes) *

#### 📍 Address Details (Mandatory)
- Full Address *
- City *
- Pincode * (6 digits)

#### 🏛️ Legal Documents (Mandatory)
- Restaurant License / Registration Certificate *
- GST Number (if applicable)
- FSSAI Certificate * (14-digit number)
- Government-approved Identity Proof * (Aadhaar / PAN / Driving License)

#### 💰 Bank Account Details (Mandatory - For Payouts)
- Account Holder Name *
- Bank Account Number *
- IFSC Code *

### Validation:
- **All fields marked with * are compulsory**
- The vendor **cannot proceed** unless every required field is filled
- Documents are validated on the backend

### Backend Route:
```javascript
POST /api/vendor/restaurants
```

---

## 🔹 Step 4: Restaurant Verification (Pending Approval)

Once all details are submitted:

### What Happens:
1. Restaurant status is set to **`pending`**
2. Vendor sees a **"Verification in Progress"** screen
3. The screen displays:
   - Restaurant name and contact details
   - Status badge: **"Pending Approval"**
   - Information about what happens next
   - **Refresh Status** button

### Approval Process:
- Admin reviews the restaurant information
- Verification typically takes **24-48 hours**
- Vendor receives email notification once approved

### During This Phase:
- Vendor **cannot add food items**
- The "Add Food Items" option is **locked**
- Vendor can only view their pending restaurant details

---

## 🔹 Step 5: Add Food Items (Unlocked After Approval)

After restaurant approval (`approvalStatus: 'approved'`), the vendor can now:

### New Option Appears:
- **"Add Food Items"** button becomes visible
- Vendor can start building their menu

### Food Item Management Features:
1. **Add new food items**
2. **Toggle availability** (available/unavailable)
3. **View all menu items** in a grid layout
4. **Categorize items** by cuisine and type

---

## 🔹 Step 6: Food Item Details

When adding a food item, vendors must provide:

### Mandatory Fields:
- **Food Item Name** *
- **Description** *
- **Category** * (Starter, Appetizer, Main Course, Dessert, Beverage, Snack, Side Dish)
- **Cuisine Category** * (Indian, Chinese, Fast Food, Continental, South Indian, North Indian, Italian, Mexican, Beverages, Desserts, Other)
- **Type** * (Veg / Non-Veg)
- **Price** * (in ₹)
- **Portion Size / Quantity** * (e.g., "250ml", "1 plate", "200g")
- **Availability Status** * (Available / Unavailable / Out of Stock)

### Optional Fields:
- **Ingredients** (List of main ingredients)
- **Nutritional Values**:
  - Calories (kcal)
  - Protein (g)
  - Carbs (g)
  - Fats (g)
  - Fiber (g)
- **Weight** (in grams, for auto-nutrition lookup)

### Important Notes:
- ⚠️ **Portion size is MANDATORY**
- ✅ **Nutrition and calories are OPTIONAL**
- Vendors can provide approximate values
- Items can be categorized by both **food category** and **cuisine category**

### Backend Route:
```javascript
POST /api/vendor/restaurants/:restaurantId/foods
```

---

## 🔹 Step 7: Menu Management Dashboard

After approval, vendors see a full dashboard with:

### Features:
1. **Restaurant Information**
   - Restaurant name
   - Verified badge
   - Contact details

2. **Menu Management**
   - Grid view of all food items
   - Veg/Non-Veg indicators
   - Availability toggle switches
   - Price and portion size display
   - "Add Food Item" button

3. **Real-time Updates**
   - Toggle food availability instantly
   - Add new items dynamically
   - View all menu items

---

## 📊 Database Models

### Vendor Model
```javascript
{
  ownerName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  gstNumber: String,
  fssaiLicense: String,
  hasRestaurant: Boolean (default: false),
  restaurantApproved: Boolean (default: false),
  restaurants: [ObjectId] (ref: Restaurant),
  isApproved: Boolean (default: false),
  isActive: Boolean (default: true)
}
```

### Restaurant Model
```javascript
{
  name: String (required),
  description: String (required),
  image: String,
  cuisineType: String (required),
  rating: Number (0-5),
  deliveryTime: String (required),
  contactNumber: String (required),
  email: String (required),
  restaurantType: String (enum: Veg, Non-Veg, Both, Cloud Kitchen, Cafe, Bakery),
  vendor: ObjectId (ref: Vendor),
  address: {
    street: String,
    city: String,
    pincode: String,
    fullAddress: String
  },
  documents: {
    restaurantLicense: String,
    gstNumber: String,
    fssaiCertificate: String,
    identityProof: String,
    bankAccountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  approvalStatus: String (enum: pending, approved, rejected),
  submittedAt: Date,
  approvedAt: Date,
  rejectionReason: String,
  foodItems: [ObjectId] (ref: FoodItem),
  isActive: Boolean
}
```

### FoodItem Model
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  image: String,
  category: String (enum: appetizer, main, dessert, beverage, snack, side, starter),
  cuisineCategory: String (enum: Indian, Chinese, Fast Food, Continental, etc.),
  portionSize: String (required),
  ingredients: String (optional),
  isVeg: Boolean,
  weight: Number (in grams),
  availabilityStatus: String (enum: available, unavailable, out_of_stock),
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number
  },
  isAvailable: Boolean
}
```

---

## 🔐 Security & Validation

### Backend Validation:
1. **JWT Token Authentication** for all vendor routes
2. **Role-based access control** (vendor role required)
3. **Document validation** (all mandatory documents must be provided)
4. **Restaurant ownership verification** (vendors can only manage their own restaurants)
5. **Approval status check** (food items can only be added after approval)

### Frontend Validation:
1. **Form validation** for all required fields
2. **Pattern matching** for pincode (6 digits)
3. **Email format validation**
4. **Minimum/maximum values** for numeric fields

---

## 🎯 Key Features Summary

✅ **Separate vendor portal** (completely isolated from customer interface)  
✅ **Mandatory restaurant registration** with legal documents  
✅ **Pending approval state** (vendors cannot add food until approved)  
✅ **Food item addition unlocked** only after restaurant approval  
✅ **Comprehensive food details** with mandatory portion size  
✅ **Optional nutrition information** (calories, protein, carbs, fats, fiber)  
✅ **Cuisine categorization** (Indian, Chinese, Fast Food, etc.)  
✅ **Real-time menu management** with availability toggles  
✅ **Dynamic food categorization** (Beverages, Cool drinks, Main food, Starters, Desserts)  

---

## 🚀 Testing the Flow

### 1. Register as Vendor
```
Navigate to: /vendor
Click: "Register here"
Fill in vendor details
Submit registration
```

### 2. Add Restaurant
```
After login, you'll see: "Add Your Restaurant"
Fill in all mandatory fields:
  - Basic details
  - Address
  - Legal documents
  - Bank details
Submit for verification
```

### 3. Wait for Approval
```
Status: "Verification in Progress"
Click: "Refresh Status" to check approval
(For testing, manually update approvalStatus to 'approved' in database)
```

### 4. Add Food Items
```
After approval, click: "Add Food Item"
Fill in:
  - Name, description, price
  - Category and cuisine category
  - Portion size (mandatory)
  - Ingredients (optional)
  - Nutrition values (optional)
Submit
```

### 5. Manage Menu
```
View all food items
Toggle availability
Add more items
```

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vendor/register` | Register new vendor |
| POST | `/api/vendor/login` | Vendor login |
| GET | `/api/vendor/profile` | Get vendor profile |
| POST | `/api/vendor/restaurants` | Add restaurant (pending approval) |
| GET | `/api/vendor/restaurants` | Get vendor's restaurants |
| POST | `/api/vendor/restaurants/:id/foods` | Add food item (requires approval) |
| PUT | `/api/vendor/foods/:id` | Update food item |
| PATCH | `/api/vendor/foods/:id/availability` | Toggle food availability |
| GET | `/api/vendor/orders` | Get vendor orders |
| PATCH | `/api/vendor/orders/:id/status` | Update order status |
| GET | `/api/vendor/analytics` | Get dashboard analytics |

---

## 🎨 UI/UX Highlights

- **Step-by-step onboarding** with clear progress indicators
- **Pending approval screen** with informative messaging
- **Empty states** with call-to-action buttons
- **Real-time toggles** for food availability
- **Veg/Non-Veg badges** with color indicators
- **Modal forms** for adding food items
- **Responsive grid layout** for menu items
- **Professional styling** with modern CSS

---

## ✅ Implementation Complete!

The entire vendor onboarding and restaurant management flow is now fully implemented and ready to use. Vendors can:

1. ✅ Register and login through a separate portal
2. ✅ Submit restaurant details with mandatory legal documents
3. ✅ Wait for approval (pending state)
4. ✅ Add food items after approval
5. ✅ Categorize items by cuisine type
6. ✅ Provide optional nutrition information
7. ✅ Manage menu in real-time

**All requirements from your specification have been implemented!** 🎉
