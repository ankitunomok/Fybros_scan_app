import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReadQr from "./ReadQr";

function App() {
  const [codes, setCodes] = useState(""); // single input field (string)
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState({});
  const [error, setError] = useState("");
  const [saveCode, setSaveCode] = useState("");

  // Handle QR scan → append to codes
  const handleQrScan = (value) => {
    if (!value) return;
    const newCode = value.trim();
    if (newCode === "") return;
    if (showData?.ProductCode === newCode || saveCode === newCode) {
      if (!error){
      setError(newCode + " " +"already scanned");
      }
      return;
    } // Don't submit if same as old
    setCodes(newCode);
    handleSubmit(newCode);
    console.log("Scanned Code:", newCode);
  };

  const handleChange = (value) => {
    setCodes(value);
  };

  const isReady = codes.trim() !== "";

  const handleSubmit = async (val) => {
    if (!val) {
      console.log("No codes to submit");
      setError("Please enter or scan a QR code");
      return;
    }

    setLoading(true);

    try {
      // Remove empty values from codes array

      // Find batchNo (starts with PG), then assign first two others as start/end
      const result = await axios.get(
        `https://fybrosindia.unomok.com/api/mobile/searchCode/${val}`,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", result.data);
      setSaveCode(val);
      if (result.data.success) {
        setShowData(result.data.data);
        setError("");
      } else {
        setError(val+" "+result.data.message || "Error fetching data");
        setShowData({});
      }
      setCodes(""); // reset field
    } catch (err) {
      Swal.fire("Something went wrong!");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Scan QR Codes</h2>

      {/* QR Scanner */}
      <ReadQr onScan={handleQrScan} />

      {/* /* Single Input Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          QR Codes (comma separated)
        </label>
        <input
          type="text"
          value={codes}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter or scan QR codes"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Show parsed codes */}

      {/* Proceed Button */}
      <button
        disabled={!isReady || loading}
        onClick={() => {
          handleSubmit(codes.trim());
        }}
        className={`w-full py-2 rounded-lg font-semibold ${
          isReady && !loading
            ? "bg-yellow-400 text-black hover:bg-yellow-500"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {loading ? "Submitting..." : "Proceed"}
      </button>
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Display Result */}
      {/* {showData && Object.keys(showData).length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          {Object.entries(showData).map(([key, value]) => (
            <div key={key}>
              <h3 className="text-lg font-semibold mb-2 inline">{key}</h3>
              <p className="text-gray-700 inline">
                {" : "}
                {value}
              </p>
            </div>
          ))}
        </div>
      )} */}

      {showData && Object.keys(showData).length>0 && (<div className='mt-6 p-4 border rounded-lg bg-gray-50'>
        <div>
          <h3 className='text-lg font-semibold mb-2 inline'>SKU Size Name</h3>
          <p className='text-gray-700 inline'>
            {' : '}
            {showData?.SkuSizeName}
          </p>
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-2 inline'>SKU ID</h3>
          <p className='text-gray-700 inline'>
            {' : '}
            {showData?.SkuUniqueId}
          </p>
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-2 inline'>Code</h3>
          <p className='text-gray-700 inline'>
            {' : '}
            {showData?.ProductCode}
          </p>
        </div>
      </div>)}

    </div>
  );
}

export default App;
