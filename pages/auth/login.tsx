import React, { FormEvent } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import 'simplebar-react/dist/simplebar.min.css';
import axiosInstance, { API_ENDPOINTS } from "@/utils/axios";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

// 1. Định nghĩa interface cho dữ liệu form
interface LoginForm {
  account: string;
  password?: string;
}

// 2. Định nghĩa interface cho cấu trúc lỗi từ API
interface ApiErrorResponse {
  errors?: Array<{ message: string }>;
  message?: string;
}

// 3. Định nghĩa interface cho phản hồi thành công
interface LoginResponse {
  token: string;
  studentId: string;
}

const Login: React.FC = () => {
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await axiosInstance.post<LoginResponse>(API_ENDPOINTS.auth.login, {
        account: data.account,
        password: data.password,
        totp_code: ""
      });

      const { token, studentId } = res.data;

      if (token) {
        Cookies.set("access_token", token, { 
            expires: 7, 
            path: '/' 
        });
        Cookies.set("student_id", studentId, { 
            expires: 7, 
            path: '/' 
        });
      }
      
      toast.success("Đăng nhập thành công!");
      
      // Chuyển hướng về trang chủ
      router.replace("/");
   
    } catch (error: unknown) {
      let message = "Đăng nhập thất bại. Vui lòng thử lại.";

      // Xử lý lỗi an toàn không dùng any
      if (error instanceof AxiosError) {
        const serverResponse = error.response?.data as ApiErrorResponse;
        if (serverResponse?.errors && serverResponse.errors.length > 0) {
          message = serverResponse.errors[0].message;
        } else if (serverResponse?.message) {
          message = serverResponse.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const account = formData.get("phone") as string;
    const password = formData.get("password") as string;
    
    if (!account || !password) {
      toast.error("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }
    
    onSubmit({ account, password });
  };

  return (
    <div className="min-h-screen w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="w-full h-full lg:max-h-screen sticky left-0 top-0 bg-[length:80%_auto] bg-bottom bg-no-repeat bg-[#ce1628] overflow-hidden lg:bg-[url('https://lh4.googleusercontent.com/proxy/4jULRMIhptcFopjyWoPB34q7gxUBew761Q86NO2wQTTlbiT8D96VsmS0Hf0H2GxXB2_RgiGf0s62m11wv6NyXmnUiblXBKouRsiBVyeqW5GL51pt')]" />
        
        <div className="px-5 md:px-12 bg-white lg:px-26 xl:px-36 flex items-start lg:mt-0 mt-[-18px] z-10 lg:pt-0 pt-8 lg:justify-center flex-col lg:rounded-0 rounded-t-3xl">
          <div className="w-full md:px-36 lg:px-8 xl:px-12 ">
            <div className="flex mb-5 space-x-2">
              <Image
                src="https://img-cache.coccoc.com/image2?i=2&l=20/339612710"
                alt="Logo"
                className="object-cover border-white border-2 rounded bg-black w-[30px]"
                width={30}
                height={30}
              />
              <div className="flex flex-col">
                <div className="font-medium text-lg ">
                  ĐĂNG NHẬP TÀI KHOẢN
                </div>
                <p className="text-gray-500 text-sm">
                  Trường đại học Tiktok
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-black mb-2">Mã số sinh viên</label>
                <input
                  type="text"
                  name="phone"
                  id="phoneNumber"
                  placeholder="vd: MSV1234"
                  className="w-full rounded-lg bg-slate-100 placeholder:text-slate-400 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#ce1628]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-black mb-2">Mật khẩu</label>
                  <Link
                    href="/quen-mat-khau"
                    className="text-xs text-gray-600 hover:text-[#ce1628]"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="***********"
                  className="w-full rounded-lg bg-slate-100 placeholder:text-slate-400 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#ce1628]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ce1628] font-medium text-white py-2.5 rounded-lg text-sm hover:opacity-90 transition"
              >
                Đăng nhập
              </button>

              <button
                type="button" 
                className="w-full bg-white border border-gray-400 font-medium text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Tra cứu điểm thi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;