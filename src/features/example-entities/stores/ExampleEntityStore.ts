import { defineStore } from "pinia";
import type { ExampleEntity, ExampleEntityInput } from "../models/ExampleEntity";
import { ExampleEntityRepository } from "../repositories/ExampleEntityRepository";
import { ExampleEntityService } from "../services/ExampleEntityService";

const repository = new ExampleEntityRepository();
const service = new ExampleEntityService(repository);

export const ExampleEntityStore = defineStore("exampleEntities", {
  state: () => ({
    items: [] as ExampleEntity[],
    loading: false,
    lastSavedEntity: null as ExampleEntity | null,
  }),
  actions: {
    async loadEntities() {
      this.loading = true;

      try {
        this.items = await service.getEntities();
      } finally {
        this.loading = false;
      }
    },
    async createEntity(input: ExampleEntityInput) {
      this.loading = true;

      try {
        const entity = await service.createEntity(input);
        this.items = [entity, ...this.items];
        this.lastSavedEntity = entity;
        return entity;
      } finally {
        this.loading = false;
      }
    },
  },
});
