"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Sidebar } from "@/components/sidebar";
import { useAppContext } from "@/context/app-provider";
import DashboardNavbar from "@/components/dashboard-navbar";

export default function TrafficControlPage() {
  const { detections } = useAppContext();
  console.log(detections)

  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const statsVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.playbackRate = 4;
      mainVideoRef.current.play();
    }
    if (statsVideoRef.current) {
      statsVideoRef.current.playbackRate = 4;
      statsVideoRef.current.play();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />
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
                    <video
                      ref={mainVideoRef}
                      src="/sample_videos/traffic_control.mp4"
                      autoPlay
                      muted
                      className="w-full rounded-lg border"
                    />

                    {/* Traffic Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <video
                          ref={statsVideoRef}
                          src="/sample_videos/traffic_control_stats.mp4"
                          autoPlay
                          muted
                          className="w-full rounded-lg border"
                        />
                      </div>
                      <Card className="flex items-center justify-center p-6">
                        <h2 className="text-2xl text-foreground text-center">
                          Cummulative Delay = Avg. waiting Time of Vehicle *
                          Total Vehicles
                        </h2>
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