import { PropTypes } from "prop-types";
import { useCart } from "../Contexts/Cart";

const Cart = ({ onViewDetail }) => {
  const { cartItems, total } = useCart();

  return (
    <div className="cart fixed bottom-4 right-4 w-80 p-4 bg-gray-100 rounded shadow-md flex items-center justify-between">
      <div>
        <p className="text-lg font-semibold">Items: {cartItems.length}</p>
        <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
      </div>
      <button
        onClick={onViewDetail}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Ver Detalle
      </button>
    </div>
  );
};

Cart.propTypes = {
  onViewDetail: PropTypes.func,
};

export default Cart;
