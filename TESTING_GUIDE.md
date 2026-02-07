# 🧪 Unified System Testing Guide

## Quick Test Scenarios

### ✅ Scenario 1: Register as Customer

**Steps:**
1. Navigate to `http://localhost:5173/register`
2. Fill in the form:
   ```
   Name: John Customer
   Email: john@customer.com
   Phone: +91 9876543210
   Role: Customer  ← SELECT THIS
   Password: test123
   Confirm Password: test123
   ```
3. Click **Register**

**Expected Result:**
- ✅ Redirected to `/` (home page)
- ✅ See restaurant marketplace
- ✅ Can browse restaurants
- ✅ Can add items to cart
- ✅ Header shows customer options

---

### ✅ Scenario 2: Register as Vendor

**Steps:**
1. Navigate to `http://localhost:5173/register`
2. Fill in the form:
   ```
   Name: Jane Vendor
   Email: jane@vendor.com
   Phone: +91 9876543211
   Role: Vendor  ← SELECT THIS
   Password: test123
   Confirm Password: test123
   ```
3. Click **Register**

**Expected Result:**
- ✅ Redirected to `/vendor/dashboard`
- ✅ See "Add Your Restaurant" form
- ✅ Cannot access customer cart
- ✅ Header shows vendor options

---

### ✅ Scenario 3: Login as Customer

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   ```
   Email: john@customer.com
   Password: test123
   ```
3. Click **Login**

**Expected Result:**
- ✅ Redirected to `/` (home page)
- ✅ See marketplace
- ✅ Can browse and shop

---

### ✅ Scenario 4: Login as Vendor

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   ```
   Email: jane@vendor.com
   Password: test123
   ```
3. Click **Login**

**Expected Result:**
- ✅ Redirected to `/vendor/dashboard`
- ✅ See restaurant management interface
- ✅ Can add restaurant

---

### ✅ Scenario 5: Role-Based Access Control (Customer)

**Steps:**
1. Login as customer (john@customer.com)
2. Manually navigate to `http://localhost:5173/vendor/dashboard`

**Expected Result:**
- ✅ Automatically redirected to `/` (home)
- ✅ Cannot access vendor dashboard
- ✅ Shows "Access Denied" or redirects immediately

---

### ✅ Scenario 6: Role-Based Access Control (Vendor)

**Steps:**
1. Login as vendor (jane@vendor.com)
2. Try to access customer features:
   - Navigate to `/checkout`
   - Try to add items to cart

**Expected Result:**
- ✅ Redirected to `/vendor/dashboard`
- ✅ Cannot access checkout
- ✅ No cart functionality available

---

### ✅ Scenario 7: Complete Vendor Onboarding

**Steps:**
1. Login as vendor
2. Fill "Add Restaurant" form:
   ```
   Restaurant Name: Spice Garden
   Contact: +91 9876543211
   Email: restaurant@test.com
   Type: Both
   Description: Authentic Indian cuisine
   Cuisine: Indian
   Delivery Time: 30
   
   Address:
   Full Address: 123 MG Road
   City: Bangalore
   Pincode: 560034
   
   Documents:
   License: REST123456
   GST: 29AAAAA0000A1Z5
   FSSAI: 12345678901234
   ID Proof: AADHAAR123456789012
   
   Bank:
   Account Holder: Spice Garden
   Account Number: 1234567890123456
   IFSC: SBIN0001234
   ```
3. Submit

**Expected Result:**
- ✅ Restaurant submitted
- ✅ Status: "Pending Approval"
- ✅ Cannot add food items yet
- ✅ See refresh button

---

### ✅ Scenario 8: Approve Restaurant (Manual)

**Steps:**
1. Open MongoDB Compass or shell
2. Find the restaurant:
   ```javascript
   db.restaurants.findOne({ email: "restaurant@test.com" })
   ```
