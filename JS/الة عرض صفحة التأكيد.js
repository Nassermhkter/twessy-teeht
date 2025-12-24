// === دالة عرض صفحة التأكيد للعميل ===
function showDirectConfirmationPage(orderData) {
    // إخفاء جميع النماذج الأخرى
    document.getElementById('orderModal').classList.remove('active');
    document.getElementById('successScreen').classList.remove('active');
    
    // تحديث بيانات صفحة التأكيد
    document.getElementById('confirmationOrderId').textContent = orderData.orderId;
    document.getElementById('confirmationName').textContent = orderData.customer.fullName;
    document.getElementById('confirmationPhone').textContent = orderData.customer.phone;
    document.getElementById('confirmationTotal').textContent = `${formatPrice(orderData.total)} ﷼`;
    
    // إظهار صفحة التأكيد
    document.getElementById('directConfirmationPage').classList.add('active');
    
    // إضافة مستمعي الأحداث
    document.getElementById('printConfirmationBtn').addEventListener('click', function() {
        printOrderConfirmation(orderData);
    });
    
    document.getElementById('saveConfirmationBtn').addEventListener('click', function() {
        navigator.clipboard.writeText(orderData.orderId).then(() => {
            showAlert('تم نسخ رقم الطلب إلى الحافظة', 'success');
        });
    });
    
    document.getElementById('backToHomeFromConfirmation').addEventListener('click', function() {
        document.getElementById('directConfirmationPage').classList.remove('active');
        showHomePage();
    });
    
    // إرسال إشعار إليك بعد 2 ثانية
    setTimeout(() => {
        sendWhatsAppNotificationToAdmin(orderData);
    }, 2000);
}