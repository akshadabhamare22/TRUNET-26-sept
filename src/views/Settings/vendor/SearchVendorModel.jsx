// import React, {
//   useEffect,
//   useState,
// } from "react";
// import PropTypes from "prop-types";
// import {
//   Search,
//   RotateCcw,
//   X,
// } from "lucide-react";

// const SearchVendorModel = ({
//   visible,
//   onClose,
//   onSearch,
// }) => {
//   const [searchData, setSearchData] =
//     useState({
//       keyword: "",
//     });

//   // --------------------------------------------------
//   // Reset when modal closes
//   // --------------------------------------------------
//   useEffect(() => {
//     if (!visible) {
//       setSearchData({
//         keyword: "",
//       });
//     }
//   }, [visible]);

//   // --------------------------------------------------
//   // Handle Change
//   // --------------------------------------------------
//   const handleChange = (e) => {
//     const {
//       name,
//       value,
//     } = e.target;

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
//     };

//     setSearchData(resetData);
//     onSearch(resetData);
//   };

//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//       <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl">
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
//         <div className="px-6 py-5">
//           <div>
//             <label
//               htmlFor="keyword"
//               className="mb-1.5 block text-sm font-medium text-gray-700"
//             >
//               Keyword
//             </label>

//             <input
//               type="text"
//               id="keyword"
//               name="keyword"
//               value={searchData.keyword}
//               onChange={handleChange}
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//             />
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
//             Close
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

// SearchVendorModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
// };

// export default SearchVendorModel;


import React, {
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  Search,
  RotateCcw,
  X,
} from "lucide-react";

const SearchVendorModel = ({
  visible,
  onClose,
  onSearch,
}) => {
  const [searchData, setSearchData] =
    useState({
      keyword: "",
    });

  // --------------------------------------------------
  // Reset when modal closes
  // --------------------------------------------------
  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
      });
    }
  }, [visible]);

  // --------------------------------------------------
  // Handle Change
  // --------------------------------------------------
  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    const resetData = {
      keyword: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* ==================================================
          MODAL ANIMATION
      ================================================== */}
      <style>
        {`
          @keyframes vendorSearchBackdrop {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes vendorSearchSlideDown {
            from {
              opacity: 0;
              transform: translateY(-55px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* ==================================================
          BACKDROP
      ================================================== */}
      <div
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-start
          justify-center
          bg-black/50
          px-4
          pt-[125px]
        "
        style={{
          animation:
            "vendorSearchBackdrop 0.22s ease-out forwards",
        }}
      >
        {/* ==================================================
            MODAL
        ================================================== */}
        <div
          className="
            w-full
            max-w-[800px]
            overflow-hidden
            rounded-[7px]
            bg-white
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          "
          style={{
            animation:
              "vendorSearchSlideDown 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        >
          {/* ==================================================
              HEADER
          ================================================== */}
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
              onClick={onClose}
              className="
                flex
                h-[38px]
                w-[38px]
                items-center
                justify-center
                rounded-[4px]
                text-[#777]
                transition
                duration-150
                hover:bg-[#f1f1f1]
                hover:text-[#333]
                focus:outline-none
              "
              aria-label="Close"
            >
              <X
                size={25}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* ==================================================
              BODY
          ================================================== */}
          <div
            className="
              px-[17px]
              pb-[30px]
              pt-[18px]
            "
          >
            <div>
              <label
                htmlFor="keyword"
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
                type="text"
                id="keyword"
                name="keyword"
                value={
                  searchData.keyword
                }
                onChange={
                  handleChange
                }
                autoFocus
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
                  duration-150
                  placeholder:text-[#999]
                  focus:border-[#2f5fa7]
                  focus:ring-1
                  focus:ring-[#2f5fa7]/20
                "
              />
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}
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
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="
                h-[41px]
                rounded-[6px]
                bg-[#6c757d]
                px-[15px]
                text-[16px]
                font-medium
                text-white
                transition
                duration-150
                hover:bg-[#5c636a]
                focus:outline-none
                focus:ring-2
                focus:ring-[#6c757d]/30
              "
            >
              Close
            </button>

            {/* Search */}
            <button
              type="button"
              onClick={handleSearch}
              className="
                h-[41px]
                rounded-[6px]
                bg-[#2f5fa7]
                px-[17px]
                text-[16px]
                font-medium
                text-white
                transition
                duration-150
                hover:bg-[#244c88]
                focus:outline-none
                focus:ring-2
                focus:ring-[#2f5fa7]/30
              "
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

SearchVendorModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchVendorModel;