"use client"

import { Clock, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardNavbar() {
    const [currentTime, setCurrentTime] = useState(new Date())

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href={"/"} className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-lg font-bold">
                <span className="text-primary">Road</span>
                <span className="text-green-500">Lens</span>
            </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    {currentTime.toLocaleTimeString()}
                </span>
            </div>
            <ThemeToggle />
        </div>
    </header>
}