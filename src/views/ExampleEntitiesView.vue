<template>
  <Loader :loading="store.loading">
    <PanelTitleForm :title="pageTitle" icon="fa-solid fa-table-list">
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>{{ translate('template.entities.columns.id', { defaultMessage: 'ID' }) }}</th>
              <th>{{ translate('template.entities.columns.name', { defaultMessage: 'Name' }) }}</th>
              <th>{{ translate('template.entities.columns.category', { defaultMessage: 'Category' }) }}</th>
              <th>{{ translate('template.entities.columns.owner', { defaultMessage: 'Owner' }) }}</th>
              <th>{{ translate('template.entities.columns.status', { defaultMessage: 'Status' }) }}</th>
              <th>{{ translate('template.entities.columns.updatedAt', { defaultMessage: 'Updated at' }) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in store.items" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.ownerEmail }}</td>
              <td>
                <span class="badge rounded-pill" :class="item.status === 'active' ? 'bg-success' : 'bg-secondary'">
                  {{ item.status }}
                </span>
              </td>
              <td>{{ formatDate(item.updatedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PanelTitleForm>
  </Loader>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import moment from "moment";
import Loader from "@/components/Loader.vue";
import PanelTitleForm from "@/components/PanelTitleForm.vue";
import { ExampleEntityStore } from "@/features/example-entities/stores/ExampleEntityStore";
import { translate } from "@/core/localization/translator";

const store = ExampleEntityStore();
const pageTitle = translate("template.entities.title", {
  defaultMessage: "Example Entities",
});

function formatDate(value: string) {
  return moment(value).format("YYYY-MM-DD HH:mm");
}

onMounted(async () => {
  await store.loadEntities();
});
</script>
