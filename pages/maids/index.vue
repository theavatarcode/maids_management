<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">จัดการแม่บ้าน</h2>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        เพิ่มแม่บ้าน
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาแม่บ้าน..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">ทั้งหมด</option>
        <option value="available">พร้อมทำงาน</option>
        <option value="busy">กำลังทำงาน</option>
        <option value="offline">ไม่พร้อมทำงาน</option>
      </select>
    </div>

    <!-- Maids Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="maid in filteredMaids"
        :key="maid.id"
        class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-4">
            <div class="flex justify-center">
                <img :src="maid.image" alt="Maid Image" class=" w-24 h-24 object-cover rounded-full">
            </div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">{{ maid.name }}</h3>
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-green-100 text-green-800': maid.status === 'available',
                'bg-yellow-100 text-yellow-800': maid.status === 'busy',
                'bg-red-100 text-red-800': maid.status === 'offline'
              }"
            >
              {{ getStatusText(maid.status) }}
            </span>
          </div>
          <div class="mt-2 space-y-1">
            <p class="text-sm text-gray-600">{{ maid.email }}</p>
            <p class="text-sm text-gray-600">{{ maid.phone }}</p>
            <div class="flex items-center mt-2">
              <StarIcon class="h-4 w-4 text-yellow-400" />
              <span class="ml-1 text-sm text-gray-600">{{ maid.rating }}</span>
              <span class="mx-2 text-gray-300">|</span>
              <span class="text-sm text-gray-600">งานทั้งหมด: {{ maid.totalJobs }}</span>
            </div>
          </div>
          <div class="mt-4">
            <h4 class="text-sm font-medium text-gray-700">พื้นที่บริการ:</h4>
            <div class="mt-1 flex flex-wrap gap-2">
              <span
                v-for="area in maid.serviceAreas"
                :key="area"
                class="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
              >
                {{ area }}
              </span>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
          <!-- <NuxtLink
            :to="`/maids/${maid.id}`"
            class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            ดูรายละเอียด
          </NuxtLink> -->
          <button
            @click="editMaid(maid)"
            class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            แก้ไข
          </button>
          <button
            @click="deleteMaid(maid.id)"
            class="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingMaid ? 'แก้ไขแม่บ้าน' : 'เพิ่มแม่บ้าน' }}
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
            <label class="block text-sm font-medium text-gray-700">รูปภาพ(URL)</label>
            <input
              v-model="form.image"
              type="text"
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
              <option value="available">พร้อมทำงาน</option>
              <option value="busy">กำลังทำงาน</option>
              <option value="offline">ไม่พร้อมทำงาน</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">พื้นที่บริการ (คั่นด้วยเครื่องหมายจุลภาค)</label>
            <input
              v-model="form.serviceAreasInput"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
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
              {{ editingMaid ? 'บันทึก' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { StarIcon } from '@heroicons/vue/24/solid';
import type { Maid } from '~/types';
import { mockMaids } from '~/utils/mockData';
import Swal from 'sweetalert2';

const maids = ref<Maid[]>(mockMaids)
const loading = ref(false)
const searchQuery = ref('');
const statusFilter = ref('');
const showAddModal = ref(false);
const editingMaid = ref<Maid | null>(null);

const form = ref({
  name: '',
  email: '',
  phone: '',
  image: '',
  status: 'available' as 'available' | 'busy' | 'offline',
  serviceAreasInput: ''
});

const filteredMaids = computed(() => {
  return maids.value.filter(maid => {
    const matchesSearch = 
      maid.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      maid.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      maid.phone.includes(searchQuery.value);
    
    const matchesStatus = !statusFilter.value || maid.status === statusFilter.value;
    
    return matchesSearch && matchesStatus;
  });
});

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    available: 'พร้อมทำงาน',
    busy: 'กำลังทำงาน',
    offline: 'ไม่พร้อมทำงาน'
  };
  return statusMap[status] || status;
};

const fetchMaids = async () => {
  loading.value = true
  try {
    const { data } = await useFetch<{ maids: Maid[] }>('/api/maids')
    maids.value = data.value?.maids || mockMaids
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลแม่บ้าน:', error)
  } finally {
    loading.value = false
  }
}

const editMaid = (maid: Maid) => {
  editingMaid.value = maid;
  form.value = {
    name: maid.name,
    email: maid.email,
    phone: maid.phone,
    image: maid.image,
    status: maid.status as 'available' | 'busy' | 'offline',
    serviceAreasInput: maid.serviceAreas.join(', ')
  };
  showAddModal.value = true;
};

const deleteMaid = async (id: string) => {
  if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) return
  try {
    await useFetch<{ message: string }>(`/api/maids/${id}`, {
      method: 'DELETE'
    })
    await fetchMaids()
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error)
  }
};

const handleSubmit = async () => {
  try {
    if (editingMaid.value) {
      await useFetch<{ message: string }>(`/api/maids/${editingMaid.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'แก้ไขข้อมูลแม่บ้านเรียบร้อยแล้ว',
        icon: 'success'
      })
    } else {
      await useFetch<{ id: number }>('/api/maids', {
        method: 'POST',
        body: form.value
      })
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'เพิ่มข้อมูลแม่บ้านเรียบร้อยแล้ว',
        icon: 'success'
      })
    }
    showAddModal.value = false
    await fetchMaids()
    editingMaid.value = null
    form.value = {
      name: '',
      email: '',
      phone: '',
      image: '',
      status: 'available',
      serviceAreasInput: ''
    }
  } catch (error) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด!',
      text: 'ไม่สามารถบันทึกข้อมูลได้',
      icon: 'error'
    })
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error)
  }
};

onMounted(() => {
  fetchMaids()
})
</script> 