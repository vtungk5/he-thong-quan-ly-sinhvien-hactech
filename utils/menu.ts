import { title } from "process";

export const UserMenu = [
  {
    href: "/user/profile",
    icon: " fa-solid text-[16px] lg:text-[18px] fa-user",
    label: "Tài khoản",
  },
  {
    href: "/user/orders",
    icon: " fa-solid text-[16px] lg:text-[18px] fa-cart-shopping",
    label: "Lịch sử đơn hàng",
  },
  {
    href: "/user/transactions",
    icon: " fa-solid text-[16px] lg:text-[18px] fa-credit-card",
    label: "Lịch sử giao dịch",
  },
  {
    href: "/user/security",
    icon: " fa-solid text-[16px] lg:text-[18px] fa-user-lock",
    label: "Mật khẩu và bảo mật",
  },
  {
    href: "/user/comments",
    icon: " fa-solid text-[16px] lg:text-[18px] fa-comment-dots",
    label: "Bình luận của tôi",
  },
  {
    href: "/user/wishlist",
    icon: " fa-solid text-[16px] lg:text-[18px] fa-heart",
    label: "Sản phẩm yêu thích",
  },
  {
    href: "/user/affiliate",
    icon: " fa-solid text-[16px] lg:text-[18px] fa-share-nodes",
    label: "Giới thiệu bạn bè",
  },
];

export const PartnerMenu = [
  {
    title: "Tổng quan",
    items: [
      { href: "/partner", icon: "fa-solid fa-chart-simple", label: "Thống kê" },
      // {
      //   href: "/partner/reviews",
      //   icon: "fa-solid fa-circle-star",
      //   label: "Đánh giá",
      // },
    ],
  },
  {
    title: "Sản phẩm",
    items: [
      {
        href: "/partner/products/add",
        icon: "fa-solid fa-circle-plus",
        label: "Thêm sản phẩm",
      },
      {
        href: "/partner/products/list",
        icon: "fa-solid fa-box-open",
        label: "Tất cả sản phẩm",
      },
      {
        href: "/partner/orders",
        icon: "fa-solid fa-clock-rotate-left",
        label: "Sản phẩm đã bán",
      },
    ],
  },
  {
    title: "Quảng cáo",
    items: [
      {
        href: "/partner/ads/create",
        icon: "fa-solid fa-circle-plus",
        label: "Tạo chiến dịch",
      },
      {
        href: "/partner/ads",
        icon: "fa-solid fa-rectangle-ad ",
        label: "Tất cả chiến dịch",
      },
    ],
  },
  {
    title: "Khuyến mãi",
    items: [
      {
        href: "/partner/discounts/add",
        icon: "fa-solid fa-circle-plus",
        label: "Thêm mã giảm giá",
      },
      {
        href: "/partner/discounts/list",
        icon: "fa-solid fa-badge-percent",
        label: "Tất cả mã giảm giá",
      },
    ],
  },
  {
    title: "Cấu hình",
    items: [
      {
        href: "/partner/settings",
        icon: "fa-solid fa-hammer",
        label: "Thông tin cửa hàng",
      },
      {
        href: "/partner/settings/api",
        icon: "fa-solid fa-globe-pointer",
        label: "Tích hợp API",
      },
      {
        href: "/partner/settings/withdraw",
        icon: "fa-solid fa-wallet",
        label: "Yêu cầu rút tiền",
      },
    ],
  },
];
export const SetupMenu = [
  {
    title: "Tổng quan",
    items: [
      {
        href: "/setup",
        icon: "fa-solid fa-chart-simple",
        label: "Cài đặt website",
      },
    ],
  },
];

export const AdminMenu = [
  {
    title: "Tổng quan",
    items: [
      { href: "/admin", icon: "fa-solid fa-gauge", label: "Dashboard" },
      {
        label: "Người dùng",
        icon: "fa-solid fa-users",
        href: "/admin/customers/list",
      },
      {
        label: "Cửa hàng",
        icon: "fa-solid fa-shop",
        href: "/admin/partner/list",
      },

      {
        label: "Trang đối tác",
        icon: "fa-solid fa-handshake", 
        children: [
          {
            href: "/admin/brand/list",
            icon: "fa-solid fa-list",
            label: "Tất cả",
          },
          {
            href: "/admin/brand/add",
            icon: "fa-solid fa-plus",
            label: "Thêm trang",
          },
        ],
      },

      {
        label: "Sản phẩm",
        icon: "fa-solid fa-box",
        children: [
          {
            href: "/admin/products/list",
            icon: "fa-solid fa-cart-shopping",
            label: "Tất cả",
          },
          {
            href: "/admin/orders",
            icon: "fa-solid fa-receipt",
            label: "Đơn hàng",
          },
        ],
      },
      {
        label: "Danh mục",
        icon: "fa-solid fa-layer-group",
        children: [
          {
            href: "/admin/menu/list",
            icon: "fa-solid fa-list",
            label: "Tất cả",
          },
          {
            href: "/admin/menu/add",
            icon: "fa-solid fa-plus",
            label: "Thêm mới",
          },
        ],
      },
      {
        label: "Thể loại",
        icon: "fa-solid fa-tags",
        children: [
          {
            href: "/admin/category/list",
            icon: "fa-solid fa-list",
            label: "Tất cả",
          },
          {
            href: "/admin/category/add",
            icon: "fa-solid fa-plus",
            label: "Thêm mới",
          },
        ],
      },
      {
        label: "Khuyến mãi",
        icon: "fa-solid fa-ticket",
        children: [
          {
            href: "/admin/discounts/list",
            icon: "fa-solid fa-list",
            label: "Danh sách",
          },
          {
            href: "/admin/discounts/add",
            icon: "fa-solid fa-plus",
            label: "Thêm mới",
          },
        ],
      },

      {
        label: "Cấu hình",
        icon: "fa-solid fa-gear",
        children: [
          {
            href: "/admin/setting/general",
            icon: "fa-solid fa-sliders",
            label: "Chung",
          },
          // {
          //   icon: "fa-solid fa-building-columns",
          //   label: "Ngân hàng",

          //   children: [
          //     {
          //       href: "/admin/setting/bank/list",
          //       icon: "fa-solid fa-list",
          //       label: "Tất cả",
          //     },
          //     {
          //       href: "/admin/setting/bank/add",
          //       icon: "fa-solid fa-plus",
          //       label: "Thêm mới",
          //     },
          //   ],
          // },
          {
            href: "/admin/setting/history",
            icon: "fa-solid fa-clock-rotate-left",
            label: "Lịch sử nạp",
          },
        ],
      },
    ],
  },
];
