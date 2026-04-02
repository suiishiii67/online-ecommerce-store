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
const save = () => localStorage.setItem('admin_products', JSON.stringify(products));

const $ = id => document.getElementById(id);
const tableBody = $('inventoryTableBody'), emptyState = $('emptyState'), modal = $('productModal'), form = $('productForm');

function updateStats() {
  $('totalProducts').textContent = products.length;
  let val = 0, low = 0;
  products.forEach(p => { 
    val += p.p * (p.stock || 0); 
    if (p.stock < 10) low++; 
  });
  $('totalValue').textContent = '₹' + val.toLocaleString('en-IN');
  $('lowStock').textContent = low;
}

function render(filter = '') {
  tableBody.innerHTML = '';
  const filtered = products.filter(p => (p.n+p.b+p.c).toLowerCase().includes(filter.toLowerCase()));
  emptyState.style.display = filtered.length ? 'none' : 'block';
  
  filtered.forEach(p => {
    const s = p.stock || 0;
    const {cls, txt} = s === 0 ? {cls:'out', txt:'Out of Stock'} : s < 10 ? {cls:'low', txt:'Low Stock'} : {cls:'in', txt:'In Stock'};
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>#${p.id.slice(0,8)}</td>
      <td><div class="product-cell"><div class="product-cell-icon">${p.icon||'📦'}</div><div><span class="product-cell-name">${p.n}</span><span class="product-cell-brand">${p.b}</span></div></div></td>
      <td>${p.c}</td><td>₹${p.p.toLocaleString('en-IN')}</td><td>${s} units</td>
      <td><span class="status-badge status-${cls}-stock">${txt}</span></td>
      <td><div class="action-btns"><button onclick="edit('${p.id}')">✏️</button><button class="delete" onclick="del('${p.id}')">🗑️</button></div></td>`;
    tableBody.appendChild(tr);
  });
  updateStats();
}

window.edit = id => {
  const p = products.find(x => x.id === id);
  if (!p) return;
  $('prodId').value = p.id; $('prodName').value = p.n; $('prodBrand').value = p.b;
  $('prodCat').value = p.c; $('prodIcon').value = p.icon; $('prodPrice').value = p.p;
  $('prodStock').value = p.stock; $('prodTag').value = p.tag || '';
  $('modalTitle').textContent = 'Edit Product';
  modal.classList.add('active');
};

window.del = id => {
  if (confirm('Delete this product?')) {
    products = products.filter(x => x.id !== id);
    save(); render($('adminSearchInput').value);
  }
};

const close = () => modal.classList.remove('active');
$('addBtn').onclick = $('emptyAddBtn').onclick = () => { 
  form.reset(); $('prodId').value = ''; $('modalTitle').textContent = 'Add Product'; modal.classList.add('active'); 
};
$('closeModalBtn').onclick = $('cancelModalBtn').onclick = close;
$('adminSearchInput').oninput = e => render(e.target.value);

form.onsubmit = e => {
  e.preventDefault();
  const id = $('prodId').value || $('prodName').value.toLowerCase().replace(/\s+/g, '-');
  const d = { id, n:$('prodName').value, b:$('prodBrand').value, c:$('prodCat').value, icon:$('prodIcon').value, p:+$('prodPrice').value, stock:+$('prodStock').value, tag:$('prodTag').value };
  const idx = products.findIndex(x => x.id === d.id);
  if (idx > -1) products[idx] = d; else products.push(d);
  save(); close(); render();
};

render();
