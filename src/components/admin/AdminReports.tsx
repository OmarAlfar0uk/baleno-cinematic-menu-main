import { useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type ScopeFilter = "current" | "all";

const weeklySalesChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--secondary))",
  },
};

const branchSalesChartConfig = {
  month: {
    label: "Monthly Sales",
    color: "hsl(var(--accent))",
  },
};

const isSameDay = (dateA: Date, dateB: Date) => dateA.toDateString() === dateB.toDateString();

const getRangeStarts = () => {
  const now = new Date();

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return { now, weekStart, monthStart };
};

const AdminReports = () => {
  const { branches, currentBranchId, orders, settings } = useStore();
  const [scope, setScope] = useState<ScopeFilter>("current");
  const defaultBranchId = branches[0]?.id || "";

  const scopedOrders = useMemo(() => {
    if (scope === "all") return orders;

    return orders.filter((order) => {
      const orderBranchId = order.branchId || defaultBranchId;
      return orderBranchId === currentBranchId;
    });
  }, [orders, scope, currentBranchId, defaultBranchId]);

  const metrics = useMemo(() => {
    const { now, weekStart, monthStart } = getRangeStarts();

    const salesToday = scopedOrders
      .filter((order) => isSameDay(new Date(order.timestamp), now))
      .reduce((sum, order) => sum + order.total, 0);

    const salesWeek = scopedOrders
      .filter((order) => new Date(order.timestamp) >= weekStart)
      .reduce((sum, order) => sum + order.total, 0);

    const salesMonth = scopedOrders
      .filter((order) => new Date(order.timestamp) >= monthStart)
      .reduce((sum, order) => sum + order.total, 0);

    const doneCount = scopedOrders.filter((order) => order.status === "done").length;
    const completionRate = scopedOrders.length > 0 ? (doneCount / scopedOrders.length) * 100 : 0;

    return {
      salesToday,
      salesWeek,
      salesMonth,
      completionRate,
    };
  }, [scopedOrders]);

  const topProducts = useMemo(() => {
    const aggregate = new Map<string, { name: string; qty: number; revenue: number }>();

    scopedOrders.forEach((order) => {
      order.items.forEach((cartItem) => {
        const key = cartItem.menuItem.id;
        const existing = aggregate.get(key);

        if (existing) {
          existing.qty += cartItem.quantity;
          existing.revenue += cartItem.quantity * cartItem.menuItem.price;
        } else {
          aggregate.set(key, {
            name: cartItem.menuItem.name,
            qty: cartItem.quantity,
            revenue: cartItem.quantity * cartItem.menuItem.price,
          });
        }
      });
    });

    return [...aggregate.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [scopedOrders]);

  const branchPerformance = useMemo(() => {
    const { now, weekStart, monthStart } = getRangeStarts();

    return branches.map((branch) => {
      const branchOrders = orders.filter((order) => (order.branchId || defaultBranchId) === branch.id);
      const today = branchOrders
        .filter((order) => isSameDay(new Date(order.timestamp), now))
        .reduce((sum, order) => sum + order.total, 0);
      const week = branchOrders
        .filter((order) => new Date(order.timestamp) >= weekStart)
        .reduce((sum, order) => sum + order.total, 0);
      const month = branchOrders
        .filter((order) => new Date(order.timestamp) >= monthStart)
        .reduce((sum, order) => sum + order.total, 0);

      const doneCount = branchOrders.filter((order) => order.status === "done").length;
      const completionRate = branchOrders.length > 0 ? (doneCount / branchOrders.length) * 100 : 0;

      return {
        branch,
        ordersCount: branchOrders.length,
        today,
        week,
        month,
        completionRate,
      };
    });
  }, [branches, orders, defaultBranchId]);

  const weeklySalesData = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);

      const sales = scopedOrders
        .filter((order) => isSameDay(new Date(order.timestamp), day))
        .reduce((sum, order) => sum + order.total, 0);

      return {
        dayLabel: day.toLocaleDateString("en-EG", { weekday: "short" }),
        sales,
      };
    });
  }, [scopedOrders]);

  const branchMonthSalesData = useMemo(
    () =>
      branchPerformance.map((entry) => ({
        branch: entry.branch.name,
        month: entry.month,
      })),
    [branchPerformance]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-heading text-xl text-foreground">Reports</h2>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as ScopeFilter)}
          className="h-10 rounded-md border border-border bg-muted px-3 text-sm text-foreground"
          aria-label="Report scope"
        >
          <option value="current">Current Branch</option>
          <option value="all">All Branches</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Sales Today</p>
          <p className="text-xl font-heading text-gold mt-1">{formatCurrency(metrics.salesToday, settings.currency)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Sales Last 7 Days</p>
          <p className="text-xl font-heading text-gold mt-1">{formatCurrency(metrics.salesWeek, settings.currency)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Sales This Month</p>
          <p className="text-xl font-heading text-gold mt-1">{formatCurrency(metrics.salesMonth, settings.currency)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Completion Rate</p>
          <p className="text-xl font-heading text-gold mt-1">{metrics.completionRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-heading text-lg text-foreground mb-3">Sales Trend (Last 7 Days)</h3>
          <ChartContainer config={weeklySalesChartConfig} className="h-64 w-full">
            <LineChart data={weeklySalesData} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="dayLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${Math.round((value as number) / 1000)}k`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value), settings.currency)}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="var(--color-sales)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-heading text-lg text-foreground mb-3">Monthly Sales by Branch</h3>
          <ChartContainer config={branchSalesChartConfig} className="h-64 w-full">
            <BarChart data={branchMonthSalesData} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="branch"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                angle={-10}
                height={46}
                textAnchor="end"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${Math.round((value as number) / 1000)}k`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value), settings.currency)}
                  />
                }
              />
              <Bar
                dataKey="month"
                fill="var(--color-month)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-heading text-lg text-foreground mb-3">Top Products</h3>
        {topProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No product sales data yet.</p>
        ) : (
          <div className="space-y-2">
            {topProducts.map((product, index) => (
              <div key={`${product.name}-${index}`} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
                <div>
                  <p className="text-foreground font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {product.qty}</p>
                </div>
                <p className="text-foreground font-semibold">{formatCurrency(product.revenue, settings.currency)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-heading text-lg text-foreground mb-3">Branch Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {branchPerformance.map((entry) => (
            <div key={entry.branch.id} className="rounded-lg border border-border/70 px-3 py-3 space-y-1">
              <p className="text-foreground font-semibold">{entry.branch.name}</p>
              <p className="text-xs text-muted-foreground">Orders: {entry.ordersCount}</p>
              <p className="text-xs text-muted-foreground">Today: {formatCurrency(entry.today, settings.currency)}</p>
              <p className="text-xs text-muted-foreground">Last 7 Days: {formatCurrency(entry.week, settings.currency)}</p>
              <p className="text-xs text-muted-foreground">This Month: {formatCurrency(entry.month, settings.currency)}</p>
              <p className="text-xs text-muted-foreground">Done Rate: {entry.completionRate.toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
