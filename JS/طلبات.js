// === لوحة تحكم مبسطة للمشتري ===
function createSimpleAdminPanel() {
    // زر سريع في القائمة
    const adminLink = document.createElement('li');
    adminLink.innerHTML = `
        <a href="#adminPanel" id="adminPanelLink" style="color: var(--primary-color);">
            <i class="fas fa-chart-line"></i> الطلبات الواردة
        </a>
    `;
    
    document.querySelector('.nav-menu').appendChild(adminLink);
    
    // لوحة التحكم
    const adminPanelHTML = `
        <div id="adminPanel" style="position: fixed; bottom: 20px; left: 20px; z-index: 1000; display: none;">
            <div style="background: white; width: 350px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden;">
                <div style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 16px;">
                        <i class="fas fa-box"></i> الطلبات الواردة
                    </h3>
                    <button id="closeAdminPanel" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">
                        &times;
                    </button>
                </div>
                
                <div style="padding: 20px; max-height: 400px; overflow-y: auto;">
                    <div id="ordersSummary">
                        <p style="text-align: center; color: var(--gray-color); padding: 20px;">
                            <i class="fas fa-sync fa-spin"></i> جاري تحميل الطلبات...
                        </p>
                    </div>
                </div>
                
                <div style="padding: 15px 20px; background: #f7fafc; border-top: 2px solid #e2e8f0;">
                    <button id="refreshOrdersBtn" class="btn-small" style="width: 100%;">
                        <i class="fas fa-sync-alt"></i> تحديث الطلبات
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', adminPanelHTML);
    
    // إدارة الأحداث
    document.getElementById('adminPanelLink').addEventListener('click', function(e) {
        e.preventDefault();
        const panel = document.getElementById('adminPanel');
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        if (panel.style.display === 'block') {
            loadOrdersSummary();
        }
    });
    
    document.getElementById('closeAdminPanel').addEventListener('click', function() {
        document.getElementById('adminPanel').style.display = 'none';
    });
    
    document.getElementById('refreshOrdersBtn').addEventListener('click', loadOrdersSummary);
}

// دالة تحميل ملخص الطلبات
function loadOrdersSummary() {
    const container = document.getElementById('ordersSummary');
    const orders = JSON.parse(localStorage.getItem('twessyTeethAllOrders')) || [];
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--gray-color);">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; color: #e2e8f0;"></i>
                <p>لا توجد طلبات واردة بعد</p>
            </div>
        `;
        return;
    }
    
    const newOrders = orders.filter(o => !o.status || o.status === 'new').length;
    
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0; color: var(--secondary-color);">إحصائيات</h4>
                <span style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 20px; font-size: 14px;">
                    ${orders.length} طلب
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <div style="background: #ebf8ff; padding: 15px; border-radius: 10px; text-align: center; border: 2px solid var(--primary-color);">
                    <div style="font-size: 24px; font-weight: 800; color: var(--primary-color);">${newOrders}</div>
                    <div style="font-size: 12px; color: var(--gray-color);">طلبات جديدة</div>
                </div>
                <div style="background: #f0fff4; padding: 15px; border-radius: 10px; text-align: center; border: 2px solid var(--success-color);">
                    <div style="font-size: 24px; font-weight: 800; color: var(--success-color);">${orders.length - newOrders}</div>
                    <div style="font-size: 12px; color: var(--gray-color);">طلبات معالجة</div>
                </div>
            </div>
        </div>
        
        <div>
            <h4 style="margin: 0 0 15px 0; color: var(--secondary-color);">آخر 3 طلبات</h4>
            ${orders.slice(0, 3).map(order => `
                <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px; border: 2px solid #e2e8f0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong style="color: var(--primary-color); font-size: 14px;">${order.orderId}</strong>
                        <span style="background: ${order.status === 'new' ? '#ebf8ff' : '#f0fff4'}; color: ${order.status === 'new' ? 'var(--primary-color)' : 'var(--success-color)'}; padding: 3px 8px; border-radius: 20px; font-size: 12px;">
                            ${order.status === 'new' ? '🆕 جديد' : '🔄 معالج'}
                        </span>
                    </div>
                    <div style="font-size: 13px; color: var(--gray-color);">
                        <div><i class="fas fa-user"></i> ${order.customer.fullName}</div>
                        <div><i class="fas fa-phone"></i> ${order.customer.phone}</div>
                        <div><i class="fas fa-money-bill-wave"></i> ${formatPrice(order.total)} ﷼</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}