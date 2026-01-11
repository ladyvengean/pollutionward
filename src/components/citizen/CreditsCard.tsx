import { Coins, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CreditsCardProps {
  totalCredits: number;
  thisMonthCredits: number;
  level: string;
  nextLevelCredits: number;
  rank: number;
  totalCitizens: number;
}

const CreditsCard = ({ 
  totalCredits, 
  thisMonthCredits, 
  level, 
  nextLevelCredits,
  rank,
  totalCitizens
}: CreditsCardProps) => {
  const progressToNextLevel = (totalCredits / nextLevelCredits) * 100;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      {/* Header with gradient */}
      <div className="gradient-credits p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Pollution Action Credits</h2>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {level}
          </div>
        </div>

        <div className="text-center">
          <p className="text-5xl font-bold mb-1">{totalCredits.toLocaleString()}</p>
          <p className="text-white/80">Total Credits Earned</p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-success" />
            <span>This Month</span>
          </div>
          <span className="font-semibold text-foreground">+{thisMonthCredits} credits</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="w-4 h-4 text-warning" />
            <span>Ward Rank</span>
          </div>
          <span className="font-semibold text-foreground">#{rank} of {totalCitizens}</span>
        </div>

        {/* Progress to next level */}
        <div className="pt-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress to next level</span>
            <span className="font-medium text-foreground">{totalCredits}/{nextLevelCredits}</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default CreditsCard;
