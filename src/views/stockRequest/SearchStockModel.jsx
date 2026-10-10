// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import {
//   X,
//   Search,
//   RotateCcw,
// } from "lucide-react";
// import axiosInstance from "../../axiosInstance";

// const SearchStockModel = ({
//   visible,
//   onClose,
//   onSearch,
//   products = [],
//   centers = [],
// }) => {
//   const [searchData, setSearchData] = useState({
//     keyword: "",
//     center: "",
//     outlet: "",
//     status: "",
//     startDate: "",
//     endDate: "",
//     indentStartDate: "",
//     indentEndDate: "",
//     product: "",
//   });

//   const [productOptions, setProductOptions] =
//     useState(products);

//   const [loadingProducts, setLoadingProducts] =
//     useState(false);

//   // --------------------------------------------------
//   // Fetch products
//   // --------------------------------------------------
//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         keyword: "",
//         center: "",
//         outlet: "",
//         status: "",
//         startDate: "",
//         endDate: "",
//         indentStartDate: "",
//         indentEndDate: "",
//         product: "",
//       });
//       return;
//     }

//     if (products.length > 0) {
//       setProductOptions(products);
//       return;
//     }

//     const fetchProducts = async () => {
//       try {
//         setLoadingProducts(true);

//         const response = await axiosInstance.get(
//           "/products/all",
//         );

//         if (response.data?.success) {
//           setProductOptions(
//             response.data.data || [],
//           );
//         } else {
//           setProductOptions([]);
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching products:",
//           error,
//         );
//         setProductOptions([]);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };

//     fetchProducts();
//   }, [visible, products]);

//   // --------------------------------------------------
//   // Input change
//   // --------------------------------------------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // --------------------------------------------------
//   // Search
//   // --------------------------------------------------
//   const handleSearch = () => {
//     onSearch(searchData);
//     onClose();
//   };

//   // --------------------------------------------------
//   // Reset
//   // --------------------------------------------------
//   const handleReset = () => {
//     const resetData = {
//       keyword: "",
//       center: "",
//       outlet: "",
//       status: "",
//       startDate: "",
//       endDate: "",
//       indentStartDate: "",
//       indentEndDate: "",
//       product: "",
//     };

//     setSearchData(resetData);
//     onSearch(resetData);
//   };

//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl">
//         {/* ------------------------------------------------ */}
//         {/* Header */}
//         {/* ------------------------------------------------ */}
//         <div className="flex items-center justify-between border-b px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* ------------------------------------------------ */}
//         {/* Body */}
//         {/* ------------------------------------------------ */}
//         <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             {/* Keyword */}
//             <div>
//               <label
//                 htmlFor="keyword"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Keyword
//               </label>

//               <input
//                 id="keyword"
//                 name="keyword"
//                 type="text"
//                 value={searchData.keyword}
//                 onChange={handleChange}
//                 placeholder="Enter keyword"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             {/* Center */}
//             <div>
//               <label
//                 htmlFor="center"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Center
//               </label>

//               <select
//                 id="center"
//                 name="center"
//                 value={searchData.center}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">
//                   All Centers
//                 </option>

//                 {centers.map((center) => (
//                   <option
//                     key={center._id}
//                     value={center._id}
//                   >
//                     {center.centerName ||
//                       center.name ||
//                       center.businessName ||
//                       center.centerCode ||
//                       "Unnamed Center"}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Outlet */}
//             <div>
//               <label
//                 htmlFor="outlet"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Outlet
//               </label>

//               <select
//                 id="outlet"
//                 name="outlet"
//                 value={searchData.outlet}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">
//                   All Outlets
//                 </option>

//                 {centers.map((center) => (
//                   <option
//                     key={center._id}
//                     value={center._id}
//                   >
//                     {center.centerName ||
//                       center.name ||
//                       center.businessName ||
//                       center.centerCode ||
//                       "Unnamed Outlet"}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Status */}
//             <div>
//               <label
//                 htmlFor="status"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Status
//               </label>

//               <select
//                 id="status"
//                 name="status"
//                 value={searchData.status}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">
//                   All Status
//                 </option>

//                 <option value="Open">
//                   Open
//                 </option>

//                 <option value="Closed">
//                   Closed
//                 </option>

