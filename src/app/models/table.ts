import { Component, VNode } from "vue";

// Define la estructura de cada encabezado (columna) de la tabla
export class TableHeader {
    constructor(
        // Puede ser una clave de objeto (string) o una función que reciba un ítem y devuelva un valor
        public key: string | ((item: any) => string),
        // Etiqueta visible del encabezado en la tabla
        public label: string,
        public style?: { [key: string]: string } ,// Añadido para estilos de columna
        public render?: (item: any) => string | VNode | Component // NUEVO
    ) {}
}

// Define la estructura de una acción que se puede aplicar a cada fila de la tabla
export class TableAction {
    constructor(
        public method: (row: any) => void, // Método que se ejecuta al hacer clic en la acción, recibe el ítem (fila)
        // Texto que se muestra en el botón de acción (opcional)
        public label?: string,
        // Clases CSS para aplicar estilos al botón (opcional)
        public  cssClass?: string,
        // Ícono del botón: puede ser un string o una función que devuelva un string según el ítem (opcional)
        public icon?: string | ((item: any) => string),
        // Determina si se debe mostrar el botón: puede ser booleano o una función que evalúe el ítem (opcional)
        public show: boolean | ((item: any) => boolean) = true,
        // Determina si el botón debe estar deshabilitado: booleano o función que evalúe el ítem (opcional)
        public disable: boolean | ((item: any) => boolean) = false,
            public tooltip?: string // Añadido para tooltips
    ) {}
}

// Define la estructura completa de columnas de la tabla
export class TableColumn {
    constructor(
        // Lista de encabezados de la tabla
        public headers: TableHeader[],
        // Lista de acciones disponibles por fila (opcional)
        public actions?: TableAction[],
    ) {}
}
