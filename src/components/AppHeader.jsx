// import React, { useEffect, useRef, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom'
// import {
//   Menu,
//   Moon,
//   Sun,
//   Contrast,
//   Search,
//   Loader2,
// } from 'lucide-react'

// import {
//   AppHeaderDropdown,
//   AppHeaderDropdownNotif,
// } from './header'

// import axiosInstance from '../axiosInstance'

// const AppHeader = () => {
//   const headerRef = useRef(null)
//   const searchDropdownRef = useRef(null)

//   const { i18n, t } = useTranslation()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const asideShow = useSelector((state) => state.asideShow)
//   const sidebarShow = useSelector((state) => state.sidebarShow)
//   const unfoldable = useSelector((state) => state.sidebarUnfoldable)

//   const [searchTerm, setSearchTerm] = useState('')
//   const [searchResults, setSearchResults] = useState(null)
//   const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
//   const [loading, setLoading] = useState(false)

//   // Theme
//   const [colorMode, setColorMode] = useState(() => {
//     return localStorage.getItem('theme') || 'light'
//   })

//   useEffect(() => {
//     const root = document.documentElement

//     if (colorMode === 'dark') {
//       root.classList.add('dark')
//     } else {
//       root.classList.remove('dark')
//     }

//     localStorage.setItem('theme', colorMode)
//   }, [colorMode])

//   // Mobile sidebar toggle
//   const handleSidebarToggle = () => {
//     dispatch({
//       type: 'set',
//       sidebarShow: !sidebarShow,
//     })
//   }

//   // Desktop sidebar collapse / expand
//   const handleMenuClick = () => {
//     dispatch({
//       type: 'set',
//       sidebarUnfoldable: !unfoldable,
//     })
//   }

//   const handleUsernameClick = (customerId) => {
//     navigate(`/customer-profile/${customerId}`)
//     setSearchDropdownOpen(false)
//     setSearchTerm('')
//   }

//   const handleBuildingClick = (buildingId) => {
//     navigate(`/building-profile/${buildingId}`)
//     setSearchDropdownOpen(false)
//     setSearchTerm('')
//   }

//   const handleCenterClick = (centerId) => {
//     navigate(`/center-profile/${centerId}`)
//     setSearchDropdownOpen(false)
//     setSearchTerm('')
//   }

//   // Fetch all search data
//   const fetchAllData = async () => {
//     try {
//       setLoading(true)

//       const response = await axiosInstance.get('/all-data')

//       if (response.data.success) {
//         return response.data.data
//       }

//       return null
//     } catch (error) {
//       console.error('Error fetching search data:', error)
//       return null
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Search
//   const handleSearch = async (term) => {
//     setSearchTerm(term)

//     if (!term.trim()) {
//       setSearchResults(null)
//       setSearchDropdownOpen(false)
//       return
//     }

//     const allData = await fetchAllData()

//     if (!allData) {
//       setSearchResults(null)
//       setSearchDropdownOpen(true)
//       return
//     }

//     const searchTermLower = term.toLowerCase()

//     const buildingMatches = (allData.buildings || []).filter(
//       (building) =>
//         building.name?.toLowerCase().includes(searchTermLower),
//     )

//     const customerMatches = (allData.customers || []).filter(
//       (customer) =>
//         customer.username
//           ?.toLowerCase()
//           .includes(searchTermLower),
//     )

//     const centerMatches = (allData.centers || []).filter(
//       (center) =>
//         center.name?.toLowerCase().includes(searchTermLower),
//     )

//     const results = {
//       buildings: buildingMatches,
//       customers: customerMatches,
//       centers: centerMatches,
//     }

//     setSearchResults(results)
//     setSearchDropdownOpen(true)
//   }

//   // Close search dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         searchDropdownRef.current &&
//         !searchDropdownRef.current.contains(event.target)
//       ) {
//         setSearchDropdownOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)

//     return () => {
//       document.removeEventListener(
//         'mousedown',
//         handleClickOutside,
//       )
//     }
//   }, [])

