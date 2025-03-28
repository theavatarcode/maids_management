<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="stat.bgColor">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
            <p class="text-lg font-semibold text-gray-900">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Booking Status Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">สถานะการจอง</h3>
        <div class="h-[300px]">
          <Doughnut :data="bookingStatusData" :options="chartOptions" />
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">รายได้รายเดือน</h3>
        <div class="h-[300px]">
          <Line :data="revenueData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Doughnut, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import {
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const stats = [
  {
    name: 'ลูกค้าทั้งหมด',
    value: '150',
    icon: UsersIcon,
    bgColor: 'bg-blue-500'
  },
  {
    name: 'แม่บ้านทั้งหมด',
    value: '45',
    icon: UserGroupIcon,
    bgColor: 'bg-green-500'
  },
  {
    name: 'การจองวันนี้',
    value: '12',
    icon: CalendarIcon,
    bgColor: 'bg-yellow-500'
  },
  {
    name: 'รายได้วันนี้',
    value: '฿6,500',
    icon: CurrencyDollarIcon,
    bgColor: 'bg-purple-500'
  }
];

const bookingStatusData = {
  labels: ['รอดำเนินการ', 'ยืนยันแล้ว', 'เสร็จสิ้น', 'ยกเลิก'],
  datasets: [
    {
      data: [30, 45, 20, 5],
      backgroundColor: [
        '#FCD34D',
        '#34D399',
        '#60A5FA',
        '#F87171'
      ]
    }
  ]
};

const revenueData = {
  labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
  datasets: [
    {
      label: 'รายได้',
      data: [65000, 59000, 80000, 81000, 56000, 95000],
      borderColor: '#4F46E5',
      tension: 0.4
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};
</script> 