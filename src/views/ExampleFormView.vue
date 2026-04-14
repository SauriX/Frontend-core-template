<template>
  <div class="container-fluid">
    <PanelTitleForm :title="pageTitle" icon="fa-solid fa-pen-ruler">
      <Loader :loading="store.loading">
        <form class="row g-3" @submit.prevent="submitWithI18n">
          <div class="col-md-6">
            <label class="form-label">{{ translate('template.form.fields.name', { defaultMessage: 'Name' }) }}</label>
            <input v-model="form.name" class="form-control" :class="{ 'is-invalid': hasError('name', errors) }" />
            <div class="invalid-feedback d-block" v-if="hasError('name', errors)">{{ getErrorMessage('name', errors) }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ translate('template.form.fields.category', { defaultMessage: 'Category' }) }}</label>
            <input v-model="form.category" class="form-control" :class="{ 'is-invalid': hasError('category', errors) }" />
            <div class="invalid-feedback d-block" v-if="hasError('category', errors)">{{ getErrorMessage('category', errors) }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ translate('template.form.fields.ownerEmail', { defaultMessage: 'Owner email' }) }}</label>
            <input v-model="form.ownerEmail" class="form-control" :class="{ 'is-invalid': hasError('ownerEmail', errors) }" />
            <div class="invalid-feedback d-block" v-if="hasError('ownerEmail', errors)">{{ getErrorMessage('ownerEmail', errors) }}</div>
          </div>
          <div class="col-12">
            <label class="form-label">{{ translate('template.form.fields.description', { defaultMessage: 'Description' }) }}</label>
            <textarea v-model="form.description" class="form-control" rows="4" :class="{ 'is-invalid': hasError('description', errors) }"></textarea>
            <div class="invalid-feedback d-block" v-if="hasError('description', errors)">{{ getErrorMessage('description', errors) }}</div>
          </div>
          <div class="col-12 d-flex gap-2 flex-wrap">
            <button type="submit" class="btn btn-primary">{{ translate('template.form.actions.submitI18n', { defaultMessage: 'Validate and save with i18n' }) }}</button>
            <button type="button" class="btn btn-outline-secondary" @click="submitWithoutI18n">{{ translate('template.form.actions.submitPlain', { defaultMessage: 'Validate without i18n' }) }}</button>
          </div>
        </form>
      </Loader>
    </PanelTitleForm>

    <PanelTitleForm :title="translate('template.form.resultTitle', { defaultMessage: 'Last result' })" icon="fa-solid fa-circle-info" class="mt-4">
      <pre class="result-box">{{ resultMessage }}</pre>
    </PanelTitleForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CustomError } from "@/app/models/errors";
import Loader from "@/components/Loader.vue";
import PanelTitleForm from "@/components/PanelTitleForm.vue";
import { getErrorMessage, hasError, validateObjectProperties } from "@/app/util/helpers";
import { translate } from "@/core/localization/translator";
import { ExampleEntityStore } from "@/features/example-entities/stores/ExampleEntityStore";
import { createExampleFormModel } from "@/features/example-form/models/ExampleForm";
import { ExampleFormPlainSchema } from "@/features/example-form/validators/exampleFormPlainSchema";
import { ExampleFormSchema } from "@/features/example-form/validators/exampleFormSchema";

const store = ExampleEntityStore();
const form = ref(createExampleFormModel());
const errors = ref<CustomError[]>([]);
const resultMessage = ref(translate("template.form.initialResult", { defaultMessage: "No action executed yet." }));
const pageTitle = translate("template.form.title", { defaultMessage: "Example Form" });

async function submitWithI18n() {
  errors.value = validateObjectProperties(form.value, ExampleFormSchema);

  if (errors.value.length > 0) {
    resultMessage.value = translate("template.form.validationFailed", {
      defaultMessage: "Validation with i18n returned errors.",
    });
    return;
  }

  const entity = await store.createEntity({
    name: form.value.name,
    category: form.value.category,
    ownerEmail: form.value.ownerEmail,
  });

  resultMessage.value = JSON.stringify(entity, null, 2);
}

function submitWithoutI18n() {
  errors.value = validateObjectProperties(form.value, ExampleFormPlainSchema);

  resultMessage.value = errors.value.length > 0
    ? JSON.stringify(errors.value, null, 2)
    : "Plain validation passed.";
}
</script>

<style scoped>
.result-box {
  margin: 0;
  padding: 1rem;
  border-radius: 12px;
  background: #0c294a;
  color: #f8fbff;
  white-space: pre-wrap;
}
</style>
