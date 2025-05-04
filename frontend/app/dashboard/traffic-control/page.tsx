"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/sidebar";
import { useAppContext } from "@/context/app-provider";
import { CVModel } from "@/types";
import DashboardNavbar from "@/components/dashboard-navbar";

export default function TrafficControlPage() {
  const router = useRouter();
  const [activeModel, setActiveModel] = useState<CVModel>("trafficControl");
  const { detections } = useAppContext();

  const latestTrafficControlData = useMemo(() => {
    if (detections.trafficControl.length === 0) return [];

    let latestDetection =
      detections.trafficControl[detections.trafficControl.length - 1];

    return latestDetection.map((data) => {
      const totalVehicle = data.detections.length;
      const cumulativeVehicleElapsedTime = data.detections.reduce(
        (acc, curr) => acc + curr.elapsedTime,
        0
      );

      return {
        video_id: data.video_id,
        totalVehicle,
        avgVehicleElapsedTime: cumulativeVehicleElapsedTime / totalVehicle,
      };
    });
  }, [detections.trafficControl]);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar/>
      <div className="grid flex-1 items-start gap-4 p-4 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr] lg:gap-8 lg:p-8">
        <Sidebar />
        <main className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold md:text-2xl">Traffic Control</h1>
          </div>
          <Tabs defaultValue="monitoring">
            <TabsContent value="monitoring" className="space-y-4">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Traffic Monitoring</CardTitle>
                  <CardDescription>
                    Real-time traffic monitoring from all four directions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="w-full border-2 rounded-md flex justify-center items-center h-[50vh]">
                      Stream
                    </div>

                    {/* Traffic Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Traffic Density</CardTitle>
                          <CardDescription>
                            Current traffic density by direction
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {latestTrafficControlData.map((data, index) => {
                              // Determine direction based on index order: West (0), East (1), North (2), South (3)
                              const direction =
                                index === 0
                                  ? "West"
                                  : index === 1
                                  ? "East"
                                  : index === 2
                                  ? "North"
                                  : "South";

                              // Calculate percentage (max 20) and parse to 4 decimal places
                              const percentageValue = Math.min(
                                20,
                                data.totalVehicle
                              ); // Cap at 20
                              const percentage = parseFloat(
                                percentageValue.toFixed(4)
                              ); // Ensure 4 decimal places

                              // Determine color: red (≥12), yellow (≥6), green (<6)
                              const color =
                                percentage >= 12
                                  ? "bg-red-500"
                                  : percentage >= 6
                                  ? "bg-yellow-500"
                                  : "bg-green-500";

                              return (
                                <div className="space-y-2" key={data.video_id}>
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                      {direction}
                                    </p>
                                    <p className="text-sm font-medium">
                                      {percentage}%
                                    </p>
                                  </div>
                                  <div className="h-2 w-full rounded-full bg-muted">
                                    <div
                                      className={`h-2 rounded-full ${color}`}
                                      style={{
                                        width: `${(percentage / 20) * 100}%`,
                                      }}
                                    />
                                  </div>
                                  {/* Optional: Display raw data in smaller text */}
                                  <div className="text-xs text-gray-500">
                                    Vehicles: {data.totalVehicle} | Avg Time:{" "}
                                    {parseFloat(
                                      data.avgVehicleElapsedTime.toString()
                                    ).toFixed(4)}
                                    s |{" "}
                                    <span className="text-foreground/80">
                                      Cummulative Delay:{" "}
                                      {(
                                        data.totalVehicle *
                                        data.avgVehicleElapsedTime
                                      ).toFixed(0)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="flex items-center justify-center p-6">
                        <h2 className="text-2xl text-foreground text-center">
                          Cummulative Delay = Avg. waiting Time of Vehicle *
                          Total Vehicles
                        </h2>
                        {/* <TrafficFlowChart latestTrafficControlData={latestTrafficControlData} /> */}
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}