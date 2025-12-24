// === دالة إرسال البريد إليك - بدون تحويل للعميل ===
async function sendAdminEmailNotification(orderData) {
    return new Promise((resolve) => {
        try {
            const subject = `🎯 طلب جديد - ${orderData.orderId} - Twessy Teeth`;
            const body = `
                📋 **طلب جديد من متجر Twessy Teeth**\n\n
                
                🆔 **رقم الطلب:** ${orderData.orderId}\n
                👤 **الاسم:** ${orderData.customer.fullName}\n
                📱 **الهاتف:** ${orderData.customer.phone}\n
                📍 **العنوان:** ${orderData.customer.address}\n
                💳 **طريقة الدفع:** ${getPaymentMethodName(orderData.customer.paymentMethod)}\n
                📅 **التاريخ:** ${orderData.orderDate}\n\n
                
                📦 **المنتجات:**\n
                ${orderData.items.map(item => 
                    `   • ${item.name} - ${item.quantity} × ${formatPrice(item.price)} ﷼ = ${formatPrice(item.total)} ﷼`
                ).join('\n')}\n\n
                
                💰 **المجموع الكلي:** ${formatPrice(orderData.total)} ﷼\n\n
                
                📝 **ملاحظات العميل:** ${orderData.customer.notes || 'لا يوجد'}\n\n
                
                ---\n
                🔗 **مصدر الطلب:** متجر Twessy Teeth الإلكتروني\n
                ⏰ **وقت الاستلام:** ${new Date().toLocaleString('ar-SA')}\n
            `;
            
            // إنشاء رابط mailto
            const mailtoUrl = `mailto:${BACKUP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            console.log('📤 رابط البريد الإلكتروني إليك:', mailtoUrl);
            
            // هنا يمكنك استخدام خدمة إرسال بريد إلكتروني
            // لكن سنستخدم طريقة بسيطة تعمل على جميع المتصفحات
            
            // محاولة إرسال البريد مباشرة (يفتح بريد العميل لكن يمكن إرساله)
            const emailLink = document.createElement('a');
            emailLink.href = mailtoUrl;
            emailLink.target = '_blank';
            document.body.appendChild(emailLink);
            emailLink.click();
            document.body.removeChild(emailLink);
            
            // بديل: استخدام FormSubmit أو خدمة مشابهة
            // يمكنك إضافة كود خدمة البريد هنا
            
            resolve(true);
            
        } catch (error) {
            console.error('❌ خطأ في إرسال البريد:', error);
            // حتى لو فشل إرسال البريد، نكمل العملية
            resolve(false);
        }
    });
}