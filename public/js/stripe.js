/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51OkBi8IQxFBik99hIYqBigXFJ17t5xDnJaG9tMgeM4b8yg664HmAjO0YImaB9WxojuX03ACi9ALmbnKL3lDkHBNc00Q0uIx29S',
    );

    // 1) get checkout session from api
    const session = await axios({
      url: `http://127.0.0.1:3000/api/v1/bookings/getCheckoutSession/${tourId}`,
    });

    // 2) create checkout form & charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
