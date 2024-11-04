import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal } from 'antd';
import DropIn from "braintree-web-drop-in-react";
import Cookies from "js-cookie";
import UserContext from './UserContext'; 
import './styles.css';  // Importez votre fichier de styles CSS

const PaymentModal = ({ visible, onCancel, onPaymentSuccess, amount }) => {
  const { user } = useContext(UserContext);  // Récupération de l'utilisateur via le contexte
  const [data, setData] = useState({
    braintreeToken: null,
    error: null,
  });

  const instanceRef = useRef(null);
  const userId = user._id;
  const token = Cookies.get('token');

  useEffect(() => {
    const getBraintreeToken = async (userId, token) => {
      try {
        const res = await fetch(`http://localhost:7000/api/braintree/getToken/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const result = await res.json();
        setData({ ...data, braintreeToken: result.token });
      } catch (err) {
        setData({ ...data, error: err.message });
      }
    };

    getBraintreeToken(userId, token);
  }, [userId, token]);

  const buy = async () => {
    if (instanceRef.current) {
      try {
        const { nonce } = await instanceRef.current.requestPaymentMethod();
        const response = await fetch(`http://localhost:7000/api/braintree/purchase/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentMethodNonce: nonce,
            amount: amount,  // Utilisez le montant passé en prop
          }),
        });

        const result = await response.json();
        if (result.success) {
          console.log("Transaction successful:", result.transaction);
          onPaymentSuccess(); // Appel de la fonction de succès du paiement
        } else {
          console.error("Transaction failed:", result.error);
        }
      } catch (err) {
        console.error("Payment error:", err);
      }
    }
  };

  if (!data.braintreeToken) {
    return (
      <div className="loading-container">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={buy}
      title="Secure Payment"
      className="payment-modal"
    >
      <div className="dropin-wrapper">
        <DropIn
          options={{ 
            authorization: data.braintreeToken,
            paypal: {
              flow: "vault",
            },
          }}
          onInstance={(instance) => (instanceRef.current = instance)}
        />
      </div>
      <div className="amount-container">
        <h3>Total Amount:</h3>
        <p>{amount} Dhs</p> {/* Affichage du montant */}
      </div>
      {data.error && <p className="error-message">{data.error}</p>}
    </Modal>
  );
};

export default PaymentModal;
