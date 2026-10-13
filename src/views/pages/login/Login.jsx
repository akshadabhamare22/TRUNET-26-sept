// import React, { useContext, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   User,
//   LockKeyhole,
//   Mail,
//   Loader2,
// } from 'lucide-react'

// import backgroundImage from '../../../assets/images/background.jpg'
// import logo from '../../../assets/images/logo.png'
// import axiosInstance from '../../../axiosInstance'
// import { AuthContext } from '../../../context/AuthContext'

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [activeTab, setActiveTab] = useState(1)

//   const navigate = useNavigate()
//   const { refreshPermissions } = useContext(AuthContext)

//   const handleInputChange = (e) => {
//     const { name, value } = e.target

//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }))

//     if (error) {
//       setError('')
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     setError('')
//     setSuccess('')

//     if (!formData.username || (activeTab === 1 && !formData.password)) {
//       setError('Please fill in all fields')
//       return
//     }

//     if (activeTab === 1) {
//       setLoading(true)

//       try {
//         const response = await axiosInstance.post('/auth/login', {
//           username: formData.username,
//           password: formData.password,
//         })

//         if (response.data.success) {
//           if (response.data.requiresCenterSelection) {
//             localStorage.setItem('tempToken', response.data.token)

//             localStorage.setItem(
//               'userTemp',
//               JSON.stringify(response.data.data.user),
//             )

//             navigate('/select-center')
//           } else {
//             if (response.data.token) {
//               localStorage.setItem('token', response.data.token)
//             }

//             if (response.data.data && response.data.data.user) {
//               localStorage.setItem(
//                 'user',
//                 JSON.stringify(response.data.data.user),
//               )

//               if (response.data.data.user.center) {
//                 localStorage.setItem(
//                   'userCenter',
//                   JSON.stringify(response.data.data.user.center),
//                 )
//               }
//             }

//             await refreshPermissions()
//             navigate('/')
//           }
//         } else {
//           setError(response.data.message || 'Login failed')
//         }
//       } catch (error) {
//         console.error('Login error:', error)

//         if (error.response && error.response.data) {
//           setError(
//             error.response.data.message ||
//               'Login failed. Please try again.',
//           )
//         } else if (error.request) {
//           setError(
//             'No response from server. Please check your connection.',
//           )
//         } else {
//           setError('An error occurred. Please try again.')
//         }
//       } finally {
//         setLoading(false)
//       }
//     } else {
//       setSuccess('OTP has been sent to your email.')
//     }
//   }

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//       }}
//     >
//       <div className="min-h-screen bg-black/20">
//         <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
//           <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12">
//             {/* Left Section */}
//             <div className="flex items-center justify-center lg:col-span-6">
//               <div className="text-center text-white">
//                 <img
//                   src={logo}
//                   alt="Company Logo"
//                   className="mx-auto mt-4 w-full max-w-[450px] object-contain"
//                 />

//                 <h1 className="mt-4 text-4xl font-bold tracking-wide sm:text-5xl">
//                   TRUNET
//                 </h1>

//                 <p className="mt-2 text-lg text-white/90">
//                   Welcome to our platform
//                 </p>
//               </div>
//             </div>

//             {/* Login Section */}
//             <div className="lg:col-span-5 lg:col-start-8">
//               <div className="rounded-xl bg-white p-5 shadow-2xl sm:p-7">
//                 <p className="mb-5 text-center text-sm text-gray-600">
//                   Sign in to start your session Login
//                 </p>

//                 {/* Tabs */}
//                 <div className="mb-5 flex border-b border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => setActiveTab(1)}
//                     className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${
//                       activeTab === 1
//                         ? 'border-blue-600 text-blue-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Password Login
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setActiveTab(2)}
//                     className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${
//                       activeTab === 2
//                         ? 'border-blue-600 text-blue-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     OTP Login
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                   {/* Error */}
//                   {error && (
//                     <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                       {error}
//                     </div>
//                   )}

//                   {/* Success */}
//                   {success && (
//                     <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                       {success}
//                     </div>
//                   )}

//                   {/* Password Login */}
//                   {activeTab === 1 && (
//                     <>
//                       {/* Username */}
//                       <div className="mb-3 flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
//                         <div className="flex w-11 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50 text-gray-500">
//                           <User size={18} />
//                         </div>

//                         <input
//                           type="text"
//                           name="username"
//                           placeholder="Username"
//                           autoComplete="username"
//                           value={formData.username}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full border-0 px-3 py-2.5 text-sm text-gray-800 outline-none"
//                         />
//                       </div>

//                       {/* Password */}
//                       <div className="mb-4 flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
//                         <div className="flex w-11 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50 text-gray-500">
//                           <LockKeyhole size={18} />
//                         </div>

//                         <input
//                           type="password"
//                           name="password"
//                           placeholder="Password"
//                           autoComplete="current-password"
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full border-0 px-3 py-2.5 text-sm text-gray-800 outline-none"
//                         />
//                       </div>

