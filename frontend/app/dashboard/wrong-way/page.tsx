"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { CVModel, Detections } from "@/types"
import { useAppContext } from "@/context/app-provider"
import DetectionTable from "@/components/detection-table"
import DetectionCards from "@/components/detection-cards"
import DashboardNavbar from "@/components/dashboard-navbar"
import { STATIC_DETECTIONS } from "@/constants/sample_data_wrongway"

export default function WrongWayPage() {
  const [activeModel, setActiveModel] = useState<CVModel>("wrongWay");
  const { detections } = useAppContext();

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
            <h1 className="text-xl font-bold md:text-2xl">Wrong Way Detection</h1>
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
                    <CardDescription>Real-time wrong way vehicle detection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Status:</div>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Today's Statistics:</div>
                        <div className="grid grid-cols-1 gap-4">
                          <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                              <span className="text-3xl font-bold">{visibleDetections[activeModel].length}</span>
                              <span className="text-xs text-muted-foreground">Violations Detected</span>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Monitoring Locations:</div>
                        <div className="p-3 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">Active Cameras</p>
                              <p className="text-xs text-muted-foreground">8 locations monitored</p>
                            </div>
                            <Badge className="bg-blue-500">All Online</Badge>
                          </div>
                          <div className="mt-2 text-xs">
                            <div className="flex items-center gap-1">
                              <span>Current view: Highway 101 - Exit 3 (One-way)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Latest Detections:</div>
                        <div className="space-y-2">
                          <DetectionCards detections={visibleDetections} activeModel={activeModel} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right side - Video feed */}
                <Card>
                  <CardHeader>
                    <CardTitle>Live Camera Feed</CardTitle>
                    <CardDescription>Monitoring for wrong way vehicles</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <video
                      ref={videoRef}
                      src="/sample_videos/wrong_way.mp4"
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
                        <span className="text-muted-foreground">Highway 101 - Exit 3 (One-way)</span>
                      </div>
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Traffic Flow</p>
                            <p className="text-xs text-muted-foreground">Normal (Southbound only)</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Current Status</p>
                            <p className="text-xs text-green-500 font-medium">No violations</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wrong Way Detection History</CardTitle>
                  <CardDescription>Record of wrong way violations detected by the system</CardDescription>
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
  )
}