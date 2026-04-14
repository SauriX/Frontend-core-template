import type { ExampleEntity, ExampleEntityInput } from "../models/ExampleEntity";
import { ExampleEntityRepository } from "../repositories/ExampleEntityRepository";

export class ExampleEntityService {
  constructor(private readonly repository: ExampleEntityRepository) {}

  async getEntities(): Promise<ExampleEntity[]> {
    return this.repository.getAll();
  }

  async createEntity(input: ExampleEntityInput): Promise<ExampleEntity> {
    return this.repository.create(input);
  }
}
