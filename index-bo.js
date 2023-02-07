const API_PRODUCT = `https://striveschool-api.herokuapp.com/api/product/`;
const API_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2RmZmEwZWUzYjkwMzAwMTViMDIxMTAiLCJpYXQiOjE2NzU2MjI5MjYsImV4cCI6MTY3NjgzMjUyNn0.WZQnBgrgS3oDLdLDr1Z5adgS8M0Dvxw8jCiH43DfNRM`;

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {event.preventDefault(); submitProduct();});

const addButton = document.querySelector('#addButton');
addButton.addEventListener('click', (event) => {
    reset();
});
const close = document.querySelector('button[class*="btn"][data-dismiss]');
close.addEventListener('click', (event) => {
    reset();
});
const prepareRequest = (method, body) => {
    const request = {
        method: method,
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        }
    };
    if (body) {
        request["body"] = JSON.stringify(body);
    }
    return request;
};

const prepareBody = (productId) => {
    const inputName = document.querySelector('#inputName');
    const inputDescription = document.querySelector('#inputDescription');
    const inputBrand = document.querySelector('#inputBrand');
    const inputImage = document.querySelector('#inputImage');
    const inputPrice = document.querySelector('#inputPrice');
    // {
    //     “_id”: “5d318e1a8541744830bef139”, // SERVER GENERATED
    //     “name”: “3310 cellphone”, // REQUIRED
    //     “description”: “An unforgettable icon.”, // REQUIRED
    //     “brand”: “Nokia”, // REQUIRED
    //     “imageUrl”: “https://bit.ly/3CExjRa”, // REQUIRED
    //     “price”: 100, // REQUIRED
    //     “userId”: “admin”, // SERVER GENERATED
    //     “createdAt”: “2021-09-19T09:32:10.535Z”, // SERVER GENERATED
    //     “updatedAt”: “2021-09-19T09:32:10.535Z”, // SERVER GENERATED
    //     “__v”: 0 // SERVER GENERATED
    //     }
    const product = {
        name: inputName.value,
        description: inputDescription.value,
        brand: inputBrand.value,
        imageUrl: inputImage.value,
        price: parseInt(inputPrice.value),
    };
    if (productId) {
        product["_id"] = productId;
    }
    return product;
};

const success = document.querySelector('.alert-success');
const error = document.querySelector('.alert-danger');

const valida = () => {
    form.classList.add('was-validated');
    if (form.checkValidity() === false) {
        form.reportValidity();
        return false;
    }
    return true;
}

const submitProduct = async () => {
    const ret = valida();
    if (!ret) { return;}
    if (!success.classList.contains("d-none")){
        const heading = success.querySelector(".alert-heading");
        heading.textContent =  "";
        success.classList.add("d-none");
    }
    
    if (!error.classList.contains("d-none")){
        const heading = error.querySelector(".alert-heading");
        heading.textContent =  "";
        error.classList.add("d-none");
    }
    const product = prepareBody();
    const request = prepareRequest("POST", product);
    try {
        const response = await fetch(API_PRODUCT, request);
        if(response.ok){
            const data = await response.json();
            console.log(data);
            success.querySelector(".alert-heading").textContent = "Well done!";
            success.classList.remove("d-none");

            chiudiERicarica();
        }
    } catch (err) {
        console.log(err);
        error.querySelector(".alert-heading").textContent = JSON.stringify(err.message);
        error.classList.remove("d-none");
    }
}

const reset = () => {
    form.classList.remove('was-validated');
    const inputId = form.querySelector('#inputId');
    inputId.value = '';
    inputId.parentElement.classList.add('d-none');
    const inputName = form.querySelector('#inputName');
    inputName.value = '';
    const inputDescription = form.querySelector('#inputDescription');
    inputDescription.value = '';
    const inputBrand = form.querySelector('#inputBrand');
    inputBrand.value = '';
    const inputImage = form.querySelector('#inputImage');
    inputImage.value = '';
    const inputPrice = form.querySelector('#inputPrice');
    inputPrice.value = '';
    const saveBtn = document.querySelector('.btn-action');
    saveBtn.removeAttribute("onclick");
    saveBtn.onclick = null;
    saveBtn.setAttribute("onclick", "submitProduct();");

    document.querySelector('#exampleModalLabel').textContent = 'Aggiungi Prodotto';
};

const chiudiERicarica = () => {
    const close = document.querySelector('button[class*="btn"][data-dismiss]');
    close.click();
    
    // ricarica pagina
    window.location.reload();
};

const aggiorna = async (productId) => {
    const ret = valida();
    if (!ret) { return;}
    console.log(productId);
    if(productId){
        try {
            const product = prepareBody(productId);
            const request = prepareRequest("PUT",product);
            const response = await fetch(`${API_PRODUCT}${productId}`,request);
            if (response.ok){
                const data = await response.json();
                console.log(data);
                success.querySelector(".alert-heading").textContent = "Well done!";
                success.classList.remove("d-none");

                chiudiERicarica();
            }
        } catch (err) {
            console.log(err);
            error.querySelector(".alert-heading").textContent = JSON.stringify(err.message);
            error.classList.remove("d-none");
        }
    }
    reset();
};

const createTD = (tableRow, tdValue) => {
    const td = document.createElement('td');
    td.textContent = tdValue;
    tableRow.appendChild(td);
};

const aggiungiProdottoInTabella = (product) => {
    const table = document.querySelector('.table');
    const tbody = table.querySelector('tbody');

    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = product._id;
    tr.appendChild(th);
    const tdImg = document.createElement('td');
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.style.maxWidth = '50px';
    img.style.maxHeight = '70px';
    tdImg.className = "text-center";
    tdImg.appendChild(img);
    tr.appendChild(tdImg);

    createTD(tr, product.name);
    createTD(tr, product.description);
    createTD(tr, product.brand);
    createTD(tr, product.price);

    const tdButtons = document.createElement('td');
    const buttonModifica = document.createElement('button');
    buttonModifica.textContent="Modifica";
    buttonModifica.className = "mr-1";
    buttonModifica.onclick = async (evt) => {
        console.log("modifica",product);
        evt.stopPropagation();
        const inputId = form.querySelector('#inputId');
        inputId.value = '';
        inputId.value = product._id;
        inputId.parentElement.classList.remove('d-none');
        const inputName = form.querySelector('#inputName');
        inputName.value = '';
        inputName.value = product.name;
        const inputDescription = form.querySelector('#inputDescription');
        inputDescription.value = '';
        inputDescription.value = product.description;
        const inputBrand = form.querySelector('#inputBrand');
        inputBrand.value = '';
        inputBrand.value = product.brand;
        const inputImage = form.querySelector('#inputImage');
        inputImage.value = '';
        inputImage.value = product.imageUrl;
        const inputPrice = form.querySelector('#inputPrice');
        inputPrice.value = '';
        inputPrice.value = product.price;

        const saveBtn = document.querySelector('.btn-action');
        saveBtn.removeAttribute("onclick");
        saveBtn.onclick = null;
        saveBtn.setAttribute("onclick", `aggiorna('${product._id}');`)

        document.querySelector('#exampleModalLabel').textContent = 'Modifica Prodotto';

        new bootstrap.Modal(document.querySelector('#exampleModal')).show(); 
    };
    const buttonElimina = document.createElement('button');
    buttonElimina.textContent="Elimina";
    buttonElimina.onclick = async (evt) => {
        console.log("elimina",product);
        evt.stopPropagation();
        const confirmation = confirm("Sei sicuro?");
        if (confirmation) {
            const request = prepareRequest("DELETE");
            const response = await fetch(`${API_PRODUCT}${product._id}`, request);
            console.log(response.status);

            // ricarica pagina
            window.location.reload();
        }
    }
    tdButtons.appendChild(buttonModifica);
    tdButtons.appendChild(buttonElimina);
    tr.appendChild(tdButtons);

    tbody.appendChild(tr);
};
window.addEventListener("load", async (event) => {
    try {
        const request = prepareRequest("GET");
        const response = await fetch(API_PRODUCT, request);
        if (response.ok){
            const data = await response.json();
            for (const product of data) {
                aggiungiProdottoInTabella(product);
            }
        }
    } catch (err) {
        console.log(err);
    }
});