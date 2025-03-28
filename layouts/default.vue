<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div class="flex flex-col h-full">
        <div class="p-4">
          <h1 class="text-2xl font-bold text-gray-800">ระบบจัดการแม่บ้าน</h1>
        </div>
        <nav class="flex-1 px-2 py-4 space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            :class="{ 'bg-gray-100': route.path === item.path }"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </NuxtLink>
        </nav>
        <div class="p-4 border-t">
          <button
            @click="logout"
            class="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftOnRectangleIcon class="w-5 h-5 mr-3" />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <header class="bg-white shadow">
        <div class="px-4 py-6">
          <h2 class="text-xl font-semibold text-gray-800">{{ currentPageTitle }}</h2>
        </div>
      </header>
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();

const menuItems = [
  { name: 'หน้าหลัก', path: '/', icon: HomeIcon },
  { name: 'จัดการสมาชิก', path: '/customers', icon: UsersIcon },
  { name: 'ดูแลแม่บ้าน', path: '/maids', icon: UserGroupIcon },
  { name: 'จัดการการจอง', path: '/bookings', icon: CalendarIcon },
  { name: 'จัดการการเงิน', path: '/payments', icon: CurrencyDollarIcon },
  { name: 'รีวิวและข้อเสนอแนะ', path: '/reviews', icon: ChatBubbleLeftRightIcon },
//   { name: 'วิเคราะห์และรายงาน', path: '/analytics', icon: ChartBarIcon },
];

const currentPageTitle = computed(() => {
  const currentItem = menuItems.find(item => route.path === item.path);
  return currentItem?.name || 'หน้าหลัก';
});

const logout = () => {
  navigateTo('/login');
};
</script> 