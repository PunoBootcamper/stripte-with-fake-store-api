import { useState } from "react";
import ProductsList from "../components/ProductList";
import Cart from "../components/Cart";
import CartDetail from "../components/CartDetail";
import { useNavigate } from "react-router-dom";
//import { useNavigate } from "react-router-dom";

function Home() {
  const [viewDetail, setViewDetail] = useState(false);
  const navigate = useNavigate();
  const handleViewDetail = () => {
    setViewDetail(true);
  };

  const handleBackToProducts = () => {
    setViewDetail(false);
  };
  return (
    <>
      <div className="app container mx-auto py-8">
        {!viewDetail ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-8">Productos</h1>
            <ProductsList />
            <Cart onViewDetail={handleViewDetail} />
          </>
        ) : (
          <>
            <div className="flex flex-grow space-x-4">
              <button
                onClick={handleBackToProducts}
                className="flex-1 bg-blue-500 text-white py-4 rounded hover:bg-blue-600 mb-4"
              >
                Volver a Productos
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 bg-blue-500 text-white py-4 rounded hover:bg-blue-600 mb-4"
              >
                Pagar
              </button>
            </div>

            <CartDetail />
          </>
        )}
      </div>
    </>
  );
}

export default Home;
