import requests from "@/app/api/agent";
import type { ExampleEntity, ExampleEntityInput } from "../models/ExampleEntity";
import { exampleEntitySeed } from "../data/exampleEntitySeed";

function normalizeEntityResponse(response: unknown): ExampleEntity[] {
  if (Array.isArray(response)) {
    return response as ExampleEntity[];
  }

  if (response && typeof response === "object" && "data" in response && Array.isArray((response as { data: unknown[] }).data)) {
    return (response as { data: ExampleEntity[] }).data;
  }

  return exampleEntitySeed;
}

export class ExampleEntityRepository {
  async getAll(): Promise<ExampleEntity[]> {
    try {
      const response = await requests.get("examples/entities");
      return normalizeEntityResponse(response);
    } catch (error) {
      return exampleEntitySeed;
    }
  }

  async create(input: ExampleEntityInput): Promise<ExampleEntity> {
    try {
      const response = await requests.post("examples/entities", input);

      if (response && typeof response === "object" && "data" in response && (response as { data: ExampleEntity }).data) {
        return (response as { data: ExampleEntity }).data;
      }

      if (response && typeof response === "object" && "id" in response) {
        return response as ExampleEntity;
      }
    } catch (error) {
      // La plantilla sigue funcionando sin backend real.
    }

    return {
      id: `EX-${Date.now()}`,
      name: input.name,
      category: input.category,
      ownerEmail: input.ownerEmail,
      status: "draft",
      updatedAt: new Date().toISOString(),
    };
  }
}
