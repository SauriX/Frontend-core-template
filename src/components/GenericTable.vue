<template>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="text-start"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, rowIndex) in data"
            :key="rowIndex"
          >
            <td
              v-for="column in columns"
              :key="column.key"
            >
              {{ item[column.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue'
  
  interface Column {
    key: string;
    label: string;
  }
  
  interface Props {
    columns: Column[];
    data: Record<string, any>[];
  }
  
  const props = defineProps<Props>();
  </script>
  