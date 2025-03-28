<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">จัดการการเงิน</h2>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        เพิ่มรายการชำระ
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500">รายได้รวม</h3>
        <p class="mt-2 text-3xl font-semibold text-gray-900">{{ formatPrice(totalIncome) }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500">เงินที่ต้องจ่ายแม่บ้าน</h3>
        <p class="mt-2 text-3xl font-semibold text-gray-900">{{ formatPrice(totalPayments) }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500">กำไรสุทธิ</h3>
        <p class="mt-2 text-3xl font-semibold" :class="netProfit >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatPrice(netProfit) }}
        </p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหารายการชำระ..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">ทั้งหมด</option>
        <option value="pending">รอดำเนินการ</option>
        <option value="completed">เสร็จสิ้น</option>
        <option value="failed">ล้มเหลว</option>
      </select>
    </div>

    <!-- Payments Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสการชำระ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสการจอง</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">แม่บ้าน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนเงิน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วิธีการชำระ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="payment in filteredPayments" :key="payment.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ payment.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ payment.bookingId }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getCustomerName(payment.bookingId) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getMaidName(payment.bookingId) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatPrice(payment.amount) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getPaymentMethodText(payment.paymentMethod) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                  'bg-green-100 text-green-800': payment.status === 'completed',
                  'bg-red-100 text-red-800': payment.status === 'failed'
                }"
              >
                {{ getStatusText(payment.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(payment.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editPayment(payment)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                แก้ไข
              </button>
              <button
                @click="deletePayment(payment.id)"
                class="text-red-600 hover:text-red-900"
              >
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingPayment ? 'แก้ไขรายการชำระ' : 'เพิ่มรายการชำระ' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">การจอง</label>
            <select
              v-model="form.bookingId"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option v-for="booking in mockBookings" :key="booking.id" :value="booking.id">
                #{{ booking.id }} - {{ getCustomerName(booking.id) }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">จำนวนเงิน</label>
            <input
              v-model="form.amount"
              type="number"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">วิธีการชำระ</label>
            <select
              v-model="form.paymentMethod"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="credit_card">บัตรเครดิต</option>
              <option value="bank_transfer">โอนเงินผ่านธนาคาร</option>
              <option value="promptpay">พร้อมเพย์</option>
              <option value="cash">เงินสด</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">สถานะ</label>
            <select
              v-model="form.status"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="pending">รอดำเนินการ</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="failed">ล้มเหลว</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {{ editingPayment ? 'บันทึก' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { mockBookings, mockCustomers, mockMaids } from '~/utils/mockData';
import type { Payment, Booking, Customer, Maid } from '~/types';

const payments = ref<Payment[]>([]);
const searchQuery = ref('');
const statusFilter = ref('');
const showAddModal = ref(false);
const editingPayment = ref<Payment | null>(null);
const loading = ref(false);

const form = ref({
  bookingId: '',
  amount: 0,
  paymentMethod: 'credit_card' as 'credit_card' | 'bank_transfer' | 'promptpay' | 'cash',
  status: 'pending' as 'pending' | 'completed' | 'failed'
});

// คำนวณยอดรวมต่างๆ
const totalIncome = computed(() => {
  return payments.value
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
});

const totalPayments = computed(() => {
  return mockBookings.reduce((sum, b) => sum + b.price, 0);
});

const netProfit = computed(() => {
  return totalIncome.value - totalPayments.value;
});

const filteredPayments = computed(() => {
  return payments.value.filter(payment => {
    const booking = mockBookings.find(b => b.id === payment.bookingId);
    const customer = booking ? mockCustomers.find(c => c.id === booking.customerId) : null;
    const maid = booking ? mockMaids.find(m => m.id === booking.maidId) : null;
    
    const matchesSearch = 
      customer?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      maid?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      payment.id.includes(searchQuery.value);
    
    const matchesStatus = !statusFilter.value || payment.status === statusFilter.value;
    
    return matchesSearch && matchesStatus;
  });
});

const getCustomerName = (bookingId: string) => {
  const booking = mockBookings.find(b => b.id === bookingId);
  if (!booking) return 'ไม่พบข้อมูล';
  const customer = mockCustomers.find(c => c.id === booking.customerId);
  return customer?.name || 'ไม่พบข้อมูล';
};

const getMaidName = (bookingId: string) => {
  const booking = mockBookings.find(b => b.id === bookingId);
  if (!booking) return 'ไม่พบข้อมูล';
  const maid = mockMaids.find(m => m.id === booking.maidId);
  return maid?.name || 'ไม่พบข้อมูล';
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'รอดำเนินการ',
    completed: 'เสร็จสิ้น',
    failed: 'ล้มเหลว'
  };
  return statusMap[status] || status;
};

const getPaymentMethodText = (method: string) => {
  const methodMap: Record<string, string> = {
    credit_card: 'บัตรเครดิต',
    bank_transfer: 'โอนเงินผ่านธนาคาร',
    promptpay: 'พร้อมเพย์',
    cash: 'เงินสด'
  };
  return methodMap[method] || method;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('th-TH');
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(price);
};

const editPayment = (payment: Payment) => {
  editingPayment.value = payment;
  form.value = {
    bookingId: payment.bookingId,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod as 'credit_card' | 'bank_transfer' | 'promptpay' | 'cash',
    status: payment.status
  };
  showAddModal.value = true;
};

const deletePayment = async (id: string) => {
  if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) return;
  try {
    await useFetch<{ message: string }>(`/api/payments/${id}`, {
      method: 'DELETE'
    });
    await fetchPayments();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
  }
};

const handleSubmit = async () => {
  try {
    if (editingPayment.value) {
      await useFetch<{ message: string }>(`/api/payments/${editingPayment.value.id}`, {
        method: 'PUT',
        body: form.value
      });
    } else {
      await useFetch<{ id: number }>('/api/payments', {
        method: 'POST',
        body: form.value
      });
    }
    showAddModal.value = false;
    await fetchPayments();
    editingPayment.value = null;
    form.value = {
      bookingId: '',
      amount: 0,
      paymentMethod: 'credit_card',
      status: 'pending'
    };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
  }
};

const fetchPayments = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch<{ payments: Payment[] }>('/api/payments');
    payments.value = data.value?.payments || [];
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPayments();
});
</script> 