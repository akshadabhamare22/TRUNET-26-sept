
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
  const [searchData, setSearchData] = useState({
    center: '',
    date: '',
  });

  const formatDateForPicker = (dateValue) => {
    if (!dateValue) return '';
    if (dateValue.includes(' to ')) return dateValue;
    return dateValue;
  };

  useEffect(() => {
    if (visible) {
      if (initialSearchData) {
        setSearchData({
          center: initialSearchData.center || '',
          date: formatDateForPicker(initialSearchData.date) || '',
        });
      } else {
        setSearchData({ center: '', date: '' });
      }
    }
  }, [visible, initialSearchData]);

  const handleDateChange = (dateValue) => {
    setSearchData((prev) => ({ ...prev, date: dateValue }));
  };

  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  const handleClose = () => {
    if (initialSearchData) {
      setSearchData({
        center: initialSearchData.center || '',
        date: formatDateForPicker(initialSearchData.date) || '',
      });
    } else {
      setSearchData({ center: '', date: '' });
    }
    onClose();
  };

  const handleReset = () => {
    setSearchData({ center: '', date: '' });
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '40px',
      borderRadius: '6px',
      borderColor: state.isFocused ? '#2759a2' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(39,89,162,0.12)' : 'none',
      '&:hover': { borderColor: '#2759a2' },
      fontSize: '14px',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10001,
      marginTop: '6px',
      borderRadius: '6px',
      overflow: 'hidden',
      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.16)',
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '320px',
      padding: '0',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
    }),
    option: (base, state) => ({
      ...base,
      padding: '10px 12px',
      fontSize: '14px',
      color: '#374151',
      backgroundColor: state.isSelected
        ? '#dbeafe'
        : state.isFocused
          ? '#eaf2ff'
          : '#ffffff',
      cursor: 'pointer',
      ':active': {
        ...base[':active'],
        backgroundColor: '#dbeafe',
      },
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 10001,
    }),
    placeholder: (base) => ({ ...base, color: '#858b95' }),
  };

  if (!visible) return null;

  return (
    // Overlay scrolls if needed; the inner wrapper centers the card both
    // vertically and horizontally. The date popup drops down below its field
    // (top -> bottom) and the overlay scrolls if it goes past the screen.
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/50 backdrop-blur-[2px]">
      <div className="flex min-h-full items-center justify-center px-4 py-8 sm:px-6">
      {/* overflow-hidden is NOT used on this card (it clipped the date popup).
          Rounded corners are applied to the header and footer instead. */}
      <div
        className="w-full max-w-3xl origin-top rounded-lg border border-slate-200 bg-white shadow-2xl"
        style={{
          animation: 'report-search-drop-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}
      >
        <style>{`
          @keyframes report-search-drop-in {
            from { opacity: 0; transform: translateY(-16px) scale(0.985); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            .report-search-modal-motion { animation: none !important; }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-800">Search</h2>
            <p className="mt-0.5 text-xs text-slate-500">Filter closing stock records</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (raised above the footer so the date popup is never covered) */}
        <div className="relative z-20 border-t-4 border-t-[#2759a2] px-5 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Date
              </label>
              <DatePicker
                value={searchData.date}
                onChange={handleDateChange}
                placeholder="Date"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="center"
                className="mb-2 block text-sm font-semibold text-slate-700"
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
                        value: searchData.center,
                        label:
                          centers.find((center) => center._id === searchData.center)
                            ?.centerName || '',
                      }
                    : null
                }
                onChange={(selected) =>
                  setSearchData((prev) => ({
                    ...prev,
                    center: selected ? selected.value : '',
                  }))
                }
                options={centers.map((center) => ({
                  value: center._id,
                  label: center.centerName,
                }))}
                isClearable
                menuPlacement="bottom"
                menuPosition="fixed"
                menuPortalTarget={document.body}
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex flex-col-reverse gap-2 rounded-b-lg border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <RotateCcw size={16} />
            Clear
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2759a2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f4b8b] focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

ReportSearchmodel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  initialSearchData: PropTypes.object,
};

ReportSearchmodel.defaultProps = {
  initialSearchData: null,
};

export default ReportSearchmodel;