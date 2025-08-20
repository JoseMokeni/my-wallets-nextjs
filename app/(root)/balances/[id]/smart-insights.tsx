"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsData, getInsightMessage } from "@/lib/analytics";
import { Lightbulb, TrendingUp, TrendingDown } from "lucide-react";

interface SmartInsightsProps {
  analytics: AnalyticsData;
}

export default function SmartInsights({ analytics }: SmartInsightsProps) {
  const insights = getInsightMessage(analytics);

  const getInsightIcon = (insight: string) => {
    if (insight.includes('increased') || insight.includes('saved')) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (insight.includes('decreased') || insight.includes('spent')) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getInsightType = (insight: string) => {
    if (insight.includes('increased') || insight.includes('spent')) {
      return 'warning';
    } else if (insight.includes('decreased') || insight.includes('saved')) {
      return 'success';
    } else {
      return 'info';
    }
  };

  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'success': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-muted-foreground">No insights available yet. Add more transactions to see patterns.</p>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const type = getInsightType(insight);
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                  {getInsightIcon(insight)}
                  <div className="flex-1">
                    <p className="text-sm">{insight}</p>
                  </div>
                  <Badge variant={getBadgeVariant(type)} className="ml-2">
                    {type}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Additional contextual insights */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Quick Stats</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Avg per transaction</p>
              <p className="font-medium">{analytics.averageTransaction.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Categories used</p>
              <p className="font-medium">{analytics.categoryBreakdown.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">This week</p>
              <p className="font-medium">{analytics.weeklyComparison.thisWeek.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last week</p>
              <p className="font-medium">{analytics.weeklyComparison.lastWeek.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}