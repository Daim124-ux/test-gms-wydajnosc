export type ConfigColor = {
  id: string;
  name: string;
  hex: string;
  price: number;
};

export type ConfigOption = {
  id: string;
  name: string;
  price: number;
};

export const CONFIG_COLORS: ConfigColor[] = [
  { id: 'ocynk', name: 'Ocynk', hex: '#d9e0e3', price: 0 },
  { id: 'ral3005', name: 'RAL3005', hex: '#5e2028', price: 300 },
  { id: 'ral6005', name: 'RAL6005', hex: '#114232', price: 300 },
  { id: 'ral6020', name: 'RAL6020 mat', hex: '#3b4d36', price: 300 },
  { id: 'ral7016', name: 'RAL7016', hex: '#373f43', price: 300 },
  { id: 'ral7016mat', name: 'RAL7016 mat', hex: '#373f43', price: 300 },
  { id: 'ral8004', name: 'RAL8004', hex: '#8e402a', price: 300 },
  { id: 'ral8017', name: 'RAL8017', hex: '#452a24', price: 300 },
  { id: 'ral8017mat', name: 'RAL8017 mat', hex: '#452a24', price: 300 },
  { id: 'ral9006', name: 'RAL9006', hex: '#a5a5a5', price: 300 },
  { id: 'ral9010', name: 'RAL9010', hex: '#f1efe7', price: 300 },
];

export const ADDITIONAL_OPTIONS: ConfigOption[] = [
  { id: 'floor', name: 'Aluminiowa podłoga', price: 700 },
];

export const BASE_PRICE = 4500; // Hypothetical base price

export type ConfigState = {
  color: string;
  additionalOptions: Record<string, boolean>;
};