//   // Header shadow on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       if (!headerRef.current) return

//       if (document.documentElement.scrollTop > 0) {
//         headerRef.current.classList.add('shadow-md')
//       } else {
//         headerRef.current.classList.remove('shadow-md')
//       }
//     }

//     document.addEventListener('scroll', handleScroll)

//     return () => {
//       document.removeEventListener('scroll', handleScroll)
//     }
//   }, [])

//   const renderSearchResults = () => {
//     if (!searchResults) return null

//     const hasBuildings = searchResults.buildings.length > 0
//     const hasCustomers = searchResults.customers.length > 0
//     const hasCenters = searchResults.centers.length > 0

//     if (!hasBuildings && !hasCustomers && !hasCenters) {
//       return (
//         <div>
//           <div className="border-b border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
//             None
//           </div>

//           <div className="px-4 py-2 text-sm text-gray-400">
//             No data found
//           </div>
//         </div>
//       )
//     }

//     return (
//       <>
//         {/* Buildings */}
//         {hasBuildings && (
//           <div className="border-b border-gray-200 last:border-b-0">
//             <div className="px-4 py-2 text-sm font-semibold text-gray-600">
//               Buildings
//             </div>

//             {searchResults.buildings.map((building) => (
//               <button
//                 key={`building-${building.id}`}
//                 type="button"
//                 onClick={() =>
//                   handleBuildingClick(building.id)
//                 }
//                 className="block w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
//               >
//                 {building.name}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Customers */}
//         {hasCustomers && (
//           <div className="border-b border-gray-200 last:border-b-0">
//             <div className="px-4 py-2 text-sm font-semibold text-gray-600">
//               Customers
//             </div>

//             {searchResults.customers.map((customer) => (
//               <button
//                 key={`customer-${customer.id}`}
//                 type="button"
//                 onClick={() =>
//                   handleUsernameClick(customer.id)
//                 }
//                 className="block w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
//               >
//                 {customer.username}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Centers */}
//         {hasCenters && (
//           <div className="border-b border-gray-200 last:border-b-0">
//             <div className="px-4 py-2 text-sm font-semibold text-gray-600">
//               Centers
//             </div>

//             {searchResults.centers.map((center) => (
//               <button
//                 key={`center-${center.id}`}
//                 type="button"
//                 onClick={() =>
//                   handleCenterClick(center.id)
//                 }
//                 className="block w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
//               >
//                 {center.name}
//               </button>
//             ))}
//           </div>
//         )}
//       </>
//     )
//   }

//   return (
//     <header
//       ref={headerRef}
//       className="sticky top-0 z-30 mb-4 w-full border-b border-white/20 bg-[#2759a2] px-4 py-2 transition-shadow duration-200"
//     >
//       <div className="flex min-h-[42px] w-full items-center gap-3">
//         {/* Mobile menu button */}
//         <button
//           type="button"
//           onClick={handleSidebarToggle}
//           className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-white/15 lg:hidden"
//           aria-label="Open sidebar"
//         >
//           <Menu size={22} />
//         </button>

//         {/* Desktop menu button */}
//         <button
//           type="button"
//           onClick={handleMenuClick}
//           className="hidden h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-white/15 lg:inline-flex"
//           aria-label="Toggle sidebar"
//         >
//           <Menu size={22} />
//         </button>

//         {/* Search */}
//         <div
//           ref={searchDropdownRef}
//           className="relative hidden w-full max-w-md md:block"
//         >
//           <div className="flex h-9 items-center overflow-hidden rounded-md bg-white">
//             <Search
//               size={17}
//               className="ml-3 shrink-0 text-gray-400"
//             />

//             <input
//               type="text"
//               placeholder="Search"
//               aria-label="Search"
//               value={searchTerm}
//               onChange={(e) =>
//                 handleSearch(e.target.value)
//               }
//               onFocus={() => {
//                 if (searchTerm.trim()) {
//                   setSearchDropdownOpen(true)
//                 }
//               }}
//               className="h-full w-full border-0 bg-transparent px-2 text-sm text-gray-800 outline-none placeholder:text-gray-500"
//             />
//           </div>

