export type ExampleEntityStatus = "active" | "draft";

export interface ExampleEntity {
  id: string;
  name: string;
  category: string;
  ownerEmail: string;
  status: ExampleEntityStatus;
  updatedAt: string;
}

export interface ExampleEntityInput {
  name: string;
  category: string;
  ownerEmail: string;
}
