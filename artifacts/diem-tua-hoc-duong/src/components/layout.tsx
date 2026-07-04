import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Heart, MessageCircle, BookOpen, Smile, PhoneCall, HelpCircle, Menu, X, Music, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Trang chủ", icon: Heart },
    { href: "/chat", label: "Điểm Tựa (Chatbot)", icon: MessageCircle },
    { href: "/resources", label: "Tài liệu", icon: BookOpen },
    { href: "/mood", label: "Ghi nhận cảm xúc", icon: Smile },
    { href: "/hotlines", label: "Liên hệ khẩn cấp", icon: PhoneCall },
    { href: "/faq", label: "Hỏi đáp", icon: HelpCircle },
    { href: "/music", label: "Nhạc thư giãn", icon: Music },
    { href: "/vocabulary", label: "Từ điển Anh", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-background selection:bg-secondary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-primary/20 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">Điểm Tựa Học Đường</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
        
        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background p-4 flex flex-col gap-2 shadow-lg animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center gap-3 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border/50 bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg text-primary">Điểm Tựa Học Đường</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Không gian an toàn, ấm áp và luôn sẵn sàng hỗ trợ sức khỏe tinh thần cho học sinh, sinh viên.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-4">
            ✦ Được tạo bởi <span className="font-semibold text-primary/70">Lê Nguyễn — 9A3</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
