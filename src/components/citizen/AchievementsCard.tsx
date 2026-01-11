import { Trophy, Leaf, Bike, TreeDeciduous, Recycle, Sun, Zap } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  earnedDate?: string;
  color: string;
}

const achievements: Achievement[] = [
  {
    id: "1",
    name: "First Report",
    description: "Reported your first civic issue",
    icon: Trophy,
    earned: true,
    earnedDate: "Jan 2025",
    color: "bg-warning",
  },
  {
    id: "2",
    name: "Eco Warrior",
    description: "Used public transport 30 days",
    icon: Bike,
    earned: true,
    earnedDate: "Dec 2024",
    color: "bg-success",
  },
  {
    id: "3",
    name: "Tree Hugger",
    description: "Planted 5 trees in your ward",
    icon: TreeDeciduous,
    earned: true,
    earnedDate: "Nov 2024",
    color: "bg-primary",
  },
  {
    id: "4",
    name: "Recycler",
    description: "Reported 10 recycling locations",
    icon: Recycle,
    earned: false,
    color: "bg-muted",
  },
  {
    id: "5",
    name: "Solar Pioneer",
    description: "Installed solar panels",
    icon: Sun,
    earned: false,
    color: "bg-muted",
  },
  {
    id: "6",
    name: "Energy Saver",
    description: "Reduced energy consumption 20%",
    icon: Zap,
    earned: false,
    color: "bg-muted",
  },
];

const AchievementsCard = () => {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Eco Achievements</h2>
        </div>
        <span className="text-muted-foreground text-sm">
          {earnedCount}/{achievements.length} earned
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-4 rounded-lg text-center transition-all ${
              achievement.earned
                ? "bg-secondary"
                : "bg-muted/50 opacity-50"
            }`}
          >
            <div
              className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                achievement.earned ? achievement.color : "bg-muted"
              }`}
            >
              <achievement.icon
                className={`w-6 h-6 ${
                  achievement.earned ? "text-white" : "text-muted-foreground"
                }`}
              />
            </div>
            <p className="text-sm font-medium text-foreground">{achievement.name}</p>
            {achievement.earned && achievement.earnedDate && (
              <p className="text-xs text-muted-foreground mt-1">{achievement.earnedDate}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsCard;
