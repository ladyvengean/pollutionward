import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Car, 
  Recycle, 
  Droplets, 
  Sun, 
  TreePine, 
  Award,
  Download,
  Users,
  TrendingDown,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PledgeAction {
  id: string;
  title: string;
  description: string;
  credits: number;
  icon: React.ElementType;
  emissionsSaved: number; // kg CO2 per month
}

const pledgeActions: PledgeAction[] = [
  {
    id: "public-transport",
    title: "Use Public Transport",
    description: "Commit to using public transport at least 3 days a week",
    credits: 50,
    icon: Car,
    emissionsSaved: 120
  },
  {
    id: "carpool",
    title: "Carpool to Work",
    description: "Share rides with colleagues or neighbors",
    credits: 40,
    icon: Users,
    emissionsSaved: 80
  },
  {
    id: "plant-trees",
    title: "Plant Trees",
    description: "Plant at least 2 trees this month in your locality",
    credits: 100,
    icon: TreePine,
    emissionsSaved: 50
  },
  {
    id: "reduce-waste",
    title: "Reduce Single-Use Plastic",
    description: "Avoid single-use plastics and carry reusable bags",
    credits: 30,
    icon: Recycle,
    emissionsSaved: 15
  },
  {
    id: "conserve-water",
    title: "Conserve Water",
    description: "Reduce water usage by 20% through mindful consumption",
    credits: 25,
    icon: Droplets,
    emissionsSaved: 10
  },
  {
    id: "solar-energy",
    title: "Switch to Solar",
    description: "Use solar-powered devices or install solar panels",
    credits: 150,
    icon: Sun,
    emissionsSaved: 200
  },
  {
    id: "green-commute",
    title: "Walk or Cycle",
    description: "Walk or cycle for short distances instead of driving",
    credits: 45,
    icon: Leaf,
    emissionsSaved: 60
  }
];

// Mock impact data
const impactStats = {
  totalPledges: 12847,
  totalEmissionsSaved: 1543200, // kg CO2
  activeCitizens: 8932
};

const TakeAPledge = () => {
  const [selectedPledges, setSelectedPledges] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePledgeToggle = (pledgeId: string) => {
    setSelectedPledges(prev => 
      prev.includes(pledgeId) 
        ? prev.filter(id => id !== pledgeId)
        : [...prev, pledgeId]
    );
  };

  const totalCredits = selectedPledges.reduce((sum, id) => {
    const pledge = pledgeActions.find(p => p.id === id);
    return sum + (pledge?.credits || 0);
  }, 0);

  const totalEmissions = selectedPledges.reduce((sum, id) => {
    const pledge = pledgeActions.find(p => p.id === id);
    return sum + (pledge?.emissionsSaved || 0);
  }, 0);

  const handleSubmitPledge = () => {
    if (selectedPledges.length === 0) {
      toast({
        title: "No pledges selected",
        description: "Please select at least one action to pledge.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitted(true);
    setShowCertificate(true);
    toast({
      title: "Pledge Submitted! 🎉",
      description: `You've committed to ${selectedPledges.length} actions and will earn ${totalCredits} credits upon completion.`,
    });
  };

  const handleDownloadCertificate = () => {
    toast({
      title: "Certificate Downloaded",
      description: "Your pledge certificate has been saved.",
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Take a Pledge</h1>
            <p className="text-muted-foreground">Commit to eco-friendly actions and earn rewards</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            <Sparkles className="w-4 h-4 mr-1" />
            Earn up to 440 credits
          </Badge>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pledges</p>
                <p className="text-2xl font-bold text-foreground">{formatNumber(impactStats.totalPledges)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/20">
                <TrendingDown className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                <p className="text-2xl font-bold text-foreground">{formatNumber(impactStats.totalEmissionsSaved)} kg</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/20">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Citizens</p>
                <p className="text-2xl font-bold text-foreground">{formatNumber(impactStats.activeCitizens)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pledge Actions */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Select Your Pledges
                </CardTitle>
                <CardDescription>
                  Choose actions you commit to perform. Credits will be awarded upon verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pledgeActions.map((pledge) => {
                  const isSelected = selectedPledges.includes(pledge.id);
                  const IconComponent = pledge.icon;
                  
                  return (
                    <div
                      key={pledge.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                      onClick={() => !isSubmitted && handlePledgeToggle(pledge.id)}
                    >
                      <Checkbox 
                        checked={isSelected}
                        disabled={isSubmitted}
                        className="mt-1"
                      />
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground">{pledge.title}</h3>
                          <Badge variant="secondary" className="bg-success/10 text-success border-0">
                            +{pledge.credits} credits
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{pledge.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          🌍 Saves {pledge.emissionsSaved} kg CO₂/month
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Summary & Certificate */}
          <div className="space-y-4">
            {/* Pledge Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Pledge Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Actions selected</span>
                    <span className="font-medium text-foreground">{selectedPledges.length} of {pledgeActions.length}</span>
                  </div>
                  <Progress value={(selectedPledges.length / pledgeActions.length) * 100} className="h-2" />
                </div>

                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Credits</span>
                    <span className="font-bold text-primary">{totalCredits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CO₂ Reduction</span>
                    <span className="font-bold text-success">{totalEmissions} kg/mo</span>
                  </div>
                </div>

                <Button 
                  className="w-full gradient-credits text-primary-foreground"
                  onClick={handleSubmitPledge}
                  disabled={isSubmitted || selectedPledges.length === 0}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Pledge Submitted
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Submit Pledge
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Certificate */}
            {showCertificate && (
              <Card className="border-primary/30 overflow-hidden">
                <div 
                  ref={certificateRef}
                  className="bg-gradient-to-br from-primary/10 via-background to-success/10 p-6"
                >
                  <div className="text-center space-y-4">
                    <div className="inline-flex p-3 rounded-full bg-primary/20">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Pledge Certificate</h3>
                      <p className="text-sm text-muted-foreground">CleanAir Delhi Initiative</p>
                    </div>
                    <div className="py-4 border-y border-border/50">
                      <p className="text-sm text-muted-foreground">This certifies that</p>
                      <p className="text-xl font-bold text-primary mt-1">Rajesh Kumar</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        has pledged to take <span className="font-semibold text-foreground">{selectedPledges.length} eco-friendly actions</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        contributing to a reduction of <span className="font-semibold text-success">{totalEmissions} kg CO₂/month</span>
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Certificate ID: PLG-{Date.now().toString(36).toUpperCase()}</p>
                      <p>Issued: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 bg-card">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleDownloadCertificate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TakeAPledge;