//                       {/* Sign In */}
//                       <div className="mt-4 text-right">
//                         <button
//                           type="submit"
//                           disabled={loading}
//                           className="mb-2 inline-flex min-w-[100px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                           {loading ? (
//                             <>
//                               <Loader2
//                                 size={17}
//                                 className="animate-spin"
//                               />
//                               Loading...
//                             </>
//                           ) : (
//                             'Sign In'
//                           )}
//                         </button>
//                       </div>

//                       {/* Forgot Password */}
//                       <div className="text-right">
//                         <button
//                           type="button"
//                           className="px-0 text-sm text-blue-600 transition hover:text-blue-800 hover:underline"
//                         >
//                           Forgot password?
//                         </button>
//                       </div>
//                     </>
//                   )}

//                   {/* OTP Login */}
//                   {activeTab === 2 && (
//                     <>
//                       <div className="mb-3 flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
//                         <div className="flex w-11 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50 text-gray-500">
//                           <Mail size={18} />
//                         </div>

//                         <input
//                           type="text"
//                           name="username"
//                           placeholder="Email"
//                           autoComplete="username"
//                           value={formData.username}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full border-0 px-3 py-2.5 text-sm text-gray-800 outline-none"
//                         />
//                       </div>

//                       <div className="text-left">
//                         <button
//                           type="button"
//                           className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
//                         >
//                           Generate OTP
//                         </button>
//                       </div>
//                     </>
//                   )}

//                   {/* Footer */}
//                   <div className="mt-5 border-t border-gray-200 pt-4">
//                     <p className="text-center text-xs text-gray-500">
//                       Design and Developed by{' '}
//                       <a
//                         href="https://softcrowdtechnologies.com/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="font-medium text-blue-600 hover:underline"
//                       >
//                         Softcrowd Technologies
//                       </a>
//                     </p>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login


