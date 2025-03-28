<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">จัดการการจอง</h2>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        เพิ่มการจอง
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาการจอง..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">ทั้งหมด</option>
        <option value="pending">รอดำเนินการ</option>
        <option value="confirmed">ยืนยันแล้ว</option>
        <option value="completed">เสร็จสิ้น</option>
        <option value="cancelled">ยกเลิก</option>
      </select>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสการจอง</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">แม่บ้าน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลา</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="booking in filteredBookings" :key="booking.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ booking.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getCustomerName(booking.customerId) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getMaidName(booking.maidId) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(booking.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ booking.time }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatPrice(booking.price) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': booking.status === 'pending',
                  'bg-green-100 text-green-800': booking.status === 'confirmed',
                  'bg-blue-100 text-blue-800': booking.status === 'completed',
                  'bg-red-100 text-red-800': booking.status === 'cancelled'
                }"
              >
                {{ getStatusText(booking.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editBooking(booking)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                แก้ไข
              </button>
              <button
                @click="deleteBooking(booking.id)"
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
          {{ editingBooking ? 'แก้ไขการจอง' : 'เพิ่มการจอง' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">ลูกค้า</label>
            <select
              v-model="form.customerId"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option v-for="customer in mockCustomers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">แม่บ้าน</label>
            <select
              v-model="form.maidId"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option v-for="maid in mockMaids" :key="maid.id" :value="maid.id">
                {{ maid.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">วันที่</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">เวลา</label>
            <input
              v-model="form.time"
              type="time"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">ราคา</label>
            <input
              v-model="form.price"
              type="number"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">สถานะ</label>
            <select
              v-model="form.status"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="pending">รอดำเนินการ</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
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
              {{ editingBooking ? 'บันทึก' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { mockCustomers, mockMaids, mockBookings } from '~/utils/mockData';
import type { Booking, Customer, Maid } from '~/types';
import Swal from 'sweetalert2';
const bookings = ref<Booking[]>(mockBookings);
const searchQuery = ref('');
const statusFilter = ref('');
const showAddModal = ref(false);
const editingBooking = ref<Booking | null>(null);
const loading = ref(false);

const form = ref({
  customerId: '',
  maidId: '',
  date: '',
  time: '',
  price: 0,
  status: 'pending' as 'pending' | 'confirmed' | 'completed' | 'cancelled'
});

const filteredBookings = computed(() => {
  return bookings.value.filter(booking => {
    const customer = mockCustomers.find(c => c.id === booking.customerId);
    const maid = mockMaids.find(m => m.id === booking.maidId);
    
    const matchesSearch = 
      customer?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      maid?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.id.includes(searchQuery.value);
    
    const matchesStatus = !statusFilter.value || booking.status === statusFilter.value;
    
    return matchesSearch && matchesStatus;
  });
});

const getCustomerName = (customerId: string) => {
  return mockCustomers.find(c => c.id === customerId)?.name || 'ไม่พบข้อมูล';
};

const getMaidName = (maidId: string) => {
  return mockMaids.find(m => m.id === maidId)?.name || 'ไม่พบข้อมูล';
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'รอดำเนินการ',
    confirmed: 'ยืนยันแล้ว',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
  };
  return statusMap[status] || status;
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

const editBooking = (booking: Booking) => {
  editingBooking.value = booking;
  form.value = { ...booking };
  showAddModal.value = true;
};

const deleteBooking = async (id: string) => {
  if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) return;
  try {
    await useFetch<{ message: string }>(`/api/bookings/${id}`, {
      method: 'DELETE'
    });
    await fetchBookings();
  } catch (error) {
    Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถลบข้อมูลได้',
        icon: 'error'
      })
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
  }
};

const handleSubmit = async () => {
  try {
    if (editingBooking.value) {
      await useFetch<{ message: string }>(`/api/bookings/${editingBooking.value.id}`, {
        method: 'PUT',
        body: form.value
      });
    } else {
      await useFetch<{ id: number }>('/api/bookings', {
        method: 'POST',
        body: form.value
      });
    }
    showAddModal.value = false;
    Swal.fire({
        title: 'สำเร็จ!',
        text: 'บันทึกข้อมูลการจองเรียบร้อยแล้ว',
        icon: 'success'
      })

    await fetchBookings();
    resetForm();
  } catch (error) {
    Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        icon: 'error'
      })
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
  }
};

const resetForm = () => {
  editingBooking.value = null;
  form.value = {
    customerId: '',
    maidId: '',
    date: '',
    time: '',
    price: 0,
    status: 'pending'
  };
};

const fetchBookings = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch<{ bookings: Booking[] }>('/api/bookings');
    bookings.value = data.value?.bookings || mockBookings;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBookings();
});
</script> 