//           {searchDropdownOpen && (
//             <div className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-[400px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
//               {loading ? (
//                 <div className="flex items-center justify-center px-4 py-4 text-sm text-gray-500">
//                   <Loader2
//                     size={16}
//                     className="mr-2 animate-spin"
//                   />
//                   Searching...
//                 </div>
//               ) : (
//                 renderSearchResults()
//               )}
//             </div>
//           )}
//         </div>

//         {/* Right side */}
//         <div className="ml-auto flex items-center gap-2">
//           {/* Notifications */}
//           <AppHeaderDropdownNotif />

//           {/* Theme selector */}
//           <div className="relative">
//             <button
//               type="button"
//               className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-white/15"
//               title="Change theme"
//               onClick={() => {
//                 const nextMode =
//                   colorMode === 'light'
//                     ? 'dark'
//                     : colorMode === 'dark'
//                       ? 'auto'
//                       : 'light'

//                 setColorMode(nextMode)
//               }}
//             >
//               {colorMode === 'dark' ? (
//                 <Moon size={19} />
//               ) : colorMode === 'auto' ? (
//                 <Contrast size={19} />
//               ) : (
//                 <Sun size={19} />
//               )}
//             </button>
//           </div>

//           {/* Profile / User dropdown */}
//           <AppHeaderDropdown />
//         </div>
//       </div>
//     </header>
//   )
// }

// export default AppHeader


import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Moon,
  Sun,
  Contrast,
  Search,
  Loader2,
} from 'lucide-react'

import {
  AppHeaderDropdown,
  AppHeaderDropdownNotif,
} from './header'

import axiosInstance from '../axiosInstance'

