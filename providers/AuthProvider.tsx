"use client";

import { useContext, ReactNode, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useUser } from "@/hooks/useUser";
import { AuthContext, AuthContextType } from "@/context/AuthContext";
import axiosInstance, { API_ENDPOINTS } from "@/utils/axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const {
    user,
    settings,
    loading,
    setUser,
    setSettings,
    setLoading,
  } = useUser();

  useEffect(() => {
    let active = true;
    const ctrl = new AbortController();

    const fetchData = async () => {
      // 1. Lấy thông tin từ Cookie trước
      const token = Cookies.get("access_token");
      const studentId = Cookies.get("student_id");

      // 2. Chặn gọi API nếu user chưa đăng nhập (không có cookie)
      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        const accountEndpoint = typeof API_ENDPOINTS.auth.account === 'function' 
            ? API_ENDPOINTS.auth.account(studentId as string) 
            : API_ENDPOINTS.auth.account; 

        const response = await axiosInstance.get(accountEndpoint, {
          signal: ctrl.signal,
        });

        if (!active) return;

        setUser(response.data);

      } catch (error: any) {
        if (!active) return;
        
        if (error?.response?.status === 401) {
          Cookies.remove("access_token");
          Cookies.remove("student_id");
          setUser(null);
        }
        console.error("Lỗi xác thực người dùng:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
      ctrl.abort();
    };
    // 5. Rút gọn dependency array để tránh useEffect chạy lại không mong muốn
  }, [setUser, setLoading]); 

  const logout = () => {
    // 6. Xóa toàn bộ dữ liệu liên quan khi đăng xuất
    Cookies.remove("access_token");
    Cookies.remove("student_id"); 
    setUser(null);
    router.replace("/");
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      settings,
      loading,
      isAuthenticated: Boolean(user),
      logout,
    }),
    [user, settings, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};