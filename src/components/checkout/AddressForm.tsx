"use client";
import { useAddressStore } from "@/store/address-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { placeOrder } from "@/actions/place-order";
import useStore from "@/store/store";
import { useShippingStore } from "@/store/shipping-store";

type FormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  country: string;
  city: string;
  phone: string;
};

export const AddressForm = () => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
  } = useForm<FormInputs>();

  const router = useRouter();
  const products = useStore((state) => state.products);
  const getShippingCost = useShippingStore((state) => state.getShippingCost);

  const setAddress = useAddressStore((state) => state.setAddress);
  const address = useAddressStore((state) => state.address);

  useEffect(() => {
    if (address.firstName) {
      reset(address);
    }
  }, [address, reset]);

  const onSubmit = async (data: FormInputs) => {
    try {
      // Set the address in the store
      setAddress(data);

      // Get shipping cost
      const shippingCost = getShippingCost();

      // Create the order
      const result = await placeOrder(products, data, shippingCost);

      if (!result.ok) {
        console.error("Error creating order:", result.message);
        return;
      }

      // Redirect to the specific order page
      router.push(`/checkout/order/${result.order!.id}`);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full xl:w-[1000px] flex flex-col justify-center text-left"
      >
        <div className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
          <div className="flex flex-col mb-2">
            <span>Nombres</span>
            <input
              type="text"
              className="form-input"
              {...register("firstName", { required: true })}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Apellidos</span>
            <input
              type="text"
              className="form-input"
              {...register("lastName", { required: true })}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Correo electrónico</span>
            <input
              type="email"
              className="form-input"
              {...register("email", { 
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido"
                }
              })}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>Dirección</span>
            <input
              type="text"
              className="form-input"
              {...register("address", { required: true })}
            />
          </div>

          <div className="flex flex-col mb-2">
            <span>País</span>
            <select
              className="form-input"
              {...register("country", { required: true })}
              defaultValue="Colombia"
            >
              <option value="Colombia">Colombia</option>
            </select>
          </div>

          <div className="flex flex-col mb-2">
            <span>Ciudad</span>
            <select
              className="form-input"
              {...register("city", { required: true })}
            >
              <option value="">Seleccione una ciudad</option>
              <option value="Bogota">Bogotá</option>
              <option value="Medellin">Medellín</option>
              <option value="Cali">Cali</option>
            </select>
          </div>

          <div className="flex flex-col mb-2">
            <span>Teléfono</span>
            <input
              type="text"
              className="form-input"
              {...register("phone", { required: true })}
            />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            disabled={!isValid}
            type="submit"
            className="form-action-button-primary w-full sm:w-1/2"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};