3. Update status:
   ```javascript
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

**Expected Result:**
- ✅ Restaurant approved in database

---

### ✅ Scenario 9: Add Food Items (After Approval)

**Steps:**
1. Login as vendor
2. Click "Refresh Status" on dashboard
3. Click "+ Add Food Item"
4. Fill form:
   ```
   Name: Butter Chicken
   Description: Creamy tomato curry
   Category: Main Course
   Cuisine Category: North Indian  ← NEW FIELD
   Type: Non-Veg
   Price: 299
   Portion Size: 1 plate (350g)  ← MANDATORY
   
   Optional:
   Ingredients: Chicken, Tomatoes, Cream
   Calories: 450
   Protein: 25
   Carbs: 15
   Fats: 30
   Fiber: 2
   ```
5. Click "Add Item"

**Expected Result:**
- ✅ Food item added successfully
- ✅ Appears in menu grid
- ✅ Shows all details
- ✅ Can toggle availability

---

### ✅ Scenario 10: Logout and Switch Roles

**Steps:**
1. Login as customer
2. Browse marketplace
3. Logout
4. Login as vendor
5. See vendor dashboard
6. Logout
7. Login as customer again

**Expected Result:**
- ✅ Each login redirects to correct dashboard
- ✅ Customer → home
- ✅ Vendor → vendor dashboard
- ✅ No cross-contamination of features

---

## 🔍 Verification Checklist

### Customer Features ✅
- [ ] Can register with "Customer" role
- [ ] Redirected to home after login
- [ ] Can browse restaurants
- [ ] Can view restaurant details
- [ ] Can add items to cart
- [ ] Can checkout (if logged in)
- [ ] Can view orders
- [ ] CANNOT access vendor dashboard

### Vendor Features ✅
- [ ] Can register with "Vendor" role
- [ ] Redirected to vendor dashboard after login
- [ ] Can add restaurant
- [ ] See pending approval status
- [ ] Can add food items (after approval)
- [ ] Can set cuisine categories
- [ ] Can add optional nutrition
- [ ] Can toggle food availability
- [ ] CANNOT access customer checkout

### Authentication ✅
- [ ] JWT token includes role
- [ ] Token stored in localStorage as 'token'
- [ ] User data stored as 'user'
- [ ] Logout clears both token and user
- [ ] Protected routes work correctly
- [ ] Unauthorized access redirects properly

### Role-Based Routing ✅
- [ ] VendorRoute protects vendor pages
- [ ] CustomerRoute protects customer pages
- [ ] Automatic redirect based on role
- [ ] No manual portal selection needed
- [ ] Single unified login system

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot access vendor dashboard"
**Solution**: Make sure you registered/logged in with role="vendor"

### Issue 2: "Redirected to home when trying to add food"
**Solution**: Restaurant must be approved first. Check database approval status.

### Issue 3: "Token not found"
**Solution**: Make sure you're logged in. Check localStorage for 'token' key.

### Issue 4: "Role not redirecting correctly"
**Solution**: Clear localStorage and re-login. Check that JWT includes role.

---

## 📊 Test Data

### Test Customers
```
Email: customer1@test.com
Password: test123
Role: customer

Email: customer2@test.com
Password: test123
Role: customer
```

### Test Vendors
```
Email: vendor1@test.com
Password: test123
Role: vendor

Email: vendor2@test.com
Password: test123
Role: vendor
```

---

## ✅ Success Criteria

Your unified system is working correctly if:

1. ✅ **Single Login Page** - One login for all users
2. ✅ **Role Selection** - Users choose role during registration
3. ✅ **Automatic Redirect** - Vendors → dashboard, Customers → home
4. ✅ **Protected Routes** - Cannot access unauthorized pages
5. ✅ **Unified Token** - Single 'token' in localStorage
6. ✅ **No Separate Portal** - No /vendor login page needed
7. ✅ **Role in JWT** - Token includes user role
8. ✅ **Seamless UX** - Clear separation, no confusion

---

## 🎉 All Tests Passing?

**Congratulations!** Your Nutrikart unified system is production-ready! 🚀

- ✅ Single application
- ✅ Multiple roles
- ✅ Automatic redirection
- ✅ Secure authentication
- ✅ Role-based access control

**System Status: OPERATIONAL** ✅
