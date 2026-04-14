<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 table-scroll-container">


                <!-- Tabla -->
                <table class="table table-hover table-bordered">
                    <thead>
                        <tr class="table-dark">
                            <th v-for="(header, index) in columns.headers" :key="index" scope="col">
                                {{ header.label }}
                            </th>
                            <th v-if="columns.actions!.length" scope="col">Acciones</th>
                        </tr>
                    </thead>


                    <tbody class="table-group-divider" v-if="!loading">
                        <tr v-for="(item, rowIndex) in paginatedData" :key="rowIndex">
                            <td v-for="(header, colIndex) in columns.headers" :key="colIndex">
                                {{ typeof header.key === 'function' ? header.key(item) : getNestedValue(item, header.key) }}
                            </td>
                            <td v-if="columns.actions!.length"
                                class="actions-cell d-flex align-items-center justify-content-start">
                                <template v-for="(action, actionIndex) in columns.actions" :key="actionIndex">
                                    <span class="action-item-wrapper">
                                        <button
                                            v-if="(action.icon && !action.label) && (typeof action.show === 'function' ? action.show(item) : action.show)"
                                            @click="action.method(item)" class="btn btn-sm" :class="action.cssClass"
                                            :disabled="typeof action.disable === 'function' ? action.disable(item) : action.disable">
                                            <font-awesome-icon :icon="getIcon(action.icon, item)" />
                                        </button>

                                        <button
                                            v-if="action.label && (typeof action.show === 'function' ? action.show(item) : action.show)"
                                            @click="action.method(item)" class="btn btn-sm" :class="action.cssClass"
                                            :disabled="typeof action.disable === 'function' ? action.disable(item) : action.disable">
                                            <font-awesome-icon v-if="action.icon" :icon="getIcon(action.icon, item)" />
                                            {{ action.label }}
                                        </button>

                                        <span v-if="!(typeof action.show === 'function' ? action.show(item) : action.show)"
                                            class="invisible-placeholder-button">
                                        </span>
                                    </span>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-12 d-flex justify-content-center">
                <BSpinner v-if="loading" />
            </div>
            <div class="col-3"></div>
            <div class="col-3 offset-6">

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BSpinner } from 'bootstrap-vue-next'
import { TableColumn } from "@/app/models/table"

const props = defineProps<{
    columns: TableColumn;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    loading: boolean;
}>();

// Estado del filtro y la paginación
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(100); // Valor inicial de elementos por página
const pageOptions = ref([10, 20, 25, 30]); // Opciones para el selector de "Items por página"

const pageRange = 5;

// Función para obtener íconos (permite que sean dinámicos por item)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIcon = (icon: string | ((item: any) => string), item: any) => {
    if (typeof icon === 'function') {
        return icon(item); // Si es una función, la ejecutamos con `item`
    }
    return icon; // Si es un string, lo devolvemos tal cual
};
// Filtrar los datos por el texto ingresado
const filteredData = computed(() => {
    return props.data.filter((item) => {
        return Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchText.value.toLowerCase())
        );
    });
});

// Calcular los datos paginados
const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredData.value.slice(startIndex, startIndex + itemsPerPage.value);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string): any {
    return path
        .replace(/\[(\w+)\]/g, '.$1') // convierte [0] en .0
        .split('.')
        .reduce((acc, key) => acc?.[key], obj);
}
// Total de páginas
const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage.value);
});


// Navegar a la página anterior
const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// Navegar a la página siguiente
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};
// Función para ir a una página específica
function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
}
const pagesToShow = computed(() => {
    let start = currentPage.value - Math.floor(pageRange / 2);
    let end = currentPage.value + Math.floor(pageRange / 2);

    // Ajustar los valores de inicio y fin si están fuera del rango permitido
    if (start < 1) {
        start = 1;
        end = Math.min(pageRange, totalPages.value);
    }
    if (end > totalPages.value) {
        end = totalPages.value;
        start = Math.max(totalPages.value - pageRange + 1, 1);
    }

    // Crear un array con las páginas a mostrar
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
});
</script>

<style scoped>
.btn {
    margin-right: 5px;
}

.pagination-container {
    margin-top: 10px;
    display: flex;
    justify-content: end;
    align-items: center;
}

.pagination-container button {
    margin: 0 5px;
}

.form-select {
    max-width: 25%;
}



/* Estilos para el contenedor de la tabla */
.table-scroll-container {
    max-height: 374px;
    /* Ajusta este valor según la altura real de tus filas.Por ejemplo, si cada fila (incluyendo padding) mide 40px,
                         40px * 10 filas = 400px. Suma un poco más para el encabezado
                         y cualquier padding extra dentro del TableDocs. */
    overflow-y: auto;
    /* Habilita el scroll vertical cuando el contenido excede max-height */

}

/* Opcional: Puedes añadir estilos para el scrollbar si lo deseas,
   aunque su apariencia por defecto suele ser suficiente. */
.table-scroll-container::-webkit-scrollbar {
    width: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
