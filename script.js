/* Global variables */
const modal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close-modal');
const orderForm = document.getElementById('orderForm');

/* Function to open modal - replaces direct WhatsApp redirection */
function redirectToWa(event) {
    if (event) event.preventDefault();
    modal.style.display = 'flex';
}

/* Close modal logic */
closeModal.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

/* Handle Form Submission */
orderForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        taskType: document.getElementById('taskType').value,
        notes: document.getElementById('notes').value
    };

    // Construct WhatsApp URL
    const waNumber = "6289669107694";
    const text = `Halo min, saya mau joki tugas.\n\nNama: ${formData.name}\nNo HP: ${formData.phone}\nJenis Tugas: ${formData.taskType}\nCatatan: ${formData.notes}`;
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

    try {
        // Attempt to save to server (Works locally, fails/ignored on Vercel static)
        // We use a short timeout to not delay the user too long if server is unreachable
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

    } catch (error) {
        // Ignore error (Server not running or Vercel environment)
        console.log('Backend sync skipped or failed, proceeding to WhatsApp...');
    } finally {
        // ALWAYS Redirect to WhatsApp
        window.open(waUrl, '_blank');

        // Cleanup UI
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        modal.style.display = 'none';
        orderForm.reset();
    }
});

// Reveal animations on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Add reveal class to elements we want to animate
    const animatedElements = document.querySelectorAll('.card, .feature-item, .hero-content, .hero-visual');

    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});

// Add css for reveal animation dynamically
const style = document.createElement('style');
style.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    
    .reveal.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
