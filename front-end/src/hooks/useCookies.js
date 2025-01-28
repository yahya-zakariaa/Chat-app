"use server";
import { cookies } from "next/headers";

export async function useCookies(name) {
  const cookie = cookies().get(name);
  return cookie?.value;
}
