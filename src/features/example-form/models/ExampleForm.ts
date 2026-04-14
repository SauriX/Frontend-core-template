export interface ExampleFormModel {
  name: string;
  category: string;
  ownerEmail: string;
  description: string;
}

export function createExampleFormModel(): ExampleFormModel {
  return {
    name: "",
    category: "",
    ownerEmail: "",
    description: "",
  };
}
