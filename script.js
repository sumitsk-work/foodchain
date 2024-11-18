document.addEventListener('DOMContentLoaded', function () {
    const areaSelect = document.getElementById('area');
    const hungerSlider = document.getElementById('hunger-slider');
    const hungerMinValue = document.getElementById('hunger-min-value');
    const hungerMaxValue = document.getElementById('hunger-max-value');
    const budgetInput = document.getElementById('budget');
    const priceNACheckbox = document.getElementById('price-na');
    const submitBtn = document.getElementById('submit-btn');
    const foodResults = document.getElementById('food-results');

    noUiSlider.create(hungerSlider, {
        start: [1, 10],
        connect: true,
        range: {
            'min': 1,
            'max': 10
        },
        step: 1,
        format: {
            to: value => Math.round(value),
            from: value => Math.round(value)
        }
    });

    hungerSlider.noUiSlider.on('update', function (values) {
        hungerMinValue.textContent = values[0];
        hungerMaxValue.textContent = values[1];
    });

    submitBtn.addEventListener('click', function () {
        const area = areaSelect.value;
        const hungerRange = hungerSlider.noUiSlider.get();
        const minHunger = parseInt(hungerRange[0]);
        const maxHunger = parseInt(hungerRange[1]);
        const budget = budgetInput.value;
        const priceNA = priceNACheckbox.checked;

        fetch('data/foodData.json')
            .then(response => response.json())
            .then(data => {
                const filteredFood = data.filter(item => {
                    if (item.area !== area) return false;
                    if (item.hunger_index < minHunger || item.hunger_index > maxHunger) return false;
                    if (!priceNA && item.price > budget) return false;
                    return true;
                });

                // Group food items by shop
                const groupedByShop = filteredFood.reduce((acc, item) => {
                    if (!acc[item.shop]) acc[item.shop] = [];
                    acc[item.shop].push(item);
                    return acc;
                }, {});

                foodResults.innerHTML = '';

                // Create a dropdown for each shop
                Object.keys(groupedByShop).forEach(shop => {
                    const shopContainer = document.createElement('div');
                    const shopTitle = document.createElement('button');
                    shopTitle.innerHTML = `${shop} <i class="fas fa-chevron-down"></i>`;
                    shopTitle.classList.add('shop-title');
                    shopTitle.addEventListener('click', () => {
                        const foodItems = shopContainer.querySelector('.food-items');
                        foodItems.classList.toggle('hidden');
                    });

                    const foodItems = document.createElement('ul');
                    foodItems.classList.add('food-items', 'hidden');
                    groupedByShop[shop].forEach(item => {
                        const li = document.createElement('li');
                        li.innerHTML = `<span class="food-name">${item.food}</span> - <span class="food-price">${item.price} Rs</span>`;
                        foodItems.appendChild(li);
                    });

                    shopContainer.appendChild(shopTitle);
                    shopContainer.appendChild(foodItems);
                    foodResults.appendChild(shopContainer);
                });
            });
    });
});
