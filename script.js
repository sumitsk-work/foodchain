document.getElementById('submit-btn').addEventListener('click', function () {
    const area = document.getElementById('area').value;
    const budget = document.getElementById('budget').value;
    const priceNA = document.getElementById('price-na').checked;

    fetch('data/foodData.json')
        .then(response => response.json())
        .then(data => {
            const filteredFood = data.filter(item => {
                if (item.area !== area) return false;
                if (!priceNA && item.price > budget) return false;
                return true;
            });

            // Sort the filtered food by price in increasing order
            filteredFood.sort((a, b) => a.price - b.price);

            const foodList = document.getElementById('food-list');
            foodList.innerHTML = '';
            filteredFood.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.food} - ${item.price} Rs`;
                foodList.appendChild(li);
            });
        });
});
