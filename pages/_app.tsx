import type { AppProps } from "next/app";
import { useEffect, Suspense } from "react";
import type { ReactElement, ReactNode } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";
import SEO from "@/next-seo.config";
import "./app.css";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { useAuthContext } from "@/context/AuthContext";
import { AuthProvider } from "@/providers/AuthProvider";

// 1. Định nghĩa Type cho Page có Layout (Fix lỗi {} và IP)
export type NextPageWithLayout<P = object> = {
  getLayout?: (page: ReactElement) => ReactNode;
} & ((props: P) => ReactElement);

// 2. Định nghĩa Type cho AppProps mở rộng
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// 3. Định nghĩa Type cho Props của AppContent
interface AppContentProps {
  Component: NextPageWithLayout;
  pageProps: Record<string, unknown>;
}

const Layout = dynamic(() => import("@/layouts/layout"), { ssr: false });

const AppContent = ({ Component, pageProps }: AppContentProps) => {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const token = Cookies.get("access_token");

  // Logic kiểm tra trạng thái chờ Auth
  const isWaitingForAuth = loading || (!!token && !user);

  useEffect(() => {
    // Nếu đang load data thì không điều hướng để tránh loop
    if (isWaitingForAuth) return;

    const isAuthRoute = router.pathname.startsWith("/auth");

    // Case 1: Chưa login -> Đá ra login (Trừ các trang auth)
    if (!user && !token && !isAuthRoute) {
      void router.replace("/auth/login");
    }

    // Case 2: Đã login -> Không cho vào lại trang auth
    if (user && isAuthRoute) {
      void router.replace("/");
    }
    // Fix lỗi dependency: thêm router vào mảng
  }, [user, token, loading, router, isWaitingForAuth]);

  const getLayout = Component.getLayout ?? ((page) => page);

  if (isWaitingForAuth) {
    // Bạn có thể thay thế div này bằng một Spinner component
    return <div className="h-screen w-screen bg-white" />; 
  }

  return (
    <Suspense fallback={<></>}>
      {user && !router.pathname.startsWith("/auth") ? (
        <>
          <Layout />
          <div className="pt-14 lg:pl-[15.5rem]">
            {getLayout(<Component {...pageProps} />)}
          </div>
        </>
      ) : (
        getLayout(<Component {...pageProps} />)
      )}
    </Suspense>
  );
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Toaster position="top-center" />
      <AuthProvider>
        <AppContent 
          Component={Component} 
          pageProps={pageProps as Record<string, unknown>} 
        />
      </AuthProvider>
    </>
  );
}