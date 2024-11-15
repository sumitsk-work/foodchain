document.addEventListener('DOMContentLoaded', function () {
    const hungerSlider = document.getElementById('hunger-slider');
    noUiSlider.create(hungerSlider, {
        start: [1, 10],
        connect: true,
        range: {
            'min': 1,
            'max': 10
        },
        step: 1,
        tooltips: [true, true],
        format: {
            to: value => Math.round(value),
            from: value => Number(value)
        }
    });

    const hungerMinValue = document.getElementById('hunger-min-value');
    const hungerMaxValue = document.getElementById('hunger-max-value');

    hungerSlider.noUiSlider.on('update', function (values, handle) {
        if (handle === 0) {
            hungerMinValue.textContent = values[0];
        } else {
            hungerMaxValue.textContent = values[1];
        }
    });

    document.getElementById('submit-btn').addEventListener('click', function () {
        const area = document.getElementById('area').value;
        const budget = document.getElementById('budget').value;
        const priceNA = document.getElementById('price-na').checked;
        const hungerRange = hungerSlider.noUiSlider.get();
        const hungerMin = hungerRange[0];
        const hungerMax = hungerRange[1];

        fetch('data/foodData.json')
            .then(response => response.json())
            .then(data => {
                const filteredFood = data.filter(item => {
                    if (item.area !== area) return false;
                    if (!priceNA && item.price > budget) return false;
                    if (item.hunger_index < hungerMin || item.hunger_index > hungerMax) return false;
                    return true;
                });

                // Sort the filtered food by price in increasing order
                filteredFood.sort((a, b) => a.price - b.price);

                const foodList = document.getElementById('food-list');
                foodList.innerHTML = '';
                filteredFood.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.food} - ${item.price} Rs (Hunger Index: ${item.hunger_index})`;
                    foodList.appendChild(li);
                });
            });
    });
});
