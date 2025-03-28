import type { Customer, Maid, Booking, Payment, Review } from '~/types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '0812345678',
    address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'สมหญิง รักดี',
    email: 'somying@example.com',
    phone: '0823456789',
    address: '456 ถนนเพชรบุรี แขวงถนนเพชรบุรี เขตราชเทวี กรุงเทพฯ 10400',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'วิชัย มั่งมี',
    email: 'wichai@example.com',
    phone: '0834567890',
    address: '789 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const mockMaids: Maid[] = [
  {
    id: '1',
    name: 'นภา สุขใจ',
    email: 'napa@example.com',
    phone: '0845678901',
    status: 'available',
    serviceAreas: ['คลองเตย', 'ราชเทวี', 'จตุจักร'],
    rating: 4.8,
    totalJobs: 150,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'รัตนา ตั้งใจ',
    email: 'rattana@example.com',
    phone: '0856789012',
    status: 'busy',
    serviceAreas: ['ราชเทวี', 'จตุจักร', 'ลาดพร้าว'],
    rating: 4.9,
    totalJobs: 200,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'มณี ใจดี',
    email: 'manee@example.com',
    phone: '0867890123',
    status: 'available',
    serviceAreas: ['คลองเตย', 'ลาดพร้าว', 'บางกะปิ'],
    rating: 4.7,
    totalJobs: 180,
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    customerId: '1',
    maidId: '1',
    date: '2024-03-30',
    time: '09:00',
    status: 'confirmed',
    price: 500,
    createdAt: '2024-03-25T00:00:00Z'
  },
  {
    id: '2',
    customerId: '2',
    maidId: '2',
    date: '2024-03-31',
    time: '10:00',
    status: 'pending',
    price: 600,
    createdAt: '2024-03-26T00:00:00Z'
  },
  {
    id: '3',
    customerId: '3',
    maidId: '3',
    date: '2024-04-01',
    time: '11:00',
    status: 'completed',
    price: 550,
    createdAt: '2024-03-27T00:00:00Z'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    bookingId: '1',
    amount: 500,
    status: 'completed',
    paymentMethod: 'credit_card',
    createdAt: '2024-03-25T00:00:00Z'
  },
  {
    id: '2',
    bookingId: '2',
    amount: 600,
    status: 'pending',
    paymentMethod: 'bank_transfer',
    createdAt: '2024-03-26T00:00:00Z'
  },
  {
    id: '3',
    bookingId: '3',
    amount: 550,
    status: 'completed',
    paymentMethod: 'promptpay',
    createdAt: '2024-03-27T00:00:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    bookingId: '1',
    customerId: '1',
    maidId: '1',
    rating: 5,
    comment: 'แม่บ้านทำงานได้ดีมาก ตรงต่อเวลา',
    createdAt: '2024-03-26T00:00:00Z'
  },
  {
    id: '2',
    bookingId: '2',
    customerId: '2',
    maidId: '2',
    rating: 4,
    comment: 'บริการดี แต่มาช้าเล็กน้อย',
    createdAt: '2024-03-27T00:00:00Z'
  },
  {
    id: '3',
    bookingId: '3',
    customerId: '3',
    maidId: '3',
    rating: 5,
    comment: 'แม่บ้านมีความเป็นมืออาชีพสูง',
    createdAt: '2024-03-28T00:00:00Z'
  }
]; 