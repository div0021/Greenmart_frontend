// import Input from "./ui/input";
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import Button from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { CiLogin } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { onLoginClose, selectLoginOpen } from "../app/features/loginSlice";
import { onRegisterOpen } from "../app/features/registerSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCurrentUserMutation, useLoginMutation } from "../app/services/authApiSlice";
import { LoginUserInput, handleErrorResponse, loginUserSchema } from "../lib/schema";
import FormInput from "./ui/form-input";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getGoogleOAuthURL } from "../lib/getGoogleUrl";

const Login = () => {

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login,{isLoading}] = useLoginMutation()
  const [currentUser,{isLoading:currentUserLoading}] = useCurrentUserMutation()


  const onSubmit = async (values: LoginUserInput) => {
    
    try {
      // login
       await login({password:values.password as string,email:values.email as string}).unwrap();

//  Get current user
      await currentUser('').unwrap()
      reset()

      toast.success("Login Successful");
      setOpen(false);
      setTimeout(() => {
        dispatch(onLoginClose());
      }, 300);

      setTimeout(()=>{
        window.location.reload();
      },600)
    } catch (errors) {
      const { status } = handleErrorResponse.parse(errors);
      if (status === 500) toast.error("Currently service is unavailable");
      else {
        toast.error("unknown Login error");
        console.log("Error:: ", errors);
      }
    }

  }


  const loginOpen = useAppSelector(selectLoginOpen);


  const [open, setOpen] = useState<boolean | undefined>(loginOpen);

  useEffect(() => {
    setOpen(loginOpen);
  }, [loginOpen]);

  if (!loginOpen) {
    return null;
  }
  return (
    <div
      className={`h-full fixed overflow-x-hidden bg-gray-800/90 inset-0 flex justify-center items-center z-50 focus:outline-none outline-none overflow-hidden`}
    >
      <div className="relative w-full md:w-5/6 lg:w-4/6 max-w-screen-md mx-auto h-[35rem] sm:h-96 rounded-xl lg:max-h-96 ">
        <div
          className={`translate duration-300 h-full w-full ${
            open ? "translate-y-0" : "translate-y-full"
          } ${open ? "opacity-100" : "opacity-0"}`}
        >
          <div className="h-full w-full flex flex-col-reverse sm:flex-row items-center justify-center rounded-xl overflow-hidden">
            <div className="h-full w-full sm:w-2/5  flex-auto flex flex-col items-center justify-center bg-[url(/banner2.jpg)] object-cover bg-no-repeat gap-3">
              <h1 className="text-2xl lg:text-4xl font-semibold">Sign Up</h1>
              <p className="text-sm lg:text-base text-center font-medium lg:px-7">
                Create on Sign Up button to create a new account
              </p>

              <button
                className="px-10 bg-[#679F0A]/80 hover:bg-[#679F0A] rounded-full py-4 transition-all duration-200 ease-in-out tracking-wide hover:ring-1 hover:ring-offset-2 hover:ring-white text-sm font-medium w-60 sm:w-auto"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => {
                    dispatch(onLoginClose());
                    dispatch(onRegisterOpen());
                  }, 300);
                }}
              >
                SignUp
              </button>

              <div className="h-0.5 w-52 bg-[#679F0A]/50 rounded-full" />

              <a href={getGoogleOAuthURL()} className="px-5 py-3 bg-green-500/50 text-center rounded-full flex justify-center items-center">
                <FaGoogle className="w-4 h-4 mr-2" />
                <span>Google</span>

              </a>
            </div>
            <div className="h-full w-full sm:w-3/5 bg-white flex-auto py-5 flex flex-col justify-center items-center">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-xl lg:text-3xl mb-6">
                  Login To You account
                </h1>

                <FormInput
                  label="Email"
                  type="email"
                  icon={IoMailOutline}
                  name="email"
                  register={register}
                  className="w-60 md:w-full mb-6"
                  errors={errors.email}
                  disabled={isLoading}
                />

                <FormInput
                  label="Password"
                  type="password"
                  icon={IoLockClosedOutline}
                  isPassword={true}
                  name="password"
                  register={register}
                  className="w-60 md:w-full"
                  errors={errors.password}
                  disabled={isLoading}
                />

                <Link className="text-end  w-full text-sm mb-2 cursor-pointer hover:text-[#679F0A] hover:underline" to="/forgetPassword" onClick={()=>{
                    setOpen(false);
                    setTimeout(() => {
                      dispatch(onLoginClose());
                    }, 300);
                }}>
                  Forget Password?
                </Link>

                <Button
                  label="Login"
                  onClick={() => {
                    //TODO login
                  }}
                  loading={isLoading || currentUserLoading} 
                  className="rounded-full hover:text-white"
                  icon={CiLogin}
                  type="submit"
                />
              </form>
            </div>
          </div>
          <button
            className="absolute -right-2 -top-2 p-1 bg-red-600 flex iemc justify-center text-white rounded-full"
            onClick={() => {
              setOpen(false);
              setTimeout(() => {
                dispatch(onLoginClose());
              }, 300);
            }}
          >
            <RxCross2 className="w-4 h-4 font-bold" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
