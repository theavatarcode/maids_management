export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'customer' | 'maid';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Maid {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  serviceAreas: string[];
  rating: number;
  totalJobs: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  maidId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  maidId: string;
  rating: number;
  comment: string;
  createdAt: string;
} 