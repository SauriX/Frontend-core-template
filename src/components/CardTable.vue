<template>
    <div class="col-12" v-if="!isMobile && !loading">
        <div class="card card-header">
            <div class="card-body">
                <table class="table table-header">
                    <thead>
                        <tr class="tr-headers table-header">
                            <th v-for="(header, index) in tableConfig.headers" :key="index" :style="header.style">
                                <span v-if="typeof header.label === 'string'" v-html="header.label"></span>
                                <template v-else>{{ header.label }}</template>
                            </th>
                            <th v-if="tableConfig.actions && tableConfig.actions.length > 0" style="width: 1%;"></th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>

    <div class="col-12" v-for="(item, itemIndex) in items" :key="itemIndex" v-if="!isMobile && !loading">
        <div class="card card-tbody">
            <div class="card-body">
                <table class="table table-borderless table-body">
                    <tbody>
                        <tr class="tr-body table-body">
                            <th v-for="(header, headerIndex) in tableConfig.headers" :key="headerIndex"
                                :style="header.style">
                                <template v-if="typeof header.key === 'function'">
                                    <span v-html="header.key(item)"></span>
                                </template>
                                <template v-else>
                                    {{ getItemValue(item, header.key) }}
                                </template>
                            </th>
                            <th v-if="tableConfig.actions && tableConfig.actions.length > 0" style="width: 1%;">
                                <template v-for="(action, actionIndex) in tableConfig.actions" :key="actionIndex">
                                    <div v-if="typeof action.show === 'boolean' ? action.show : action.show(item)"
                                        :class="[getIsActionDisabled(action, item) ? 'circle-btn-d' : 'circle-btn', action.cssClass]"
                                        v-tippy="{ content: action.tooltip || action.label, arrow: true, placement: 'right' }"
                                        @click="!getIsActionDisabled(action, item) && action.method(item)">
                                        <a :href="getIsActionDisabled(action, item) ? '#' : 'javascript:void(0)'">
                                            <i
                                                :class="typeof action.icon === 'string' ? action.icon : (action.icon ? action.icon(item) : '')"></i>
                                            {{ action.label }}
                                        </a>
                                    </div>
                                </template>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { TableAction, TableColumn } from '@/app/models/table';
import { defineProps, withDefaults } from 'vue';

interface Props {
    items: any[];
    tableConfig: TableColumn;
    isMobile?: boolean;
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isMobile: false,
    loading: false,
});

const getItemValue = (item: any, key: string): any => {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), item);
};

// Helper function to safely check if an action is disabled
const getIsActionDisabled = (action: TableAction, item: any): boolean => {
    if (typeof action.disable === 'function') {
        return action.disable(item);
    }
    return action.disable;
};

// You might also need a similar helper for `action.show` if it's causing issues,
// though the ternary operator typically handles it fine in Vue templates.
// const getShouldShowAction = (action: TableAction, item: any): boolean => {
//   if (typeof action.show === 'function') {
//     return action.show(item);
//   }
//   return action.show;
// };

</script>
  
<style scoped>
/* Your existing styles here */
.card {
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.card-header {
    background-color: #f8f9fa;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #e0e0e0;
}

.card-tbody {
    border-top: none;
}

.table {
    width: 100%;
    margin-bottom: 0;
    border-collapse: collapse;
}

.table-header th {
    padding: 0.75rem;
    vertical-align: top;
    border-bottom: 2px solid #dee2e6;
    text-align: left;
}

.table-body th {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
    text-align: left;
}

.tr-headers {
    background-color: #f0f0f0;
}

.tr-body {
    background-color: #ffffff;
}

.spanInfo {
    font-size: 0.85em;
    color: #6c757d;
}

.tipe {
    background-color: #d4edda;
    /* Verde para Regular */
    color: #155724;
    padding: 0.25em 0.5em;
    border-radius: 0.25rem;
}

.tipeB {
    background-color: #cce5ff;
    /* Azul para otros tipos (ej. Executive) */
    color: #004085;
    padding: 0.25em 0.5em;
    border-radius: 0.25rem;
}

.badge {
    display: inline-block;
    padding: 0.35em 0.65em;
    font-size: 0.75em;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
}

.text-bg-danger {
    background-color: #dc3545 !important;
}

.text-bg-success {
    background-color: #198754 !important;
}

.circle-btn,
.circle-btn-d {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.circle-btn {
    background-color: #007bff;
    /* Color para botones activos */
}

.circle-btn a {
    color: white;
    text-decoration: none;
}

.circle-btn:hover {
    background-color: #0056b3;
}

.circle-btn-d {
    background-color: #e9ecef;
    /* Color para botones deshabilitados */
    cursor: not-allowed;
}

.circle-btn-d a {
    color: #6c757d;
    text-decoration: none;
}

.bi {
    display: inline-block;
    font-size: 1rem;
    vertical-align: -0.125em;
    fill: currentcolor;
}</style>