// app/layout.js
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
 import { Toaster } from "@/components/ui/sonner"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Jirasoft",
  description: "project management app",
};

export default function RootLayout({ children }) {
  return (
     <ClerkProvider
     appearance={{
      baseTheme:shadesOfPurple,
      variables: {
        colorPrimary: "#6d28d9",
        colorText: "#f3f4f6",
        colorBackground: "#1f2937",
        colorInputBackground: "#374151",
        colorInputText: "#f3f4f6",
        colorDanger: "#ef4444",
        colorSuccess: "#10b981",
      },
      elements:{
        formButtonPrimary: {
          backgroundColor: "#6d28d9",
          color: "#f3f4f6",
          borderRadius: "0.375rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
        },
        card: {
          backgroundColor: "#374151",
          borderRadius: "0.375rem",
          padding: "1rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
      }
     }}

     >
        <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} dotted-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">

          <Header />
         <main className="min-h-screen">{children}</main> 
          <Toaster richColors/>
         <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200"> 
          <p>Made with Jira by Rashmi</p>
        </div>
          
         </footer>
        </ThemeProvider>
      </body>
    </html>


     </ClerkProvider>
    
  );
}
