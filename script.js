// Toggle Dropdown Menu (Handled by Bootstrap, but if you prefer manual control, uncomment the code below)
// document.getElementById('home-btn').addEventListener('click', function (e) {
//     e.preventDefault();
//     const dropdown = document.getElementById('dropdown-menu');
//     dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
// });

// Close Dropdown When Clicking Outside (Bootstrap handles it automatically, but if you want custom behavior, use this)
window.addEventListener('click', function (e) {
  const dropdown = document.getElementById('home-btn');
  const menu = document.querySelector('.dropdown-menu');
  if (!dropdown.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('show');  // Hides the dropdown when clicking outside
  }
});

// Purchase Button Logic
document.querySelectorAll('.purchase-btn').forEach(button => {
  button.addEventListener('click', function () {
    const course = this.getAttribute('data-course');
    alert(`You are  purchasing the course: ${course}`);
    // You can integrate with a backend payment system here
  });
});
// Initialize Stripe and Elements
const stripe = Stripe('your-publishable-key'); // Replace with your own Stripe public key
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element'); // Mount the card element on the page

// Show modal when Purchase button is clicked
document.querySelectorAll('.purchase-btn').forEach(button => {
  button.addEventListener('click', function () {
    const course = this.getAttribute('data-course');
    const coursePrice = this.parentElement.querySelector('.price').textContent;

    // Show course name in the modal
    document.getElementById('course-name').textContent = `Course: ${course} - Price: ${coursePrice}`;

    // Open the payment modal
    new bootstrap.Modal(document.getElementById('purchase-form')).show();
  });
});

// Handle Payment Form Submission
const paymentForm = document.getElementById('payment-form');
paymentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitButton = document.getElementById('submit-btn');
  submitButton.disabled = true;  // Disable the button while the payment is processing

  const {token, error} = await stripe.createToken(card);

  if (error) {
    document.getElementById('error-message').textContent = error.message; // Show error message
    submitButton.disabled = false;  // Re-enable the button
  } else {
    // Send the token to your server to process payment (backend integration)
    processPayment(token);
  }
});

// Process payment with token received from Stripe
async function processPayment(token) {
  try {
    // Send token to backend for processing (replace with your server API URL)
    const response = await fetch('/create-charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token: token.id}),
    });

    const result = await response.json();

    if (result.success) {
      alert('Payment successful!');
      // Redirect to a success page or show success message
    } else {
      alert('Payment failed!');
    }
  } catch (error) {
    console.error('Payment error: ', error);
    alert('Something went wrong. Please try again later.');
  }
}
// Add review functionality for each course
function addReview(courseId) {
  const reviewInput = document.getElementById(`${courseId}-review`);
  const reviewText = reviewInput.value.trim();
  
  if (reviewText) {
    const reviewList = document.getElementById(`${courseId}-reviews`);
    const newReview = document.createElement('li');
    newReview.textContent = reviewText;
    reviewList.appendChild(newReview);
    reviewInput.value = '';  // Clear the input field
  }
}

// Toggle Dropdown Menu
document.getElementById('home-btn').addEventListener('click', function (e) {
  e.preventDefault();
  const dropdown = document.getElementById('dropdown-menu');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close Dropdown When Clicking Outside
window.addEventListener('click', function (e) {
  const dropdown = document.getElementById('dropdown-menu');
  if (!e.target.matches('#home-btn')) {
    dropdown.style.display = 'none';
  }
});


