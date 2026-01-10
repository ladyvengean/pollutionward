export interface Ward {
  id: string;
  name: string;
  center: [number, number];
}

export const wards: Ward[] = [
  {
    id: "W1",
    name: "Ward 1",
    center: [28.6448, 77.2167],
  },
  {
    id: "W2",
    name: "Ward 2",
    center: [28.6540, 77.2300],
  },
  {
    id: "W3",
    name: "Ward 3",
    center: [28.6350, 77.2000],
  }
];
