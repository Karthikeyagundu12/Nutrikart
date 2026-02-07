# 🚀 Quick Start Guide - Vendor Onboarding System

## ✅ System Status

**Backend Server**: Running on `http://localhost:5000`  
**Frontend Client**: Running on `http://localhost:5173`  
**Database**: Connected to MongoDB Atlas

---

## 🎯 Testing the Complete Vendor Flow

### Step 1: Access Vendor Portal
1. Open your browser and navigate to: `http://localhost:5173/vendor`
2. You'll see the **Vendor Portal** login/registration page

### Step 2: Register as a New Vendor
Click "Register here" and fill in:
- **Owner Name**: Your name
- **Email**: vendor@test.com
- **Password**: test123
- **Phone**: +91 9876543210
- **GST Number**: (optional) 22AAAAA0000A1Z5
- **FSSAI License**: (optional) 12345678901234

Click **"Register"** → You'll be redirected to the dashboard

### Step 3: Add Your Restaurant
You'll see the **"Add Your Restaurant"** form. Fill in all required fields:

#### Basic Details:
- **Restaurant Name**: Spice Garden
- **Contact Number**: +91 9876543210
- **Email**: restaurant@test.com
- **Restaurant Type**: Both (Veg & Non-Veg)
- **Description**: Authentic Indian cuisine with a modern twist
- **Cuisine Type**: Indian
- **Delivery Time**: 30 minutes

#### Address:
- **Full Address**: 123 MG Road, Koramangala
- **City**: Bangalore
- **Pincode**: 560034

#### Legal Documents:
- **Restaurant License**: REST123456
- **GST Number**: 29AAAAA0000A1Z5
- **FSSAI Certificate**: 12345678901234
- **Identity Proof**: AADHAAR123456789012

#### Bank Details:
- **Account Holder Name**: Spice Garden Restaurant
- **Bank Account Number**: 1234567890123456
- **IFSC Code**: SBIN0001234

Click **"Submit for Verification"**

### Step 4: Pending Approval Screen
You'll see:
- ⏳ **"Verification in Progress"** message
- Your restaurant details
- Status: **Pending Approval**
- Information about the approval process

**For Testing**: You need to manually approve the restaurant in the database:

```javascript
// In MongoDB, update the restaurant:
db.restaurants.updateOne(
  { name: "Spice Garden" },
  { $set: { approvalStatus: "approved", isApproved: true, approvedAt: new Date() } }
)
```

Or use the admin panel (if available) to approve the restaurant.

### Step 5: Refresh and Add Food Items
1. Click **"Refresh Status"** button
2. Once approved, you'll see the **Menu Management Dashboard**
3. Click **"+ Add Food Item"**

### Step 6: Add Your First Food Item
Fill in the food item form:

#### Mandatory Fields:
- **Food Item Name**: Butter Chicken
- **Description**: Creamy tomato-based curry with tender chicken pieces
- **Category**: Main Course
- **Cuisine Category**: North Indian
- **Type**: Non-Veg
- **Price**: 299
- **Portion Size**: 1 plate (350g)

#### Optional Fields:
- **Ingredients**: Chicken, Tomatoes, Cream, Butter, Spices
- **Calories**: 450
- **Weight**: 350
- **Protein**: 25
- **Carbs**: 15
- **Fats**: 30
- **Fiber**: 2

Click **"Add Item"**

### Step 7: Manage Your Menu
Now you can:
- ✅ View all your food items in a grid
- ✅ Toggle availability on/off
- ✅ Add more items
- ✅ See veg/non-veg indicators
- ✅ View prices and portion sizes

---

## 📋 Sample Food Items to Add

### 1. Paneer Tikka (Veg)
- **Category**: Starter
- **Cuisine**: North Indian
- **Price**: ₹199
- **Portion**: 8 pieces (200g)
- **Calories**: 320

### 2. Masala Dosa (Veg)
- **Category**: Main Course
- **Cuisine**: South Indian
- **Price**: ₹149
- **Portion**: 1 dosa (250g)
- **Calories**: 380

