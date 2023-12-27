import jwt from 'jsonwebtoken'

/**
* Verify if the client token is valid. 
*/
const verifyAuth = async (token) => {
  if (!token) {
    return {
      status: "unauthorized",
      msg: "Please pass a request token",
    };
  }

  try {
    return await new Promise( (resolve, reject) => jwt.verify(token, import.meta.env.SECRET_JWT, (err, decoded) => {
      if(err) {
        return reject({ status: "error", msg: "could not validate auth token" })
      }

      return resolve({
        status: "authorized",
        payload: decoded,
        msg: "successfully verified auth token",
      })
    }))

    // return {
    //   status: "authorized",
    //   payload: jwtVerifyResult.payload,
    //   msg: "successfully verified auth token",
    // };
  } catch (err) {
    if (err) {
      return { status: "error", msg: err.message };
    }

    console.debug(err);
    return { status: "error", msg: "could not validate auth token" };
  }
};

// context { locals, cookies, url, redirect }
export async function onRequest ({ locals, cookies, url, redirect }, next) {
  // intercept data from a request
  // optionally, modify the properties in `locals`
  // locals.title = "New title";

  // console.log('\n\nLOCALS: ', locals)
  // console.log('\n\nREQUEST: ', request)
  // console.log('\n\nCOOKIES: ', cookies.get('token').value)


  //every route is blocked but
  const allowedRoutes = ['/login', '/', '/register', '/api/users']
  if (allowedRoutes.includes(url.pathname)) {
    /**
     * Construct a full URL by passing `context.url` as the base URL
     */
    return next()
  }

  // const response = await next() 
  
  if(!cookies.has('token')) {
    return redirect('login')
  }

  const token = cookies.get('token').value
  const validationResult = await verifyAuth(token);

  switch (validationResult.status) {
    case "authorized":
      // Respond as usual if the user is authorised 
      locals.userId = validationResult.payload.id
      return next();

    case "error":
    case "unauthorized":
      // If an API endpoint, return a JSON response
      if (url.pathname.startsWith("/api/")) {
        return new Response(JSON.stringify({ message: validationResult.msg }), {
          status: 401,
        });
      }
      // Otherwise, this is a standard page. Redirect to the root page for the user to login
      else {
        return Response.redirect(new URL("/login", url));
      }

    default:
      return Response.redirect(new URL("/login", url));
  }

  // return a Response or the result of calling `next()`
  // return next();
};