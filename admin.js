// admin.js - Simplified Version

const defaultProducts = [
  { id: "arctis-nova-pro", n: "Arctis Nova Pro Wireless", b: "SteelSeries", p: 24999, c: "Headphones", icon: "🎧", stock: 15 },
  { id: "lg-ultragear", n: "UltraGear 27GP850-B", b: "LG", p: 32499, c: "Monitors", icon: "🖥️", stock: 5 },
  { id: "keychron-q3", n: "Q3 Pro Wireless QMK", b: "Keychron", p: 14999, c: "Keyboards", icon: "⌨️", stock: 45 },
  { id: "logitech-super2", n: "G Pro X Superlight 2", b: "Logitech", p: 13495, c: "Mouse", icon: "🖱️", stock: 12 },
  { id: "secretlab-titan", n: "TITAN Evo XL Series", b: "SecretLab", p: 42999, c: "Gaming Chairs", icon: "🪑", stock: 2 },
  { id: "hyperx-quadcast", n: "QuadCast S USB Mic", b: "HyperX", p: 11999, c: "Microphones", icon: "🎤", stock: 0 },
  { id: "facecam-pro", n: "Facecam Pro 4K", b: "Elgato", p: 19999, c: "Webcams", icon: "📷", stock: 8 },
];

let products = JSON.parse(localStorage.getItem('admin_products')) || defaultProducts;

function saveToLocalStorage() {
  localStorage.setItem('admin_products', JSON.stringify(products));
}

function updateSummaryStats() {
  const totalProductsElement = document.getElementById('totalProducts');
  const totalValueElement = document.getElementById('totalValue');
  const lowStockElement = document.getElementById('lowStock');

  totalProductsElement.textContent = products.length;

  let totalValue = 0;
  let lowStockCount = 0;

  products.forEach(function(product) {
    const stock = Number(product.stock) || 0;
    const price = Number(product.p) || 0;
    totalValue += price * stock;
    if (stock < 10) {
      lowStockCount++;
    }
  });

  totalValueElement.textContent = '₹' + totalValue.toLocaleString('en-IN');
  lowStockElement.textContent = lowStockCount;
}

function renderInventoryTable(filterText = '') {
  const tableBody = document.getElementById('inventoryTableBody');
  const emptyState = document.getElementById('emptyState');
  
  tableBody.innerHTML = '';
  
  const filteredProducts = products.filter(function(product) {
    const searchString = (product.n + ' ' + product.b + ' ' + product.c).toLowerCase();
    return searchString.indexOf(filterText.toLowerCase()) !== -1;
  });

  if (filteredProducts.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }
  
  filteredProducts.forEach(function(p) {
    const stock = Number(p.stock) || 0;
    let statusClass = 'status-in-stock';
    let statusText = 'In Stock';
    
    if (stock === 0) {
      statusClass = 'status-out-stock';
      statusText = 'Out of Stock';
    } else if (stock < 10) {
      statusClass = 'status-low-stock';
      statusText = 'Low Stock';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${p.n}</strong><br><small style="color:#666">${p.b}</small></td>
      <td>${p.c}</td>
      <td>₹${p.p.toLocaleString('en-IN')}</td>
      <td>${stock}</td>
      <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      <td>
        <button onclick="editProduct('${p.id}')">Edit</button>
        <button class="delete" onclick="deleteProduct('${p.id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updateSummaryStats();
}

window.editProduct = function(productId) {
  const product = products.find(function(p) { return p.id === productId; });
  if (!product) return;

  document.getElementById('prodId').value = product.id;
  document.getElementById('prodName').value = product.n;
  document.getElementById('prodBrand').value = product.b;
  document.getElementById('prodCat').value = product.c;
  document.getElementById('prodPrice').value = product.p;
  document.getElementById('prodStock').value = product.stock;
  document.getElementById('prodIcon').value = product.icon || '';
  document.getElementById('prodTag').value = product.tag || '';

  document.getElementById('modalTitle').textContent = 'Edit Product Entry';
  document.getElementById('productModal').classList.add('active');
};

window.deleteProduct = function(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    products = products.filter(function(p) { return p.id !== productId; });
    saveToLocalStorage();
    renderInventoryTable(document.getElementById('adminSearchInput').value);
  }
};

document.getElementById('addBtn').onclick = function() {
  document.getElementById('productForm').reset();
  document.getElementById('prodId').value = '';
  document.getElementById('modalTitle').textContent = 'New Product Entry';
  document.getElementById('productModal').classList.add('active');
};

document.getElementById('cancelModalBtn').onclick = function() {
  document.getElementById('productModal').classList.remove('active');
};

document.getElementById('adminSearchInput').oninput = function(event) {
  renderInventoryTable(event.target.value);
};

document.getElementById('productForm').onsubmit = function(event) {
  event.preventDefault();
  
  const id = document.getElementById('prodId').value || document.getElementById('prodName').value.toLowerCase().replace(/\s+/g, '-');
  
  const newProductData = {
    id: id,
    n: document.getElementById('prodName').value,
    b: document.getElementById('prodBrand').value,
    c: document.getElementById('prodCat').value,
    icon: document.getElementById('prodIcon').value,
    p: Number(document.getElementById('prodPrice').value),
    stock: Number(document.getElementById('prodStock').value),
    tag: document.getElementById('prodTag').value
  };

  const idx = products.findIndex(function(p) { return p.id === newProductData.id; });
  if (idx !== -1) {
    products[idx] = newProductData;
  } else {
    products.push(newProductData);
  }

  saveToLocalStorage();
  document.getElementById('productModal').classList.remove('active');
  renderInventoryTable();
};

renderInventoryTable();
