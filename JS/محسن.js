// === نظام النسخ الاحتياطي المحلي ===
function saveOrderToLocalStorage(orderData) {
    try {
        let allOrders = JSON.parse(localStorage.getItem('twessyTeethAllOrders')) || [];
        
        // إضافة معلومات إضافية
        orderData.receivedAt = new Date().toISOString();
        orderData.status = 'new';
        orderData.notificationSent = true;
        orderData.notificationMethod = 'email';
        orderData.store = 'Twessy Teeth';
        
        // إضافة الطلب الجديد
        allOrders.unshift(orderData); // إضافة في البداية
        
        // حفظ في localStorage
        localStorage.setItem('twessyTeethAllOrders', JSON.stringify(allOrders));
        
        // حفظ نسخة احتياطية إضافية
        localStorage.setItem(`twessy_order_${orderData.orderId}`, JSON.stringify(orderData));
        
        console.log('💾 تم حفظ الطلب محلياً:', orderData.orderId);
        console.log('📊 إجمالي الطلبات المحفوظة:', allOrders.length);
        
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في حفظ الطلب محلياً:', error);
        
        // محاولة بديلة
        try {
            sessionStorage.setItem('last_order_backup', JSON.stringify(orderData));
            console.log('🔄 تم حفظ نسخة احتياطية في sessionStorage');
        } catch (e) {
            console.error('❌ فشل جميع محاولات الحفظ');
        }
        
        return false;
    }
}