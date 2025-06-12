
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ChartRendererProps {
  data: Array<any>;
  selectedMetric: string;
  selectedMetricData: { key: string; label: string; color: string } | undefined;
  isExpanded: boolean;
  isMobile: boolean;
}

export const ChartRenderer = ({
  data,
  selectedMetric,
  selectedMetricData,
  isExpanded,
  isMobile
}: ChartRendererProps) => {
  return (
    <Card className="bg-club-black/20 border-club-gold/20">
      <CardContent className="p-4">
        <div className={`${isExpanded ? 'h-80' : 'h-48'} flex items-center justify-center`}>
          <div className="text-center space-y-2">
            <div className="text-club-light-gray/60 text-sm">
              Chart for {selectedMetricData?.label}
            </div>
            <div className="text-club-gold text-lg font-semibold">
              Performance Chart Coming Soon
            </div>
            <div className="text-club-light-gray/40 text-xs">
              {data.length} data points available
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
