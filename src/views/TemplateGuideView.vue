<template>
  <div class="container-fluid">
    <PanelTitleForm :title="translate('template.guide.title', { defaultMessage: 'Template Guide' })" icon="fa-solid fa-book-open">
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="guide-card">
            <h5>{{ translate('template.guide.authTitle', { defaultMessage: 'Switch authentication strategy' }) }}</h5>
            <pre>VITE_AUTH_STRATEGY=custom | msal</pre>
            <p>{{ translate('template.guide.authBody', { defaultMessage: 'The template keeps both providers and resolves the active strategy through authService.' }) }}</p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="guide-card">
            <h5>{{ translate('template.guide.i18nTitle', { defaultMessage: 'Enable or disable i18n' }) }}</h5>
            <pre>VITE_I18N_ENABLED=true | false</pre>
            <p>{{ translate('template.guide.i18nBody', { defaultMessage: 'When disabled, translate(...) returns the fallback message or the key.' }) }}</p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="guide-card">
            <h5>{{ translate('template.guide.apiTitle', { defaultMessage: 'Use the API agent' }) }}</h5>
            <pre>requests.get("examples/entities")</pre>
            <p>{{ translate('template.guide.apiBody', { defaultMessage: 'Build new repositories on top of the shared agent instead of calling axios directly from views.' }) }}</p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="guide-card">
            <h5>{{ translate('template.guide.validationTitle', { defaultMessage: 'Use the custom validator' }) }}</h5>
            <pre>validateObjectProperties(model, ExampleFormSchema)</pre>
            <p>{{ translate('template.guide.validationBody', { defaultMessage: 'The template includes examples with i18n-aware messages and plain messages.' }) }}</p>
          </div>
        </div>
      </div>
    </PanelTitleForm>
  </div>
</template>

<script setup lang="ts">
import PanelTitleForm from "@/components/PanelTitleForm.vue";
import { translate } from "@/core/localization/translator";
</script>

<style scoped>
.guide-card {
  height: 100%;
  padding: 1.25rem;
  border-radius: 18px;
  border: 1px solid #d9e2f1;
  background: #ffffff;
}

pre {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: #0c294a;
  color: #ffffff;
}
</style>
