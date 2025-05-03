

import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export const getUserSession = async ()=>{
  const session = await getServerSession(authOptions);
  return session;
}

export const signInEmailPassword = async( email: string, password: string ) => {
  if ( !email || !password ) return null;

  const user = await prisma.user.findUnique({ where: { email } }); 

  if (!user) {
    const dbUser = createUser(email, password);
    return dbUser;
  }

  if (!bcrypt.compareSync(password, user.password ?? '')) {
    return null;
  }
  
  return user;
}

const createUser = async( email: string, password: string ) => {
 

  const newUser = await prisma.user.create({
    data: {
      email,
      password: bcrypt.hashSync(password, 10),
      isActive: true,
      roles: ['user'],
      name: email.split('@')[0],
    }
  });

  return newUser;
}


