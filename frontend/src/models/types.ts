export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePicture?: string;
  emailVerified: boolean;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Hotel {
  id: number;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  starRating?: number;
  hasWifi: boolean;
  hasPool: boolean;
  hasRestaurant: boolean;
  hasParking: boolean;
  hasGym: boolean;
  createdAt: string;
  updatedAt: string;
  images?: HotelImage[];
  reviews?: Review[];
}

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  capacity: number;
  images: string[]; 
  amenities?: string[];
  createdAt: string;
}

export interface Room {
  id: number;
  hotelId: number;
  roomTypeId: number;
  roomNumber: string;
  floor?: number;
  hasAirConditioning: boolean;
  hasTv: boolean;
  hasMinibar: boolean;
  isSmokingAllowed: boolean;
  createdAt: string;
  roomType?: RoomType;
  availability?: RoomAvailability[];
}

export interface Booking {
  guestCount: number;
  totalAmount: number;
  id: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  createdAt: string;
  updatedAt: string;
  user?: User;
  room?: Room;
  guestName?: string;
}

export interface Favorite {
  userId: number;
  hotelId: number;
  createdAt: string;
  hotel?: Hotel;
}

export interface Review {
  id: number;
  userId: number;
  hotelId: number;
  bookingId?: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: User;
}

export interface HotelImage {
  id: number;
  hotelId: number;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface RoomAvailability {
  id: number;
  roomId: number;
  date: string;
  isAvailable: boolean;
  price?: number;
}

export interface Admin {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalHotels: number;
  totalRooms: number;
  totalBookings: number;
  totalUsers: number;
  revenueThisMonth: number;
  occupancyRate: number;
  bookingsPerMonth: { month: string; count: number }[];
}