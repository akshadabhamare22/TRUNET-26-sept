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

const SearchUserModel = ({
  visible,
  onClose,
  onSearch,
  centers,
  roles,
  status,
}) => {
  const [searchData, setSearchData] =
    useState({
      keyword: "",
      center: "",
      role: "",
      status: "",
    });

  // --------------------------------------------------
  // Reset when modal closes
  // --------------------------------------------------
  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        center: "",
        role: "",
        status: "",
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
      center: "",
      role: "",
      status: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* ------------------------------------------------ */}
      {/* Top Down Modal Animation */}
      {/* ------------------------------------------------ */}
      <style>
        {`
          @keyframes searchUserModalDropDown {
            0% {
              opacity: 0;
              transform: translateY(-80px) scale(0.98);
            }

            60% {
              opacity: 1;
              transform: translateY(8px) scale(1);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes searchUserBackdropFade {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          .search-user-backdrop {
            animation: searchUserBackdropFade 0.2s ease-out forwards;
          }

          .search-user-modal {
            animation: searchUserModalDropDown 0.42s
              cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        `}
      </style>

      {/* ------------------------------------------------ */}
      {/* Overlay */}
      {/* ------------------------------------------------ */}
      <div
        className="
          search-user-backdrop
          fixed
          inset-0
          z-[9999]
          flex
          items-start
          justify-center
          overflow-y-auto
          bg-black/50
          px-4
          pb-8
          pt-[70px]
          sm:pt-[90px]
        "
      >
        {/* ------------------------------------------------ */}
        {/* Modal */}
        {/* ------------------------------------------------ */}
        <div
          className="
            search-user-modal
            w-full
            max-w-[760px]
            overflow-hidden
            rounded-[4px]
            border
            border-[#dfe3e8]
            bg-white
            shadow-[0_12px_35px_rgba(0,0,0,0.25)]
          "
        >
        

          {/* ------------------------------------------------ */}
          {/* Header */}
          {/* ------------------------------------------------ */}
          <div
            className="
              flex
              h-[60px]
              items-center
              justify-between
              border-b
              border-[#e1e5e9]
              bg-white
              px-[18px]
              sm:px-[20px]
            "
          >
            <h2
              className="
                m-0
                text-[21px]
                font-normal
                leading-none
                text-[#263238]
              "
            >
              Search
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="
                flex
                h-[30px]
                w-[30px]
                items-center
                justify-center
                rounded-[3px]
                text-[#8a8f94]
                transition-all
                duration-200
                hover:bg-[#f1f3f5]
                hover:text-[#333]
                focus:outline-none
              "
            >
              <X size={18} strokeWidth={1.7} />
            </button>
          </div>

          {/* ------------------------------------------------ */}
          {/* Body */}
          {/* ------------------------------------------------ */}
          <div
            className="
              px-[18px]
              py-[22px]
              sm:px-[20px]
              sm:py-[24px]
            "
          >
            <div
              className="
                grid
                grid-cols-1
                gap-x-[22px]
                gap-y-[20px]
                md:grid-cols-2
              "
            >
              {/* ------------------------------------------------ */}
              {/* Keyword */}
              {/* ------------------------------------------------ */}
              <div>
                <label
                  htmlFor="keyword"
                  className="
                    mb-[7px]
                    block
                    text-[15px]
                    font-semibold
                    text-[#172033]
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
                  onChange={handleChange}
                  className="
                    h-[40px]
                    w-full
                    rounded-none
                    border
                    border-[#d8dadd]
                    bg-white
                    px-[11px]
                    text-[14px]
                    text-[#212529]
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-[#999]
                    focus:border-[#2f64ad]
                    focus:ring-0
                  "
                />
              </div>

              {/* ------------------------------------------------ */}
              {/* Center */}
              {/* ------------------------------------------------ */}
              <div>
                <label
                  htmlFor="center"
                  className="
                    mb-[7px]
                    block
                    text-[15px]
                    font-semibold
                    text-[#172033]
                  "
                >
                  Center
                </label>

                <select
                  id="center"
                  name="center"
                  value={
                    searchData.center
                  }
                  onChange={handleChange}
                  className="
                    h-[40px]
                    w-full
                    cursor-pointer
                    rounded-none
                    border
                    border-[#d8dadd]
                    bg-white
                    px-[11px]
                    text-[14px]
                    text-[#212529]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-[#2f64ad]
                    focus:ring-0
                  "
                >
                  <option value="">
                    SELECT CENTER
                  </option>

                  {centers.map(
                    (center) => (
                      <option
                        key={center._id}
                        value={center._id}
                      >
                        {
                          center.centerName
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* ------------------------------------------------ */}
              {/* Role */}
              {/* ------------------------------------------------ */}
              <div>
                <label
                  htmlFor="role"
                  className="
                    mb-[7px]
                    block
                    text-[15px]
                    font-semibold
                    text-[#172033]
                  "
                >
                  Role
                </label>

                <select
                  id="role"
                  name="role"
                  value={
                    searchData.role
                  }
                  onChange={handleChange}
                  className="
                    h-[40px]
                    w-full
                    cursor-pointer
                    rounded-none
                    border
                    border-[#d8dadd]
                    bg-white
                    px-[11px]
                    text-[14px]
                    text-[#212529]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-[#2f64ad]
                    focus:ring-0
                  "
                >
                  <option value="">
                    SELECT ROLE
                  </option>

                  {roles.map(
                    (role) => (
                      <option
                        key={role._id}
                        value={role._id}
                      >
                        {
                          role.roleTitle
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* ------------------------------------------------ */}
              {/* Status */}
              {/* ------------------------------------------------ */}
              <div>
                <label
                  htmlFor="status"
                  className="
                    mb-[7px]
                    block
                    text-[15px]
                    font-semibold
                    text-[#172033]
                  "
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    searchData.status
                  }
                  onChange={handleChange}
                  className="
                    h-[40px]
                    w-full
                    cursor-pointer
                    rounded-none
                    border
                    border-[#d8dadd]
                    bg-white
                    px-[11px]
                    text-[14px]
                    text-[#212529]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-[#2f64ad]
                    focus:ring-0
                  "
                >
                  <option value="">
                    -SELECT-
                  </option>

                  <option value="Enable">
                    Enable
                  </option>

                  <option value="Disable">
                    Disable
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* Footer */}
          {/* ------------------------------------------------ */}
          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-[#e1e5e9]
              bg-[#fafafa]
              px-[18px]
              py-[15px]
              sm:flex-row
              sm:justify-end
              sm:px-[20px]
            "
          >
            {/* Reset / Close */}
            <button
              type="button"
              onClick={
                handleReset
              }
              className="
                inline-flex
                h-[40px]
                items-center
                justify-center
                gap-2
                rounded-[4px]
                border
                border-[#2f64ad]
                bg-[#2f64ad]
                px-[17px]
                text-[14px]
                font-medium
                text-white
                transition-all
                duration-200
                hover:bg-[#245494]
                focus:outline-none
              "
            >
              <RotateCcw
                size={15}
                strokeWidth={2}
              />

              Close
            </button>

            {/* Search */}
            <button
              type="button"
              onClick={
                handleSearch
              }
              className="
                inline-flex
                h-[40px]
                items-center
                justify-center
                gap-2
                rounded-[4px]
                bg-[#2f64ad]
                px-[18px]
                text-[14px]
                font-medium
                text-white
                transition-all
                duration-200
                hover:bg-[#245494]
                focus:outline-none
              "
            >
              <Search
                size={16}
                strokeWidth={2}
              />

              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

SearchUserModel.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  onSearch:
    PropTypes.func.isRequired,

  centers:
    PropTypes.array.isRequired,

  roles:
    PropTypes.array.isRequired,

  status:
    PropTypes.array.isRequired,
};

export default SearchUserModel;