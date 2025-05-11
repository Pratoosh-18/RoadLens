"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-provider"
import DetectionCards from "@/components/detection-cards"
import DetectionTable from "@/components/detection-table"
import MapWithMarkers from "@/components/map-with-markers"
import DashboardNavbar from "@/components/dashboard-navbar"
import { CVModel, Detections } from "@/types"
import { STATIC_DETECTIONS } from "@/constants/sample_data_pothole"

export default function PotholeDetectionPage() {
  const [activeModel, setActiveModel] = useState<CVModel>("pothole");
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
    if (videoRef.current) {
      videoRef.current.playbackRate = 2;
      videoRef.current.play();
    }
  }, []);

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
      <DashboardNavbar/>
      <div className="grid flex-1 items-start gap-4 p-4 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr] lg:gap-8 lg:p-8">
        <Sidebar />
        <main className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold md:text-2xl">Pothole Detection</h1>
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
                    <CardDescription>Real-time pothole detection using mobile cameras</CardDescription>
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
                              <span className="text-3xl font-bold">{visibleDetections.pothole.length}</span>
                              <span className="text-xs text-muted-foreground">Potholes Detected</span>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Latest Detections:</div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 gap-4">
                          <DetectionCards detections={visibleDetections} activeModel="pothole" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right side - Video feed */}
                <Card>
                  <CardHeader>
                    <CardTitle>Live Camera Feed</CardTitle>
                    <CardDescription>Mobile camera scanning for potholes</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                  <video
                      ref={videoRef}
                      src="/sample_videos/pothole.mp4"
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
                        <span className="text-muted-foreground">East Road - Mobile Unit #3</span>
                      </div>
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Road Condition</p>
                            <p className="text-xs text-muted-foreground">Moderate wear</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Scan Progress</p>
                            <div className="h-2 w-24 rounded-full bg-background mt-1">
                              <div className="h-2 rounded-full bg-green-500" style={{ width: "65%" }} />
                            </div>
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
                  <CardTitle>Pothole Detection History</CardTitle>
                  <CardDescription>Record of potholes detected by the system</CardDescription>
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
