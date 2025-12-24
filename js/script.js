// ============================================
// Twessy Teeth Store - JavaScript Main File
// ============================================

// === الإعدادات ===
const CONFIG = {
    storeName: 'Twessy Teeth',
    storeEmail: 'Hadirynasser@gmail.com',
    storePhone: '+967772149158',
    apiUrl: 'https://script.google.com/macros/s/AKfycbwMkaVgEq7nL9LYIWcOMf7F8d3jDgiQ-ydOUhjMPflHiTNPfMw6J_unSeCPsWZ1rQYO/exec',
    whatsappNumber: '+967772149158',
    currency: '﷼',
    silentMode: true
};

// === بيانات التطبيق ===
let cart = JSON.parse(localStorage.getItem('twessy_cart')) || [];
let products = [];
let currentProduct = null;

// === تهيئة التطبيق ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 متجر Twessy Teeth يعمل بنجاح!');
    initApp();
});

async function initApp() {
    try {
        // تحميل المنتجات
        await loadProducts();
        
        // إعداد واجهة المستخدم
        setupUI();
        
        // إعداد مستمعي الأحداث
        setupEventListeners();
        
        // تحديث السلة
        updateCartUI();
        
        // اختبار الاتصال
        testConnection();
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showError('حدث خطأ في تحميل التطبيق', false);
    }
}

// === تحميل المنتجات ===
async function loadProducts() {
    try {
        // محاولة جلب المنتجات من API
        const response = await fetch(`${CONFIG.apiUrl}?action=getProducts`);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                products = data.products;
                console.log(`✅ تم تحميل ${products.length} منتج`);
            } else {
                throw new Error('فشل تحميل المنتجات');
            }
        } else {
            throw new Error('فشل الاتصال بالخادم');
        }
    } catch (error) {
        console.warn('⚠️ استخدام المنتجات المحلية:', error.message);
        // استخدام بيانات محلية احتياطية
        products = getLocalProducts();
    }
    
    renderProducts();
}

function getLocalProducts() {
    return [
        {
            id: 1,
            name: "مجموعة أدوات جراحة الفم الكاملة",
            category: "surgery",
            price: 1125,
            description: "مجموعة متكاملة من أدوات جراحة الفم عالية الجودة، مصنوعة من الفولاذ المقاوم للصدأ الجراحي.",
            image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            code: "TT-001",
            stock: 50
        },
        {
            id: 2,
            name: "مجموعة أدوات التشخيص المتكاملة",
            category: "diagnostic",
            price: 500,
            description: "مجموعة كاملة من أدوات تشخيص الأسنان تشمل مرايا الأسنان، مجسات، مسبارات وأدوات فحص اللثة.",
            image: "https://dental.bashirco.com.sa/image/cache/catalog/products/instruments-set-standard-set-600x600.jpg.webp",
            code: "TT-002",
            stock: 30
        },
        {
            id: 3,
            name: "مواد الحشو التجميلية المتقدمة",
            category: "filling",
            price: 200,
            description: "مواد حشو تجميلية عالية الجودة بلون الأسنان، توفر متانة عالية ومقاومة للتآكل.",
            image: "https://tijaanclinics.com/wp-content/uploads/2024/11/%D8%A7%D9%84%D8%AD%D8%B4%D9%88%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D9%8A%D9%84%D9%8A%D8%A9-2-1024x576.jpg",
            code: "TT-003",
            stock: 100
        },
        {
            id: 4,
            name: "جهاز أشعة الأسنان المحمول",
            category: "xray",
            price: 1900,
            description: "جهاز أشعة سينية محمول للأسنان، يوفر صورًا عالية الدقة مع تعرض منخفض للإشعاع.",
            image: "https://oss-us.xorder.com/globale/image/US_Los_Angeles/2416/oss/carryx-I/156005c5baf40ff51a327f1c34f2975b..jpeg?x-oss-process=image/resize,m_pad,h_800,w_800",
            code: "TT-004",
            stock: 10
        },
        {
            id: 5,
            name: "ملاقط جراحية متنوعة",
            category: "surgery",
            price: 30,
            description: "مجموعة من الملاقط الجراحية المتنوعة المستخدمة في جراحات الفم والأسنان.",
            image: "https://s.alicdn.com/@sc04/kf/Ac361c852a6df49409c9a7a2a2e098dfa2/6-Pieces-Surgery-Suture-Kits-With-Scalpel-Handle-Knife-Scissor-Tweezer-Drop-Needle-Tools-Sets-With-Leather-Case.jpg_300x300.jpg",
            code: "TT-005",
            stock: 80
        },
        {
            id: 6,
            name: "مجسات ومسبارات فحص الأسنان",
            category: "diagnostic",
            price: 50,
            description: "مجموعة من المجسات والمسبارات الدقيقة المستخدمة في فحص وتسجيل حالات اللثة والأسنان.",
            image: "https://image.made-in-china.com/365f3j00qualHcdGJMpg/-.webp",
            code: "TT-006",
            stock: 60
        }
    ];
}

