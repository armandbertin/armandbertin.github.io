// JavaScript to handle the form submission
function openCheckout() {
    document.getElementById('checkoutModal').style.display = 'block';
  }

function closeCheckout() {
document.getElementById('checkoutModal').style.display = 'none';
document.getElementById('orderStatus').className = 'hidden text-center p-4';
}

async function handleSubmit(event) {
event.preventDefault();

const form = event.target;
const statusDiv = document.getElementById('orderStatus');
const submitButton = form.querySelector('button[type="submit"]');

// Disable the submit button and show loading state
submitButton.disabled = true;
submitButton.textContent = 'Processing...';

// Prepare the form data
const formData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    address: form.address.value,
    timestamp: new Date().toISOString()
    };

    try {
    // Replace this URL with your Google Apps Script web app URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwwDgr4l_6Y6ZZzLhWIKFfdLzQq_laxp_KEbP4NF9C4lpTpTvsnUe_rv-0N3s1KP-4b2Q/exec';
    
    // Create a URL-encoded string of parameters
    const queryString = Object.keys(formData)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`)
        .join('&');
    
    // Append parameters to URL
    const fullUrl = `${scriptUrl}?${queryString}`;
    
    // Make request using JSONP approach
    const response = await new Promise((resolve, reject) => {
        // Create a temporary callback function
        const callbackName = 'callback_' + Math.random().toString(36).substr(2, 9);
        window[callbackName] = function(response) {
        delete window[callbackName];
        document.head.removeChild(script);
        resolve(response);
        };
        
        // Create script element
        const script = document.createElement('script');
        script.src = `${fullUrl}&callback=${callbackName}`;
        script.onerror = () => {
        delete window[callbackName];
        document.head.removeChild(script);
        reject(new Error('Script loading failed'));
        };
        
        document.head.appendChild(script);
    });

    statusDiv.textContent = 'Order placed successfully! Thank you.';
    statusDiv.className = 'text-center p-4 success';
    form.reset();
    /*setTimeout(closeCheckout, 3000);*/
    
    } catch (error) {
    console.error('Submission error:', error);
    statusDiv.textContent = 'Error submitting order. Please try again.';
    statusDiv.className = 'text-center p-4 error';
    } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Place Order';
    statusDiv.classList.remove('hidden');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
const modal = document.getElementById('checkoutModal');
if (event.target === modal) {
    closeCheckout();
}
}