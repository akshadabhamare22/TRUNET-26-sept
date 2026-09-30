import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Search,
  RotateCcw,
  Settings,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react'

import Pagination from '../../utils/Pagination'

const getValue = (obj, path) => {
  return path
    .split('.')
    .reduce(
      (acc, part) =>
        acc && acc[part],
      obj,
    )
}

const ReusableTable = ({
  title,
  fetchData,
  fetchCenters,
  addLink,
  searchComponent: SearchModal,
  columns,
  onRowClick,
  onEdit,
  onDelete,
}) => {
  const [records, setRecords] = useState([])
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: 'ascending',
    })

  const [searchTerm, setSearchTerm] =
    useState('')

  const [
    searchModalVisible,
    setSearchModalVisible,
  ] = useState(false)

  const [activeSearch, setActiveSearch] =
    useState({
      keyword: '',
      center: '',
    })

  const [dropdownOpen, setDropdownOpen] =
    useState({})

  const [currentPage, setCurrentPage] =
    useState(1)

  const [totalPages, setTotalPages] =
    useState(1)

  const dropdownRefs = useRef({})
  const navigate = useNavigate()

  const handleFetch = async (
    searchParams = {},
    page = 1,
  ) => {
    try {
      setLoading(true)
      setError(null)

      const {
        data,
        pagination,
      } = await fetchData(
        searchParams,
        page,
      )

      setRecords(data)
      setCurrentPage(
        pagination.currentPage,
      )
      setTotalPages(
        pagination.totalPages,
      )
    } catch (err) {
      setError(
        err?.message || 'Something went wrong',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadCenters = async () => {
      if (!fetchCenters) {
        return
      }

      try {
        const response =
          await fetchCenters()

        setCenters(response)
      } catch (err) {
        console.error(
          'Error fetching centers:',
          err,
        )
      }
    }

    loadCenters()
    handleFetch()
  }, [])

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return
    }

    handleFetch(
      activeSearch,
      page,
    )
  }

  const handleSort = (key) => {
    let direction = 'ascending'

    if (
      sortConfig.key === key &&
      sortConfig.direction ===
        'ascending'
    ) {
      direction = 'descending'
    }

    setSortConfig({
      key,
      direction,
    })

    const sorted = [...records].sort(
      (a, b) => {
        const aValue = getValue(a, key)
        const bValue = getValue(b, key)

        if (aValue < bValue) {
          return direction === 'ascending'
            ? -1
            : 1
        }

        if (aValue > bValue) {
          return direction === 'ascending'
            ? 1
            : -1
        }

        return 0
      },
    )

    setRecords(sorted)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction ===
      'ascending' ? (
      <ArrowUp
        size={14}
        className="inline-block"
      />
    ) : (
      <ArrowDown
        size={14}
        className="inline-block"
      />
    )
  }

  const handleSearch = (searchData) => {
    setActiveSearch(searchData)
    handleFetch(searchData, 1)
  }

  const handleResetSearch = () => {
    setActiveSearch({
      keyword: '',
      center: '',
    })

    setSearchTerm('')

    handleFetch({}, 1)
  }

  const filteredRecords =
    records.filter((record) =>
      Object.values(record).some(
        (value) => {
          if (
            typeof value === 'object' &&
            value !== null
          ) {
            return Object.values(value).some(
              (nested) =>
                nested &&
                nested
                  .toString()
                  .toLowerCase()
                  .includes(
                    searchTerm.toLowerCase(),
                  ),
            )
          }

          return (
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase(),
              )
          )
        },
      ),
    )

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  useEffect(() => {
    const handleClickOutside = (
      event,
    ) => {
      const newDropdownState = {}
      let shouldUpdate = false

      Object.keys(
        dropdownRefs.current,
      ).forEach((key) => {
        if (
          dropdownRefs.current[key] &&
          !dropdownRefs.current[
            key
          ].contains(event.target)
        ) {
          newDropdownState[key] = false
          shouldUpdate = true
        }
      })

      if (shouldUpdate) {
        setDropdownOpen((prev) => ({
          ...prev,
          ...newDropdownState,
        }))
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-[#2759A2]"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="
          rounded-md
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-700
        "
      >
        Error: {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-2 text-base font-semibold text-gray-700">
        {title}
      </div>

      {/* Search Modal */}
      {SearchModal && (
        <SearchModal
          visible={searchModalVisible}
          onClose={() =>
            setSearchModalVisible(false)
          }
          onSearch={handleSearch}
          centers={centers}
        />
      )}

      {/* Main Card */}
      <div
        className="
          mt-4
          overflow-hidden
          rounded-md
          border-t-[3px]
          border-[#2759A2]
          bg-white
          shadow-sm
        "
      >
        {/* Card Header */}
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-b
            border-gray-200
            px-3
            py-2
          "
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Add */}
            {addLink && (
              <button
                type="button"
                onClick={() =>
                  navigate(addLink)
                }
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded
                  bg-[#2759A2]
                  px-2.5
                  py-1.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-[#1f4a89]
                "
              >
                <Plus size={16} />
                Add
              </button>
            )}

            {/* Search */}
            {SearchModal && (
              <button
                type="button"
                onClick={() =>
                  setSearchModalVisible(
                    true,
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded
                  bg-[#2759A2]
                  px-2.5
                  py-1.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-[#1f4a89]
                "
              >
                <Search size={16} />
                Search
              </button>
            )}

            {/* Reset Search */}
            {(
              activeSearch.keyword ||
              activeSearch.center
            ) && (
              <button
                type="button"
                onClick={
                  handleResetSearch
                }
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded
                  bg-gray-500
                  px-2.5
                  py-1.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-gray-600
                "
              >
                <RotateCcw size={16} />
                Reset Search
              </button>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={
              handlePageChange
            }
          />
        </div>

        {/* Card Body */}
        <div className="p-3">
          {/* Table Search */}
          <div className="mb-3 flex justify-between">
            <div />

            <div className="flex items-center gap-2">
              <label
                htmlFor="table-search"
                className="
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Search:
              </label>

              <input
                id="table-search"
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value,
                  )
                }
                className="
                  h-[30px]
                  w-full
                  max-w-[350px]
                  rounded-none
                  border
                  border-gray-300
                  px-2
                  text-sm
                  outline-none
                  focus:border-[#2759A2]
                  focus:ring-1
                  focus:ring-[#2759A2]
                "
              />
            </div>
          </div>

          {/* Responsive Table */}
          <div className="w-full overflow-x-auto">
            <table
              className="
                min-w-full
                border-collapse
                border
                border-gray-300
                text-sm
              "
            >
              <thead>
                <tr className="bg-gray-100">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      onClick={
                        col.sortable
                          ? () =>
                              handleSort(
                                col.key,
                              )
                          : undefined
                      }
                      className={`
                        whitespace-nowrap
                        border
                        border-gray-300
                        px-3
                        py-2
                        text-left
                        font-semibold
                        text-gray-700
                        ${
                          col.sortable
                            ? 'cursor-pointer hover:bg-gray-200'
                            : ''
                        }
                      `}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}

                        {col.sortable &&
                          getSortIcon(
                            col.key,
                          )}
                      </span>
                    </th>
                  ))}

                  {(onEdit ||
                    onDelete) && (
                    <th
                      scope="col"
                      className="
                        whitespace-nowrap
                        border
                        border-gray-300
                        px-3
                        py-2
                        text-left
                        font-semibold
                        text-gray-700
                      "
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length >
                0 ? (
                  filteredRecords.map(
                    (row) => (
                      <tr
                        key={row._id}
                        onClick={() =>
                          onRowClick &&
                          onRowClick(row)
                        }
                        className={`
                          border-b
                          border-gray-200
                          transition-colors
                          ${
                            onRowClick
                              ? 'cursor-pointer hover:bg-gray-50'
                              : ''
                          }
                          even:bg-gray-50/50
                        `}
                      >
                        {columns.map(
                          (col) => (
                            <td
                              key={
                                col.key
                              }
                              className="
                                border
                                border-gray-300
                                px-3
                                py-2
                                text-gray-700
                              "
                            >
                              {col.render
                                ? col.render(
                                    row,
                                  )
                                : getValue(
                                    row,
                                    col.key,
                                  ) ||
                                  '-'}
                            </td>
                          ),
                        )}

                        {(onEdit ||
                          onDelete) && (
                          <td
                            className="
                              relative
                              border
                              border-gray-300
                              px-3
                              py-2
                            "
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >
                            <div
                              ref={(element) => {
                                dropdownRefs.current[
                                  row._id
                                ] =
                                  element
                              }}
                              className="relative inline-block"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDropdown(
                                    row._id,
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  rounded
                                  border
                                  border-gray-300
                                  bg-white
                                  px-2.5
                                  py-1.5
                                  text-sm
                                  font-medium
                                  text-gray-700
                                  transition-colors
                                  hover:bg-gray-100
                                "
                              >
                                <Settings
                                  size={15}
                                />
                                Options
                              </button>

                              {dropdownOpen[
                                row._id
                              ] && (
                                <div
                                  className="
                                    absolute
                                    right-0
                                    top-full
                                    z-50
                                    mt-1
                                    min-w-[130px]
                                    overflow-hidden
                                    rounded-md
                                    border
                                    border-gray-200
                                    bg-white
                                    py-1
                                    shadow-lg
                                  "
                                >
                                  {onEdit && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onEdit(
                                          row._id,
                                        )
                                        toggleDropdown(
                                          row._id,
                                        )
                                      }}
                                      className="
                                        flex
                                        w-full
                                        items-center
                                        gap-2
                                        px-3
                                        py-2
                                        text-left
                                        text-sm
                                        text-gray-700
                                        hover:bg-gray-100
                                      "
                                    >
                                      <Pencil
                                        size={
                                          15
                                        }
                                      />
                                      Edit
                                    </button>
                                  )}

                                  {onDelete && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onDelete(
                                          row._id,
                                        )
                                        toggleDropdown(
                                          row._id,
                                        )
                                      }}
                                      className="
                                        flex
                                        w-full
                                        items-center
                                        gap-2
                                        px-3
                                        py-2
                                        text-left
                                        text-sm
                                        text-red-600
                                        hover:bg-red-50
                                      "
                                    >
                                      <Trash2
                                        size={
                                          15
                                        }
                                      />
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        (onEdit ||
                        onDelete
                          ? 1
                          : 0)
                      }
                      className="
                        border
                        border-gray-300
                        px-3
                        py-6
                        text-center
                        text-sm
                        text-gray-500
                      "
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

ReusableTable.propTypes = {
  title: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  fetchCenters: PropTypes.func,
  addLink: PropTypes.string,
  searchComponent:
    PropTypes.elementType,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label:
        PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    }),
  ).isRequired,
  onRowClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}

export default ReusableTable