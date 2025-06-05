
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Filter } from 'lucide-react';
import { Expense } from '@/pages/Index';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [paymentModeFilters, setPaymentModeFilters] = useState<string[]>([]);

  const categories = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'];
  const paymentModes = ['UPI', 'Credit Card', 'Net Banking', 'Cash'];

  const getDateFilteredExpenses = (expenses: Expense[]) => {
    const now = new Date();
    
    switch (dateFilter) {
      case 'thisMonth':
        return expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === now.getMonth() && 
                 expenseDate.getFullYear() === now.getFullYear();
        });
      case 'last30':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return expenses.filter(expense => new Date(expense.date) >= thirtyDaysAgo);
      case 'last90':
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return expenses.filter(expense => new Date(expense.date) >= ninetyDaysAgo);
      default:
        return expenses;
    }
  };

  const filteredExpenses = getDateFilteredExpenses(expenses)
    .filter(expense => 
      categoryFilters.length === 0 || categoryFilters.includes(expense.category)
    )
    .filter(expense => 
      paymentModeFilters.length === 0 || paymentModeFilters.includes(expense.paymentMode)
    );

  const handleCategoryFilter = (category: string, checked: boolean) => {
    if (checked) {
      setCategoryFilters(prev => [...prev, category]);
    } else {
      setCategoryFilters(prev => prev.filter(c => c !== category));
    }
  };

  const handlePaymentModeFilter = (mode: string, checked: boolean) => {
    if (checked) {
      setPaymentModeFilters(prev => [...prev, mode]);
    } else {
      setPaymentModeFilters(prev => prev.filter(m => m !== mode));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Rental': 'bg-blue-100 text-blue-800',
      'Groceries': 'bg-green-100 text-green-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Travel': 'bg-orange-100 text-orange-800',
      'Others': 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors];
  };

  const getPaymentModeColor = (mode: string) => {
    const colors = {
      'UPI': 'bg-indigo-100 text-indigo-800',
      'Credit Card': 'bg-red-100 text-red-800',
      'Net Banking': 'bg-blue-100 text-blue-800',
      'Cash': 'bg-green-100 text-green-800',
    };
    return colors[mode as keyof typeof colors];
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-sm bg-gray-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={18} />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categories</label>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={categoryFilters.includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryFilter(category, checked as boolean)
                      }
                    />
                    <label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Mode Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Modes</label>
              <div className="space-y-2">
                {paymentModes.map(mode => (
                  <div key={mode} className="flex items-center space-x-2">
                    <Checkbox
                      id={`payment-${mode}`}
                      checked={paymentModeFilters.includes(mode)}
                      onCheckedChange={(checked) => 
                        handlePaymentModeFilter(mode, checked as boolean)
                      }
                    />
                    <label htmlFor={`payment-${mode}`} className="text-sm">
                      {mode}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Showing {filteredExpenses.length} expenses</p>
              <p className="text-2xl font-bold text-gray-900">Total: ₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No expenses found matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map(expense => (
            <Card key={expense.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{expense.amount.toLocaleString()}
                      </span>
                      <Badge className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                      <Badge variant="outline" className={getPaymentModeColor(expense.paymentMode)}>
                        {expense.paymentMode}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-1">
                      {format(new Date(expense.date), 'PPP')}
                    </p>
                    
                    {expense.notes && (
                      <p className="text-sm text-gray-500">{expense.notes}</p>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