import React, { useContext, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {

  User,

  LockKeyhole,

  Mail,

  Loader2,

} from 'lucide-react'



import backgroundImage from '../../../assets/images/background.jpg'

import logo from '../../../assets/images/logo.png'

import axiosInstance from '../../../axiosInstance'

import { AuthContext } from '../../../context/AuthContext'



const isValidJwtFormat = (value) => {
  if (typeof value !== 'string') return false
  const parts = value.trim().split('.')
  return parts.length === 3 && parts.every((part) => part.length > 0)
}

const extractAccessToken = (body) => {
  const candidates = [
    body?.accessToken,
    body?.data?.accessToken,
    body?.data?.data?.accessToken,
    body?.tokens?.accessToken,
    body?.data?.tokens?.accessToken,
    body?.token,
    body?.data?.token,
    body?.data?.data?.token,
  ]
  return candidates.find(isValidJwtFormat)?.trim() || null
}

const Login = () => {

  const [formData, setFormData] = useState({

    username: '',

    password: '',

  })



  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const [success, setSuccess] = useState('')

  const [activeTab, setActiveTab] = useState(1)



  const navigate = useNavigate()

  const { refreshPermissions } = useContext(AuthContext)



  const handleInputChange = (e) => {

    const { name, value } = e.target



    setFormData((prevState) => ({

      ...prevState,

      [name]: value,

    }))



    if (error) {

      setError('')

    }

  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.username || (activeTab === 1 && !formData.password)) {
      setError('Please fill in all fields')
      return
    }

    if (activeTab !== 1) {
      setSuccess('OTP login is not implemented yet.')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/auth/login', {
        username: formData.username,
        password: formData.password,
      })
      const body = response.data

      if (!body?.success) {
        setError(body?.message || 'Login failed')
        return
      }

      const accessToken = extractAccessToken(body)

      // Diagnostic only: never log the token itself.
      console.log('[LOGIN DEBUG]', {
        responseKeys: Object.keys(body || {}),
        dataKeys: Object.keys(body?.data || {}),
        tokenFound: Boolean(accessToken),
        tokenLength: accessToken?.length ?? 0,
        tokenDotCount: accessToken ? (accessToken.match(/\./g) || []).length : 0,
        requiresCenterSelection: Boolean(body.requiresCenterSelection),
      })

      if (!accessToken) {
        setError('The login API did not return a valid access token. Please contact the backend team.')
        return
      }

      if (body.requiresCenterSelection) {
        localStorage.removeItem('token')
        localStorage.setItem('tempToken', accessToken)
        if (body.data?.user) {
          localStorage.setItem('userTemp', JSON.stringify(body.data.user))
        }
        navigate('/select-center')
        return
      }

      localStorage.setItem('token', accessToken)
      localStorage.removeItem('tempToken')

      if (body.data?.user) {
        localStorage.setItem('user', JSON.stringify(body.data.user))
        if (body.data.user.center) {
          localStorage.setItem('userCenter', JSON.stringify(body.data.user.center))
        }
      }

      await refreshPermissions()
      navigate('/')
    } catch (error) {
      console.error('Login error:', {
        message: error?.response?.data?.message || error.message,
        status: error?.response?.status,
      })

      if (error.response?.data) {
        setError(error.response.data.message || 'Login failed. Please try again.')
      } else if (error.request) {
        setError('No response from server. Please check your connection.')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (

    <div

      className="min-h-screen bg-cover bg-center bg-no-repeat"

      style={{

        backgroundImage: `url(${backgroundImage})`,

      }}

    >

      <div className="min-h-screen bg-black/20">

        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">

          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12">

            {/* Left Section */}

            <div className="flex items-center justify-center lg:col-span-6">

              <div className="text-center text-white">

                <img

                  src={logo}

                  alt="Company Logo"

                  className="mx-auto mt-4 w-full max-w-[450px] object-contain"

                />



                <h1 className="mt-4 text-4xl font-bold tracking-wide sm:text-5xl">

                  TRUNET

                </h1>



                <p className="mt-2 text-lg text-white/90">

                  Welcome to our platform

                </p>

              </div>

            </div>



            {/* Login Section */}

            <div className="lg:col-span-5 lg:col-start-8">

              <div className="rounded-xl bg-white p-5 shadow-2xl sm:p-7">

                <p className="mb-5 text-center text-sm text-gray-600">

                  Sign in to start your session Login

                </p>



                {/* Tabs */}

                <div className="mb-5 flex border-b border-gray-200">

                  <button

                    type="button"

                    onClick={() => setActiveTab(1)}

                    className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${

                      activeTab === 1

                        ? 'border-blue-600 text-blue-600'

                        : 'border-transparent text-gray-500 hover:text-gray-700'

                    }`}

                  >

                    Password Login

                  </button>



                  <button

                    type="button"

                    onClick={() => setActiveTab(2)}

                    className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${

                      activeTab === 2

                        ? 'border-blue-600 text-blue-600'

                        : 'border-transparent text-gray-500 hover:text-gray-700'

                    }`}

                  >

                    OTP Login

                  </button>

                </div>



                <form onSubmit={handleSubmit}>

                  {/* Error */}

                  {error && (

                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                      {error}

                    </div>

                  )}



                  {/* Success */}

                  {success && (

                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                      {success}

                    </div>

                  )}



                  {/* Password Login */}

                  {activeTab === 1 && (

                    <>

                      {/* Username */}

                      <div className="mb-3 flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

                        <div className="flex w-11 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50 text-gray-500">

                          <User size={18} />

                        </div>



                        <input

                          type="text"

                          name="username"

                          placeholder="Username"

                          autoComplete="username"

                          value={formData.username}

                          onChange={handleInputChange}

                          required

                          className="w-full border-0 px-3 py-2.5 text-sm text-gray-800 outline-none"

                        />

                      </div>



                      {/* Password */}

                      <div className="mb-4 flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

                        <div className="flex w-11 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50 text-gray-500">

                          <LockKeyhole size={18} />

                        </div>



                        <input

                          type="password"

                          name="password"

                          placeholder="Password"

                          autoComplete="current-password"

                          value={formData.password}

                          onChange={handleInputChange}

                          required

                          className="w-full border-0 px-3 py-2.5 text-sm text-gray-800 outline-none"

                        />

                      </div>



                      {/* Sign In */}

                      <div className="mt-4 text-right">

                        <button

                          type="submit"

                          disabled={loading}

                          className="mb-2 inline-flex min-w-[100px] items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"

                        >

                          {loading ? (

                            <>

                              <Loader2

                                size={17}

                                className="animate-spin"

                              />

                              Loading...

                            </>

                          ) : (

                            'Sign In'

                          )}

                        </button>

                      </div>



                      {/* Forgot Password */}

                      <div className="text-right">

                        <button

                          type="button"

                          className="px-0 text-sm text-blue-600 transition hover:text-blue-800 hover:underline"

                        >

                          Forgot password?

                        </button>

                      </div>

                    </>

                  )}



                  {/* OTP Login */}

                  {activeTab === 2 && (

                    <>

                      <div className="mb-3 flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

                        <div className="flex w-11 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50 text-gray-500">

                          <Mail size={18} />

                        </div>



                        <input

                          type="text"

                          name="username"

                          placeholder="Email"

                          autoComplete="username"

                          value={formData.username}

                          onChange={handleInputChange}

                          required

                          className="w-full border-0 px-3 py-2.5 text-sm text-gray-800 outline-none"

                        />

                      </div>



                      <div className="text-left">

                        <button

                          type="button"

                          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"

                        >

                          Generate OTP

                        </button>

                      </div>

                    </>

                  )}



                  {/* Footer */}

                  <div className="mt-5 border-t border-gray-200 pt-4">

                    <p className="text-center text-xs text-gray-500">

                      Design and Developed by{' '}

                      <a

                        href="https://softcrowdtechnologies.com/"

                        target="_blank"

                        rel="noopener noreferrer"

                        className="font-medium text-blue-600 hover:underline"

                      >

                        Softcrowd Technologies

                      </a>

                    </p>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}



export default Login