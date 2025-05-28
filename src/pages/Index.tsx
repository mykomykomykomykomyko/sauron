import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  FileText, 
  Brain, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Send,
  Upload,
  BarChart3,
  Users,
  Lock,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ChatQuickReport from "@/components/ChatQuickReport";

const Index = () => {
  const { user, signOut } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quickReport, setQuickReport] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10,
  }));

  const workflowSteps = [
    {
      number: 1,
      title: "Submit Report",
      description: "Contractors submit detailed progress reports",
      icon: Upload,
      color: "from-blue-500 to-cyan-400"
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Advanced AI processes and validates submissions",
      icon: Brain,
      color: "from-purple-500 to-pink-400"
    },
    {
      number: 3,
      title: "Quality Review",
      description: "Automated quality checks and validation",
      icon: Shield,
      color: "from-green-500 to-emerald-400"
    },
    {
      number: 4,
      title: "Dashboard Insights",
      description: "Real-time analytics and performance metrics",
      icon: BarChart3,
      color: "from-orange-500 to-red-400"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/30"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-orange-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(
