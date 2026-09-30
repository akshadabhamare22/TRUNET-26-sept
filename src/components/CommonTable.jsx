import React from 'react'
import {
  Plus,
  Search,
  FileSpreadsheet,
} from 'lucide-react'

function CommonTable() {
  return (
    <>
      <h5 className="mb-2 text-base font-semibold text-gray-700">
        Closing Stock Logs
      </h5>

      <div
        className="
          rounded-md
          border-t-[3px] border-[#2759A2]
          bg-white
          p-2.5
          shadow-sm
        "
      >
        <form className="flex w-full flex-wrap">
          {/* Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              className="
                inline-flex items-center
                rounded
                bg-[#2759A2]
                px-2 py-1
                text-sm text-white
                transition-colors
                hover:bg-[#1f4a89]
              "
            >
              <Plus size={18} className="mr-1.5" />
              Add
            </button>

            <button
              type="button"
              className="
                inline-flex items-center
                rounded
                bg-[#2759A2]
                px-2 py-1
                text-sm text-white
                transition-colors
                hover:bg-[#1f4a89]
              "
            >
              <Search size={18} className="mr-1.5" />
              Export
            </button>

            <button
              type="button"
              className="
                inline-flex items-center
                rounded
                bg-[#2759A2]
                px-2 py-1
                text-sm text-white
                transition-colors
                hover:bg-[#1f4a89]
              "
            >
              <FileSpreadsheet size={18} className="mr-1.5" />
              Search
            </button>
          </div>

          {/* Divider */}
          <hr className="my-2.5 w-full border-0 border-t border-gray-200" />

          {/* Search */}
          <div className="ml-auto mr-5 flex items-center gap-1.5">
            <label
              htmlFor="common-table-search"
              className="text-sm text-gray-700"
            >
              Search:
            </label>

            <input
              id="common-table-search"
              type="search"
              placeholder=""
              className="
                h-[27px]
                w-[180px]
                rounded-none
                border-l-2 border-t-2
                border-l-gray-800 border-t-gray-800
                border-r-2 border-b-2
                border-r-gray-500 border-b-gray-500
                px-1 py-0.5
                text-sm
                outline-none
                focus:ring-1 focus:ring-[#2759A2]
              "
            />
          </div>
        </form>
      </div>
    </>
  )
}

export default CommonTable