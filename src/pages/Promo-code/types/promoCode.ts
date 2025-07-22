export interface PromoCode {
  id: string;
  code: string;
  assignedTo: string;
  status: "used" | "unused";
  expirationDate: string;
}
