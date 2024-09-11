// // import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Login from './components/Login';
// import Signup from './components/Signup';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         <nav className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16">
//               <div className="flex">
//                 <Link to="/" className="flex-shrink-0 flex items-center">
//                   <img
//                     className="h-8 w-auto"
//                     src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//                     alt="Your Company"
//                   />
//                 </Link>
//               </div>
//               <div className="flex items-center">
//                 <Link to="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
//                 <Link to="/signup" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
//               </div>
//             </div>
//           </div>
//         </nav>

//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/" element={<h1 className="text-2xl font-bold text-center mt-10">Welcome to Movie Booking</h1>} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;