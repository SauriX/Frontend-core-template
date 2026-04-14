<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import {
  Chart,
  registerables,
  ChartData,
  ChartOptions
} from 'chart.js';

// Registrar todos los componentes de Chart.js necesarios
Chart.register(...registerables);

export default defineComponent({
  name: 'BaseChart',
  props: {
    type: {
      type: String as () => 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea',
      required: true
    },
    data: {
      type: Object as () => ChartData<any>,  // ChartData<'bar'> si quieres específico
      required: true
    },
    options: {
      type: Object as () => ChartOptions<any>,
      required: false,
      default: () => ({})
    }
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    const renderChart = () => {
      if (chartInstance) chartInstance.destroy();
      if (canvasRef.value) {
        chartInstance = new Chart(canvasRef.value, {
          type: props.type,
          data: props.data,
          options: props.options
        });
      }
    };

    onMounted(() => {
      renderChart();
    });

    // Redibujar si cambian los datos
    watch(() => props.data, () => {
      renderChart();
    }, { deep: true });

    return { canvasRef };
  }
});
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
