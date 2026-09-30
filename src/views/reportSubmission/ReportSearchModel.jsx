import React, { useEffect, useState } from 'react';
import { RotateCcw, Search, X } from 'lucide-react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import DatePicker from '../../utils/DatePicker';

const ReportSearchmodel = ({
  visible,
  onClose,
  onSearch,
  centers,
  initialSearchData,
}) => {
  const [searchData, setSearchData] =
    useState({
      center: '',
      date: '',
    });

  /* =========================================================
     FORMAT DATE FOR DATE PICKER
  ========================================================= */

  const formatDateForPicker = (
    dateValue
  ) => {
    if (!dateValue) {
      return '';
    }

    if (dateValue.includes(' to ')) {
      return dateValue;
    }

    return dateValue;
  };

  /* =========================================================
     LOAD INITIAL SEARCH DATA
  ========================================================= */

  useEffect(() => {
    if (visible) {
      if (initialSearchData) {
        setSearchData({
          center:
            initialSearchData.center ||
            '',

          date:
            formatDateForPicker(
              initialSearchData.date
            ) || '',
        });
      } else {
        setSearchData({
          center: '',
          date: '',
        });
      }
    }
  }, [
    visible,
    initialSearchData,
  ]);

  /* =========================================================
     DATE CHANGE
  ========================================================= */

  const handleDateChange = (
    dateValue
  ) => {
    setSearchData((prev) => ({
      ...prev,
      date: dateValue,
    }));
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  /* =========================================================
     CLOSE
  ========================================================= */

  const handleClose = () => {
    if (initialSearchData) {
      setSearchData({
        center:
          initialSearchData.center ||
          '',

        date:
          formatDateForPicker(
            initialSearchData.date
          ) || '',
      });
    } else {
      setSearchData({
        center: '',
        date: '',
      });
    }

    onClose();
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    setSearchData({
      center: '',
      date: '',
    });
  };

  /* =========================================================
     SELECT STYLES
  ========================================================= */

  const selectStyles = {
    control: (
      base,
      state
    ) => ({
      ...base,
      minHeight: '40px',
      borderRadius: '8px',
      borderColor:
        state.isFocused
          ? '#3b82f6'
          : '#d1d5db',
      boxShadow:
        state.isFocused
          ? '0 0 0 1px #3b82f6'
          : 'none',
      '&:hover': {
        borderColor:
          '#9ca3af',
      },
    }),

    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  /* =========================================================
     MODAL
  ========================================================= */

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================== */}

        <div className="px-5 py-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* DATE */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Date
              </label>

              <DatePicker
                value={
                  searchData.date
                }
                onChange={
                  handleDateChange
                }
                placeholder="Date"
                className="w-full"
              />
            </div>

            {/* BRANCH */}

            <div>
              <label
                htmlFor="center"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Branch
              </label>

              <Select
                inputId="center"
                name="center"
                placeholder="Select Branch..."
                value={
                  searchData.center
                    ? {
                        value:
                          searchData.center,
                        label:
                          centers.find(
                            (center) =>
                              center._id ===
                              searchData.center
                          )
                            ?.centerName ||
                          '',
                      }
                    : null
                }
                onChange={(
                  selected
                ) =>
                  setSearchData(
                    (prev) => ({
                      ...prev,
                      center:
                        selected
                          ? selected.value
                          : '',
                    })
                  )
                }
                options={centers.map(
                  (center) => ({
                    value:
                      center._id,
                    label:
                      center.centerName,
                  })
                )}
                isClearable
                styles={
                  selectStyles
                }
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw
              size={16}
            />
            Clear
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

ReportSearchmodel.propTypes = {
  visible:
    PropTypes.bool.isRequired,

  onClose:
    PropTypes.func.isRequired,

  onSearch:
    PropTypes.func.isRequired,

  centers:
    PropTypes.array.isRequired,

  initialSearchData:
    PropTypes.object,
};

ReportSearchmodel.defaultProps = {
  initialSearchData: null,
};

export default ReportSearchmodel;