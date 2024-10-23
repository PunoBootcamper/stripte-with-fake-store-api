import { useCart } from "../Contexts/Cart";

const CartDetail = () => {
  const { cartItems, total } = useCart();

  return (
    <div className="cart-detail container mx-auto py-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Detalle del Carro de Compras</h2>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((product) => (
            <div
              key={product.id}
              className="cart-item flex justify-between items-center mb-2"
            >
              <span className="text-lg font-semibold">{product.title}</span>
              <span className="text-lg font-semibold">${product.price}</span>
            </div>
          ))}
          <div className="cart-total mt-4 text-xl font-bold">
            Total: ${total.toFixed(2)}
          </div>
        </>
      ) : (
        <p className="text-lg">No hay productos en el carrito.</p>
      )}
    </div>
  );
};

export default CartDetail;
