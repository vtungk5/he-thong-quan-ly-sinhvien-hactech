import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import 'swiper/css';
import 'swiper/css/free-mode';
import { usePathname } from 'next/navigation';

const Layout: React.FC = () => {
  const [isSidebar, setIsSidebar] = useState(false);
  const [isUser, setUser] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);


  const MENU_ITEMS = [
    {
      group: 'Thông tin chung',
      items: [
        { name: 'Thông tin cá nhân', href: '/', icon: 'fa-regular fa-user-gear' },
        { name: 'Chương trình đào tạo', href: '/students/specified-plan', icon: 'fa-regular fa-book-open-reader' },
        { name: 'Bảng điểm', href: '/students/students', icon: 'fa-regular fa-file-chart-column' },
        { name: 'Thời khoá biểu', href: '/students/schedule', icon: 'fa-regular fa-calendar-days' },
        { name: 'Thông tin điểm danh', href: '/students/register-histories', icon: 'fa-regular fa-clipboard-user' },
      ],
    },
    {
      group: 'Học phí',
      items: [
        { name: 'Nộp học phí', href: '/users', icon: 'fa-regular fa-credit-card' },
        { name: 'Nộp tiền bổ sung', href: '/plans', icon: 'fa-regular fa-hand-holding-dollar' },
        { name: 'Nộp tiền thi lại', href: '/categories', icon: 'fa-regular fa-file-invoice-dollar' },
        { name: 'Lịch sử đóng tiền', href: '/sitemap', icon: 'fa-regular fa-history' },
        { name: 'Cảnh cáo học phí', href: '/sitemap', icon: 'fa-regular fa-circle-exclamation' },
        { name: 'Danh sách khoản nợ', href: '/sitemap', icon: 'fa-regular fa-receipt' },
        { name: 'Lịch sử giao dịch', href: '/sitemap', icon: 'fa-regular fa-money-bill-transfer' },
      ],
    },
    {
      group: 'Đăng ký',
      items: [
        { name: 'Đăng ký môn học', href: '/payment-config', icon: 'fa-regular fa-pen-to-square' },
        { name: 'Đăng ký học kỳ tiếp theo', href: '/transactions', icon: 'fa-regular fa-calendar-plus' },
      ],
    },
  ];

  const userRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node;

    // Nếu click ra ngoài vùng Sidebar thì đóng Sidebar
    if (isSidebar && sidebarRef.current && !sidebarRef.current.contains(target)) {
      setIsSidebar(false);
    }

    // Nếu click ra ngoài vùng User Dropdown thì đóng Dropdown
    if (isUser && userRef.current && !userRef.current.contains(target)) {
      setUser(false);
    }
  }, [isSidebar, isUser]); // Nhớ đưa cả isSidebar và isUser vào dependency array

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const pathname = usePathname();
  return (
    <>
      <div className='fixed top-0 z-40 pl-3 pr-6 py-4  bg-[#ce1628] w-full h-14 flex items-center justify-between'>

        <div className='flex items-center space-x-3'>
          <div className="lg:hidden block">
            <button className="lg:hidden block " onClick={() => setIsSidebar(!isSidebar)}>
              <i className="fa-solid fa-bars text-3xl text-white"></i>
            </button>
          </div>
          <div>
            <Image
              src="https://img-cache.coccoc.com/image2?i=2&l=20/339612710"
              alt="Hãy Lấy Em Đi"
              className="object-cover border-white border-2 rounded bg-black w-[28px]"
              width={150}
              height={150}
            />
          </div>
          <div className='flex flex-col'>
            <div className='font-medium text-base text-white'>
              Tiktok University
            </div>
            <p className='text-red-200 text-xs'>
              Trường đại học Tiktok
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative" >
            <button className="flex-col text-xs flex space-y-0 text-white"
            >
              <div className="fa-solid fa-mailbox leading-[normal] text-2xl"></div>
              <div className="font-medium mt-0">Thông báo</div>
            </button>
          </div>
          <div className="relative" ref={userRef}>
            <button onClick={() => setUser(!isUser)}
            >
              <Image alt='' src="https://marketplace.canva.com/PIJuQ/MAFOL3PIJuQ/1/tl/canva-male-avatar-profile-MAFOL3PIJuQ.png" width={50} height={50} className=' !w-[40px] !h-[40px] bg-[#eee] rounded-full border-2 border-white' />
            </button>
            {isUser && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100 animate-in fade-in zoom-in duration-200">
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Hồ sơ của tôi
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Thay đổi mật khẩu
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Chế độ nền sáng
                </Link>
                <hr className="my-1 border-gray-200" />
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"

                >
                  Đăng xuất
                </button>
              </div>
            )}

          </div>
        </div>



      </div>
      {isSidebar && (
        <div
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setIsSidebar(false)}
        />
      )}
      <div ref={sidebarRef} className={`fixed z-20 top-0 pt-14  lg:left-0 h-full w-[15.5rem] bg-slate-50 transition-all duration-300 ${!isSidebar ? "left-[-22rem]" : "left-0"}`}>

        <SimpleBar style={{ maxHeight: '100%' }} className="h-full pb-[10rem]">
          {MENU_ITEMS.map((section, index) => (
            <div key={index} className=" pt-3 space-y-2">
              <div className="text-sm px-6 font-medium text-gray-600">
                {section.group}
              </div>

              <ul className="flex flex-col space-y-1">
                {section.items.map((item) => {

                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-6 text-sm space-x-2 py-3 w-full transition-colors duration-200 ${isActive
                          ? 'bg-[#ce1628]/10 text-[#ce1628] border-l-4 border-[#ce1628]'
                          : 'text-gray-500 hover:text-[#ce1628]'
                          }`}
                      >
                        <i
                          className={item.icon}
                        ></i>
                        <span
                          className="font-medium "
                        >
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </SimpleBar>
      </div>

    </>
  );
};
export default Layout;