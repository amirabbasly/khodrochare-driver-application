# راهنمای نصب iOS

راهنما در ورود مرورگر iPhone/iPad به نسخه وب نشان داده می‌شود؛ اندروید و دسکتاپ بدون صفحه نصب وارد جریان قبلی می‌شوند. فایل APK، لینک دانلود یا تشخیص نصب اندروید اضافه نشده است.

`IOSInstallationGate` پیش از SessionProvider و SplashGate قرار دارد؛ تا زمان تعیین محیط، فقط یک زمینه خالی کوتاه نشان داده می‌شود و راهنمای نصب در اجرای نصب‌شده فلش نمی‌زند. `navigator.standalone`، display-modeهای نصب‌شده، پل‌های شناخته‌شده Capacitor/Cordova/React Native و WebView iOS بررسی می‌شوند. برنامه بومی با User-Agent کاملاً شبیه Safari باید `window.__KHODROCHARE_NATIVE_APP__ = true` را در document-start، قبل از اسکریپت‌های وب، تنظیم کند. تشخیص برنامه بومی نامشخص صرفاً از روی User-Agent تضمین‌پذیر نیست.

بازکردن سایت در Safari عادی با اجرای PWA از آیکون صفحه اصلی متفاوت است. Safari API عمومی برای تشخیص قطعی نصب قبلی همین وب‌اپ در یک اجرای دیگر ندارد؛ بنابراین در Safari عادی، حتی پس از نصب قبلی، ممکن است راهنما نمایش داده شود. وجود برنامه در حالت standalone همواره راهنما را کنار می‌زند. از localStorage برای ادعای نصب یا از کلیک کاربر برای ثبت نصب دائمی استفاده نمی‌شود.

«فعلاً ادامه در نسخه وب» فقط راهنما را برای همان نشست مرورگر کنار می‌گذارد. برگشت از پرداخت `/payment/*` و `/hall/payment` نیز از راهنما عبور می‌کند. رویداد `appinstalled` یا تغییر display-mode راهنمای باز را می‌بندد. دکمه ساختگی نصب یا تلاش برای بازکردن خودکار منوی Safari وجود ندارد.

مراحل بر اساس راهنمای Apple است: منوی More، سپس Share، سپس Add to Home Screen و در پایان Add؛ در صورت نمایش Open as Web App روشن بماند. در Safari قدیمی، Share ممکن است مستقیم در نوار ابزار باشد. در Chrome/Firefox iOS، کاربر به بازکردن همان نشانی در Safari راهنمایی می‌شود.

منابع: https://support.apple.com/guide/iphone/iphea86e5236/ios و https://developer.chrome.com/docs/capabilities/get-installed-related-apps

استقرار: فایل‌های هر دو رابط وب باید منتقل و دوباره build شوند. migration یا تغییر بک‌اند لازم نیست. آزمون‌ها در `khodrochare-app/playwright.ios-install.config.ts` با شبیه‌سازی محیط‌های مرورگر اجرا می‌شوند؛ این آزمون‌ها جای بررسی روی آیفون واقعی را نمی‌گیرند.