//                 <option value="Pending">
//                   Pending
//                 </option>

//                 <option value="Approved">
//                   Approved
//                 </option>

//                 <option value="Rejected">
//                   Rejected
//                 </option>

//                 <option value="Completed">
//                   Completed
//                 </option>
//               </select>
//             </div>

//             {/* Product */}
//             <div className="md:col-span-2">
//               <label
//                 htmlFor="product"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Product
//               </label>

//               <select
//                 id="product"
//                 name="product"
//                 value={searchData.product}
//                 onChange={handleChange}
//                 disabled={loadingProducts}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
//               >
//                 <option value="">
//                   {loadingProducts
//                     ? "Loading products..."
//                     : "All Products"}
//                 </option>

//                 {productOptions.map((product) => (
//                   <option
//                     key={product._id}
//                     value={product._id}
//                   >
//                     {product.productTitle ||
//                       product.productName ||
//                       product.name ||
//                       product.productCode ||
//                       "Unnamed Product"}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Start Date */}
//             <div>
//               <label
//                 htmlFor="startDate"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Start Date
//               </label>

//               <input
//                 id="startDate"
//                 name="startDate"
//                 type="date"
//                 value={searchData.startDate}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             {/* End Date */}
//             <div>
//               <label
//                 htmlFor="endDate"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 End Date
//               </label>

//               <input
//                 id="endDate"
//                 name="endDate"
//                 type="date"
//                 value={searchData.endDate}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             {/* Indent Start Date */}
//             <div>
//               <label
//                 htmlFor="indentStartDate"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Indent Start Date
//               </label>

//               <input
//                 id="indentStartDate"
//                 name="indentStartDate"
//                 type="date"
//                 value={
//                   searchData.indentStartDate
//                 }
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             {/* Indent End Date */}
//             <div>
//               <label
//                 htmlFor="indentEndDate"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Indent End Date
//               </label>

//               <input
//                 id="indentEndDate"
//                 name="indentEndDate"
//                 type="date"
//                 value={
//                   searchData.indentEndDate
//                 }
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* ------------------------------------------------ */}
//         {/* Footer */}
//         {/* ------------------------------------------------ */}
//         <div className="flex items-center justify-end gap-2 border-t bg-gray-50 px-6 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Search size={16} />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// SearchStockModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   products: PropTypes.array,
//   centers: PropTypes.array,
// };

// export default SearchStockModel;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  X,
  Search,
  RotateCcw,
} from "lucide-react";
import axiosInstance from "../../axiosInstance";

