import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  cookies.delete('token', {
    path:'/',
  })
  return redirect('/')
};