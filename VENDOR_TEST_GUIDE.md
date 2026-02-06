# Quick Test Script for Restaurant Approval

# To test the vendor flow:

# 1. Register as vendor at: http://localhost:5173/vendor
# 2. Fill in the restaurant registration form with all mandatory fields
# 3. Submit for verification (status will be "pending")

# 4. To approve the restaurant (for testing), use this API call:

# Get pending restaurants:
# GET http://localhost:5000/api/admin/restaurants/pending

# Approve a restaurant (replace {restaurant_id} with actual ID):
# POST http://localhost:5000/api/admin/restaurants/{restaurant_id}/approve

# Example using curl:
# curl -X POST http://localhost:5000/api/admin/restaurants/RESTAURANT_ID_HERE/approve

# Or using PowerShell:
# Invoke-RestMethod -Uri "http://localhost:5000/api/admin/restaurants/RESTAURANT_ID_HERE/approve" -Method Post

# 5. After approval, refresh the vendor dashboard
# 6. You should now see the "Add Food Item" option unlocked!

# Note: In production, you would build a proper admin panel for this.
# For now, you can use Postman, curl, or browser console to approve restaurants.
