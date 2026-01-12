const dashboardData = {
  stats: [
    {
      title: "Total Products",
      value: 1234
    },
    {
      title: "Stock Value",
      value: "$48,942"
    },
    {
      title: "Today's Sales",
      value: "$3,249"
    },
    {
      title: "Low Stock Alerts",
      value: 4
    }
  ],

  salesOverview: [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 2100 },
    { day: "Wed", sales: 1800 },
    { day: "Thu", sales: 2600 },
    { day: "Fri", sales: 3200 },
    { day: "Sat", sales: 2800 },
    { day: "Sun", sales: 3500 }
  ],

  recentSales: [
    {
      id: 1,
      date: "10 Sep 2025",
      bills: 42,
      revenue: 3240,
      status: "Completed"
    },
    {
      id: 2,
      date: "11 Sep 2025",
      bills: 36,
      revenue: 2980,
      status: "Completed"
    }
  ]
};

export default dashboardData;
