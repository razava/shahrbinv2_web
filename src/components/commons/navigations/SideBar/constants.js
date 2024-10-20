export const roles = {
  newReports: ["Operator", "Executive", "Contractor", "Inspector"],
  infos: [
    "Manager",
    "Mayor",
    "Executive",
    "Operator",
    "Admin",
    "Inspector",
    "ComplaintAdmin",
    "ComplaintInspector",
  ],
  userManager: ["Admin"],
  categories: ["Admin"],
  processes: ["Admin"],
  reports: [
    "Manager",
    "Operator",
    "Executive",
    "Contractor",
    "Mayor",
    "Inspector",
  ],
  comments: ["Operator"],
  contractors: ["Executive"],
  addReport: ["Operator"],
  polls: ["Admin"],
  organizationalUnits: ["Admin"],
  violations: ["Operator"],
  quickAccess: ["Admin"],
  complaints: ["ComplaintInspector"],
  complaintsCategories: ["ComplaintAdmin"],
  complaintsUnits: ["ComplaintAdmin"],
  allComplaints: ["ComplaintInspector"],
  FAQ: ["Admin"],
  news: ["Admin"],
  forms: ["Admin"],
  notes: [
    "Operator",
    "Executive",
    "Contractor",
    "Inspector",
    "Manager",
    "Mayor",
  ],
  tickets: [
    "Operator",
    "Executive",
    "Contractor",
    "Inspector",
    "Manager",
    "Mayor",
  ],
};

export const links = [
  {
    id: "link-1",
    title: "درخواست‌های جدید",
    icon: "fas fa-file",
    path: "newReports",
    roles: roles.newReports,
    order: 1,
  },
  {
    id: "link-2",
    title: "ثبت درخواست",
    icon: "fas fa-file-alt",
    path: "registerReport",
    roles: roles.addReport,
    order: 2,
  },
  {
    id: "link-3",
    title: "آمار و اطلاعات",
    icon: "fas fa-chart-pie",
    path: "infos",
    roles: roles.infos,
    order: 3,
  },
  {
    id: "link-4",
    title: "مدیریت کاربران",
    icon: "fas fa-user-plus",
    path: "manageUsers",
    roles: roles.userManager,
    order: 4,
  },
  {
    id: "link-5",
    title: "دسته‌بندی‌ها",
    icon: "fas fa-stream",
    path: "categories",
    roles: roles.userManager,
    order: 5,
  },
  {
    id: "link-6",
    title: "فرآیند‌ها",
    icon: "fas fa-tasks",
    path: "processes",
    roles: roles.processes,
    order: 6,
  },
  {
    id: "link-7",
    title: "واحد‌های سازمانی",
    icon: "fas fa-building",
    path: "organizationalUnits",
    roles: roles.organizationalUnits,
    order: 7,
  },
  {
    id: "link-8",
    title: "درخواست‌ها",
    icon: "fas fa-clipboard-list",
    path: "reports",
    roles: roles.reports,
    order: 8,
  },
  {
    id: "link-9",
    title: "نظر ها",
    icon: "fas fa-comment",
    path: "comments",
    roles: roles.comments,
    order: 9,
  },
  {
    id: "link-10",
    title: "پیمانکار ها",
    icon: "fas fa-certificate",
    path: "contractors",
    roles: roles.contractors,
    order: 10,
  },
  {
    id: "link-11",
    title: "گزارش تخلف",
    icon: "fas fa-flag",
    path: "violations",
    roles: roles.violations,
    order: 11,
  },
  {
    id: "link-12",
    title: "نظرسنجی ها",
    icon: "fas fa-poll",
    path: "polls",
    roles: roles.polls,
    order: 12,
  },
  {
    id: "link-13",
    title: "دسترسی سریع",
    icon: "fas fa-star",
    path: "quickAccess",
    roles: roles.quickAccess,
    order: 13,
  },
  {
    id: "link-14",
    title: "سوالات متداول",
    icon: "fas fa-question-circle",
    path: "FAQ",
    roles: roles.FAQ,
    order: 14,
  },
  {
    id: "link-15",
    title: "اخبار",
    icon: "fas fa-newspaper",
    path: "news",
    roles: roles.news,
    order: 15,
  },
  {
    id: "link-16",
    title: "فرم ها",
    icon: "fab fa-wpforms",
    path: "forms",
    roles: roles.forms,
    order: 16,
  },
  {
    id: "link-22",
    title: "تیکت ها",
    icon: "fas fa-ticket-alt",
    path: "tickets",
    roles: roles.tickets,
    order: 22,
  },
  {
    id: "link-17",
    title: "شکایات",
    icon: "fas fa-file",
    path: "complaints",
    roles: roles.complaints,
    order: 17,
  },
  {
    id: "link-18",
    title: "همه شکایات",
    icon: "fas fa-clipboard-list",
    path: "allComplaints",
    roles: roles.allComplaints,
    order: 18,
  },
  {
    id: "link-19",
    title: "دسته‌بندی (شکایات)",
    icon: "fas fa-stream",
    path: "complaints-categories",
    roles: roles.complaintsCategories,
    order: 19,
  },
  {
    id: "link-20",
    title: "واحد سازمانی (شکایات)",
    icon: "fas fa-building",
    path: "complaints-units",
    roles: roles.complaintsUnits,
    order: 20,
  },
  {
    id: "link-21",
    title: "یادداشت ها",
    icon: "fas fa-sticky-note",
    path: "notes",
    roles: roles.notes,
    order: 21,
  },
];