### 3. Chicken Biryani (Non-Veg)
- **Category**: Main Course
- **Cuisine**: Indian
- **Price**: ₹349
- **Portion**: 1 plate (400g)
- **Calories**: 550

### 4. Gulab Jamun (Veg)
- **Category**: Dessert
- **Cuisine**: Desserts
- **Price**: ₹89
- **Portion**: 2 pieces (100g)
- **Calories**: 280

### 5. Mango Lassi (Veg)
- **Category**: Beverage
- **Cuisine**: Beverages
- **Price**: ₹79
- **Portion**: 250ml
- **Calories**: 180

---

## 🔧 Manual Database Approval (For Testing)

If you want to test the approval flow, you can manually approve restaurants using MongoDB:

### Option 1: MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `nutrikart` → `restaurants`
4. Find your restaurant
5. Edit the document:
   ```json
   {
     "approvalStatus": "approved",
     "isApproved": true,
     "approvedAt": ISODate("2026-02-07T06:30:00.000Z")
   }
   ```

### Option 2: MongoDB Shell
```javascript
use nutrikart
db.restaurants.updateOne(
  { email: "restaurant@test.com" },
  { 
    $set: { 
      approvalStatus: "approved", 
      isApproved: true, 
      approvedAt: new Date() 
    } 
  }
)
```

---

## 🎨 Features to Test

### ✅ Vendor Authentication
- [x] Register new vendor
- [x] Login existing vendor
- [x] Logout
- [x] Token-based authentication

### ✅ Restaurant Management
- [x] Add restaurant with all mandatory fields
- [x] Document validation
- [x] Pending approval state
- [x] Approval workflow
- [x] Restaurant details display

### ✅ Food Item Management
- [x] Add food items (only after approval)
- [x] Mandatory portion size
- [x] Optional nutrition values
- [x] Cuisine categorization
- [x] Ingredients field
- [x] Toggle availability
- [x] Veg/Non-Veg indicators

### ✅ UI/UX
- [x] Step-by-step onboarding
- [x] Progress indicators
- [x] Empty states
- [x] Modal forms
- [x] Responsive grid layout
- [x] Real-time updates

---

## 🐛 Troubleshooting

### Issue: "Cannot add food items"
**Solution**: Make sure the restaurant is approved. Check `approvalStatus` in the database.

### Issue: "Restaurant not found"
**Solution**: Ensure you're logged in as the correct vendor who owns the restaurant.

### Issue: "Portion size is mandatory"
**Solution**: Always fill in the portion size field (e.g., "250ml", "1 plate", "200g").

### Issue: Server not connecting to MongoDB
**Solution**: Check that the `.env` file exists in the `server` folder with the correct `MONGODB_URI`.

---

## 📊 Database Collections

After testing, you should see these collections in MongoDB:

1. **vendors** - Vendor accounts
2. **restaurants** - Restaurant details
3. **fooditems** - Menu items
4. **users** - Customer accounts (if any)
5. **orders** - Orders (if any)

---

## 🎉 Success Indicators

You've successfully implemented the vendor system if:

✅ Vendors can register and login through a separate portal  
✅ Restaurant registration requires all mandatory fields  
✅ Vendors see "pending approval" state after submission  
✅ Food items can ONLY be added after restaurant approval  
✅ Portion size is mandatory for all food items  
✅ Nutrition values are optional  
✅ Items can be categorized by cuisine type  
✅ Vendors can toggle food availability in real-time  

---

## 🚀 Next Steps

1. **Admin Panel**: Create an admin interface to approve/reject restaurants
2. **Image Upload**: Add image upload functionality for restaurants and food items
3. **Email Notifications**: Send emails when restaurants are approved/rejected
4. **Analytics Dashboard**: Show sales, orders, and revenue statistics
5. **Order Management**: Allow vendors to view and manage incoming orders

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server terminal for backend errors
3. Verify MongoDB connection
4. Ensure all required fields are filled
5. Check that the restaurant is approved before adding food items

---

**Happy Testing! 🎉**

Your complete vendor onboarding and restaurant management system is now live and ready to use!
