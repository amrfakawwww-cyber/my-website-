/* ==========================================================================
   مطعم الأصالة — script.js
   ------------------------------------------------------------------------
   الفهرس:
     1. القائمة على الموبايل (Hamburger Menu)
     2. سكرول ناعم + تفعيل الرابط النشط (Smooth Scroll + Active Link)
     3. تكبير صور المعرض (Lightbox)
     4. فورم الحجز (Booking Form Validation)
   ========================================================================== */
 
/*
  DOMContentLoaded: حدث (event) بيحصل لما المتصفح يخلّص تحميل كل عناصر
  الـ HTML. بنحط كل الكود بتاعنا جواه عشان نتأكد إن العناصر اللي
  بنبحث عنها (زي الأزرار والفورم) تكون موجودة فعلاً قبل ما نتعامل معاها.
*/
document.addEventListener("DOMContentLoaded", function () {
 
    /* ======================================================================
       1. القائمة على الموبايل (Hamburger Menu)
       ------------------------------------------------------------------
       document.querySelector("#id") => بيدور على عنصر واحد بالـ id بتاعه.
       classList.toggle("show") => لو الكلاس مش موجود يضيفه، ولو موجود يشيله.
       بكده كل ضغطة بتفتح/تقفل القائمة.
       ====================================================================== */
    const menuToggle = document.querySelector("#menuToggle");
    const navMenu = document.querySelector("#navMenu");
 
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("show");
    });
 
 
    /* ======================================================================
       2. سكرول ناعم + تفعيل الرابط النشط
       ------------------------------------------------------------------
       أ) لما تدوس على رابط في القائمة، بدل ما الصفحة "تقفز" للقسم،
          بنخليها تتحرك بسلاسة (scrollIntoView with smooth).
       ب) وإحنا بنسكرول، بنراقب مكاننا في الصفحة ونحط كلاس "active"
          على الرابط بتاع القسم اللي احنا واقفين فيه.
       ====================================================================== */
    const navLinks = document.querySelectorAll(".nav a");
    const sections = document.querySelectorAll("section[id]");
 
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");   // مثال: "#menu"
            const targetSection = document.querySelector(targetId);
 
            if (targetSection) {
                event.preventDefault(); // بيمنع القفزة المفاجئة الافتراضية
                targetSection.scrollIntoView({ behavior: "smooth" });
                navMenu.classList.remove("show"); // قفل القائمة بعد الاختيار (موبايل)
            }
        });
    });
 
    function highlightActiveLink() {
        let currentId = "";
 
        sections.forEach(function (section) {
            // offsetTop = المسافة من أول الصفحة لبداية القسم ده
            const sectionTop = section.offsetTop - 90; // 90 = ارتفاع الهيدر تقريبًا
            if (window.scrollY >= sectionTop) {
                currentId = section.getAttribute("id");
            }
        });
 
        navLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + currentId) {
                link.classList.add("active");
            }
        });
    }
 
    window.addEventListener("scroll", highlightActiveLink);
    highlightActiveLink(); // نشغلها مرة واحدة عند فتح الصفحة
 
 
    /* ======================================================================
       3. تكبير صور المعرض (Lightbox)
       ------------------------------------------------------------------
       لما تدوس على أي صورة في المعرض، بناخد الرابط بتاعها (src)
       ونحطه جوه صورة النافذة الكبيرة، وبعدين نظهر النافذة.
       ====================================================================== */
    const galleryImages = document.querySelectorAll(".gallery-img");
    const lightbox = document.querySelector("#lightbox");
    const lightboxImg = document.querySelector("#lightboxImg");
    const lightboxClose = document.querySelector("#lightboxClose");
 
    galleryImages.forEach(function (image) {
        image.addEventListener("click", function () {
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
            lightbox.classList.add("show");
        });
    });
 
    function closeLightbox() {
        lightbox.classList.remove("show");
    }
 
    lightboxClose.addEventListener("click", closeLightbox);
 
    // نقفل النافذة كمان لو دُس في أي مكان فاضي حواليها (مش على الصورة نفسها)
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
 
 
    /* ======================================================================
       4. فورم الحجز (Booking Form Validation)
       ------------------------------------------------------------------
       submit: الحدث اللي بيحصل لما تدوس "تأكيد الحجز".
       بنمنع الإرسال الافتراضي (لأن مفيش سيرفر حاليًا يستقبل البيانات)
       ونتحقق إن كل حقل مطلوب متملي صح، وبعدين نظهر رسالة مناسبة.
       ====================================================================== */
    const bookingForm = document.querySelector("#bookingForm");
    const bookingFeedback = document.querySelector("#bookingFeedback");
 
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault(); // بيوقف إرسال الفورم الفعلي لصفحة تانية
 
        const name = document.querySelector("#bookingName").value.trim();
        const phone = document.querySelector("#bookingPhone").value.trim();
        const date = document.querySelector("#bookingDate").value;
        const time = document.querySelector("#bookingTime").value;
        const guests = document.querySelector("#bookingGuests").value;
 
        // نتأكد إن رقم التليفون أرقام بس (مصري: يبدأ بـ 01 وطوله 11 رقم)
        const phonePattern = /^01[0-9]{9}$/;
 
        if (name === "") {
            showFeedback("من فضلك اكتب اسمك", "error");
        } else if (!phonePattern.test(phone)) {
            showFeedback("من فضلك اكتب رقم تليفون صحيح (01xxxxxxxxx)", "error");
        } else if (date === "" || time === "") {
            showFeedback("من فضلك اختار التاريخ والوقت", "error");
        } else if (guests === "" || guests < 1) {
            showFeedback("من فضلك اكتب عدد الأفراد", "error");
        } else {
            showFeedback("تم استلام حجزك! هنتواصل معاك على " + phone + " للتأكيد", "success");
            bookingForm.reset(); // بيفضّي كل حقول الفورم بعد النجاح
        }
    });
 
    function showFeedback(message, type) {
        bookingFeedback.textContent = message;
        bookingFeedback.className = "form-feedback " + type; // error أو success
    }
 
});