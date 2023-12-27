import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {

  async function submit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/users", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    
    // alert(data.message)

    // console.log(data.success)

    if(data.success) {
      return location.href = '/admin'
    }
  }

  return (<form onSubmit={submit} className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full m-auto bg-white lg:max-w-lg">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" placeholder="you@mail.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" />
            </div>
            
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full">Login</Button>
          {/* <p className="mt-2 text-xs text-center text-gray-700">
            {" "}
            Don't have an account?{" "}
            <a href="register" className=" text-blue-600 hover:underline">Register</a>
          </p> */}
        </CardFooter>
      </Card>
    </div>
  </form>)
}