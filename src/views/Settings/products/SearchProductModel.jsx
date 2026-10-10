// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { X } from "lucide-react";

// const SearchProductModel = ({
//   visible,
//   onClose,
//   onSearch,
//   categories,
// }) => {
//   const [searchData, setSearchData] = useState({
//     keyword: "",
//     category: "",
//     status: "",
//   });

//   // Reset form whenever modal is closed
//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         keyword: "",
//         category: "",
//         status: "",
//       });
//     }
//   }, [visible]);

//   // Handle input/select changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setSearchData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Search
//   const handleSearch = () => {
//     onSearch(searchData);
//     onClose();
//   };

//   // Reset
//   const handleReset = () => {
//     const resetData = {
//       keyword: "",
//       category: "",
//       status: "",
//     };

//     setSearchData(resetData);
//     onSearch(resetData);
//   };

//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
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

//         {/* Modal Body */}
//         <div className="p-5">
//           {/* Row 1 */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Keyword */}
//             <div>
//               <label
//                 htmlFor="keyword"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Keyword
//               </label>

//               <input
//                 type="text"
//                 id="keyword"
//                 name="keyword"
//                 value={searchData.keyword}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>

//             {/* Product Category */}
//             <div>
//               <label
//                 htmlFor="category"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Product Category
//               </label>

//               <select
//                 id="category"
//                 name="category"
//                 value={searchData.category}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               >
//                 <option value="">
//                   SELECT CATEGORY
//                 </option>

//                 {categories.map((cat) => (
//                   <option
//                     key={cat._id}
//                     value={cat.productCategory}
//                   >
//                     {cat.productCategory}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* Status */}
//             <div>
//               <label
//                 htmlFor="status"
//                 className="mb-1.5 block text-sm font-medium text-gray-700"
//               >
//                 Status
//               </label>

//               <select
//                 id="status"
//                 name="status"
//                 value={searchData.status}
//                 onChange={handleChange}
//                 className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               >
//                 <option value="">
//                   SELECT STATUS
//                 </option>

//                 <option value="Enable">
//                   Enable
//                 </option>

//                 <option value="Disable">
//                   Disable
//                 </option>
//               </select>
//             </div>

//             {/* Empty column - preserved from original */}
//             <div />
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="rounded-md border border-gray-300 bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//           >
//             Close
//           </button>

//           <button
//             type="button"
//             onClick={handleSearch}
//             className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           >
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// SearchProductModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   categories: PropTypes.array.isRequired,
// };

// export default SearchProductModel;

