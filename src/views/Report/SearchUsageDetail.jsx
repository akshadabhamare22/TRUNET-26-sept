// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Select from "react-select";
// import { RotateCcw, Search, X } from "lucide-react";
// import axiosInstance from "../../axiosInstance";
// const SearchUsageDetail = ({
//   visible,
//   onClose,
//   onSearch,
//   centers,
//   products,
//   customers,
// }) => {
//   const [searchData, setSearchData] = useState({
//     product: "",
//     center: "",
//     usageType: "",
//     customer: "",
//     reseller: "",
//     startDate: "",
//     endDate: "",
//     connectionType: "",
//   });

//   const [resellers, setResellers] = useState([]);
//   const [loadingResellers, setLoadingResellers] = useState(false);

//   const [resellerCenters, setResellerCenters] = useState([]);
//   const [loadingCenters, setLoadingCenters] = useState(false);

//   // Fetch all resellers
//   useEffect(() => {
//     const fetchResellers = async () => {
//       setLoadingResellers(true);

//       try {
//         const response = await axiosInstance.get("/resellers");

//         if (response.data.success) {
//           setResellers(response.data.data || []);
//         } else {
//           setResellers([]);
//         }
//       } catch (error) {
//         console.error("Error fetching resellers:", error);
//         setResellers([]);
//       } finally {
//         setLoadingResellers(false);
//       }
//     };

//     fetchResellers();
//   }, []);

//   // Fetch centers based on selected reseller
//   useEffect(() => {
//     const fetchCentersByReseller = async () => {
//       if (searchData.reseller) {
//         setLoadingCenters(true);

//         try {
//           const response = await axiosInstance.get(
//             `/centers/reseller/${searchData.reseller}`
//           );

//           if (response.data.success) {
//             setResellerCenters(response.data.data);
//           } else {
//             setResellerCenters([]);
//           }
//         } catch (error) {
//           console.error(
//             "Error fetching centers for reseller:",
//             error
//           );
//           setResellerCenters([]);
//         } finally {
//           setLoadingCenters(false);
//         }
//       } else {
//         setResellerCenters([]);

//         setSearchData((prev) => ({
//           ...prev,
//           center: "",
//         }));
//       }
//     };

//     fetchCentersByReseller();
//   }, [searchData.reseller]);

//   // Reset when modal closes
//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         product: "",
//         center: "",
//         usageType: "",
//         customer: "",
//         reseller: "",
//         startDate: "",
//         endDate: "",
//         connectionType: "",
//       });

//       setResellerCenters([]);
//     }
//   }, [visible]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const formatDateToDDMMYYYY = (dateString) => {
//     if (!dateString) return "";

//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//       const [year, month, day] = dateString.split("-");

//       return `${day}-${month}-${year}`;
//     }

//     return dateString;
//   };

//   const handleSearch = () => {
//     const apiSearchData = {
//       product: searchData.product,
//       center: searchData.center,
//       usageType: searchData.usageType,
//       customer: searchData.customer,
//       reseller: searchData.reseller,
//       startDate: formatDateToDDMMYYYY(searchData.startDate),
//       endDate: formatDateToDDMMYYYY(searchData.endDate),
//       connectionType: searchData.connectionType,
//     };

//     onSearch(apiSearchData);
//     onClose();
//   };

//   const handleReset = () => {
//     const resetData = {
//       product: "",
//       center: "",
//       usageType: "",
//       customer: "",
//       reseller: "",
//       startDate: "",
//       endDate: "",
//       connectionType: "",
//     };

//     setSearchData(resetData);
//     setResellerCenters([]);

//     onSearch(resetData);
//     onClose();
//   };

//   if (!visible) return null;

//   const resellerOptions = resellers.map((reseller) => ({
//     value: reseller._id,
//     label: reseller.businessName,
//   }));

//   const centerOptions = resellerCenters.map((center) => ({
//     value: center._id,
//     label: center.centerName,
//   }));

//   const customerOptions = customers.map((customer) => ({
//     value: customer._id,
//     label: `${customer.username} - ${customer.mobile}`,
//   }));

//   const productOptions = products.map((product) => ({
//     value: product._id,
//     label: product.productTitle,
//   }));

