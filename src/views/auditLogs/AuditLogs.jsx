import React, {
  useEffect,
  useState,
} from 'react'
import {
  ArrowDown,
  ArrowUp,
  Search,
  RotateCcw,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import axiosInstance from '../../axiosInstance'
import Pagination from '../../utils/Pagination'
import usePermission from '../../utils/usePermission'

import SearchAuditLogs from './SearchAuditLogs'

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([])
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sortConfig, setSortConfig] =
    useState({
      key: 'timestamp',
      direction: 'descending',
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

  const [currentPage, setCurrentPage] =
    useState(1)

  const [totalPages, setTotalPages] =
    useState(1)

  const [totalItems, setTotalItems] =
    useState(0)

  const navigate = useNavigate()

  // Keep permission hook available
  // as it existed in the original page.
  const {
    hasPermission,
    hasAnyPermission,
    isSuperAdmin,
  } = usePermission()

  const fetchAuditLogs = async (
    searchParams = {},
    page = 1,
  ) => {
    try {
      setLoading(true)

      const params =
        new URLSearchParams()

      if (searchParams.keyword) {
        params.append(
          'search',
          searchParams.keyword,
        )
      }

      if (searchParams.center) {
        params.append(
          'user',
          searchParams.center,
        )
      }

      params.append(
        'sortBy',
        sortConfig.key,
      )

      params.append(
        'sortOrder',
        sortConfig.direction ===
          'ascending'
          ? 'asc'
          : 'desc',
      )

      params.append('page', page)

      const queryString =
        params.toString()

      const url = queryString
        ? `/auditLogs?${queryString}`
        : '/auditLogs'

      const response =
        await axiosInstance.get(url)

      if (response.data.success) {
        setAuditLogs(
          response.data.data,
        )

        setCurrentPage(
          response.data.pagination
            .currentPage,
        )

        setTotalPages(
          response.data.pagination
            .totalPages,
        )

        setTotalItems(
          response.data.pagination
            .totalItems,
        )
      }
    } catch (err) {
      setError(err.message)

      console.error(
        'Error fetching audit logs:',
        err,
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchCenters = async () => {
    try {
      const response =
        await axiosInstance.get(
          '/centers?centerType=Center',
        )

      if (response.data.success) {
        setCenters(
          response.data.data,
        )
      }
    } catch (error) {
      console.error(
        'Error fetching centers:',
        error,
      )
    }
  }

  useEffect(() => {
    fetchCenters()
    fetchAuditLogs()
  }, [])

  useEffect(() => {
    fetchAuditLogs(
      activeSearch,
      currentPage,
    )
  }, [sortConfig])

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return
    }

    fetchAuditLogs(
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
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }

    return sortConfig.direction ===
      'ascending' ? (
      <ArrowUp
        size={15}
        className="inline-block ml-1"
      />
    ) : (
      <ArrowDown
        size={15}
        className="inline-block ml-1"
      />
    )
  }

  const handleSearch = (searchData) => {
    setActiveSearch(searchData)

    fetchAuditLogs(
      searchData,
      1,
    )
  }

  const handleResetSearch = () => {
    setActiveSearch({
      keyword: '',
      center: '',
    })

    setSearchTerm('')

    fetchAuditLogs({}, 1)
  }

  const getActionBadge = (action) => {
    const actionColors = {
      CREATE:
        'bg-green-100 text-green-700',
      UPDATE:
        'bg-cyan-100 text-cyan-700',
      DELETE:
        'bg-red-100 text-red-700',
      LOGIN:
        'bg-blue-100 text-blue-700',
      LOGOUT:
        'bg-gray-100 text-gray-700',
      EXPORT:
        'bg-yellow-100 text-yellow-700',
      IMPORT:
        'bg-yellow-100 text-yellow-700',
      APPROVE:
        'bg-green-100 text-green-700',
      REJECT:
        'bg-red-100 text-red-700',
      ENABLE:
        'bg-green-100 text-green-700',
      DISABLE:
        'bg-red-100 text-red-700',
    }

    const color =
      actionColors[action] ||
      'bg-gray-100 text-gray-700'

    return (
      <span
        className={`
          inline-flex
          items-center
          rounded-full
          px-2.5
          py-1
          text-xs
          font-medium
          ${color}
        `}
      >
        {action}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    return status === 'SUCCESS' ? (
      <span
        className="
          inline-flex
          items-center
          rounded-full
          bg-green-100
          px-2.5
          py-1
          text-xs
          font-medium
          text-green-700
        "
      >
        Success
      </span>
    ) : (
      <span
        className="
          inline-flex
          items-center
          rounded-full
          bg-red-100
          px-2.5
          py-1
          text-xs
          font-medium
          text-red-700
        "
      >
        Failed
      </span>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(
      dateString,
    )

    return date.toLocaleString()
  }

  const filteredLogs =
    auditLogs.filter((log) => {
      if (!searchTerm) {
        return true
      }

      const searchLower =
        searchTerm.toLowerCase()

      return (
        (
          log.details &&
          log.details
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          log.errorMessage &&
          log.errorMessage
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          log.user?.fullName &&
          log.user.fullName
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          log.user?.username &&
          log.user.username
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          log.entity &&
          log.entity
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          log.action &&
          log.action
            .toLowerCase()
            .includes(searchLower)
        ) ||
        (
          log.ipAddress &&
          log.ipAddress.includes(
            searchTerm,
          )
        )
      )
    })

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-4
            border-gray-200
            border-t-[#2759A2]
          "
          role="status"
          aria-label="Loading"
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
        role="alert"
      >
        {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-xl font-semibold text-gray-700">
        Audit Logs
      </div>

      <SearchAuditLogs
        visible={searchModalVisible}
        onClose={() =>
          setSearchModalVisible(false)
        }
        onSearch={handleSearch}
        centers={centers}
      />

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
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSearchModalVisible(true)
              }
              className="
                inline-flex
                items-center
                gap-1.5
                rounded
                bg-[#2759A2]
                px-3
                py-1.5
                text-sm
                font-medium
                text-white
                transition-colors
                hover:bg-[#1f4a89]
              "
            >
              <Search size={15} />
              Search
            </button>

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
                  gap-1.5
                  rounded
                  bg-gray-500
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-gray-600
                "
              >
                <RotateCcw size={15} />
                Reset Search
              </button>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={
              handlePageChange
            }
          />
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div
            className="
              mb-3
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
            "
          >
            <div className="text-sm text-gray-500">
              Total Records:{' '}
              {totalItems}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="audit-search"
                className="text-sm text-gray-600"
              >
                Search:
              </label>

              <input
                id="audit-search"
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

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table
              className="
                w-full
                min-w-[900px]
                border-collapse
                text-sm
              "
            >
              <thead>
                <tr className="bg-gray-100">
                  <th
                    onClick={() =>
                      handleSort(
                        'timestamp',
                      )
                    }
                    className="
                      cursor-pointer
                      border
                      border-gray-300
                      px-3
                      py-2
                      text-left
                      font-semibold
                      text-gray-700
                      hover:bg-gray-200
                    "
                  >
                    Timestamp
                    {getSortIcon(
                      'timestamp',
                    )}
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        'user.fullName',
                      )
                    }
                    className="
                      cursor-pointer
                      border
                      border-gray-300
                      px-3
                      py-2
                      text-left
                      font-semibold
                      text-gray-700
                      hover:bg-gray-200
                    "
                  >
                    User
                    {getSortIcon(
                      'user.fullName',
                    )}
                  </th>

                  <th
                    onClick={() =>
                      handleSort('action')
                    }
                    className="
                      cursor-pointer
                      border
                      border-gray-300
                      px-3
                      py-2
                      text-left
                      font-semibold
                      text-gray-700
                      hover:bg-gray-200
                    "
                  >
                    Action
                    {getSortIcon(
                      'action',
                    )}
                  </th>

                  <th
                    onClick={() =>
                      handleSort('entity')
                    }
                    className="
                      cursor-pointer
                      border
                      border-gray-300
                      px-3
                      py-2
                      text-left
                      font-semibold
                      text-gray-700
                      hover:bg-gray-200
                    "
                  >
                    Entity
                    {getSortIcon(
                      'entity',
                    )}
                  </th>

                  <th
                    onClick={() =>
                      handleSort('status')
                    }
                    className="
                      cursor-pointer
                      border
                      border-gray-300
                      px-3
                      py-2
                      text-left
                      font-semibold
                      text-gray-700
                      hover:bg-gray-200
                    "
                  >
                    Status
                    {getSortIcon(
                      'status',
                    )}
                  </th>

                  <th
                    className="
                      border
                      border-gray-300
                      px-3
                      py-2
                      text-left
                      font-semibold
                      text-gray-700
                    "
                  >
                    Details
                  </th>

                  <th
                    className="
                      border
                      border-gray-300
                      px-3
                      py-2
                      text-left
                      font-semibold
                      text-gray-700
                    "
                  >
                    IP Address
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(
                    (log) => (
                      <tr
                        key={log._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="border border-gray-300 px-3 py-2">
                          {formatDate(
                            log.timestamp,
                          )}
                        </td>

                        <td className="border border-gray-300 px-3 py-2">
                          {log.user
                            ?.fullName ||
                            log.user
                              ?.username ||
                            'Unknown'}
                        </td>

                        <td className="border border-gray-300 px-3 py-2">
                          {getActionBadge(
                            log.action,
                          )}
                        </td>

                        <td className="border border-gray-300 px-3 py-2">
                          {log.entity}
                        </td>

                        <td className="border border-gray-300 px-3 py-2">
                          {getStatusBadge(
                            log.status,
                          )}
                        </td>

                        <td className="border border-gray-300 px-3 py-2">
                          <div>
                            {log.details}

                            {log.errorMessage && (
                              <div className="mt-1 text-xs text-red-600">
                                Error:{' '}
                                {
                                  log.errorMessage
                                }
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="border border-gray-300 px-3 py-2">
                          <code className="text-xs">
                            {log.ipAddress ||
                              '-'}
                          </code>
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="
                        border
                        border-gray-300
                        px-3
                        py-8
                        text-center
                        text-sm
                        text-gray-500
                      "
                    >
                      No audit logs found
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

export default AuditLogs