const SearchStockModel = ({
  visible,
  onClose,
  onSearch,
  centers,
  outlets,
  resellers,
}) => {
  const [keyword, setKeyword] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [indentStartDate, setIndentStartDate] = useState("");
  const [indentEndDate, setIndentEndDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);

  // Fetch products when modal opens.
  // Kept from the old implementation so Product filtering behaves exactly
  // like the existing application.
  useEffect(() => {
    if (visible) {
      fetchProducts();
    }
  }, [visible]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products/all");

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedCenter("");
    setSelectedOutlet("");
    setSelectedStatus("");
    setStartDate("");
    setEndDate("");
    setIndentStartDate("");
    setIndentEndDate("");
    setSelectedProduct("");
  };

  const handleSearch = () => {
    const searchData = {
      keyword,
      center: selectedCenter,
      outlet: selectedOutlet,
      status: selectedStatus,
      startDate,
      endDate,
      indentStartDate,
      indentEndDate,
      product: selectedProduct,
    };

    onSearch(searchData);
    onClose();
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes searchStockOverlayIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes searchStockDropDown {
          from {
            opacity: 0;
            transform: translateY(-48px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-stock-overlay {
          animation: searchStockOverlayIn 180ms ease-out forwards;
        }

        .search-stock-modal {
          animation: searchStockDropDown 280ms cubic-bezier(0.2, 0.75, 0.25, 1) forwards;
          transform-origin: top center;
        }

        @media (prefers-reduced-motion: reduce) {
          .search-stock-overlay,
          .search-stock-modal {
            animation: none;
          }
        }
      `}</style>

      <div
        className="search-stock-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 sm:py-12"
        role="dialog"
        aria-modal="true"
        aria-labelledby="advanced-search-title"
      >
        <div className="search-stock-modal w-full max-w-[858px] overflow-hidden rounded-[7px] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.28)]">
          {/* Header */}
          <div className="flex h-[68px] items-center justify-between border-b border-[#e2e5e9] bg-white px-[17px] sm:px-[18px]">
            <h2
              id="advanced-search-title"
              className="text-[22px] font-normal leading-none text-[#303640]"
            >
              Advanced Search
            </h2>

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] text-[#777d84] transition hover:bg-[#f2f3f4] hover:text-[#303640]"
              aria-label="Close"
            >
              <X size={25} strokeWidth={2} />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden px-[17px] py-[20px] sm:px-[18px]">
            <div className="grid grid-cols-1 gap-x-[26px] gap-y-[18px] md:grid-cols-2">
              {/* Keyword / Order Number */}
              <div>
                <label
                  htmlFor="keyword"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Keyword / Order Number
                </label>

                <input
                  id="keyword"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search by order number..."
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition placeholder:text-[#777d85] focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                >
                  <option value="">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                  <option value="Incompleted">Incompleted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Center */}
              <div>
                <label
                  htmlFor="center"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Center
                </label>

                <select
                  id="center"
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                >
                  <option value="">All Centers</option>

                  {centers &&
                    centers.map((center) => (
                      <option key={center._id} value={center._id}>
                        {center.centerName} ({center.centerCode})
                      </option>
                    ))}
                </select>
              </div>

              {/* Outlet / Warehouse */}
              <div>
                <label
                  htmlFor="outlet"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Outlet / Warehouse
                </label>

                <select
                  id="outlet"
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                >
                  <option value="">All Outlets</option>

                  {outlets &&
                    outlets.map((outlet) => (
                      <option key={outlet._id} value={outlet._id}>
                        {outlet.centerName} ({outlet.centerCode})
                      </option>
                    ))}
                </select>
              </div>

              {/* Product */}
              <div>
                <label
                  htmlFor="product"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Product
                </label>

                <select
                  id="product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                >
                  <option value="">All Products</option>

                  {products &&
                    products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.productTitle || product.productCode}
                      </option>
                    ))}
                </select>
              </div>

              {/* Empty alignment column */}
              <div className="hidden md:block" />

              {/* Indent Date From */}
              <div>
                <label
                  htmlFor="indentStartDate"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Indent Date From
                </label>

                <input
                  id="indentStartDate"
                  type="date"
                  value={indentStartDate}
                  onChange={(e) => setIndentStartDate(e.target.value)}
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                />
              </div>

              {/* Indent Date To */}
              <div>
                <label
                  htmlFor="indentEndDate"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Indent Date To
                </label>

                <input
                  id="indentEndDate"
                  type="date"
                  value={indentEndDate}
                  onChange={(e) => setIndentEndDate(e.target.value)}
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                />
              </div>

              {/* Order Date From */}
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Order Date From
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                />
              </div>

              {/* Order Date To */}
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-[7px] block text-[16px] font-semibold text-[#303640]"
                >
                  Order Date To
                </label>

                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-[41px] w-full rounded-[6px] border border-[#d5dbe2] bg-white px-[13px] text-[16px] text-[#303640] outline-none transition focus:border-[#2759a2] focus:ring-1 focus:ring-[#2759a2]/15"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-[#e2e5e9] bg-white px-[17px] py-[15px] sm:flex-row sm:items-center sm:justify-end sm:px-[18px]">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-[41px] items-center justify-center rounded-[6px] bg-[#6f7c8c] px-[16px] text-[16px] font-semibold text-white transition hover:bg-[#626e7d]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-[41px] items-center justify-center gap-2 rounded-[6px] bg-[#6f7c8c] px-[16px] text-[16px] font-semibold text-white transition hover:bg-[#626e7d]"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex h-[41px] items-center justify-center gap-2 rounded-[6px] bg-[#5752d6] px-[18px] text-[16px] font-semibold text-white shadow-sm transition hover:bg-[#4c47c2]"
            >
              <Search size={17} />
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

SearchStockModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array,
  outlets: PropTypes.array,
  resellers: PropTypes.array,
};

SearchStockModel.defaultProps = {
  centers: [],
  outlets: [],
  resellers: [],
};

export default SearchStockModel;
