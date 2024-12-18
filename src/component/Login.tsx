import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../services/mutation/auth";
import { ISessionData } from "../interfaces/auth.interface";
import { IUser } from "../interfaces/user.interface";
import LoginImage from "../assets/scnhs-bg.jpg";
import ScnhsLogo from "../assets/scnhs-logo.jpg";

interface Payload {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { session: {user}, login } = useAuth();
  console.log("Session", user);

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "USER") {
        navigate("/user");
      }
    }
    //logout();
  }, [user, navigate]);

  const { mutate, isPending} = useMutation({
    mutationFn: async (payload: Payload) => {
      return await signin(payload);
    },
    onSuccess: (data: ISessionData) => {
      const token = data?.token;
      const user = data?.user;
      login(String(token), user as IUser);
      
      if(user?.role === "ADMIN") {
        navigate("/admin");
      } else if(user?.role === "USER") {
        navigate("/user");
      }
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const submit = async (payload: Payload) => {
    mutate(payload);
  };

  return (
    <>
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-300">
      <div className="w-[800px] flex rounded-[20px] shadow-lg bg-white p-0">
        <div className="w-full">
          <img src={LoginImage} alt="" className="w-full h-full object-cover rounded-[20px]" />
        </div>
        <div className="w-full flex flex-col items-center p-5">
          <img src={ScnhsLogo} alt="" className="w-40" />
          <h1 className="font-semibold text-2xl mb-5">Alumni System</h1>
          <div className="w-full">
            <Form onFinish={submit} layout="vertical">
              {error && (
                <p className="mb-2 text-red-500">
                  {error}
                </p>
              )}
              <Form.Item name="username">
                <Input size="large" placeholder="username"/>
              </Form.Item>
              <Form.Item name="password">
                <Input.Password type="password" placeholder="password" autoComplete="off" size="large"/>
              </Form.Item>
              <Button
                type="primary"
                title="Login using credentials"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={isPending}
                disabled={isPending}
              >
                LOGIN
              </Button>
            </Form>
          </div>
          <div className="mt-10 text-gray-500">Don't have an account? 
            <span className="cursor-pointer text-blue-500 hover:text-gray-500" onClick={() =>navigate("/register")}> Register</span>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Login;
