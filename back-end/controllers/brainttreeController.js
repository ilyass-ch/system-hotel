const braintree = require("braintree");

require('dotenv').config

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId:process.env.BRAINTREE_MERCHEND_ID,
  publicKey:process.env.BRAINTREE_PUBLIC_KEY ,
  privateKey:process.env.BRAINTREE_PRIVATE_KEY 
});


exports.generateToken = (req, res)=>{  
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      console.error("Error generating client token:", err);
      return res.status(500).json({ error: "Failed to generate client token" });
    }
    res.json({token: response.clientToken});
  });
}

// Process payment
exports.processPayment = (req, res) => {
    const { paymentMethodNonce, amount } = req.body;  // The nonce and amount should come from the frontend
  
    // Use the Braintree gateway to process the transaction
    gateway.transaction.sale({
      amount: amount,  // The amount to be charged (from the frontend)
      paymentMethodNonce: paymentMethodNonce,  // The nonce from the frontend
      options: {
        submitForSettlement: true,  // Immediately submit the transaction for settlement
      },
    }, (err, result) => {
      if (err) {
        console.error("Transaction error:", err);
        return res.status(500).json({ error: "Transaction failed" });
      }
      if (result.success) {
        res.json({ success: true, transaction: result.transaction });
      } else {
        res.status(500).json({ error: result.message });
      }
    });
  };