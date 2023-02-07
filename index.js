const API_PRODUCT = `https://striveschool-api.herokuapp.com/api/product/`;
const API_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2RmZmEwZWUzYjkwMzAwMTViMDIxMTAiLCJpYXQiOjE2NzU2MjI5MjYsImV4cCI6MTY3NjgzMjUyNn0.WZQnBgrgS3oDLdLDr1Z5adgS8M0Dvxw8jCiH43DfNRM`;
const request = {
    headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json"
    }
};
const inserisciProdotto = (item, product, hasLink) => {
    item.querySelector("h2").textContent = `${product.brand} - ${product.name}`;
    item.querySelector("p").textContent = product.description;
    const href = document.createElement('a');
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.style.maxHeight = "100%";
    if (hasLink) {
        href.href = '/product.html?id=' + product._id;
        href.appendChild(img);
        item.querySelector("[class^='bg-']").appendChild(href);
    } else {
        item.querySelector("[class^='bg-']").appendChild(img);
    }

};
const activeLoader = (enable) => {
    const loader = document.querySelector('.loader');
    if(enable === true){
        // attiva
        loader.classList.remove('d-none');
    }else {
        // disattiva
        loader.classList.add('d-none');
    }
};
window.addEventListener("load", async (event) => {
    activeLoader(true);
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    let response = null;
    if (idParam) {
        // product
        response = await fetch(`${API_PRODUCT}${idParam}`, request);

    } else {
        // front
        response = await fetch(API_PRODUCT, request);
    }
    if (response.ok){
        const data = await response.json();
        const items = document.querySelectorAll('.item');
        if (Array.isArray(data)){
            for (const [index, product] of data.entries()) {
                const item = items[index];
                inserisciProdotto(item, product, true);
            }
        } else {
            const item = items[0];
            const product = data;
            inserisciProdotto(item, product, false);
        }
    }
    activeLoader(false);
});