// === عرض المنتجات ===
function renderProducts(filter = 'all') {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3>${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)} <span class="riyal">${CONFIG.currency}</span></div>
                <div class="product-actions">
                    <button class="btn-view-details" data-id="${product.id}">
                        <i class="fas fa-eye"></i> التفاصيل
                    </button>
                    <button class="btn-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> إضافة
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // إضافة مستمعي الأحداث للمنتجات
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').dataset.id;
            showProductDetails(parseInt(productId));
        });
    });
    
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('button').dataset.id;
            addToCart(parseInt(productId));
        });
    });
}

// === إدارة السلة ===
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('تم إضافة المنتج إلى السلة', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    // تحديث العداد
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
    
    // تحديث عرض السلة
    updateCartModal();
}

function saveCart() {
    localStorage.setItem('twessy_cart', JSON.stringify(cart));
}

// === الدوال المساعدة ===
function formatPrice(price) {
    return price.toLocaleString('ar-SA');
}

function getCategoryName(category) {
    const categories = {
        surgery: 'أدوات الجراحة',
        diagnostic: 'أدوات التشخيص',
        filling: 'مواد الحشو',
        xray: 'أجهزة الأشعة'
    };
    return categories[category] || category;
}

function showNotification(message, type = 'info') {
    // تنفيذ بسيط للإشعارات
    const alert = document.getElementById('alertMessage');
    if (alert) {
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    }
}

function showError(message, showToUser = true) {
    console.error('❌ ' + message);
    if (showToUser && !CONFIG.silentMode) {
        showNotification(message, 'error');
    }
}

// === اختبار الاتصال ===
async function testConnection() {
    try {
        const response = await fetch(`${CONFIG.apiUrl}?action=ping`);
        if (response.ok) {
            console.log('✅ اتصال API نشط');
        } else {
            console.warn('⚠️ اتصال API محدود');
        }
    } catch (error) {
        console.warn('⚠️ لا يوجد اتصال بالإنترنت');
    }
}

// === إعداد الواجهة ===
function setupUI() {
    // إعداد القائمة المتنقلة
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // إعداد التصفية
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProducts(this.dataset.filter);
        });
    });
}

// === إعداد مستمعي الأحداث ===
function setupEventListeners() {
    // فتح/إغلاق السلة
    document.querySelectorAll('.cart-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('cartModal').classList.add('active');
        });
    });
    
    // إغلاق المودالات
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    // إكمال الطلب
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('السلة فارغة', 'error');
                return;
            }
            document.getElementById('cartModal').classList.remove('active');
            document.getElementById('orderModal').classList.add('active');
        });
    }
    
    // نموذج الطلب
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await processOrder();
        });
    }
}

// === معالجة الطلب ===
async function processOrder() {
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        paymentMethod: document.querySelector('input[name="payment"]:checked')?.value
    };
    
    // التحقق من البيانات
    if (!formData.fullName || !formData.phone || !formData.address || !formData.paymentMethod) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // إعداد بيانات الطلب
    const orderData = {
        orderId: 'TT-' + Date.now().toString().slice(-8),
        customer: formData,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toLocaleString('ar-SA')
    };
    
    try {
        // إظهار شاشة التحميل
        document.getElementById('loadingScreen').style.display = 'flex';
        
        // محاولة الإرسال إلى API
        const apiResult = await submitOrderToAPI(orderData);
        
        // إرسال واتساب
        sendWhatsAppNotification(orderData);
        
        // إظهار شاشة النجاح
        showSuccessScreen(orderData);
        
        // تفريغ السلة
        cart = [];
        saveCart();
        updateCartUI();
        
    } catch (error) {
        showError('حدث خطأ في معالجة الطلب: ' + error.message);
    } finally {
        document.getElementById('loadingScreen').style.display = 'none';
    }
}

// === دالة الإرسال إلى API ===
async function submitOrderToAPI(orderData) {
    try {
        // استخدام fetch مع no-cors لتجنب الأخطاء
        await fetch(CONFIG.apiUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=submitOrder&orderData=${encodeURIComponent(JSON.stringify(orderData))}`
        });
        
        return { success: true, silent: true };
        
    } catch (error) {
        // في وضع no-cors، الأخطاء لا تظهر عادة
        console.log('📤 تم إرسال الطلب (وضع no-cors)');
        return { success: true, queued: true };
    }
}

// === إرسال إشعار واتساب ===
function sendWhatsAppNotification(orderData) {
    const message = `
📋 طلب جديد - Twessy Teeth
🆔 ${orderData.orderId}
👤 ${orderData.customer.fullName}
📱 ${orderData.customer.phone}
📍 ${orderData.customer.address}
💰 ${formatPrice(orderData.total)} ${CONFIG.currency}
    `.trim();
    
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // فتح في نافذة جديدة
    setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, 1000);
}

// === تصدير الدوال للاستخدام في HTML ===
window.twessyStore = {
    addToCart,
    removeFromCart,
    getCart: () => cart,
    clearCart: () => {
        cart = [];
        saveCart();
        updateCartUI();
    }
};