
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense } from '@/pages/Index';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface AnalyticsProps {
  expenses: Expense[];
}

const Analytics: React.FC<AnalyticsProps> = ({ expenses }) => {
  const categories = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'];
  
  const getCategoryColor = (category: string) => {
    const colors = {
      'Rental': '#3B82F6',
      'Groceries': '#10B981',
      'Entertainment': '#8B5CF6',
      'Travel': '#F59E0B',
      'Others': '#6B7280',
    };
    return colors[category as keyof typeof colors];
  };

  // Generate last 6 months data
  const generateMonthlyData = () => {
    const endDate = new Date();
    const startDate = subMonths(endDate, 5);
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthlyData: any = {
        month: format(month, 'MMM yyyy'),
      };

      // Initialize all categories with 0
      categories.forEach(category => {
        monthlyData[category] = 0;
      });

      // Calculate totals for each category
      expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        if (expenseDate >= monthStart && expenseDate <= monthEnd) {
          monthlyData[expense.category] += expense.amount;
        }
      });

      return monthlyData;
    });
  };

  const monthlyData = generateMonthlyData();

  // Calculate category totals for current month
  const currentMonth = new Date();
  const currentMonthStart = startOfMonth(currentMonth);
  const currentMonthEnd = endOfMonth(currentMonth);
  
  const categoryTotals = categories.map(category => {
    const total = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentMonthStart && 
               expenseDate <= currentMonthEnd && 
               expense.category === category;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return { category, total };
  }).filter(item => item.total > 0);

  const totalThisMonth = categoryTotals.reduce((sum, item) => sum + item.total, 0);

  // Calculate payment mode distribution
  const paymentModeData = ['UPI', 'Credit Card', 'Net Banking', 'Cash'].map(mode => {
    const total = expenses
      .filter(expense => expense.paymentMode === mode)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return { mode, total };
  }).filter(item => item.total > 0);

  return (
    <div className="space-y-6">
      {/* Monthly Spending Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Monthly Spending by Category</CardTitle>
          <CardDescription>Track your spending patterns over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
                <Legend />
                {categories.map(category => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="a"
                    fill={getCategoryColor(category)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown - Current Month */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>This Month by Category</CardTitle>
            <CardDescription>
              Total: ₹{totalThisMonth.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTotals.map(({ category, total }) => {
                const percentage = totalThisMonth > 0 ? (total / totalThisMonth) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-gray-600">
                        ₹{total.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getCategoryColor(category),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {categoryTotals.length === 0 && (
                <p className="text-gray-500 text-center">No expenses this month</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Mode Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Payment Mode Distribution</CardTitle>
            <CardDescription>All time spending by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentModeData.map(({ mode, total }) => {
                const grandTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
                const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
                return (
                  <div key={mode} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{mode}</span>
                      <span className="text-sm text-gray-600">
                        ₹{total.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {paymentModeData.length === 0 && (
                <p className="text-gray-500 text-center">No expenses recorded</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {expenses.length}
              </p>
              <p className="text-xs text-gray-600">Total Transactions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ₹{expenses.length > 0 ? Math.round(expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length).toLocaleString() : 0}
              </p>
              <p className="text-xs text-gray-600">Average per Transaction</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                ₹{Math.max(...expenses.map(exp => exp.amount), 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Highest Transaction</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {categoryTotals.length > 0 ? categoryTotals.reduce((max, item) => max.total > item.total ? max : item).category : 'None'}
              </p>
              <p className="text-xs text-gray-600">Top Category</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