//   const selectedReseller =
//     resellerOptions.find(
//       (option) => option.value === searchData.reseller
//     ) || null;

//   const selectedCenter =
//     centerOptions.find(
//       (option) => option.value === searchData.center
//     ) || null;

//   const selectedCustomer =
//     customerOptions.find(
//       (option) => option.value === searchData.customer
//     ) || null;

//   const selectedProduct =
//     productOptions.find(
//       (option) => option.value === searchData.product
//     ) || null;

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "40px",
//       borderRadius: "6px",
//       borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
//       boxShadow: state.isFocused
//         ? "0 0 0 1px #2563eb"
//         : "none",
//       "&:hover": {
//         borderColor: "#9ca3af",
//       },
//     }),

//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Search
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
//           {/* Reseller + Branch */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Reseller */}
//             <div>
//               <label
//                 htmlFor="reseller"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Reseller
//               </label>

//               <Select
//                 inputId="reseller"
//                 name="reseller"
//                 placeholder={
//                   loadingResellers
//                     ? "Loading resellers..."
//                     : "Select Reseller..."
//                 }
//                 value={selectedReseller}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     reseller: selected
//                       ? selected.value
//                       : "",
//                     center: "",
//                   }))
//                 }
//                 options={resellerOptions}
//                 isClearable
//                 isLoading={loadingResellers}
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//               />
//             </div>

//             {/* Branch */}
//             <div>
//               <label
//                 htmlFor="center"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Branch
//               </label>

//               <Select
//                 inputId="center"
//                 name="center"
//                 placeholder={
//                   loadingCenters
//                     ? "Loading branches..."
//                     : searchData.reseller
//                       ? "Select Branch..."
//                       : "Select a reseller first"
//                 }
//                 value={selectedCenter}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected
//                       ? selected.value
//                       : "",
//                   }))
//                 }
//                 options={centerOptions}
//                 isClearable
//                 isDisabled={
//                   !searchData.reseller ||
//                   loadingCenters
//                 }
//                 isLoading={loadingCenters}
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//               />

//               {searchData.reseller &&
//                 !loadingCenters &&
//                 resellerCenters.length === 0 && (
//                   <p className="mt-1.5 text-xs text-gray-500">
//                     No branches found for this reseller
//                   </p>
//                 )}
//             </div>
//           </div>

//           {/* Type + User */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Type */}
//             <div>
//               <label
//                 htmlFor="usageType"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Type
//               </label>

//               <select
//                 id="usageType"
//                 name="usageType"
//                 value={searchData.usageType}
//                 onChange={handleChange}
//                 className="block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">-SELECT-</option>
//                 <option value="Customer">Customer</option>
//                 <option value="Building">Building</option>
//                 <option value="Building to Building">
//                   Building to Building
//                 </option>
//                 <option value="Control Room">
//                   Control Room
//                 </option>
//                 <option value="Damage">Damage</option>
//                 <option value="Stolen from Center">
//                   Stolen from Center
//                 </option>
//                 <option value="Stolen from Field">
//                   Stolen from Field
//                 </option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* User */}
//             <div>
//               <label
//                 htmlFor="customer"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 User
//               </label>

//               <Select
//                 inputId="customer"
//                 name="customer"
//                 placeholder="Select User..."
//                 value={selectedCustomer}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     customer: selected
//                       ? selected.value
//                       : "",
//                   }))
//                 }
//                 options={customerOptions}
//                 isClearable
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//               />
//             </div>
//           </div>

//           {/* Product + Connection Type */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Product */}
//             <div>
//               <label
//                 htmlFor="product"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Product
//               </label>

//               <Select
//                 inputId="product"
//                 name="product"
//                 placeholder="Search Product..."
//                 value={selectedProduct}
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     product: selected
//                       ? selected.value
//                       : "",
//                   }))
//                 }
//                 options={productOptions}
//                 isClearable
//                 classNamePrefix="react-select"
//                 styles={selectStyles}
//               />
//             </div>

//             {/* Connection Type */}
//             <div>
//               <label
//                 htmlFor="connectionType"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Connection Type
//               </label>

