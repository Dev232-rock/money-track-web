
import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, BarChart3 } from 'lucide-react';
import AddExpense from '@/components/AddExpense';
import ExpenseList from '@/components/ExpenseList';
import Analytics from '@/components/Analytics';
import AuthPage from '@/components/AuthPage';

export interface Expense {
  id: string;
  amount: number;
  category: 'Rental' | 'Groceries' | 'Entertainment' | 'Travel' | 'Others';
  notes: string;
  date: string;
  paymentMode: 'UPI' | 'Credit Card' | 'Net Banking' | 'Cash';
  createdAt: string;
  userId: string;
}

const Index = () => {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState("add");

  // Load expenses from localStorage on component mount (filtered by user)
  useEffect(() => {
    if (user) {
      const savedExpenses = localStorage.getItem('expenses');
      if (savedExpenses) {
        const allExpenses = JSON.parse(savedExpenses);
        const userExpenses = allExpenses.filter((expense: Expense) => expense.userId === user.id);
        setExpenses(userExpenses);
      }
    }
  }, [user]);

  // Save all expenses to localStorage whenever expenses change
  useEffect(() => {
    if (user && expenses.length > 0) {
      const savedExpenses = localStorage.getItem('expenses');
      const allExpenses = savedExpenses ? JSON.parse(savedExpenses) : [];
      
      // Remove old expenses for this user and add new ones
      const otherUsersExpenses = allExpenses.filter((expense: Expense) => expense.userId !== user.id);
      const updatedExpenses = [...otherUsersExpenses, ...expenses];
      
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    }
  }, [expenses, user]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    setExpenses(prev => [newExpense, ...prev]);
    setActiveTab("list"); // Switch to list tab after adding
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
      <SignedOut>
        <AuthPage />
      </SignedOut>
      
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            {/* Header with User Button */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Manager</h1>
                <p className="text-gray-600">Track your expenses and analyze your spending patterns</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.firstName || 'User'}!</span>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10"
                    }
                  }}
                />
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">₹{monthlyExpenses.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{expenses.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="add" className="flex items-center gap-2">
                    <Plus size={16} />
                    Add Expense
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List size={16} />
                    View Expenses
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="add">
                  <AddExpense onAddExpense={addExpense} />
                </TabsContent>

                <TabsContent value="list">
                  <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
                </TabsContent>

                <TabsContent value="analytics">
                  <Analytics expenses={expenses} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default Index;
