import { Button } from "@material-tailwind/react";
import { useState } from "react";
import Input from "./ui/input";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

const NewsLetter = () => {
  const [email, setEmail] = useState<string>("");
  const [reset,setReset] = useState<boolean>(false);

  return (
    <div className="bg-white px-3 md:px-10 py-2 md:py-10 flex flex-col gap-y-10 md:flex-row items-center justify-around">
      <h2 className="text-xl font-medium">SIGN UP TO NEWSLETTER</h2>

      <div className="w-[70%] md:w-fit">

        <form onSubmit={(e) => {e.preventDefault();
        setReset(true)
        setEmail("")
        toast.success("Thank you for signIn for newsletter.")
        }}>
        <Input icon={MdEmail} label="Email" type="email" changeValue={(value)=> {setEmail(value)
        setReset(false)}} reset={reset} placeholder="Eg: john@doe.com" className="bg-white">
            <Button disabled={!email} type="submit" className="relative right-0 top-0 h-12 rounded-r-full bg-[#679F0A] lg:w-4/12">Suscribe</Button>
        </Input>

        </form>
        
      </div>
    </div>
  );
};
export default NewsLetter;
