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

    try {
        // Send data to server
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Redirect to WhatsApp after successful save
            const waNumber = "6289669107694";
            const text = `Halo min, saya mau joki tugas.\n\nNama: ${formData.name}\nNo HP: ${formData.phone}\nJenis Tugas: ${formData.taskType}\nCatatan: ${formData.notes}`;
            const encodedText = encodeURIComponent(text);

            window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
            modal.style.display = 'none';
            orderForm.reset();
        } else {
            alert('Gagal menyimpan data. Silakan coba lagi.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi. Pastikan server berjalan.');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
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