const AppHeader = () => {
  const headerRef = useRef(null)
  const searchDropdownRef = useRef(null)

  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const asideShow = useSelector((state) => state.asideShow)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Theme
  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    const root = document.documentElement

    if (colorMode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem('theme', colorMode)
  }, [colorMode])

  // Mobile sidebar toggle
  const handleSidebarToggle = () => {
    dispatch({
      type: 'set',
      sidebarShow: !sidebarShow,
    })
  }

  // Desktop sidebar collapse / expand
  const handleMenuClick = () => {
    dispatch({
      type: 'set',
      sidebarUnfoldable: !unfoldable,
    })
  }

  const handleUsernameClick = (customerId) => {
    navigate(`/customer-profile/${customerId}`)
    setSearchDropdownOpen(false)
    setSearchTerm('')
  }

  const handleBuildingClick = (buildingId) => {
    navigate(`/building-profile/${buildingId}`)
    setSearchDropdownOpen(false)
    setSearchTerm('')
  }

  const handleCenterClick = (centerId) => {
    navigate(`/center-profile/${centerId}`)
    setSearchDropdownOpen(false)
    setSearchTerm('')
  }

  // Fetch all search data
  const fetchAllData = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get('/all-data')

      if (response.data.success) {
        return response.data.data
      }

      return null
    } catch (error) {
      console.error('Error fetching search data:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Search
  const handleSearch = async (term) => {
    setSearchTerm(term)

    if (!term.trim()) {
      setSearchResults(null)
      setSearchDropdownOpen(false)
      return
    }

    const allData = await fetchAllData()

    if (!allData) {
      setSearchResults(null)
      setSearchDropdownOpen(true)
      return
    }

    const searchTermLower = term.toLowerCase()

    const buildingMatches = (allData.buildings || []).filter(
      (building) =>
        building.name?.toLowerCase().includes(searchTermLower),
    )

    const customerMatches = (allData.customers || []).filter(
      (customer) =>
        customer.username
          ?.toLowerCase()
          .includes(searchTermLower),
    )

    const centerMatches = (allData.centers || []).filter(
      (center) =>
        center.name?.toLowerCase().includes(searchTermLower),
    )

    const results = {
      buildings: buildingMatches,
      customers: customerMatches,
      centers: centerMatches,
    }

    setSearchResults(results)
    setSearchDropdownOpen(true)
  }

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setSearchDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  // Header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return

      if (document.documentElement.scrollTop > 0) {
        headerRef.current.classList.add('shadow-md')
      } else {
        headerRef.current.classList.remove('shadow-md')
      }
    }

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const renderSearchResults = () => {
    if (!searchResults) return null

    const hasBuildings = searchResults.buildings.length > 0
    const hasCustomers = searchResults.customers.length > 0
    const hasCenters = searchResults.centers.length > 0

    if (!hasBuildings && !hasCustomers && !hasCenters) {
      return (
        <div>
          <div className="border-b border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
            None
          </div>

          <div className="px-4 py-2 text-sm text-gray-400">
            No data found
          </div>
        </div>
      )
    }

    return (
      <>
        {/* Buildings */}
        {hasBuildings && (
          <div className="border-b border-gray-200 last:border-b-0">
            <div className="px-4 py-2 text-sm font-semibold text-gray-600">
              Buildings
            </div>

            {searchResults.buildings.map((building) => (
              <button
                key={`building-${building.id}`}
                type="button"
                onClick={() =>
                  handleBuildingClick(building.id)
                }
                className="block w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                {building.name}
              </button>
            ))}
          </div>
        )}

        {/* Customers */}
        {hasCustomers && (
          <div className="border-b border-gray-200 last:border-b-0">
            <div className="px-4 py-2 text-sm font-semibold text-gray-600">
              Customers
            </div>

            {searchResults.customers.map((customer) => (
              <button
                key={`customer-${customer.id}`}
                type="button"
                onClick={() =>
                  handleUsernameClick(customer.id)
                }
                className="block w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                {customer.username}
              </button>
            ))}
          </div>
        )}

        {/* Centers */}
        {hasCenters && (
          <div className="border-b border-gray-200 last:border-b-0">
            <div className="px-4 py-2 text-sm font-semibold text-gray-600">
              Centers
            </div>

            {searchResults.centers.map((center) => (
              <button
                key={`center-${center.id}`}
                type="button"
                onClick={() =>
                  handleCenterClick(center.id)
                }
                className="block w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                {center.name}
              </button>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 mb-4 w-full border-b border-white/20 bg-[#2759a2] px-4 py-2 transition-shadow duration-200"
    >
      <div className="flex min-h-[42px] w-full items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-white/15 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Desktop menu button */}
        <button
          type="button"
          onClick={handleMenuClick}
          className="hidden h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-white/15 lg:inline-flex"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Spacer to push everything to the right */}
        <div className="flex-1" />

        {/* Search - Right aligned, before the icons */}
        <div
          ref={searchDropdownRef}
          className="relative hidden md:block"
        >
          <div className="flex h-9 w-[220px] items-center overflow-hidden rounded-sm bg-white">
            <input
              type="text"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              onFocus={() => {
                if (searchTerm.trim()) {
                  setSearchDropdownOpen(true)
                }
              }}
              className="h-full w-full border-0 bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>

          {searchDropdownOpen && (
            <div className="absolute right-0 top-full z-[1000] mt-1 w-[320px] max-h-[400px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
              {loading ? (
                <div className="flex items-center justify-center px-4 py-4 text-sm text-gray-500">
                  <Loader2
                    size={16}
                    className="mr-2 animate-spin"
                  />
                  Searching...
                </div>
              ) : (
                renderSearchResults()
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <AppHeaderDropdownNotif />

        {/* Theme selector */}
        <div className="relative">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-white/15"
            title="Change theme"
            onClick={() => {
              const nextMode =
                colorMode === 'light'
                  ? 'dark'
                  : colorMode === 'dark'
                    ? 'auto'
                    : 'light'

              setColorMode(nextMode)
            }}
          >
            {colorMode === 'dark' ? (
              <Moon size={19} />
            ) : colorMode === 'auto' ? (
              <Contrast size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>
        </div>

        {/* Profile / User dropdown */}
        <AppHeaderDropdown />
      </div>
    </header>
  )
}

export default AppHeader