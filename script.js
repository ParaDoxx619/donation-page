// Set up Stripe.js and Elements

const stripe = Stripe('ENTER_YOUR_PUBLISHER_KEY_HERE');

const elements = stripe.elements();

const cardElement = elements.create('card');

// Mount card element to the DOM

cardElement.mount('#card-element');

// Handle form submission

const form = document.querySelector('#payment-form');

form.addEventListener('submit', async (event) => {

  event.preventDefault();

  // Disable submit button to prevent multiple submissions

  const submitButton = form.querySelector('#submit');

  submitButton.disabled = true;

  // Collect customer information

  const name = form.querySelector('#name').value;

  const email = form.querySelector('#email').value;

  // Create a payment method using the card element

  const { paymentMethod, error } = await stripe.createPaymentMethod({

    type: 'card',

    card: cardElement,

    billing_details: {

      name,

      email,

    },

  });

  // Handle payment method creation errors

  if (error) {

    const errorElement = form.querySelector('#card-errors');

    errorElement.textContent = error.message;

    submitButton.disabled = false;

    return;

  }

  // Send the payment method ID to your server to create a charge

  const { id } = paymentMethod;

  const response = await fetch('/charge', {

    method: 'POST',

    headers: {

      'Content-Type': 'application/json',

    },

    body: JSON.stringify({ id }),

  });

  // Handle charge creation errors

  if (!response.ok) {

    const errorElement = form.querySelector('#card-errors');

    errorElement.textContent = 'An error occurred while processing your payment. Please try again later.';

    submitButton.disabled = false;

    return;

  }

  // Display a success message to the customer

  const successElement = form.querySelector('#card-errors');

  successElement.textContent = 'Thank you for your donation!';

  // Reset the form and re-enable the submit button

  form.reset();

  submitButton.disabled = false;

});

