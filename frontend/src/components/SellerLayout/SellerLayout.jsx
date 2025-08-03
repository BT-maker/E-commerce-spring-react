import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SellerHeader from '../SellerHeader/SellerHeader';
import './SellerLayout.css';

const SellerLayout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="seller-layout">
      {/* New Seller Header */}
      <SellerHeader />

      {/* Seller Banner */}
      <div className="seller-banner">
        <div className="banner-content">
          <h1>Mağaza Yönetimi</h1>
          <p>Ürünlerinizi yönetin ve satışlarınızı takip edin</p>
        </div>
      </div>

      <div className="seller-main">
        {/* Main Content */}
        <main className="seller-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout; 