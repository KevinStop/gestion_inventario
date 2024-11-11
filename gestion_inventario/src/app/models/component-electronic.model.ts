export class ComponentElectronic {
  id: number;
  name: string;
  category: string;
  quantity: number;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(
    id: number,
    name: string,
    category: string,
    quantity: number,
    description: string,
    is_active: boolean,
    created_at: string | Date,
    updated_at: string | Date
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.quantity = quantity;
    this.description = description;
    this.is_active = is_active;
    this.created_at = typeof created_at === 'string' ? new Date(created_at) : created_at;
    this.updated_at = typeof updated_at === 'string' ? new Date(updated_at) : updated_at;
  }
}
