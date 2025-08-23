import React from "react";
import ProductList from "./ProductList";
import Navbar from "../components/Navbar";


const Home: React.FC = () => {
  return (
    <>
    <Navbar/>
    <div className="w-full">
  <img src="./b3.jpg" alt="Banner" className="w-full h-66 object-cover" />


      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 mt-3">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Featured Products
        </h2>
        <ProductList />
      </section>
    </div>
    </>
  );
};

export default Home;
