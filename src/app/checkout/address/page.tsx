import { AddressForm } from "@/components";

export default function AddressPage() {
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <h1>Dirección de envío</h1>
      <AddressForm />
    </div>
  );
}