//               <select
//                 id="connectionType"
//                 name="connectionType"
//                 value={searchData.connectionType}
//                 onChange={handleChange}
//                 className="block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">SELECT</option>
//                 <option value="New">new</option>
//                 <option value="Convert">convert</option>
//                 <option value="Shifting">shifting</option>
//                 <option value="Repair">Repair</option>
//               </select>
//             </div>
//           </div>

//           {/* Date Range */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Start Date */}
//             <div>
//               <label
//                 htmlFor="startDate"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Start Date
//               </label>

//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 value={searchData.startDate}
//                 onChange={handleChange}
//                 className="block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />

//               <p className="mt-1 text-xs text-gray-500">
//                 Optional
//               </p>
//             </div>

//             {/* End Date */}
//             <div>
//               <label
//                 htmlFor="endDate"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 End Date
//               </label>

//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 value={searchData.endDate}
//                 onChange={handleChange}
//                 className="block h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />

//               <p className="mt-1 text-xs text-gray-500">
//                 Optional
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
//           >
//             <Search size={16} />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// SearchUsageDetail.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   products: PropTypes.array.isRequired,
//   customers: PropTypes.array.isRequired,
// };

// export default SearchUsageDetail;






import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { X } from "lucide-react";
import axiosInstance from "../../axiosInstance";

