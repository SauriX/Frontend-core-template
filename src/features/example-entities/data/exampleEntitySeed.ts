import type { ExampleEntity } from "../models/ExampleEntity";

export const exampleEntitySeed: ExampleEntity[] = [
  {
    id: "EX-1001",
    name: "Landing Page Refresh",
    category: "Marketing",
    ownerEmail: "owner@example.com",
    status: "active",
    updatedAt: "2026-04-10T11:00:00.000Z",
  },
  {
    id: "EX-1002",
    name: "Admin Portal Setup",
    category: "Operations",
    ownerEmail: "ops@example.com",
    status: "draft",
    updatedAt: "2026-04-12T09:30:00.000Z",
  },
  {
    id: "EX-1003",
    name: "Public API Sandbox",
    category: "Engineering",
    ownerEmail: "api@example.com",
    status: "active",
    updatedAt: "2026-04-13T14:45:00.000Z",
  },
];
