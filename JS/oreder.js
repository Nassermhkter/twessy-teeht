// === دالة إنشاء صفحة تأكيد مخصصة ===
function createDirectConfirmationPage(orderData) {
    // إخفاء جميع العناصر الأخرى
    document.getElementById('orderModal').classList.remove('active');
    
    // إنشاء صفحة تأكيد جديدة
    const confirmationHTML = `
        <div class="success-screen active" id="directConfirmation">
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <h2>تم استلام طلبك بنجاح!</h2>
                <p>لقد تم تأكيد طلبك مباشرة بدون الحاجة للواتساب. يمكنك متابعة طلبك باستخدام رقم الطلب أدناه.</p>
                
                <div class="order-details" style="background: linear-gradient(135deg, #e6f7ff, #d1ecff);">
                    <h4>تفاصيل الطلب</h4>
                    <p><strong>رقم الطلب:</strong> <span id="orderIdDisplay" style="color: var(--primary-color); font-weight: 800; font-size: 18px;">${orderData.orderId}</span></p>
                    <p><strong>الاسم:</strong> ${orderData.customer.fullName}</p>
                    <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                    <p><strong>المجموع:</strong> ${formatPrice(orderData.total)} ﷼</p>
                    <p><strong>التاريخ:</strong> ${orderData.orderDate}</p>
                    <p><strong>حالة الطلب:</strong> <span style="color: var(--success-color); font-weight: 600;">جاري التحضير</span></p>
                </div>
                
                <div style="margin: 20px 0; padding: 15px; background: #f0fff4; border-radius: 10px; border-right: 4px solid var(--success-color);">
                    <h4 style="color: var(--secondary-color); margin-bottom: 10px;">
                        <i class="fas fa-info-circle"></i> معلومات المتابعة
                    </h4>
                    <p style="margin: 5px 0; color: var(--gray-color); font-size: 14px;">
                        <i class="fas fa-phone"></i> للاستفسار: <strong>+967 772 149 158</strong>
                    </p>
                    <p style="margin: 5px 0; color: var(--gray-color); font-size: 14px;">
                        <i class="fas fa-envelope"></i> البريد: <strong>Hadirynasser@gmail.com</strong>
                    </p>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="saveOrderDetails" class="btn" style="flex: 1;">
                        <i class="fas fa-download"></i> حفظ رقم الطلب
                    </button>
                    <button id="printOrder" class="btn-outline" style="flex: 1;">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                </div>
                
                <button class="back-to-home" style="margin-top: 20px;">
                    <i class="fas fa-home"></i> العودة إلى المتجر
                </button>
                
                <p style="text-align: center; margin-top: 15px; color: var(--gray-color); font-size: 12px;">
                    <i class="fas fa-clock"></i> سيتم الاتصال بك خلال 24 ساعة لتحديد موعد التوصيل
                </p>
            </div>
        </div>
    `;
    
    // إضافة الصفحة الجديدة إلى body
    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    
    // إضافة مستمعي الأحداث للأزرار الجديدة
    document.getElementById('saveOrderDetails').addEventListener('click', function() {
        const orderId = orderData.orderId;
        navigator.clipboard.writeText(orderId).then(() => {
            showAlert('تم نسخ رقم الطلب إلى الحافظة', 'success');
        }).catch(() => {
            // بديل للجوالات القديمة
            const tempInput = document.createElement('input');
            tempInput.value = orderId;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showAlert('تم نسخ رقم الطلب', 'success');
        });
    });
    
    document.getElementById('printOrder').addEventListener('click', function() {
        printOrderConfirmation(orderData);
    });
    
    document.querySelector('#directConfirmation .back-to-home').addEventListener('click', function() {
        document.getElementById('directConfirmation').remove();
        showHomePage();
    });
}

