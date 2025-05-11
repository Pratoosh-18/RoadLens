"use client"

import { Info } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardFooter() {
  return (
    <footer className="w-full border-t py-4 px-4 md:px-6">
      <div className="container mx-auto">
        <Alert variant="warning" className="bg-muted/50 border border-amber-200 dark:border-amber-900">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-xs md:text-sm text-muted-foreground">
            <strong>Demo Notice:</strong> All videos and detections shown are samples only. This demonstration illustrates how the system works, but the backend is not currently operational for this demo.
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <div>
            <p>RoadLens&copy; {new Date().getFullYear()}</p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-center md:text-right">
              Featuring: Dynamic Traffic Light Control • Wrong Way Detection • Red Light Jumping • 
              Pothole Detection • Over-speeding Detection • Vehicle Recognition • Face Recognition • No Helmet Violation
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
