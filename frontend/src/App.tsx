
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import CreateEditRoom from "./pages/admin/rooms/CreateEditRoom";
import RoomAvailabilityManager from "./pages/admin/rooms/RoomAvailability";
import RoomTypeList from "./pages/admin/roomTypes/RoomTypeList";
import CreateEditRoomType from "./pages/admin/roomTypes/CreateEditRoomType";
import RoomTypeDetails from "./pages/admin/roomTypes/RoomTypeDetails";
import HotelList from "./pages/admin/hotels/HotelList";
import CreateEditHotel from "./pages/admin/hotels/CreateEditHotel";
import HotelDetails from "./pages/admin/hotels/HotelDetails";
import HotelImageManager from "./pages/admin/hotels/HotelImageManager";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import RoomList from "./pages/admin/rooms/RoomList";
import DetailRoom from "./pages/admin/rooms/DetailRoom";
import GlobalNavbar from "./components/global-navbar/GlobalNavbar";
import GlobalSearch from "./components/global-search-box/GlobalSearch";
import CityMenu from "./components/city-menu/CityMenu";
import HotelCard from "./components/hotel-card/HotelCard";
import NearbyHotels from "./components/nearby-hotels/NearbyHotels";
import Login from "./components/routes/login/Login";
import HotelFilter from "./components/routes/hotel-filter/HotelFilter";

import Register from "./components/routes/register/Register";
import GlobalFooter from "./components/global-footer/GlobalFooter";
import AboutUs from "./components/routes/about-us/AboutUs";


function App() {
  return (
    <Router>
      {/* Global Navbar */}
      <GlobalNavbar />
      <div className="min-h-screen bg-gray-100">
        {/* Vous pourriez avoir un Header/Navbar ici */}
        <main>
          <Routes>

          {/* Auth Routes */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  
        <Route 
            path="/"
            element={
              <>
                < GlobalSearch/>
                < HotelCard/>
                < NearbyHotels/>
              </>
            }
          />

        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Hotel Management */}
          <Route path="hotels">
            <Route index element={<HotelList />} />
            <Route path="create" element={<CreateEditHotel />} />
            <Route path="edit/:id" element={<CreateEditHotel />} />
            <Route path="view/:id" element={<HotelDetails />} />
            <Route path=":id/images" element={<HotelImageManager />} />
            <Route
              path=":roomId/availability"
              element={<RoomAvailabilityManager />}
            />
            <Route path=":hotelId/rooms" element={<RoomList />} />
          </Route>

          {/* Room Types Management */}
          <Route path="room-types">
            <Route index element={<RoomTypeList />} />
            <Route path="create" element={<CreateEditRoomType />} />
            <Route path="edit/:id" element={<CreateEditRoomType />} />
            <Route path="view/:id" element={<RoomTypeDetails />} />
          </Route>

          {/* Room Management */}
          <Route path="rooms">
            <Route index element={<RoomList />} />
            <Route path="create" element={<CreateEditRoom />} />
            <Route path=":id/edit" element={<CreateEditRoom />} />
            <Route path=":roomId/view" element={<DetailRoom />} />
            <Route
              path=":id/availability"
              element={<RoomAvailabilityManager />}
            />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/*"
          element={<Navigate to="/admin/dashboard" replace />}
        />
          <Route path="/city-menu" element={<CityMenu />} />
          <Route path="/hotel-filter" element={<HotelFilter />} />
          <Route path="/rooms" element={<CreateEditRoom />} />
          <Route
            path="/rooms/availability"
            element={<RoomAvailabilityManager />}
          />
          <Route path="/about-us" element={<AboutUs />} />
          
          </Routes>
        </main>
        <GlobalFooter />
      </div>
    </Router>
  );
}

export default App;
