
import { getUserSession } from "@/actions/auth-actions";

export const Greet = async() => {
  const session = await getUserSession();

  if (session) {
    return <h1 className="flex justify-center m-4">{session.user?.name} Bienvenido a Cocinas itinerantes</h1>;
  }

  return <h1 className="flex justify-center m-4">Bienvenidos a Cocinas itinerantes</h1>;
};
