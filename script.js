const API_URL = "https://vinpropel-backend.onrender.com";
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Reveal Animations on Scroll
    const reveals = document.querySelectorAll('[data-reveal]');
    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;
        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < triggerBottom) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 4. Form Submission Handling with Simulation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');

            // Animation for submission
            submitBtn.disabled = true;
            submitBtn.innerText = "Transmitting to Engineering Hub...";
            submitBtn.style.opacity = "0.7";

            // LocalStorage Simulation (matches internal admin security key)
            const storageKey = '_vp_data_sys_';
            const formData = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: '+91 (Inquiry)', // Default or add field
                product: 'VT-M005UA', // Primary focus
                payload: 'N/A', // Technical meta
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            // Retrieve and append to global data store (obfuscated)
            let rawData = localStorage.getItem(storageKey);
            let requests = [];
            if (rawData) {
                try {
                    requests = JSON.parse(atob(rawData));
                } catch (e) { requests = []; }
            }
            requests.push(formData);
            localStorage.setItem(storageKey, btoa(JSON.stringify(requests)));

            setTimeout(() => {
                window.location.href = 'request-sent.html';
            }, 1200);
        });
    }

    // 5. Hero Product Parallax Effect
    const heroImg = document.querySelector('.product-main-img');
    if (heroImg) {
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            heroImg.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
        });
    }
});
function adjustScreen() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    console.log("Width:", width);
    console.log("Height:", height);

    document.documentElement.style.setProperty(
        "--screen-width",
        width + "px"
    );
}

adjustScreen();

window.addEventListener("resize", adjustScreen);
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {

    link.addEventListener('click', function(e){

        e.preventDefault();

        const target =
            document.querySelector(this.getAttribute('href'));

        const navbar =
            document.querySelector('.navbar');

        const position =
            target.offsetTop - navbar.offsetHeight - 20;

        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });

    });

});
async function loadProducts() {

    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();

    const container = document.getElementById("productsContainer");

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `

        <div class="lineup-card">

            <img
                src="${API_URL}/uploads/${product.image}"
                alt="${product.product_name}">

            <h3>${product.product_name}</h3>

            <p style="color: var(--text-muted); font-size:0.95rem; margin-bottom:2rem;">
                ${product.description || ""}
            </p>

            <div class="spec-mini"
                style="width:100%;display:flex;justify-content:space-between;padding:1.5rem 0;border-top:1px solid #f1f5f9;">

                <div>

                    <span style="display:block;font-size:12px;">Voltage</span>

                    <strong>${product.rated_voltage || "-"}</strong>

                </div>

                <div>

                    <span style="display:block;font-size:12px;">Power</span>

                    <strong>${product.rated_power || "-"}</strong>

                </div>

            </div>

            <a
                href="product.html?id=${product.id}"
                class="btn btn-secondary"
                style="width:100%;margin-top:15px;">

                View Product

            </a>

        </div>

        `;

    });

}

loadProducts();
