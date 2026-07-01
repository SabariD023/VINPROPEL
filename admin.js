const API_URL = "https://vinpropel-backend.onrender.com";
window.editingId = null;
window.currentImage = "";
window.currentPdf = "";

async function loadProducts() {

   const response = await fetch(`${API_URL}/products`);

    const products = await response.json();

    const table = document.getElementById("productTable");

    table.innerHTML = "";

    products.forEach(product => {

        table.innerHTML += `

        <tr>

            <td>${product.id}</td>

            <td>

                <img
                    src="${API_URL}/uploads/${product.image}"
                    style="
                        width:70px;
                        height:70px;
                        object-fit:contain;
                        border-radius:8px;">

            </td>

            <td>${product.product_name}</td>

            <td>${product.model_number}</td>

            <td>${product.rated_voltage}</td>

            <td>

                <button
                    onclick="editProduct(${product.id})"
                    class="btn btn-primary-small">

                    Edit

                </button>

                <button
                    onclick="deleteProduct(${product.id})"
                    style="
                        background:red;
                        color:white;
                        margin-left:8px;
                        padding:8px 14px;
                        border:none;
                        border-radius:6px;
                        cursor:pointer;">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

loadProducts();
async function addProduct() {
    console.log("Save Product button clicked");

    const imageFile = document.getElementById("product_image").files[0];

    let imageName = window.currentImage || "";

    // Upload Image
    if (imageFile) {

        const formData = new FormData();

        formData.append("image", imageFile);

        const uploadResponse = await fetch(`${API_URL}/upload-image`, 
            {
                method: "POST",
                body: formData
            }
        );

        const uploadResult = await uploadResponse.json();

        imageName = uploadResult.filename;
    }
    const pdfFile =
document.getElementById("product_pdf").files[0];

let pdfName = window.currentPdf || "";

if (pdfFile) {

    const formData = new FormData();

    formData.append("pdf", pdfFile);

    const uploadResponse = await fetch(`${API_URL}/upload-pdf`, {
            method: "POST",
            body: formData
        }
    );

    const uploadResult = await uploadResponse.json();

    pdfName = uploadResult.filename;
}

    const data = {

        product_name: document.getElementById("product_name").value,
        model_number: document.getElementById("model_number").value,
        description: document.getElementById("description").value,

        image: imageName,
        pdf: pdfName,

        rated_voltage: document.getElementById("rated_voltage").value,
        rated_power: document.getElementById("rated_power").value,
        max_power: document.getElementById("max_power").value,
        rated_speed: document.getElementById("rated_speed").value,
        max_speed: document.getElementById("max_speed").value,
        hover_thrust: document.getElementById("hover_thrust").value,
        max_thrust: document.getElementById("max_thrust").value,
        propeller_size: document.getElementById("propeller_size").value

    };

   let response;

if (window.editingId) {

    response =await fetch(`${API_URL}/product/${window.editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

} else {

    response = await fetch(`${API_URL}/add-product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

}

const result = await response.json();

alert(result.message);

window.editingId = null;

document.getElementById("saveBtn").innerText = "Save Product";
document.getElementById("productTitle").innerText = "Product Management";

document.querySelectorAll(
    "#products-view input, #products-view textarea"
).forEach(field => {

    if (field.type !== "file") {
        field.value = "";
    }

});

document.getElementById("product_image").value = "";
document.getElementById("product_pdf").value = "";

// Clear preview of current image and PDF
document.getElementById("currentImageBox").innerHTML = "";
document.getElementById("currentPdfBox").innerHTML = "";

window.currentImage = "";
window.currentPdf = "";
window.editingId = null;

document.getElementById("saveBtn").innerText = "Save Product";
document.getElementById("productTitle").innerText = "Product Management";

loadProducts();
}
async function editProduct(id) {

    const response = await fetch(
    `${API_URL}/product/${id}`
);

    const product = await response.json();
    window.currentImage = product.image;
    window.currentPdf = product.pdf;
    // Show current image
document.getElementById("currentImageBox").innerHTML = `
<p><strong>Current Image:</strong></p>

<img
    src="${API_URL}/uploads/${product.image}"
    style="
        width:120px;
        height:120px;
        object-fit:contain;
        border:1px solid #ddd;
        border-radius:8px;
        padding:5px;">
`;

// Show current PDF
document.getElementById("currentPdfBox").innerHTML = `
<p><strong>Current PDF:</strong></p>

<a
    href="${API_URL}/uploads/${product.pdf}"
    target="_blank"
    style="color:#0d6efd;font-weight:bold;">

    📄 View Current PDF

</a>
`;

    document.getElementById("product_name").value = product.product_name || "";
    document.getElementById("model_number").value = product.model_number || "";
    document.getElementById("description").value = product.description || "";
    document.getElementById("rated_voltage").value = product.rated_voltage || "";
    document.getElementById("rated_power").value = product.rated_power || "";
    document.getElementById("max_power").value = product.max_power || "";
    document.getElementById("rated_speed").value = product.rated_speed || "";
    document.getElementById("max_speed").value = product.max_speed || "";
    document.getElementById("hover_thrust").value = product.hover_thrust || "";
    document.getElementById("max_thrust").value = product.max_thrust || "";
    document.getElementById("propeller_size").value = product.propeller_size || "";

    window.editingId = id;

    document.getElementById("saveBtn").innerText = "Update Product";
    document.getElementById("productTitle").innerText = "Edit Product";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

async function deleteProduct(id) {

    if (!confirm("Delete Product?")) return;

    await fetch(`${API_URL}/product/${id}`, {
            method: "DELETE"
        }
    );

    loadProducts();
}

function searchProducts() {

    const input =
        document.getElementById("searchProduct")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("#productTable tr");

    const suggestions =
        document.getElementById("searchSuggestions");

    suggestions.innerHTML = "";

    let found = [];

    rows.forEach(row => {

        const text =
            row.children[2].innerText;

        if(text.toLowerCase().startsWith(input) && input !== ""){

            found.push(text);

        }

        row.style.display =
            row.innerText.toLowerCase().includes(input)
            ? ""
            : "none";

    });

    found = [...new Set(found)];

    if(found.length === 0){

        suggestions.style.display = "none";

        return;

    }

    suggestions.style.display = "block";

    found.forEach(name=>{

        suggestions.innerHTML += `
        <div
        onclick="selectSuggestion('${name}')"
        style="
        padding:10px;
        cursor:pointer;
        border-bottom:1px solid #eee;">

        ${name}

        </div>
        `;

    });

}
function selectSuggestion(name){

    document.getElementById("searchProduct").value = name;

    document.getElementById("searchSuggestions").style.display="none";

    searchProducts();

}
loadProducts();