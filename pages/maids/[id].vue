<template>
  <div v-if="maid" class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">โปรไฟล์แม่บ้าน</h2>
      <button
        @click="showEditModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        แก้ไขข้อมูล
      </button>
    </div>

    <!-- Profile Card -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ maid.name }}</h3>
            <div class="mt-1 flex items-center">
              <span
                class="px-2 py-1 text-sm font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-800': maid.status === 'available',
                  'bg-yellow-100 text-yellow-800': maid.status === 'busy',
                  'bg-red-100 text-red-800': maid.status === 'offline'
                }"
              >
                {{ getStatusText(maid.status) }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center justify-end">
              <StarIcon class="h-5 w-5 text-yellow-400" />
              <span class="ml-1 text-lg font-semibold text-gray-900">{{ maid.rating }}</span>
            </div>
            <p class="text-sm text-gray-500">คะแนนเฉลี่ย</p>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500">ข้อมูลการติดต่อ</h4>
            <dl class="mt-2 space-y-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">อีเมล</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ maid.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">เบอร์โทร</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ maid.phone }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">วันที่สมัคร</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(maid.createdAt) }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500">ข้อมูลการทำงาน</h4>
            <dl class="mt-2 space-y-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">งานทั้งหมด</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ maid.totalJobs }} งาน</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">พื้นที่บริการ</dt>
                <dd class="mt-1">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="area in maid.serviceAreas"
                      :key="area"
                      class="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                    >
                      {{ area }}
                    </span>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">แก้ไขข้อมูลแม่บ้าน</h3>
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
              @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StarIcon } from '@heroicons/vue/24/solid';
import { mockMaids } from '~/utils/mockData';
import type { Maid } from '~/types';

const route = useRoute();
const maid = ref<Maid | null>(null);
const showEditModal = ref(false);

const form = ref({
  name: '',
  email: '',
  phone: '',
  status: 'available' as 'available' | 'busy' | 'offline',
  serviceAreasInput: ''
});

onMounted(() => {
  const id = route.params.id as string;
  maid.value = mockMaids.find(m => m.id === id) || null;
  if (maid.value) {
    form.value = {
      name: maid.value.name,
      email: maid.value.email,
      phone: maid.value.phone,
      status: maid.value.status,
      serviceAreasInput: maid.value.serviceAreas.join(', ')
    };
  }
});

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    available: 'พร้อมทำงาน',
    busy: 'กำลังทำงาน',
    offline: 'ไม่พร้อมทำงาน'
  };
  return statusMap[status] || status;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('th-TH');
};

const handleSubmit = () => {
  if (!maid.value) return;

  const serviceAreas = form.value.serviceAreasInput
    .split(',')
    .map(area => area.trim())
    .filter(area => area);

  // Update maid data
  maid.value = {
    ...maid.value,
    ...form.value,
    serviceAreas
  };

  showEditModal.value = false;
};
</script> 