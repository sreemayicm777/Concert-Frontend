// src/router.js
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Component/Home';
import Login from './Component/auth/Login';
import Register from './Component/auth/Register';
// import SubCategoryPage from "./Component/admin/SubCategoryPage";
// import UserConcertView from './Component/User/UserConcertView';
import BookConcertPage from './Component/User/BookingPage';
import MyTicketPage from './Component/User/MyTicketPage';
import SubCategoryPages from './Component/admin/SubCategoryPages';
import TicketDetails from './Component/User/TicketDetails';
import AllBookingsPage from './Component/admin/AllBookingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      // { path: '/subcategories', element: <SubCategoryPage /> },
      // { path: '/viewsub', element: <UserConcertView /> },
      { path: '/book/:id', element: <BookConcertPage /> },
      { path: '/my-tickets', element: <MyTicketPage /> },
      { path: '/category/:categoryId' ,element:<SubCategoryPages />},
      { path: '/tickets' , element:<TicketDetails/>},
      { path: '/admin/bookings', element:<AllBookingsPage/>}
    ]
  }
]);

export default router;
