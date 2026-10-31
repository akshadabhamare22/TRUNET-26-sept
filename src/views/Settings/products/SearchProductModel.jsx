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