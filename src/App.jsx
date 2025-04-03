
import { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

const marginOptions = [
  { value: 0.25, label: "25% - GOV", color: "bg-pink-700 text-white" },
  { value: 0.43, label: "43% - cash", color: "bg-blue-700 text-white" },
  { value: 0.44, label: "44% - Merch EU", color: "bg-cyan-700 text-white" },
  { value: 0.48, label: "48% - 30 days", color: "bg-green-700 text-white" },
  { value: 0.53, label: "53% - 60/90 days", color: "bg-yellow-600 text-white" },
  { value: 0.60, label: "60% - custom", color: "bg-purple-700 text-white" },
  { value: 0.95, label: "95%", color: "bg-red-700 text-white" }
];

const userOptions = [
  { name: "Takwa", color: "bg-teal-700 text-white" },
  { name: "April", color: "bg-orange-700 text-white" },
  { name: "Jamie", color: "bg-indigo-700 text-white" },
  { name: "Charles", color: "bg-gray-700 text-white" },
  { name: "Lin", color: "bg-lime-700 text-white" },
  { name: "Dawn", color: "bg-rose-700 text-white" }
];

const deliveryOptions = [
  { label: "Malta Only (€8)", value: "malta" },
  { label: "Sicily to Malta (€10/small box + €8/complete box)", value: "sicily" }
];

export default function QuoteMaster() {
  const [unitCost, setUnitCost] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0.43);
  const [shippingCost, setShippingCost] = useState(0);
  const [itemsPerBox, setItemsPerBox] = useState(1);
  const [includeLocalDelivery, setIncludeLocalDelivery] = useState(true);
  const [deliveryType, setDeliveryType] = useState("malta");
  const [timestamp, setTimestamp] = useState("");
  const [selectedUser, setSelectedUser] = useState("Charles");

  useEffect(() => {
    const now = new Date();
    setTimestamp(now.toLocaleString());
  }, []);

  const smallBoxes = Math.ceil(quantity / itemsPerBox);
  const completeBoxes = Math.ceil(smallBoxes / 5);
  const totalProductCost = unitCost * quantity;

  let localDelivery = 0;
  if (includeLocalDelivery) {
    if (deliveryType === "sicily") {
      localDelivery = (smallBoxes * 10) + (completeBoxes * 8);
    } else {
      localDelivery = completeBoxes * 8;
    }
  }

  const totalCost = totalProductCost + shippingCost + localDelivery;
  const finalClientPrice = totalCost * (1 + profitMargin);
  const profitAmount = finalClientPrice - totalCost;
  const pricePerUnit = finalClientPrice / quantity;

  const handleDownloadPDF = () => {
    const element = document.getElementById("quote-summary");
    const opt = {
      margin: 0.5,
      filename: 'quote-summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div style={{ padding: 24, background: '#1f1f1f', minHeight: '100vh', color: 'white', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Quote Master</h1>
        <button onClick={handleDownloadPDF} style={{ backgroundColor: '#dc2626', padding: '8px 16px', borderRadius: 8, color: 'white' }}>Download PDF</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>User: </label>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          {userOptions.map(user => (
            <option key={user.name} value={user.name}>{user.name}</option>
          ))}
        </select>
      </div>

      <div style={{ backgroundColor: '#2d2d2d', padding: 16, borderRadius: 8 }}>
        <div><label>Quantity</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} /></div>
        <div><label>Unit Cost (€)</label><input type="number" value={unitCost} onChange={e => setUnitCost(Number(e.target.value))} /></div>
        <div><label>Shipping Cost (€)</label><input type="number" value={shippingCost} onChange={e => setShippingCost(Number(e.target.value))} /></div>
        <div><label>Items per Exterior Box</label><input type="number" value={itemsPerBox} onChange={e => setItemsPerBox(Number(e.target.value))} /></div>
        <div>
          <label>Include Local Delivery</label>
          <input type="checkbox" checked={includeLocalDelivery} onChange={e => setIncludeLocalDelivery(e.target.checked)} />
        </div>
        <div>
          <label>Delivery Type</label>
          <select value={deliveryType} onChange={e => setDeliveryType(e.target.value)}>
            {deliveryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Profit Margin</label>
          <select value={profitMargin} onChange={e => setProfitMargin(Number(e.target.value))}>
            {marginOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 24, backgroundColor: '#3f3f3f', padding: 16, borderRadius: 8 }}>
        <h2>Price Per Unit</h2>
        <p style={{ fontSize: 24 }}>€{pricePerUnit.toFixed(2)}</p>
      </div>

      <div id="quote-summary" style={{ marginTop: 24, backgroundColor: 'white', color: 'black', padding: 24, borderRadius: 8 }}>
        <h2>Quote Summary</h2>
        <p>Total Product Cost: €{totalProductCost.toFixed(2)}</p>
        <p>Small Boxes Needed: {smallBoxes}</p>
        <p>Complete Boxes (5 small boxes each): {completeBoxes}</p>
        <p>Local Delivery Fee: €{localDelivery.toFixed(2)}</p>
        <p>Total Cost (with Shipping & Local Delivery): €{totalCost.toFixed(2)}</p>
        <p>Final Client Price: €{finalClientPrice.toFixed(2)}</p>
        <p>Profit: €{profitAmount.toFixed(2)}</p>
        <p style={{ fontSize: '0.8rem', marginTop: 12 }}>Generated on: {timestamp}</p>
        <p style={{ fontSize: '0.8rem' }}>Prepared by: {selectedUser}</p>
      </div>
    </div>
  );
}
