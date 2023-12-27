import type { APIRoute } from "astro";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import dbConfig from '@/lib/dbConfig'
import { User } from '@/lib/Schemas'


interface UserFields {
  email: string
  password: string
}

async function createUser({email, password}: UserFields) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password.toString(), salt)

  const user = new User({email, password: hashedPassword})
  return user.save()
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  
  if (!password || !email) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
        success: false,
      }),
      { status: 400 }
      );
  }

  try {
    let user = await User.findOne({ email })

    if(!user) {
      user = await createUser({email: email.toString(), password: password.toString()})
    }

    const passMatch = await bcrypt.compare(password.toString(), user.password)
      
    if(!passMatch) {
      return new Response(
        JSON.stringify({
          message: "Password Mismatch",
          success: false,
        }),
        { status: 401 }
        );
    }

      const token = jwt.sign({ id: user._id}, import.meta.env.SECRET_JWT, {
        expiresIn: 60 * 60 * 2, // 2 hours in seconds
      })

      cookies.set('token', token, { 
        path: '/', 
        httpOnly: true,
        maxAge: 60 * 60 * 2, // 2 hours in seconds
      })

      return new Response(
        JSON.stringify({
          message: `Login Success!`,
          success: true,
        }),
        { status: 200 }
      );
    }

  //   const salt = await bcrypt.genSalt(10)
  //   const hashedPassword = await bcrypt.hash(password.toString(), salt)

  //   const user = new User({email, password: hashedPassword})
  //   await user.save()

  //   return new Response(
  //     JSON.stringify({
  //       message: `New User!`,
  //       success: true,
  //     }),
  //     { status: 200 }
  //   );
  // }
  catch(error) {
    return new Response(
      JSON.stringify({
        message: 'Server error',
        success: false,
        error
      }),
      { status: 500 }
      );
  }
};