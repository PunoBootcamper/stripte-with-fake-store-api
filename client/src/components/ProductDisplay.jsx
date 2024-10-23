import { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useCart } from "../Contexts/Cart";

const ProductDisplay = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [time, setTime] = useState(Math.floor(Math.random() * 10 * 60) + 1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (time > 0) {
        setTime((prevTime) => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const isSelected = cartItems.some((item) => item.id === product.id);

  return (
    <div
      className={`product bg-white rounded-lg shadow-md p-4 flex flex-col items-center ${
        isSelected ? "border-2 border-blue-500" : ""
      }`}
    >
      <img
        className="product__image w-32 h-32 object-contain mb-4"
        src={product.image}
        alt={product.title}
      />
      <h2 className="product__title text-lg font-bold text-center mb-2">
        {product.title}
      </h2>
      <p className="product__price text-xl font-semibold text-gray-800 mb-4">
        ${product.price}
      </p>
      <div className="product__actions w-full flex flex-col items-center">
        <div className="product__counter text-gray-600 mb-2">
          Tiempo: <span>{formatTime(time)}</span>
        </div>
        <button
          className="product__button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={time <= 0 || isSelected}
          onClick={() => addToCart(product)}
        >
          {isSelected ? "Seleccionado" : "Comprar"}
        </button>
      </div>
    </div>
  );
};

ProductDisplay.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    image: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
};

export default ProductDisplay;
