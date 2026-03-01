// Main JavaScript file for Lens Care Application

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.feature-card, .info-card, .formula-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form validation helpers
function validatePrescriptionForm(formData) {
    const errors = [];

    // Validate age
    const age = parseInt(formData.age);
    if (age < 1 || age > 120) {
        errors.push('Age must be between 1 and 120');
    }

    // Validate sphere values
    const sphereValues = [
        parseFloat(formData.od_sph),
        parseFloat(formData.os_sph)
    ];
    
    sphereValues.forEach((val, idx) => {
        if (isNaN(val) || val < -20 || val > 20) {
            errors.push(`Invalid sphere value for ${idx === 0 ? 'OD' : 'OS'}`);
        }
    });

    // Validate cylinder values
    const cylValues = [
        parseFloat(formData.od_cyl),
        parseFloat(formData.os_cyl)
    ];
    
    cylValues.forEach((val, idx) => {
        if (isNaN(val) || val < -10 || val > 10) {
            errors.push(`Invalid cylinder value for ${idx === 0 ? 'OD' : 'OS'}`);
        }
    });

    // Validate axis values
    const axisValues = [
        parseInt(formData.od_axis),
        parseInt(formData.os_axis)
    ];
    
    axisValues.forEach((val, idx) => {
        if (isNaN(val) || val < 0 || val > 180) {
            errors.push(`Axis must be between 0 and 180 for ${idx === 0 ? 'OD' : 'OS'}`);
        }
    });

    return errors;
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#11998e' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validatePrescriptionForm,
        formatDate,
        showNotification
    };
}