import React, { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";

const SearchProductModel = ({
  visible,
  onClose,
  onSearch,
  categories = [],
}) => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!visible) {
      return;
    }

    setKeyword("");
    setCategory("");
    setStatus("");
  }, [visible]);

  if (!visible) {
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch({
      keyword,
      category,
      status,
    });
     onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {/* ================= OVERLAY ================= */}
      <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 px-4">
        {/* ================= MODAL ================= */}
        <div
          className="
            mt-[80px]
            w-full
            max-w-[800px]
            overflow-hidden
            rounded-[7px]
            bg-white
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            animate-[searchCurtain_0.4s_ease-out]
          "
        >
          {/* ================= HEADER ================= */}
          <div
            className="
              flex
              h-[68px]
              items-center
              justify-between
              border-b
              border-[#dee2e6]
              bg-white
              px-[17px]
            "
          >
            <h2
              className="
                m-0
                text-[23px]
                font-normal
                leading-none
                text-[#343a40]
              "
            >
              Search
            </h2>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="
                flex
                h-[38px]
                w-[38px]
                items-center
                justify-center
                rounded
                text-[#777]
                transition-all
                duration-200
                hover:bg-[#f1f1f1]
                hover:text-[#333]
              "
            >
              <X size={25} strokeWidth={1.8} />
            </button>
          </div>

          {/* ================= FORM ================= */}
          <form onSubmit={handleSearch}>
            {/* ================= BODY ================= */}
            <div className="px-[17px] pb-[30px] pt-[18px]">
              <div className="grid grid-cols-1 gap-x-[21px] gap-y-[22px] md:grid-cols-2">
                {/* ================= KEYWORD ================= */}
                <div>
                  <label
                    htmlFor="search-keyword"
                    className="
                      mb-[8px]
                      block
                      text-[16px]
                      font-semibold
                      leading-[20px]
                      text-[#343a40]
                    "
                  >
                    Keyword
                  </label>

                  <input
                    id="search-keyword"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="
                      h-[41px]
                      w-full
                      rounded-[2px]
                      border
                      border-[#d9d9d9]
                      bg-white
                      px-[12px]
                      text-[16px]
                      text-[#343a40]
                      outline-none
                      transition
                      duration-200
                      focus:border-[#2f5fa7]
                      focus:ring-1
                      focus:ring-[#2f5fa7]/20
                    "
                  />
                </div>

                {/* ================= PRODUCT CATEGORY ================= */}
                <div>
                  <label
                    htmlFor="search-category"
                    className="
                      mb-[8px]
                      block
                      text-[16px]
                      font-semibold
                      leading-[20px]
                      text-[#343a40]
                    "
                  >
                    Product Category
                  </label>

                  <div className="relative">
                    <select
                      id="search-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="
                        h-[41px]
                        w-full
                        appearance-none
                        rounded-[2px]
                        border
                        border-[#d9d9d9]
                        bg-white
                        px-[12px]
                        pr-[40px]
                        text-[16px]
                        text-[#343a40]
                        outline-none
                        transition
                        duration-200
                        focus:border-[#2f5fa7]
                        focus:ring-1
                        focus:ring-[#2f5fa7]/20
                      "
                    >
                      <option value="">SELECT CATEGORY</option>

                      {categories.map((item, index) => {
                        const value =
                          item?._id ||
                          item?.id ||
                          item?.productCategory ||
                          "";

                        const label =
                          item?.productCategory ||
                          item?.categoryName ||
                          item?.name ||
                          item?.title ||
                          "";

                        return (
                          <option
                            key={item?._id || item?.id || index}
                            value={value}
                          >
                            {label}
                          </option>
                        );
                      })}
                    </select>

                    <ChevronDown
                      size={18}
                      strokeWidth={1.8}
                      className="
                        pointer-events-none
                        absolute
                        right-[12px]
                        top-1/2
                        -translate-y-1/2
                        text-[#333]
                      "
                    />
                  </div>
                </div>

                {/* ================= STATUS ================= */}
                <div>
                  <label
                    htmlFor="search-status"
                    className="
                      mb-[8px]
                      block
                      text-[16px]
                      font-semibold
                      leading-[20px]
                      text-[#343a40]
                    "
                  >
                    Status
                  </label>

                  <div className="relative">
                    <select
                      id="search-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="
                        h-[41px]
                        w-full
                        appearance-none
                        rounded-[2px]
                        border
                        border-[#d9d9d9]
                        bg-white
                        px-[12px]
                        pr-[40px]
                        text-[16px]
                        text-[#343a40]
                        outline-none
                        transition
                        duration-200
                        focus:border-[#2f5fa7]
                        focus:ring-1
                        focus:ring-[#2f5fa7]/20
                      "
                    >
                      <option value="">SELECT STATUS</option>
                      <option value="Enable">Enable</option>
                      <option value="Disable">Disable</option>
                    </select>

                    <ChevronDown
                      size={18}
                      strokeWidth={1.8}
                      className="
                        pointer-events-none
                        absolute
                        right-[12px]
                        top-1/2
                        -translate-y-1/2
                        text-[#333]
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div
              className="
                flex
                items-center
                justify-end
                gap-[12px]
                border-t
                border-[#dee2e6]
                bg-white
                px-[17px]
                py-[18px]
              "
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="
                  h-[41px]
                  rounded-[6px]
                  bg-[#6c757d]
                  px-[15px]
                  text-[16px]
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#5c636a]
                  active:scale-[0.98]
                "
              >
                Close
              </button>

              {/* Search Button */}
              <button
                type="submit"
                className="
                  h-[41px]
                  rounded-[6px]
                  bg-[#2f5fa7]
                  px-[17px]
                  text-[16px]
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#244c88]
                  active:scale-[0.98]
                "
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= CURTAIN ANIMATION ================= */}
      <style>
        {`
          @keyframes searchCurtain {
            0% {
              opacity: 0;
              transform: translateY(-60px) scaleY(0.82);
              transform-origin: top center;
            }

            45% {
              opacity: 1;
              transform: translateY(8px) scaleY(1.03);
              transform-origin: top center;
            }

            70% {
              transform: translateY(-3px) scaleY(0.99);
              transform-origin: top center;
            }

            100% {
              opacity: 1;
              transform: translateY(0) scaleY(1);
              transform-origin: top center;
            }
          }
        `}
      </style>
    </>
  );
};

export default SearchProductModel;