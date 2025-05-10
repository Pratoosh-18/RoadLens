"use client";

import { useState, useEffect, useRef } from "react";
import { Car } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-provider";
import DetectionTable from "@/components/detection-table";
import DetectionCards from "@/components/detection-cards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardNavbar from "@/components/dashboard-navbar";
import { CVModel, Detections } from "@/types";
import { STATIC_DETECTIONS } from "@/constants/sample_data_vehicle_finder";

export default function CriminalVehiclePage() {
  const { detections } = useAppContext();
  const [activeModel, setActiveModel] = useState<CVModel>("vehicleFinder");
  const [outlookVehicles, setOutlookVehicles] = useState(["R-183-JF", "L-656-XH"])

  const [visibleDetections, setVisibleDetections] = useState<Detections>({
    redLightPassing: [],
    noHelmet: [],
    overspeeding: [],
    wrongWay: [],
    pothole: [],
    vehicleFinder: [],
    trafficControl: [],
    personDetector: []
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Process each detection type
    (Object.keys(STATIC_DETECTIONS) as CVModel[]).forEach(model => {
      STATIC_DETECTIONS[model].forEach(detection => {
        // Calculate when this detection should appear
        const delay = detection.detectedAt - Date.now();

        if (delay <= 0) {
          // Show immediately if time has passed
          setVisibleDetections(prev => ({
            ...prev,
            [model]: [...prev[model], detection]
          }));
        } else {
          // Schedule for future appearance
          const timer = setTimeout(() => {
            setVisibleDetections(prev => ({
              ...prev,
              [model]: [...prev[model], detection]
            }));
          }, delay);
          timers.push(timer);
        }
      });
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />
      <div className="grid flex-1 items-start gap-4 p-4 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr] lg:gap-8 lg:p-8">
        <Sidebar />
        <main className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold md:text-2xl">
              Criminal Vehicle Detection
            </h1>
          </div>
          <Tabs defaultValue="detection">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detection">Live Detection</TabsTrigger>
              <TabsTrigger value="history">Detection History</TabsTrigger>
            </TabsList>
            <TabsContent value="detection" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side - Detection data */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detection Information</CardTitle>
                    <CardDescription>
                      Real-time criminal vehicle detection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Status:</div>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>

                      <Card className="w-full max-w-md shadow-md">
                        <CardHeader className=" border-b">
                          <CardTitle className="flex items-center gap-2">
                            <Car size={18} />
                            <span>Vehicle Database</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          {outlookVehicles && outlookVehicles.length > 0 ? (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                Vehicles on lookout (
                                {outlookVehicles.length})
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {outlookVehicles.map((vehicle, i) => (
                                  <Badge
                                    key={`vehicle-${i}`}
                                    variant="secondary"
                                    className="flex items-center gap-1 py-1 px-3"
                                  >
                                    {vehicle}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Alert className=" text-blue-800 ">
                              <AlertTitle className="text-sm font-medium">
                                No vehicles on lookout
                              </AlertTitle>
                              <AlertDescription className="text-xs">
                                Add vehicle plate numbers to monitor
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          Latest Detections:
                        </div>
                        <div className="space-y-2">
                          <DetectionCards
                            detections={visibleDetections}
                            activeModel="vehicleFinder"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right side - Video feed */}
                <Card>
                  <CardHeader>
                    <CardTitle>Live Camera Feed</CardTitle>
                    <CardDescription>
                      Monitoring for criminal vehicles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <video
                      ref={videoRef}
                      src="/sample_videos/vehicle_finder.mp4"
                      autoPlay
                      muted
                      className="w-full rounded-lg border"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span>Live Feed</span>
                        </div>
                        <span className="text-muted-foreground">
                          Main Street - North Junction
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Criminal Vehicle Detection History</CardTitle>
                  <CardDescription>
                    Record of criminal vehicles detected by the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <DetectionTable detections={visibleDetections[activeModel]} />
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
