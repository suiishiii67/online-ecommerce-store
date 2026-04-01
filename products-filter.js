var prods = [
  { id: "arctis-nova-pro", n: "Arctis Nova Pro Wireless", b: "SteelSeries", p: 24999, c: "Headphones", icon: "🎧", tag: "new", r: 5 },
  { id: "lg-ultragear", n: "UltraGear 27GP850-B", b: "LG", p: 32499, c: "Monitors", icon: "🖥️", tag: "sale", r: 5 },
  { id: "keychron-q3", n: "Q3 Pro Wireless QMK", b: "Keychron", p: 14999, c: "Keyboards", icon: "⌨️", tag: "", r: 5 },
  { id: "logitech-super2", n: "G Pro X Superlight 2", b: "Logitech", p: 13495, c: "Mouse", icon: "🖱️", tag: "popular", r: 5 },
  { id: "secretlab-titan", n: "TITAN Evo XL Series", b: "SecretLab", p: 42999, c: "Gaming Chairs", icon: "🪑", tag: "", r: 5 },
  { id: "hyperx-quadcast", n: "QuadCast S USB Mic", b: "HyperX", p: 11999, c: "Microphones", icon: "🎤", tag: "new", r: 5 },
  { id: "facecam-pro", n: "Facecam Pro 4K", b: "Elgato", p: 19999, c: "Webcams", icon: "📷", tag: "", r: 4 },
];

function updateList() {
  var grid = document.querySelector(".product-grid");
  if (!grid) return;

  var maxPrice = parseInt(document.querySelector(".range-slider").value) || 100000;
  var minPrice = parseInt(document.querySelector(".price-inputs input").value) || 0;
  var actTag = document.querySelector(".filter-tags .active");
  var tFilter = actTag ? actTag.innerText.toLowerCase() : "all";
  var sortVal = document.querySelector(".sort-select").value.toLowerCase();

  var brandChecks = document.querySelectorAll(".filter-block:nth-child(3) input:checked");
  var selectedBrands = [];
  for (var i = 0; i < brandChecks.length; i++) {
    selectedBrands.push(brandChecks[i].parentElement.innerText.trim());
  }

  var catChecks = document.querySelectorAll(".filter-block:nth-child(1) input:checked");
  var selectedCats = [];
  for (var j = 0; j < catChecks.length; j++) {
    selectedCats.push(catChecks[j].parentElement.innerText.replace(/[0-9]/g, '').trim());
  }

  var arr = [];
  for (var k = 0; k < prods.length; k++) {
    var item = prods[k];
    var brandMatch = selectedBrands.length === 0 || selectedBrands.indexOf(item.b) !== -1;
    var catMatch = selectedCats.length === 0 || selectedCats.indexOf("All Products") !== -1 || selectedCats.indexOf(item.c) !== -1;
    var priceMatch = item.p >= minPrice && item.p <= maxPrice;
    var tagMatch = tFilter === "all" || (tFilter.includes("new") && item.tag === "new") || (tFilter.includes("sale") && item.tag === "sale") || (tFilter.includes("rated") && item.tag === "popular");

    if (brandMatch && catMatch && priceMatch && tagMatch) {
      arr.push(item);
    }
  }

  if (sortVal.includes("low")) arr.sort(function (a, b) { return a.p - b.p; });
  if (sortVal.includes("high")) arr.sort(function (a, b) { return b.p - a.p; });
  if (sortVal.includes("rated")) arr.sort(function (a, b) { return b.r - a.r; });

  var res = "";
  for (var m = 0; m < arr.length; m++) {
    var p = arr[m];
    var badgeHtml = "";
    if (p.tag === "new") badgeHtml = '<span class="product-badge new">New</span>';
    else if (p.tag === "sale") badgeHtml = '<span class="product-badge sale">Sale</span>';
    else if (p.tag === "popular") badgeHtml = '<span class="product-badge">Popular</span>';

    res += '<div class="product-card" onclick="window.location=\'product-detail.html\'">' +
      badgeHtml +
      '<div class="product-image">' + p.icon + '</div>' +
      '<div class="product-info">' +
      '<div class="product-brand">' + p.b + '</div>' +
      '<div class="product-name">' + p.n + '</div>' +
      '<div class="product-footer" style="margin-top:12px">' +
      '<div class="product-price"><span class="price-current">₹' + p.p + '</span></div>' +
      '<button class="btn-add-cart" data-id="' + p.id + '">+ Cart</button>' +
      '</div></div></div>';
  }

  grid.innerHTML = res || "<div style='grid-column:1/-1;text-align:center;'>No products found</div>";
  document.querySelector(".listing-count").innerText = arr.length + " results";

  var btns = document.querySelectorAll(".btn-add-cart");
  for (var b = 0; b < btns.length; b++) {
    btns[b].addEventListener("click", function (e) {
      e.stopPropagation();
      var pid = this.getAttribute("data-id");
      if (typeof addToCart === "function") addToCart(pid);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector(".product-grid")) return;

  var slider = document.querySelector(".range-slider");
  var maxInput = document.querySelectorAll(".price-inputs input")[1];
  if (slider && maxInput) {
    slider.addEventListener("input", function () {
      maxInput.value = this.value;
      // Do not update list immediately while sliding to be simpler
    });
  }

  var tags = document.querySelectorAll(".filter-tags .tag");
  for (var i = 0; i < tags.length; i++) {
    tags[i].addEventListener("click", function () {
      for (var j = 0; j < tags.length; j++) tags[j].classList.remove("active");
      this.classList.add("active");
      updateList();
    });
  }

  var sel = document.querySelector(".sort-select");
  if (sel) sel.addEventListener("change", updateList);

  var btn = document.querySelector(".sidebar .btn-primary");
  if (btn) btn.addEventListener("click", updateList);

  updateList();
});
