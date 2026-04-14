<template>
    <div class="container-fluid">
        <div class="row">
            <div v-if="hidePagination == false" class="col-3">
                <div class="mt-3 d-flex justify-content-start align-items-center">
                    <label for="itemsPerPage" class="form-label ms-2">Items por página:</label>
                    <select id="itemsPerPage" v-model="itemsPerPage" class="form-select ms-2">
                        <option v-for="option in pageOptions" :key="option" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </div>
            </div>

            <div v-if="hideSearch == false" class="col-3 offset-6">
                <div class="input-group mt-3">
                    <input type="text" v-model="searchText" placeholder="Buscar..." class="form-control" />
                    <button class="btn btn-outline-secondary" type="button" disabled>
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" :beat-fade="loading" />
                    </button>
                </div>
            </div>

            <div class="col-12 mt-4">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered custom-table">
                        <thead>
                            <tr class="table-dark">
                                <th v-for="(header, index) in columns.headers" :key="index" scope="col">
                                    {{ header.label }}
                                </th>
                                <th v-if="columns.actions!.length" scope="col" class="actions-header">Acciones</th>
                            </tr>
                        </thead>

                        <tbody class="table-group-divider" v-if="!loading">
                            <tr v-for="(item, rowIndex) in paginatedData" :key="rowIndex">
                                <td v-for="(header, colIndex) in columns.headers" :key="colIndex">
                                    <template v-if="header.render">
                                        <!-- Usa la función de renderizado personalizada si está definida -->
                                        <component :is="header.render(item)" />
                                    </template>
                                    <template v-else>
                                        {{ typeof header.key === 'function' ? header.key(item) : getNestedValue(item,
                                            header.key) }}
                                    </template>
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

                                            <span
                                                v-if="!(typeof action.show === 'function' ? action.show(item) : action.show)"
                                                class="invisible-placeholder-button">
                                            </span>
                                        </span>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="col-12 d-flex justify-content-center">
                <BSpinner v-if="loading" />
            </div>

            <div v-if="hidePagination == false" class="col-3 offset-6">
                <div class="pagination-container d-flex align-content-end">
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item" @click="goToPage(1)" :class="{ disabled: currentPage <= 1 }">
                                <a class="page-link" href="#" aria-label="First"><span aria-hidden="true">««</span></a>
                            </li>

                            <li class="page-item" @click="previousPage" :class="{ disabled: currentPage <= 1 }">
                                <a class="page-link" href="#" aria-label="Previous"><span
                                        aria-hidden="true">&laquo;</span></a>
                            </li>

                            <li v-for="page in pagesToShow" :key="page" class="page-item"
                                :class="{ active: currentPage === page }">
                                <a class="page-link" href="#" @click="goToPage(page)">{{ page }}</a>
                            </li>

                            <li class="page-item" @click="nextPage" :class="{ disabled: currentPage >= totalPages }">
                                <a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                            </li>

                            <li class="page-item" @click="goToPage(totalPages)"
                                :class="{ disabled: currentPage >= totalPages }">
                                <a class="page-link" href="#" aria-label="Last"><span aria-hidden="true">»»</span></a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BSpinner } from 'bootstrap-vue-next';
import { TableColumn } from "@/app/models/table";

// Props que recibe el componente
const props = defineProps<{
    columns: TableColumn; // Estructura de la tabla
    data: any[];          // Datos a mostrar
    loading: boolean;     // Estado de carga
    hidePagination?: boolean;  // Mostrar paginado
    hideSearch?: boolean;        // Mostrar busqueda
}>();


// Variables de estado
const searchText = ref('');           // Texto de búsqueda
const currentPage = ref(1);           // Página actual
const itemsPerPage = ref(10);         // Ítems por página
const pageOptions = ref([10, 20, 25, 30]); // Opciones del select
const pageRange = 5;                  // Rango de páginas visibles


// Función para obtener íconos (permite que sean dinámicos por item)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIcon = (icon: string | ((item: any) => string), item: any) => {
    if (typeof icon === 'function') {
        return icon(item); // Si es una función, la ejecutamos con `item`
    }
    return icon; // Si es un string, lo devolvemos tal cual
};
// Filtrado de datos según el texto de búsqueda
const filteredData = computed(() => {
    return props.data.filter((item) => {
        return Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchText.value.toLowerCase())
        );
    });
});

// Datos mostrados en la página actual
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredData.value.slice(start, start + itemsPerPage.value);
});

// Función para acceder a valores anidados tipo 'user.name'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string) {
    return path.replace(/\[(\w+)\]/g, '.$1')
        .split('.')
        .reduce((acc, key) => acc?.[key], obj);
}

// Total de páginas disponibles
const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

// Cambiar página manualmente
function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

// Navegación entre páginas
const previousPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

// Cálculo de qué páginas mostrar en el paginador
const pagesToShow = computed(() => {
    let start = currentPage.value - Math.floor(pageRange / 2);
    let end = currentPage.value + Math.floor(pageRange / 2);
    if (start < 1) {
        start = 1;
        end = Math.min(pageRange, totalPages.value);
    }
    if (end > totalPages.value) {
        end = totalPages.value;
        start = Math.max(totalPages.value - pageRange + 1, 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
});
</script>



<style scoped>
.btn {
    /* Mantenemos el margin-right para la separación entre botones */
    margin-right: 5px;
    /* Aseguramos que los botones tengan una altura mínima si es necesario */
    height: 32px;
    /* Ajusta esto al tamaño estándar de tus botones */
    display: inline-flex;
    /* Usar flexbox para alinear el ícono y el texto si los hubiera */
    align-items: center;
    /* Centrar verticalmente contenido (ícono/texto) */
    justify-content: center;
    /* Centrar horizontalmente contenido (ícono/texto) */
    padding: 0.25rem 0.5rem;
    /* Padding típico de btn-sm, ajusta si es necesario */
}

/* Este wrapper es clave para que los placeholders ocupen espacio */
.action-item-wrapper {
    display: inline-block;
    /* Ocupa espacio horizontalmente */
    /* Aseguramos que el wrapper tenga el mismo tamaño que un botón real */
    min-width: 32px;
    /* El ancho del botón más pequeño (normalmente solo ícono) */
    height: 32px;
    /* La altura definida para los botones */
    margin-right: 5px;
    /* Para mantener la separación consistente */
    box-sizing: border-box;
    /* Incluye padding y border en el width/height */
}

.invisible-placeholder-button {
    /* El placeholder debe tener el mismo tamaño que el botón para mantener el layout */
    display: inline-block;
    min-width: 32px;
    /* Igual que el botón más pequeño */
    height: 32px;
    /* Igual que la altura de los botones */
    /* background-color: rgba(255, 0, 0, 0.1); /* Solo para depurar y ver su espacio */
    box-sizing: border-box;
    /* No debe tener margin-right extra, ya lo maneja el wrapper */
}

/* Estilos para las celdas de la tabla para asegurar que se ajusten y el contenido no se corte */
.custom-table td {
    /* Asegurar que las celdas tienen suficiente padding para el contenido */
    padding-top: 8px;
    /* Ajusta según necesidad */
    padding-bottom: 8px;
    /* Ajusta según necesidad */
    vertical-align: middle;
    /* Para que el contenido se centre verticalmente si no usas flexbox en td */
    min-height: 64px;
    /* Puedes ajustar este valor */
}


/* Asegurar que el header de acciones tenga la misma alineación */
.actions-header {
    text-align: left;
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
}</style>