// === دالة طباعة تأكيد الطلب ===
function printOrderConfirmation(orderData) {
    const printContent = `
        <html>
        <head>
            <title>تأكيد الطلب - ${orderData.orderId}</title>
            <style>
                body { font-family: 'Cairo', sans-serif; direction: rtl; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-id { color: #0d9de3; font-size: 24px; font-weight: bold; }
                .details { margin: 20px 0; }
                .details p { margin: 10px 0; }
                .footer { margin-top: 40px; text-align: center; color: #666; font-size: 14px; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Twessy Teeth</h1>
                <h2>تأكيد استلام الطلب</h2>
            </div>
            
            <div class="details">
                <p><strong>رقم الطلب:</strong> <span class="order-id">${orderData.orderId}</span></p>
                <p><strong>الاسم:</strong> ${orderData.customer.fullName}</p>
                <p><strong>الهاتف:</strong> ${orderData.customer.phone}</p>
                <p><strong>العنوان:</strong> ${orderData.customer.address}</p>
                <p><strong>طريقة الدفع:</strong> ${getPaymentMethodName(orderData.customer.paymentMethod)}</p>
                <p><strong>تاريخ الطلب:</strong> ${orderData.orderDate}</p>
                
                <h3>المنتجات:</h3>
                ${orderData.items.map(item => `
                    <p>${item.name} - ${item.quantity} × ${formatPrice(item.price)} ﷼ = ${formatPrice(item.total)} ﷼</p>
                `).join('')}
                
                <h3>المجموع الكلي: ${formatPrice(orderData.total)} ﷼</h3>
            </div>
            
            <div class="footer">
                <p>شكراً لثقتك بمتجر Twessy Teeth</p>
                <p>للاستفسار: +967 772 149 158</p>
                <p>البريد: Hadirynasser@gmail.com</p>
                <p>تاريخ الطباعة: ${new Date().toLocaleString('ar-SA')}</p>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// === تعديل دالة submitOrder ===
async function submitOrder(orderData) {
    const originalBtnText = showLoading('جاري إرسال الطلب...');
    const confirmationMethod = document.querySelector('input[name="confirmation"]:checked').value;
    
    try {
        // محاولة الإرسال إلى جوجل شيت
        try {
            const result = await submitOrderToGoogleSheet(orderData);
            console.log('✅ تم إرسال الطلب إلى جوجل شيت:', result);
            showAlert('📤 تم إرسال الطلب بنجاح', 'success', 3000);
        } catch (error) {
            console.warn('⚠️ فشل الاتصال بالسيرفر، جاري حفظ الطلب محلياً...');
            showAlert('⚠️ تم حفظ الطلب محلياً', 'warning', 3000);
        }
        
        // حفظ الطلب محلياً
        saveOrderToLocalStorage(orderData);
        
        // تحديد طريقة التأكيد
        if (confirmationMethod === 'whatsapp') {
            // الطريقة القديمة (مع واتساب)
            showSuccessScreen(orderData);
        } else {
            // الطريقة الجديدة (بدون واتساب)
            createDirectConfirmationPage(orderData);
        }
        
        // تفريغ السلة بعد إرسال الطلب
        cart = [];
        saveCartToStorage();
        updateCartCount();
        
    } catch (error) {
        console.error('❌ خطأ في معالجة الطلب:', error);
        showAlert('⚠️ حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى', 'error');
    } finally {
        hideLoading(originalBtnText);
    }
}

// === دالة حفظ الطلب محلياً مع تحديث ===
function saveOrderToLocalStorage(orderData) {
    try {
        let allOrders = JSON.parse(localStorage.getItem('twessyTeethAllOrders')) || [];
        
        // إضافة معلومات إضافية
        orderData.localSaved = true;
        orderData.localSavedAt = new Date().toISOString();
        orderData.confirmationMethod = document.querySelector('input[name="confirmation"]:checked').value;
        orderData.googleSheetSent = false;
        
        allOrders.push(orderData);
        localStorage.setItem('twessyTeethAllOrders', JSON.stringify(allOrders));
        
        // إرسال إشعار بالبريد الإلكتروني
        sendEmailNotification(orderData);
        
        console.log('💾 تم حفظ الطلب محلياً:', orderData.orderId);
        return true;
    } catch (error) {
        console.error('❌ خطأ في حفظ الطلب محلياً:', error);
        return false;
    }
}