const SearchUsageDetail = ({
  visible,
  onClose,
  onSearch,
  centers,
  products,
  customers,
}) => {
  const initialSearchData = {
    product: "",
    center: "",
    usageType: "",
    customer: "",
    reseller: "",
    startDate: "",
    endDate: "",
    connectionType: "",
  };

  const [searchData, setSearchData] = useState(initialSearchData);

  const [resellers, setResellers] = useState([]);
  const [loadingResellers, setLoadingResellers] = useState(false);

  const [resellerCenters, setResellerCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  // Fetch resellers
  useEffect(() => {
    const fetchResellers = async () => {
      setLoadingResellers(true);

      try {
        const response = await axiosInstance.get("/resellers");

        if (response.data.success) {
          setResellers(response.data.data || []);
        } else {
          setResellers([]);
        }
      } catch (error) {
        console.error("Error fetching resellers:", error);
        setResellers([]);
      } finally {
        setLoadingResellers(false);
      }
    };

    fetchResellers();
  }, []);

  // Fetch branches when reseller changes
  useEffect(() => {
    const fetchCentersByReseller = async () => {
      if (!searchData.reseller) {
        setResellerCenters([]);

        setSearchData((prev) => ({
          ...prev,
          center: "",
        }));

        return;
      }

      setLoadingCenters(true);

      try {
        const response = await axiosInstance.get(
          `/centers/reseller/${searchData.reseller}`
        );

        if (response.data.success) {
          setResellerCenters(response.data.data || []);
        } else {
          setResellerCenters([]);
        }
      } catch (error) {
        console.error(
          "Error fetching centers for reseller:",
          error
        );
        setResellerCenters([]);
      } finally {
        setLoadingCenters(false);
      }
    };

    fetchCentersByReseller();
  }, [searchData.reseller]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchData({ ...initialSearchData });
      setResellerCenters([]);
    }
  }, [visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  const handleSearch = () => {
    const apiSearchData = {
      product: searchData.product,
      center: searchData.center,
      usageType: searchData.usageType,
      customer: searchData.customer,
      reseller: searchData.reseller,
      startDate: formatDateToDDMMYYYY(searchData.startDate),
      endDate: formatDateToDDMMYYYY(searchData.endDate),
      connectionType: searchData.connectionType,
    };

    onSearch(apiSearchData);
    onClose();
  };

  const handleReset = () => {
    const resetData = { ...initialSearchData };

    setSearchData(resetData);
    setResellerCenters([]);

    onSearch(resetData);
    onClose();
  };

  if (!visible) return null;

  const resellerOptions = resellers.map((reseller) => ({
    value: reseller._id,
    label: reseller.businessName,
  }));

  const centerOptions = resellerCenters.map((center) => ({
    value: center._id,
    label: center.centerName,
  }));

  const customerOptions = customers.map((customer) => ({
    value: customer._id,
    label: `${customer.username} - ${customer.mobile}`,
  }));

  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.productTitle,
  }));

  const selectedReseller =
    resellerOptions.find(
      (option) => option.value === searchData.reseller
    ) || null;

  const selectedCenter =
    centerOptions.find(
      (option) => option.value === searchData.center
    ) || null;

  const selectedCustomer =
    customerOptions.find(
      (option) => option.value === searchData.customer
    ) || null;

  const selectedProduct =
    productOptions.find(
      (option) => option.value === searchData.product
    ) || null;

  // Dropdown appearance
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      height: "38px",
      borderRadius: "4px",
      borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 0.15rem rgba(13, 110, 253, 0.15)"
        : "none",
      backgroundColor: state.isDisabled ? "#f1f1f1" : "#ffffff",
      cursor: state.isDisabled ? "not-allowed" : "default",
      fontSize: "15px",
      "&:hover": {
        borderColor: state.isFocused ? "#86b7fe" : "#b8c0c8",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 10px",
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: "#343a40",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#777777",
      margin: 0,
    }),

    singleValue: (base) => ({
      ...base,
      color: "#343a40",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "36px",
    }),

    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#ced4da",
      marginTop: "6px",
      marginBottom: "6px",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      padding: "8px",
      color: "#6c757d",
    }),

    clearIndicator: (base) => ({
      ...base,
      padding: "6px",
    }),

    menu: (base) => ({
      ...base,
      zIndex: 10010,
      borderRadius: "4px",
      fontSize: "14px",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 10010,
    }),

    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      padding: "9px 12px",
      color: "#343a40",
      backgroundColor: state.isSelected
        ? "#0d6efd"
        : state.isFocused
          ? "#f1f4f8"
          : "#ffffff",
      cursor: "pointer",
    }),
  };

  const inputClass =
    "block h-[38px] w-full rounded-[4px] border border-[#ced4da] " +
    "bg-white px-[12px] text-[15px] font-normal text-[#343a40] " +
    "outline-none transition-colors placeholder:text-[#777] " +
    "focus:border-[#86b7fe] focus:ring-[3px] focus:ring-[#0d6efd]/10";

  const labelClass =
    "mb-[7px] block text-[15px] font-semibold leading-[18px] text-[#343a40]";

  const selectProps = {
    classNamePrefix: "usage-search-select",
    styles: selectStyles,
    menuPortalTarget:
      typeof document !== "undefined" ? document.body : undefined,
    menuPosition: "fixed",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-3 py-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Only the opening animation has been added to this dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="usage-search-title"
        className="usage-search-modal flex max-h-[calc(100vh-32px)] w-full max-w-[800px] flex-col overflow-hidden rounded-[6px] border border-[#dee2e6] bg-white shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex min-h-[62px] shrink-0 items-center justify-between border-b border-[#dee2e6] px-[15px] py-[12px]">
          <h2
            id="usage-search-title"
            className="m-0 text-[20px] font-normal leading-[28px] text-[#343a40]"
          >
            Search
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search form"
            className="flex h-[30px] w-[30px] items-center justify-center rounded text-[#858b91] transition-colors hover:bg-[#f1f3f5] hover:text-[#343a40]"
          >
            <X size={23} strokeWidth={1.8} />
          </button>
        </div>

        {/* Form body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-[15px] pb-[16px] pt-[17px]">
          <div className="grid grid-cols-1 gap-x-[20px] gap-y-[19px] md:grid-cols-2">
            {/* Reseller */}
            <div className="min-w-0">
              <label htmlFor="reseller" className={labelClass}>
                Reseller
              </label>

              <Select
                {...selectProps}
                inputId="reseller"
                name="reseller"
                placeholder={
                  loadingResellers
                    ? "Loading resellers..."
                    : "Select Reseller..."
                }
                value={selectedReseller}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    reseller: selected ? selected.value : "",
                    center: "",
                  }))
                }
                options={resellerOptions}
                isClearable
                isLoading={loadingResellers}
              />
            </div>

            {/* Branch */}
            <div className="min-w-0">
              <label htmlFor="center" className={labelClass}>
                Branch
              </label>

              <Select
                {...selectProps}
                inputId="center"
                name="center"
                placeholder={
                  loadingCenters
                    ? "Loading branches..."
                    : searchData.reseller
                      ? "Select Branch..."
                      : "Select a reseller first"
                }
                value={selectedCenter}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    center: selected ? selected.value : "",
                  }))
                }
                options={centerOptions}
                isClearable
                isDisabled={!searchData.reseller || loadingCenters}
                isLoading={loadingCenters}
              />

              {searchData.reseller &&
                !loadingCenters &&
                resellerCenters.length === 0 && (
                  <p className="mt-[4px] text-[12px] text-[#6c757d]">
                    No branches found for this reseller
                  </p>
                )}
            </div>

            {/* Type */}
            <div className="min-w-0">
              <label htmlFor="usageType" className={labelClass}>
                Type
              </label>

              <select
                id="usageType"
                name="usageType"
                value={searchData.usageType}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer pr-[10px]`}
              >
                <option value="">-SELECT-</option>
                <option value="Customer">Customer</option>
                <option value="Building">Building</option>
                <option value="Building to Building">
                  Building to Building
                </option>
                <option value="Control Room">Control Room</option>
                <option value="Damage">Damage</option>
                <option value="Stolen from Center">
                  Stolen from Center
                </option>
                <option value="Stolen from Field">
                  Stolen from Field
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* User */}
            <div className="min-w-0">
              <label htmlFor="customer" className={labelClass}>
                User
              </label>

              <Select
                {...selectProps}
                inputId="customer"
                name="customer"
                placeholder="Select User..."
                value={selectedCustomer}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    customer: selected ? selected.value : "",
                  }))
                }
                options={customerOptions}
                isClearable
              />
            </div>

            {/* Product */}
            <div className="min-w-0">
              <label htmlFor="product" className={labelClass}>
                Product
              </label>

              <Select
                {...selectProps}
                inputId="product"
                name="product"
                placeholder="Search Product..."
                value={selectedProduct}
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    product: selected ? selected.value : "",
                  }))
                }
                options={productOptions}
                isClearable
              />
            </div>

            {/* Connection Type */}
            <div className="min-w-0">
              <label htmlFor="connectionType" className={labelClass}>
                Connection Type
              </label>

              <select
                id="connectionType"
                name="connectionType"
                value={searchData.connectionType}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer pr-[10px]`}
              >
                <option value="">SELECT</option>
                <option value="New">new</option>
                <option value="Convert">convert</option>
                <option value="Shifting">shifting</option>
                <option value="Repair">Repair</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="min-w-0">
              <label htmlFor="startDate" className={labelClass}>
                Start Date
              </label>

              <input
                type="date"
                id="startDate"
                name="startDate"
                value={searchData.startDate}
                onChange={handleChange}
                className={inputClass}
              />

              <p className="mt-[3px] text-[13px] leading-[17px] text-[#6c757d]">
                Optional
              </p>
            </div>

            {/* End Date */}
            <div className="min-w-0">
              <label htmlFor="endDate" className={labelClass}>
                End Date
              </label>

              <input
                type="date"
                id="endDate"
                name="endDate"
                value={searchData.endDate}
                onChange={handleChange}
                className={inputClass}
              />

              <p className="mt-[3px] text-[13px] leading-[17px] text-[#6c757d]">
                Optional
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex min-h-[72px] shrink-0 items-center justify-end gap-[12px] border-t border-[#dee2e6] bg-white px-[15px] py-[15px]">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-[38px] items-center justify-center rounded-[5px] border border-[#6c757d] bg-[#6c757d] px-[13px] text-[15px] font-normal text-white transition-colors hover:border-[#5c636a] hover:bg-[#5c636a] focus:outline-none focus:ring-2 focus:ring-[#6c757d]/30"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex h-[38px] items-center justify-center rounded-[5px] border border-[#2f5fa7] bg-[#2f5fa7] px-[15px] text-[15px] font-normal text-white transition-colors hover:border-[#254d89] hover:bg-[#254d89] focus:outline-none focus:ring-2 focus:ring-[#2f5fa7]/30"
          >
            Search
          </button>
        </div>
      </div>

      {/* Top-to-bottom modal opening animation */}
      <style>{`
        .usage-search-modal {
          animation: usageSearchModalDrop 0.25s ease-out both;
          transform-origin: top center;
        }

        @keyframes usageSearchModalDrop {
          from {
            opacity: 0;
            transform: translateY(-28px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .usage-search-modal {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

SearchUsageDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
};

export default SearchUsageDetail;