import React, {useState} from "react";
import { Link } from "@reach/router";
import { signInWithGoogle } from "../../firebase";
import { auth } from "../../firebase";

const SignIn = () => {
    const [error, setError] = useState(null);

  return (
    
    <div>
      <h1>Sign In</h1>
      <div>
        {error !== null && <div>{error}</div>}

        <button onClick={() => {signInWithGoogle();}}>
          Sign In with Google
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/auth/signUp" className="text-blue-500 hover:text-blue-600">
            Sign up here
          </Link>{" "}
          <br />{" "}
        </p>
      </div>
    </div>
  );
};
export default SignIn;