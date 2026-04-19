// script.js - Handles logic for NN Lotus Hi-Tech

// Store current selection for booking
function initiateBooking(type, name, price) {
    const bookingDetails = {
        type: type,
        name: name,
        price: price
    };
    
    // Save to localStorage for the booking page to read
    localStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
    
    // Redirect to booking page
    window.location.href = 'booking.html';
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            // Simple toggle for demo purposes
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(2, 6, 23, 0.95)';
                navLinks.style.padding = '2rem';
            }
        });
    }

    // Load active booking on checkout page if exists
    if (window.location.pathname.includes('booking.html')) {
        loadBookingDetails();
    }
    
    // Load admin panel dashboard if on admin page
    if (window.location.pathname.includes('admin.html')) {
        loadAdminDashboard();
    }
});

function loadBookingDetails() {
    const bookingElement = document.getElementById('selected-booking');
    const bookingStr = localStorage.getItem('currentBooking');
    
    if (bookingStr && bookingElement) {
        const booking = JSON.parse(bookingStr);
        document.getElementById('booking-type').textContent = booking.type;
        document.getElementById('booking-name').textContent = booking.name;
        document.getElementById('booking-price').textContent = '₹' + parseInt(booking.price).toLocaleString('en-IN');
        document.getElementById('total-amount').textContent = '₹' + parseInt(booking.price).toLocaleString('en-IN');
        
        // Save price in a hidden field for form submission
        document.getElementById('hidden-price').value = booking.price;
        document.getElementById('hidden-type').value = booking.type;
        document.getElementById('hidden-name').value = booking.name;
    } else if (bookingElement) {
        bookingElement.innerHTML = '<p class="text-muted">No specific service selected. Please fill out details below for generic inquiry.</p>';
    }
}

// Process Checkout Form
function processPayment(event) {
    event.preventDefault();
    
    const form = document.getElementById('checkout-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Animate button
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Securely...';
    submitBtn.disabled = true;
    
    // Simulate Network Request
    setTimeout(() => {
        const orderData = {
            id: 'ORD-' + Math.floor(Math.random() * 90000) + 10000,
            date: new Date().toLocaleString(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            serviceType: document.getElementById('hidden-type').value || 'Custom Service',
            serviceName: document.getElementById('hidden-name').value || 'Custom Inquiry',
            amount: document.getElementById('hidden-price').value || 0,
            status: 'Paid'
        };

        // Get existing orders
        let orders = JSON.parse(localStorage.getItem('nnOrders')) || [];
        orders.push(orderData);
        localStorage.setItem('nnOrders', JSON.stringify(orders));
        localStorage.removeItem('currentBooking');

        // Show Success
        document.getElementById('checkout-form-container').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('order-id-display').textContent = orderData.id;
        
    }, 2000);
}

// Admin Panel Logic
function loadAdminDashboard() {
    const ordersBody = document.getElementById('orders-body');
    if (!ordersBody) return;
    
    let orders = JSON.parse(localStorage.getItem('nnOrders')) || [];
    
    if (orders.length === 0) {
        ordersBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No bookings found yet.</td></tr>';
        return;
    }
    
    // Sort by date newest
    orders.reverse();
    
    let html = '';
    let totalRevenue = 0;
    
    orders.forEach(order => {
        totalRevenue += parseInt(order.amount);
        html += `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.date}</td>
                <td>${order.name}<br><small style="color:var(--text-muted)">${order.phone}</small></td>
                <td><span class="badge ${order.serviceType === 'Course' ? 'blue' : 'pink'}">${order.serviceType}</span> - ${order.serviceName}</td>
                <td>₹${parseInt(order.amount).toLocaleString('en-IN')}</td>
                <td><span class="status-paid">Paid</span></td>
            </tr>
        `;
    });
    
    ordersBody.innerHTML = html;
    
    // Update Stats
    document.getElementById('total-revenue').textContent = '₹' + totalRevenue.toLocaleString('en-IN');
    document.getElementById('total-bookings').textContent = orders.length;
}

function clearAdminData() {
    if(confirm("Are you sure you want to clear all bookings? This cannot be undone.")) {
        localStorage.removeItem('nnOrders');
        loadAdminDashboard();
    }
}
