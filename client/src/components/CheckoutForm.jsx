import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../Contexts/Cart";
import axios from "axios";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { total } = useCart();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/create-payment-intent",
        {
          amount: total * 100,
          currency: "usd",
          email,
          name,
        }
      );

      const clientSecret = data.clientSecret;

      // Confirm the PaymentIntent on the client
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email },
        },
      });

      if (error) {
        console.error(error);
        alert(error.message);
      } else {
        alert("Payment successful!");
        elements.getElement(CardElement).clear();
        setEmail("");
        setName("");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Payment failed!");
    }

    setLoading(false);
  };

  return (
    <form
      className="p-6 w-96 bg-white rounded shadow-md"
      onSubmit={handleSubmit}
    >
      <h3 className="text-center text-xl font-bold mb-4">Price: ${total}</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 block w-full border rounded-md shadow-sm"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 block w-full border rounded-md shadow-sm"
          required
        />
      </div>

      <div className="mb-4">
        <CardElement
          className="p-2 border rounded"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex justify-center items-center ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.28.805 4.367 2.146 6.041l1.854-1.75z"
            ></path>
          </svg>
        ) : (
          "Buy"
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
