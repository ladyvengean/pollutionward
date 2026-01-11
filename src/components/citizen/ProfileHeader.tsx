import { MapPin, Calendar, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  name: string;
  wardName: string;
  memberSince: string;
  verificationStatus: "verified" | "pending" | "unverified";
  avatarUrl?: string;
}

const ProfileHeader = ({ 
  name, 
  wardName, 
  memberSince, 
  verificationStatus,
  avatarUrl 
}: ProfileHeaderProps) => {
  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <Badge className="bg-success text-success-foreground gap-1">
            <Shield className="w-3 h-3" />
            Verified Citizen
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning text-warning-foreground gap-1">
            <Shield className="w-3 h-3" />
            Pending Verification
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Shield className="w-3 h-3" />
            Unverified
          </Badge>
        );
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-start gap-6">
        <Avatar className="w-24 h-24 border-4 border-primary/20">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
            {name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{name}</h1>
            {getVerificationBadge()}
          </div>
          
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{wardName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
