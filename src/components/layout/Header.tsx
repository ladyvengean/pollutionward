import { User, Coins, LogOut, Fuel, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface UserData {
  name: string;
  email: string;
  wardName: string;
  memberSince: string;
  credits: {
    totalCredits: number;
    thisMonthCredits: number;
    level: string;
    nextLevelCredits: number;
  };
}

// Mock data - in a real app, this would come from auth context
const userData: UserData = {
  name: "Shruti Pandey",
  email: "shruti@gmail.com",
  wardName: "Central Ward",
  memberSince: "March 2024",
  credits: {
    totalCredits: 2450,
    thisMonthCredits: 340,
    level: "Green Champion",
    nextLevelCredits: 3000,
  },
};

const Header = () => {
  const progressToNextLevel = (userData.credits.totalCredits / userData.credits.nextLevelCredits) * 100;

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 h-auto py-2 px-3
             hover:bg-muted/60 transition-colors">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{userData.name}</p>
              <p className="text-xs text-muted-foreground">{userData.wardName}</p>
            </div>
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarImage src="" alt={userData.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {userData.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          {/* Profile Info */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {userData.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{userData.name}</p>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pollution Action Credits */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Pollution Action Credits</span>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="text-center mb-3">
                <p className="text-3xl font-bold text-primary">{userData.credits.totalCredits.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Credits</p>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span>This month</span>
                </div>
                <span className="font-medium text-success">+{userData.credits.thisMonthCredits}</span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{userData.credits.level}</span>
                  <span className="text-muted-foreground">{userData.credits.totalCredits}/{userData.credits.nextLevelCredits}</span>
                </div>
                <Progress value={progressToNextLevel} className="h-1.5" />
              </div>
            </div>

            {/* Redeem at CNG Station */}
            <Button className="w-full gap-2" variant="default">
              <Fuel className="w-4 h-4" />
              Redeem at CNG Station
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Get discounts on CNG refills with your credits
            </p>
          </div>

          <Separator />

          {/* Logout */}
          <div className="p-2">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
