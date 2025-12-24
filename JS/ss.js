// في دالة submitOrder - استبدلها بهذا:
async function submitOrder(orderData) {
    const originalBtnText = showLoading('جاري إرسال الطلب...');
    
    try {
        showAlert('🔄 جاري معالجة طلبك...', 'info', 3000);
        
        // 1. أولاً: حفظ الطلب محلياً (مضمون العمل)
        saveOrderToLocalStorage(orderData);
        
        // 2. ثانياً: إرسال البريد الإلكتروني إليك (إجباري)
        const emailSent = await sendAdminEmailNotification(orderData);
        
        if (emailSent) {
            console.log('✅ تم إرسال البريد الإلكتروني إليك بنجاح');
        }
        
        // 3. ثالثاً: محاولة حفظ في جوجل شيت (اختياري)
        try {
            await submitOrderToGoogleSheet(orderData);
            console.log('✅ تم حفظ الطلب في جوجل شيت');
        } catch (error) {
            console.warn('⚠️ فشل حفظ في جوجل شيت، لكن الطلب محفوظ محلياً');
        }
        
        // 4. أخيراً: إظهار تأكيد للعميل (بدون واتساب)
        showDirectConfirmationPage(orderData);
        
        // 5. تفريغ السلة
        cart = [];
        saveCartToStorage();
        updateCartCount();
        
        showAlert('✅ تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.', 'success', 5000);
        
    } catch (error) {
        console.error('❌ خطأ في معالجة الطلب:', error);
        showAlert('⚠️ حدث خطأ في النظام، لكن الطلب تم حفظه محلياً', 'warning');
        // حتى لو حدث خطأ، نعرض تأكيد للعميل
        showDirectConfirmationPage(orderData);
    } finally {
        hideLoading(originalBtnText);
    }
}