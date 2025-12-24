// === نظام إشعارات تلقائي إليك ===
function setupAutomaticNotifications() {
    // يمكن إضافة هنا:
    // 1. إشعارات SMS
    // 2. إشعارات Telegram
    // 3. إشعارات WhatsApp إليك (ليس للعميل)
}

// دالة إرسال إشعار واتساب إليك (ليس للعميل)
function sendWhatsAppNotificationToAdmin(orderData) {
    const adminPhone = '967772149158'; // رقمك
    const message = encodeURIComponent(
        `📋 طلب جديد في متجرك!\n\n` +
        `🆔 الرقم: ${orderData.orderId}\n` +
        `👤 العميل: ${orderData.customer.fullName}\n` +
        `📱 الهاتف: ${orderData.customer.phone}\n` +
        `💰 المجموع: ${formatPrice(orderData.total)} ﷼\n` +
        `⏰ الوقت: ${new Date().toLocaleTimeString('ar-SA')}\n\n` +
        `🔗 رابط الطلب: ${window.location.href}`
    );
    
    // هذا الرابط يفتح واتساب لك أنت، ليس للعميل
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
    
    // فتح في خلفية جديدة
    const newWindow = window.open(whatsappUrl, '_blank');
    if (newWindow) {
        setTimeout(() => {
            newWindow.close(); // إغلاق النافذة بعد ثانية
        }, 1000);
    }
    
    return whatsappUrl;
}