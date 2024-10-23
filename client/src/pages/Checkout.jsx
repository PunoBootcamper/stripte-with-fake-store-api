import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51QCsioFATKHVheGCd5tUZFYVvnB8d9erDkFx6FJay2SRS2bUMk8Yrk36EpFvSIZQ2d0qEQ7AjU7Pwc16kKgPY6be00qzcXwat5"
);

function App() {
  return (
    <>
      <Elements stripe={stripePromise}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <CheckoutForm />
        </div>
      </Elements>
    </>
  );
}

export default App;
