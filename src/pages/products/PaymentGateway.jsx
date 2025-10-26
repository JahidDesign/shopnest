import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

let Swal;

/* Small inline icons (kept from your earlier code) */
const IconShield = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2l7 3v5c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3z" fill="#06b6d4" />
    <path d="M12 2v9l5 2" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconHistory = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 12a9 9 0 11-2.6-6.1" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7v6l4 2" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCard = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#3b82f6" />
    <rect x="3.5" y="8.5" width="6" height="2" rx="0.5" fill="#9ac3ff" />
    <rect x="3.5" y="12.5" width="12" height="2" rx="0.5" fill="#93c5fd" />
  </svg>
);

const IconBkash = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="100" height="100" rx="16" fill="#ff2d55"/>
    <path d="M28 34h44v7H28z" fill="#fff" />
    <path d="M28 47h44v7H28z" fill="#fff" />
    <path d="M28 60h44v7H28z" fill="#fff" />
  </svg>
);
const IconNagad = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect width="100" height="100" rx="16" fill="#ff7a00"/>
    <circle cx="50" cy="45" r="18" fill="#fff" />
    <path d="M50 35v20" stroke="#ff7a00" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Spinner = ({ size = 20 }) => (
  <div style={{ width: size, height: size }} className="spinner-border" aria-hidden>
    <style>{`.spinner-border{ border:3px solid rgba(0,0,0,0.08); border-top-color: rgba(0,0,0,0.4); border-radius:50%; animation: spin 0.8s linear infinite; } @keyframes spin{ to{ transform: rotate(360deg) } }`}</style>
  </div>
);

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedProduct = location.state?.product || null;
  const passedAmount = location.state?.amount ?? "";
  const passedQuantity = location.state?.quantity ?? 1;

  const [amount, setAmount] = useState(passedAmount || "");
  const [selected, setSelected] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [cardInfo, setCardInfo] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankTxRef, setBankTxRef] = useState("");

  useEffect(() => {
    // load SweetAlert2 CDN
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    script.onload = () => (Swal = window.Swal);
    document.body.appendChild(script);

    const saved = localStorage.getItem("payment_orders");
    if (saved) setOrderHistory(JSON.parse(saved));

    // auto-fill amount if passed
    if (passedAmount) setAmount(passedAmount);
  }, [passedAmount]);

  const saveOrderLocal = (order) => {
    const updated = [order, ...orderHistory];
    setOrderHistory(updated);
    localStorage.setItem("payment_orders", JSON.stringify(updated));
  };

  const generatePDFDoc = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("SHOPNEST PAYMENT RECEIPT", 105, 22, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Transaction ID: ${order.tran_id}`, 14, 38);
    doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 14, 46);

    doc.setFontSize(13);
    doc.text("CUSTOMER", 14, 60);
    doc.setFontSize(11);
    doc.text(`Name: ${order.customer_name}`, 14, 68);
    if (order.customer_email) doc.text(`Email: ${order.customer_email}`, 14, 76);
    if (order.mobile_number) doc.text(`Mobile: ${order.mobile_number}`, 14, 84);

    doc.setFontSize(13);
    doc.text("PAYMENT", 14, 100);
    doc.setFontSize(11);
    doc.text(`Method: ${order.method}`, 14, 108);
    doc.text(`Amount: ৳${order.amount}`, 14, 116);
    if (order.card_number) doc.text(`Card: ${order.card_number}`, 14, 124);

    doc.setFontSize(10);
    doc.text("Thank you for shopping with Shopnest!", 105, 140, { align: "center" });

    return doc;
  };

  const showPaymentModal = (order) => {
    const doc = generatePDFDoc(order);
    if (!Swal) {
      saveOrderLocal(order);
      doc.save(`Shopnest_Receipt_${order.tran_id}.pdf`);
      return;
    }

    Swal.fire({
      title: "Payment Recorded",
      html: `
        <div style="text-align:left">
          <p><strong>Transaction:</strong> ${order.tran_id}</p>
          <p><strong>Amount:</strong> ৳${order.amount}</p>
          <p><strong>Method:</strong> ${order.method}</p>
        </div>
      `,
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Download Receipt",
      cancelButtonText: "Close",
      width: 520,
    }).then((res) => {
      saveOrderLocal(order);
      // attempt server submit (fire-and-forget placeholder)
      // TODO: replace endpoint with your backend
      fetch("https://shopnest-ecom.onrender.com/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      }).catch(() => {
        // ignore network errors (you may want to surface these)
      });

      if (res.isConfirmed) doc.save(`Shopnest_Receipt_${order.tran_id}.pdf`);
      // After success, optionally navigate to orders page
    });
  };

  const resetAll = () => {
    setAmount("");
    setSelected(null);
    setCardInfo({ name: "", number: "", expiry: "", cvv: "" });
    setMobileNumber("");
    setOtp("");
    setOtpSent(false);
    setGeneratedOtp("");
    setPaypalEmail("");
    setBankTxRef("");
  };

  const finalizeOrder = (base) => {
    const order = {
      tran_id: "TXN" + Date.now(),
      amount: parseFloat(base.amount),
      method: base.method,
      customer_name: base.customer_name || "Guest",
      customer_email: base.customer_email || "",
      mobile_number: base.mobile_number || "",
      card_number: base.card_number || "",
      product_id: passedProduct?._id || null,
      product_name: passedProduct?.name || "N/A",
      quantity: passedQuantity,
      status: base.status || "Pending",
      date: new Date().toISOString(),
      extra: base.extra || {}
    };

    setIsProcessing(true);
    // short simulated processing delay
    setTimeout(() => {
      setIsProcessing(false);
      showPaymentModal(order);
      resetAll();
    }, 900);
  };

  /* ------------- Handlers ------------- */

  // Card (demo). Replace this workflow with Stripe Elements or Checkout integration.
  const onCardPay = () => {
    const { name, number, expiry, cvv } = cardInfo;
    if (!amount || !name || !number || !expiry || !cvv) {
      if (Swal) Swal.fire("Error", "Please fill in all card details and amount.", "error");
      return;
    }

    // Demo: mask card number and finalize
    const cleanNumber = number.replace(/\s+/g, "");
    const orderBase = {
      amount,
      method: "Card (Demo)",
      customer_name: name,
      card_number: `XXXX-XXXX-XXXX-${cleanNumber.slice(-4)}`,
      status: "Successful"
    };

    // If you want real Stripe integration:
    // 1) Build a server endpoint to create PaymentIntent
    // 2) Use Stripe.js & Elements in frontend to collect card & confirmPayment
    // See Stripe docs and replace this simulated flow.
    finalizeOrder(orderBase);
  };

  // Mobile wallet OTP demo (bKash / Nagad / Rocket)
  const sendOtp = () => {
    if (!mobileNumber || mobileNumber.replace(/\D/g, "").length < 11) {
      if (Swal) Swal.fire("Error", "Please enter a valid 11-digit mobile number.", "error");
      return;
    }
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);
    setOtpSent(true);
    if (Swal) Swal.fire("OTP Sent", `Your OTP: ${otpCode}\n(For demo only)`, "info");
  };

  const confirmOtpPay = () => {
    if (!otpSent) {
      if (Swal) Swal.fire("Error", "Send OTP first.", "error");
      return;
    }
    if (otp !== generatedOtp) {
      if (Swal) Swal.fire("Error", "Invalid OTP.", "error");
      return;
    }
    if (!amount) {
      if (Swal) Swal.fire("Error", "Enter amount.", "error");
      return;
    }

    const orderBase = {
      amount,
      method: selected || "Mobile (Demo)",
      customer_name: "Mobile Customer",
      mobile_number: mobileNumber,
      status: "Successful"
    };

    finalizeOrder(orderBase);
  };

  // PayPal (demo)
  const onPaypalPay = () => {
    if (!paypalEmail || !amount) {
      if (Swal) Swal.fire("Error", "Provide PayPal email and amount.", "error");
      return;
    }
    const orderBase = {
      amount,
      method: "PayPal (Demo)",
      customer_name: paypalEmail,
      customer_email: paypalEmail,
      status: "Successful"
    };
    finalizeOrder(orderBase);
  };

  // Bank transfer confirmation (user enters bank tx ref)
  const onBankTransferConfirm = () => {
    if (!bankTxRef || !amount) {
      if (Swal) Swal.fire("Error", "Enter bank transaction reference and amount.", "error");
      return;
    }
    const orderBase = {
      amount,
      method: "Bank Transfer",
      customer_name: "Bank Customer",
      extra: { bank_tx_ref: bankTxRef },
      status: "Pending (Awaiting Confirmation)"
    };
    finalizeOrder(orderBase);
  };

  // Cash on Delivery
  const onCOD = () => {
    if (!amount) {
      if (Swal) Swal.fire("Error", "Enter amount.", "error");
      return;
    }
    const orderBase = {
      amount,
      method: "Cash on Delivery",
      customer_name: "COD Customer",
      status: "COD"
    };
    finalizeOrder(orderBase);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3">
            <IconShield className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">Shopnest Pay</h1>
              <p className="text-sm text-gray-600">Secure payments — Card, bKash, Nagad, Bank Transfer, COD</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Amount (BDT)</label>
            <div className="relative mb-5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-bold text-orange-600">৳</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 text-2xl font-bold border rounded-xl focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Method</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <button onClick={() => { setSelected("Credit/Debit Card"); setOtpSent(false); }} className={`p-4 rounded-xl border ${selected === "Credit/Debit Card" ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}>
                <div className="flex items-center gap-3"><IconCard className="w-8 h-8" /><div><div className="text-sm font-semibold">Card</div><div className="text-xs text-gray-500">Visa / Master</div></div></div>
              </button>

              <button onClick={() => { setSelected("bKash"); setOtpSent(false); }} className={`p-4 rounded-xl border ${selected === "bKash" ? "bg-pink-50 border-pink-300" : "bg-white border-gray-200"}`}>
                <div className="flex items-center gap-3"><IconBkash className="w-8 h-8" /><div><div className="text-sm font-semibold">bKash</div><div className="text-xs text-gray-500">Mobile Wallet</div></div></div>
              </button>

              <button onClick={() => { setSelected("Nagad"); setOtpSent(false); }} className={`p-4 rounded-xl border ${selected === "Nagad" ? "bg-orange-50 border-orange-300" : "bg-white border-gray-200"}`}>
                <div className="flex items-center gap-3"><IconNagad className="w-8 h-8" /><div><div className="text-sm font-semibold">Nagad</div><div className="text-xs text-gray-500">Mobile Wallet</div></div></div>
              </button>

              <button onClick={() => { setSelected("Bank Transfer"); setOtpSent(false); }} className={`p-4 rounded-xl border ${selected === "Bank Transfer" ? "bg-green-50 border-green-300" : "bg-white border-gray-200"}`}>
                <div className="flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><path d="M3 10h18" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round"/></svg><div><div className="text-sm font-semibold">Bank</div><div className="text-xs text-gray-500">Transfer</div></div></div>
              </button>

              <button onClick={() => { setSelected("COD"); setOtpSent(false); }} className={`p-4 rounded-xl border ${selected === "COD" ? "bg-rose-50 border-rose-300" : "bg-white border-gray-200"}`}>
                <div className="flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><path d="M3 7h18" stroke="#fb7185" strokeWidth="1.6" strokeLinecap="round"/></svg><div><div className="text-sm font-semibold">Cash on Delivery</div><div className="text-xs text-gray-500">Pay at delivery</div></div></div>
              </button>

              <button onClick={() => { setSelected("PayPal"); setOtpSent(false); }} className={`p-4 rounded-xl border ${selected === "PayPal" ? "bg-sky-50 border-sky-300" : "bg-white border-gray-200"}`}>
                <div className="flex items-center gap-3"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" fill="#003087"/></svg><div><div className="text-sm font-semibold">PayPal</div><div className="text-xs text-gray-500">Global</div></div></div>
              </button>
            </div>

            <div>
              {selected === "Credit/Debit Card" && (
                <div className="space-y-4">
                  <input value={cardInfo.name} onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })} placeholder="Cardholder name" className="w-full border rounded-lg px-3 py-2" />
                  <input value={cardInfo.number} onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })} placeholder="Card number (no spaces)" className="w-full border rounded-lg px-3 py-2 font-mono" />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={cardInfo.expiry} onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })} placeholder="MM/YY" className="border rounded-lg px-3 py-2" />
                    <input value={cardInfo.cvv} onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })} placeholder="CVV" className="border rounded-lg px-3 py-2" />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={onCardPay} disabled={isProcessing} className="flex-1 py-3 rounded-lg bg-blue-600 text-white flex items-center justify-center gap-3">
                      {isProcessing ? <Spinner size={18} /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v10l4 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      {isProcessing ? "Processing..." : `Pay ৳${amount || "0"}`}
                    </button>
                    <button onClick={() => {
                      // Helper: placeholder for wiring Stripe Checkout
                      if (Swal) Swal.fire("Info", "This demo simulates a card payment. To enable real card payments integrate Stripe server + Stripe.js.", "info");
                    }} className="py-3 px-4 rounded-lg bg-gray-100">Integrate Stripe</button>
                  </div>
                </div>
              )}

              {(selected === "bKash" || selected === "Nagad") && (
                <div className="space-y-4">
                  <input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder={`${selected} / Mobile number`} className="w-full border rounded-lg px-3 py-2" />
                  {!otpSent ? (
                    <button onClick={sendOtp} disabled={isProcessing} className="w-full py-3 rounded-lg bg-pink-500 text-white">Send OTP</button>
                  ) : (
                    <>
                      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full border rounded-lg px-3 py-2" />
                      <div className="flex gap-3">
                        <button onClick={confirmOtpPay} disabled={isProcessing} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white">{isProcessing ? "Processing..." : `Verify & Pay ৳${amount || "0"}`}</button>
                        <button onClick={() => { setOtpSent(false); setOtp(""); }} className="py-3 px-4 rounded-lg bg-gray-100">Resend</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {selected === "Bank Transfer" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                    <div className="text-sm font-semibold">Bank Details</div>
                    <div className="mt-2 text-xs text-gray-700">
                      <div>Bank: XYZ Bank Ltd.</div>
                      <div>Account: 1234567890</div>
                      <div>Branch: Dhaka</div>
                      <div>Account Name: Shopnest Ltd.</div>
                    </div>
                  </div>

                  <input value={bankTxRef} onChange={(e) => setBankTxRef(e.target.value)} placeholder="Enter bank transaction reference" className="w-full border rounded-lg px-3 py-2" />
                  <button onClick={onBankTransferConfirm} disabled={isProcessing} className="w-full py-3 rounded-lg bg-green-600 text-white">{isProcessing ? "Processing..." : `Confirm Bank Transfer ৳${amount || "0"}`}</button>
                </div>
              )}

              {selected === "COD" && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100 text-sm">Cash on Delivery selected. Please confirm order — courier/payment will be collected at delivery.</div>
                  <button onClick={onCOD} disabled={isProcessing} className="w-full py-3 rounded-lg bg-amber-600 text-white">{isProcessing ? "Processing..." : `Place COD Order ৳${amount || "0"}`}</button>
                </div>
              )}

              {selected === "PayPal" && (
                <div className="space-y-4">
                  <input value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="PayPal email" className="w-full border rounded-lg px-3 py-2" />
                  <button onClick={onPaypalPay} disabled={isProcessing} className="w-full py-3 rounded-lg bg-sky-600 text-white">{isProcessing ? "Processing..." : `Pay with PayPal ৳${amount || "0"}`}</button>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow">
              <div className="flex items-center gap-3">
                <IconShield className="w-8 h-8" />
                <div>
                  <div className="font-bold">Secure Payments</div>
                  <div className="text-xs opacity-90">256-bit SSL • PCI DSS</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><IconHistory className="w-5 h-5" /><div className="font-semibold">Order History</div></div>
                <div className="text-orange-500 font-bold">{orderHistory.length}</div>
              </div>

              {orderHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {orderHistory.map((o) => (
                    <div key={o.tran_id} className="flex justify-between items-center border-b pb-2">
                      <div className="text-xs font-mono">{o.tran_id}</div>
                      <div className="text-sm font-semibold text-orange-600">৳{o.amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow border">
              <div className="text-sm font-semibold mb-2">Product Summary</div>
              {passedProduct ? (
                <>
                  <div className="text-sm text-gray-700">{passedProduct.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Qty: {passedQuantity}</div>
                  <div className="text-lg font-bold text-orange-600 mt-3">৳{amount || "0"}</div>
                  <button onClick={() => navigate(-1)} className="mt-3 w-full py-2 rounded-lg border border-gray-200">Back to Product</button>
                </>
              ) : (
                <div className="text-sm text-gray-500">No product selected</div>
              )}
            </div>
          </aside>
        </div>

        <style>{`.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`}</style>
      </div>
    </div>
  );
};

export default PaymentGateway;
