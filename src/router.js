// src/router.js
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Component/Home';
import Login from './Component/auth/Login';
import Register from './Component/auth/Register';
import SubCategoryPage from "./Component/admin/SubCategoryPage";
import SubCategoryAdmin from './Component/admin/SubCategoryAdmin';
import UserConcertView from './Component/User/UserConcertView';
import BookConcertPage from './Component/User/BookingPage';
import MyTicketPage from './Component/User/MyTicketPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/subcategories', element: <SubCategoryPage /> },
      { path: '/admin/subcategories', element: <SubCategoryAdmin /> },
      { path: '/viewsub', element: <UserConcertView /> },
      { path: '/book/:id', element: <BookConcertPage /> },
      { path: '/my-tickets', element: <MyTicketPage /> }
    ]
  }
]);

export default router;
