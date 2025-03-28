<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">จัดการลูกค้า</h2>
      <!-- <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        เพิ่มลูกค้า
      </button> -->
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาลูกค้า..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Customer Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ที่อยู่</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สมัคร</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ customer.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ customer.phone }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-500">{{ customer.address }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(customer.createdAt) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editCustomer(customer)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                แก้ไข
              </button>
              <button
                @click="deleteCustomer(customer)"
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
          {{ editingCustomer ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้า' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">ชื่อ</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">อีเมล</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">เบอร์โทร</label>
            <input
              v-model="form.phone"
              type="tel"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">ที่อยู่</label>
            <textarea
              v-model="form.address"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
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
              {{ editingCustomer ? 'บันทึก' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Customer } from '~/types';
import { mockCustomers } from '~/utils/mockData';
const customers = ref<Customer[]>(mockCustomers);
const loading = ref(false);
const searchQuery = ref('');
const showAddModal = ref(false);
const editingCustomer = ref<Customer | null>(null);

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
});

// ดึงข้อมูลลูกค้าทั้งหมด
const fetchCustomers = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch<{ customers: Customer[] }>('/api/customers');
    customers.value = data.value?.customers || [];
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า:', error);
  } finally {
    loading.value = false;
  }
};

const filteredCustomers = computed(() => {
  return customers.value.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.phone.includes(searchQuery.value)
  );
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('th-TH');
};

const editCustomer = (customer: Customer) => {
  editingCustomer.value = customer;
  form.value = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address
  };
  showAddModal.value = true;
};

// ลบลูกค้า
const deleteCustomer = async (customer: Customer) => {
  if (!confirm('คุณแน่ใจหรือไม่ที่จะลบลูกค้านี้?')) return;
  try {
    await useFetch<{ message: string }>(`/api/customers/${customer.id}`, {
      method: 'DELETE'
    });
    await fetchCustomers();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
  }
};

// เพิ่ม/แก้ไขลูกค้า
const handleSubmit = async () => {
  try {
    if (editingCustomer.value) {
      await useFetch<{ message: string }>(`/api/customers/${editingCustomer.value.id}`, {
        method: 'PUT',
        body: form.value
      });
    } else {
      await useFetch<{ id: number }>('/api/customers', {
        method: 'POST',
        body: form.value
      });
    }
    showAddModal.value = false;
    await fetchCustomers();
    resetForm();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
  }
};

const resetForm = () => {
  editingCustomer.value = null;
  form.value = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
};

// โหลดข้อมูลเมื่อเปิดหน้า
onMounted(() => {
//   fetchCustomers();
});
</script> 