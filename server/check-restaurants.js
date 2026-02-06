const http = require('http');
const fs = require('fs');

http.get('http://localhost:5000/api/restaurants', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const restaurants = JSON.parse(data);
        let output = '\n=== RESTAURANT MENU SUMMARY ===\n\n';
        restaurants.forEach(r => {
            output += `${r.name} (${r.cuisineType}): ${r.foodItems.length} items\n`;
        });
        output += `\nTotal restaurants: ${restaurants.length}\n`;

        console.log(output);
        fs.writeFileSync('restaurant-summary.txt', output);
        process.exit(0);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
