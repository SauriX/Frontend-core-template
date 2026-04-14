<template>
  <div class="container-fluid">
    <PanelTitleForm :title="pageTitle" icon="fa-solid fa-layer-group">
      <div class="row g-3">
        <div class="col-md-4" v-for="metric in metrics" :key="metric.label">
          <div class="metric-card">
            <small class="metric-label">{{ metric.label }}</small>
            <strong class="metric-value">{{ metric.value }}</strong>
            <span class="metric-note">{{ metric.note }}</span>
          </div>
        </div>
      </div>
    </PanelTitleForm>

    <PanelTitleForm :title="translate('template.dashboard.examplesTitle', { defaultMessage: 'Template examples' })" icon="fa-solid fa-compass" class="mt-4">
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="example-block">
            <h5>{{ translate('template.dashboard.apiAgentTitle', { defaultMessage: 'API agent example' }) }}</h5>
            <p>{{ translate('template.dashboard.apiAgentBody', { defaultMessage: 'The example entity module uses the shared API agent and falls back to local seed data when no backend is configured.' }) }}</p>
            <code>requests.get("examples/entities")</code>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="example-block">
            <h5>{{ translate('template.dashboard.authTitle', { defaultMessage: 'Auth strategy example' }) }}</h5>
            <p>{{ translate('template.dashboard.authBody', { defaultMessage: 'The active authentication strategy is resolved at runtime and can be switched between custom and MSAL.' }) }}</p>
            <code>{{ currentStrategyName }}</code>
          </div>
        </div>
      </div>
    </PanelTitleForm>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PanelTitleForm from "@/components/PanelTitleForm.vue";
import { useAuth } from "@/config/useAuth";
import { isLocalizationEnabled, translate } from "@/core/localization/translator";

const { currentStrategyName } = useAuth();

const pageTitle = computed(() =>
  translate("template.dashboard.title", {
    defaultMessage: "Example Dashboard",
  }),
);

const metrics = computed(() => [
  {
    label: translate("template.dashboard.metrics.structure", { defaultMessage: "Architecture" }),
    value: "core + features + app",
    note: translate("template.dashboard.metrics.structureNote", { defaultMessage: "Reusable structure for new modules" }),
  },
  {
    label: translate("template.dashboard.metrics.auth", { defaultMessage: "Auth" }),
    value: currentStrategyName.value,
    note: translate("template.dashboard.metrics.authNote", { defaultMessage: "Pluggable MSAL/custom strategy" }),
  },
  {
    label: translate("template.dashboard.metrics.i18n", { defaultMessage: "Localization" }),
    value: isLocalizationEnabled() ? "enabled" : "fallback",
    note: translate("template.dashboard.metrics.i18nNote", { defaultMessage: "Optional i18n integration" }),
  },
]);
</script>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-height: 148px;
  padding: 1.25rem;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f5f8ff 100%);
  border: 1px solid #d9e2f1;
  box-shadow: 0 12px 24px rgba(3, 64, 127, 0.08);
}

.metric-label {
  color: #5f6b7a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.metric-value {
  color: #0c294a;
  font-size: 1.35rem;
}

.metric-note {
  color: #425466;
}

.example-block {
  height: 100%;
  padding: 1.25rem;
  border-radius: 18px;
  border: 1px solid #d9e2f1;
  background: #ffffff;
}
</style>
