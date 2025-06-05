
import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Manager</h1>
          <p className="text-gray-600">Sign in to manage your expenses</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <SignIn 
                forceRedirectUrl="/"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                    card: "shadow-none",
                  }
                }}
              />
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <SignUp 
                forceRedirectUrl="/"
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                    card: "shadow-none",
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
