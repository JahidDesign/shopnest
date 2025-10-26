import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

const PaymentSuccess = () => {
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product_id = params.get('product_id');
    const quantity = params.get('quantity');

    const user = JSON.parse(localStorage.getItem('authUser')) || {};
    const cartItem = JSON.parse(localStorage.getItem('cart'))?.find(item => item.productId === product_id);

    if (cartItem) {
      setReceipt({
        ...cartItem,
        buyerName: user.displayName || 'Anonymous',
        buyerEmail: user.email || 'N/A',
        quantity: quantity || cartItem.quantity,
        date: new Date().toLocaleString(),
      });
    }
  }, []);

  const downloadPDF = () => {
    if (!receipt) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Payment Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Buyer Name: ${receipt.buyerName}`, 20, 40);
    doc.text(`Buyer Email: ${receipt.buyerEmail}`, 20, 50);
    doc.text(`Product: ${receipt.productName}`, 20, 60);
    doc.text(`Quantity: ${receipt.quantity}`, 20, 70);
    doc.text(`Price: ৳${receipt.orderPrice}`, 20, 80);
    doc.text(`Date: ${receipt.date}`, 20, 90);
    doc.save(`receipt_${receipt.productName}_${Date.now()}.pdf`);
  };

  if (!receipt) return <div className="p-10 text-center">Loading receipt...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="mb-6">Thank you, {receipt.buyerName}. Your payment was successful.</p>
        <pre className="bg-gray-100 p-4 rounded mb-4 text-sm overflow-x-auto">
          {JSON.stringify(receipt, null, 2)}
        </pre>
        <button
          onClick={downloadPDF}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
        >
          Download PDF Receipt
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
