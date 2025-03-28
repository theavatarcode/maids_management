<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">รีวิวและข้อเสนอแนะ</h2>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500">คะแนนเฉลี่ยรวม</h3>
        <div class="mt-2 flex items-center">
          <StarIcon class="h-8 w-8 text-yellow-400" />
          <p class="ml-2 text-3xl font-semibold text-gray-900">{{ averageRating.toFixed(1) }}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500">จำนวนรีวิวทั้งหมด</h3>
        <p class="mt-2 text-3xl font-semibold text-gray-900">{{ reviews.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-sm font-medium text-gray-500">รีวิว 5 ดาว</h3>
        <p class="mt-2 text-3xl font-semibold text-gray-900">{{ fiveStarCount }}</p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหารีวิว..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <select
        v-model="ratingFilter"
        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">คะแนนทั้งหมด</option>
        <option value="5">5 ดาว</option>
        <option value="4">4 ดาว</option>
        <option value="3">3 ดาว</option>
        <option value="2">2 ดาว</option>
        <option value="1">1 ดาว</option>
      </select>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
      <div
        v-for="review in filteredReviews"
        :key="review.id"
        class="bg-white shadow rounded-lg p-6"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center">
              <StarIcon class="h-5 w-5 text-yellow-400" />
              <span class="ml-1 text-lg font-semibold text-gray-900">{{ review.rating }}</span>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              จาก {{ getCustomerName(review.customerId) }} - {{ formatDate(review.createdAt) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">แม่บ้าน</p>
            <p class="font-medium text-gray-900">{{ getMaidName(review.maidId) }}</p>
          </div>
        </div>
        <p class="mt-4 text-gray-700">{{ review.comment }}</p>
        <div class="mt-4 flex items-center text-sm text-gray-500">
          <CalendarIcon class="h-4 w-4 mr-1" />
          <span>การจอง #{{ review.bookingId }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { StarIcon, CalendarIcon } from '@heroicons/vue/24/outline';
import { mockReviews, mockCustomers, mockMaids } from '~/utils/mockData';
import type { Review, Customer, Maid } from '~/types';

const reviews = ref<Review[]>(mockReviews);
const searchQuery = ref('');
const ratingFilter = ref('');
const loading = ref(false);

// คำนวณสถิติต่างๆ
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.value.length;
});

const fiveStarCount = computed(() => {
  return reviews.value.filter(review => review.rating === 5).length;
});

const filteredReviews = computed(() => {
  return reviews.value.filter(review => {
    const customer = mockCustomers.find(c => c.id === review.customerId);
    const maid = mockMaids.find(m => m.id === review.maidId);
    
    const matchesSearch = 
      customer?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      maid?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesRating = !ratingFilter.value || review.rating === Number(ratingFilter.value);
    
    return matchesSearch && matchesRating;
  });
});

const getCustomerName = (customerId: string) => {
  const customer = mockCustomers.find(c => c.id === customerId);
  return customer?.name || 'ไม่พบข้อมูล';
};

const getMaidName = (maidId: string) => {
  const maid = mockMaids.find(m => m.id === maidId);
  return maid?.name || 'ไม่พบข้อมูล';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('th-TH');
};

// ดึงข้อมูลรีวิว
const fetchReviews = async () => {
  loading.value = true;
  try {
    const { data } = await useFetch<{ reviews: Review[] }>('/api/reviews');
    reviews.value = data.value?.reviews || mockReviews;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว:', error);
  } finally {
    loading.value = false;
  }
};

// ลบรีวิว
const deleteReview = async (id: number) => {
  if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรีวิวนี้?')) return;
  try {
    await useFetch<{ message: string }>(`/api/reviews/${id}`, {
      method: 'DELETE'
    });
    await fetchReviews();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบรีวิว:', error);
  }
};

// เรียกดึงข้อมูลเมื่อโหลดหน้า
onMounted(() => {
      fetchReviews();
});
</script> 