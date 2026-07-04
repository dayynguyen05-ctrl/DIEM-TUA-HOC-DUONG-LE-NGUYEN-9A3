import { useGetStatsOverview, useGetFeaturedResources } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, MessageCircleHeart, PhoneCall, BookOpen, ArrowRight, ShieldCheck, Clock, BookHeart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();
  const { data: featuredResources, isLoading: resourcesLoading } = useGetFeaturedResources();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>Không gian an toàn và bảo mật</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 font-serif animate-in fade-in slide-in-from-bottom-4 delay-100">
            Hãy để chúng mình lắng nghe bạn
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 delay-200">
            Dù bạn đang lo lắng về việc học, áp lực bạn bè, hay chỉ cần một nơi để trút bầu tâm sự. Điểm Tựa luôn ở đây.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 delay-300">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base rounded-full h-14 px-8 shadow-lg shadow-primary/20 gap-2">
                <MessageCircleHeart className="w-5 h-5" />
                Trò chuyện với Điểm Tựa ngay
              </Button>
            </Link>
            <Link href="/mood" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base rounded-full h-14 px-8 gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5">
                <HeartPulse className="w-5 h-5 text-primary" />
                Hôm nay bạn thế nào?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Features Banner */}
      <section className="py-12 border-y border-border/50 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
            <div className="flex flex-col items-center text-center px-4 pt-4 sm:pt-0">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4 text-secondary">
                <MessageCircleHeart className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Luôn lắng nghe 24/7</h3>
              <p className="text-muted-foreground text-sm">Chatbot Điểm Tựa luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào, không phán xét.</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 sm:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <BookHeart className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {statsLoading ? <Skeleton className="h-6 w-16 mb-1" /> : <>{stats?.totalResources || 0}+ Tài liệu</>}
              </h3>
              <p className="text-muted-foreground text-sm">Các bài viết, bí kíp chăm sóc sức khỏe tinh thần được chọn lọc kỹ càng.</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 sm:pt-0">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {statsLoading ? <Skeleton className="h-6 w-16 mb-1" /> : <>{stats?.totalHotlines || 0}+ Đường dây nóng</>}
              </h3>
              <p className="text-muted-foreground text-sm">Liên hệ ngay với các chuyên gia tâm lý khi bạn cần hỗ trợ khẩn cấp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold font-serif mb-2 text-foreground">Góc tài liệu hữu ích</h2>
              <p className="text-muted-foreground">Những bài viết nổi bật giúp bạn hiểu rõ hơn về bản thân.</p>
            </div>
            <Link href="/resources">
              <Button variant="ghost" className="hidden sm:flex gap-2 text-primary hover:text-primary hover:bg-primary/10">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/50">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <CardHeader>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredResources?.slice(0, 3).map((resource) => (
                <Link key={resource.id} href={`/resources/${resource.id}`} className="group block">
                  <Card className="overflow-hidden h-full border-border/50 hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    {resource.imageUrl && (
                      <div className="h-48 overflow-hidden bg-muted">
                        <img 
                          src={resource.imageUrl} 
                          alt={resource.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    )}
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                          {resource.category}
                        </span>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.readMinutes} phút
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-2">
                      <CardDescription className="line-clamp-3 text-sm">
                        {resource.summary}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/resources">
              <Button variant="outline" className="w-full gap-2 rounded-full">
                Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 bg-gradient-to-br from-destructive/10 to-background border-t border-destructive/10">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <PhoneCall className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Bạn đang trong tình trạng khẩn cấp?</h2>
          <p className="text-muted-foreground mb-8">
            Nếu bạn đang có suy nghĩ làm hại bản thân hoặc cần một người trò chuyện ngay lập tức, xin đừng ngần ngại liên hệ với các đường dây nóng hỗ trợ tâm lý chuyên nghiệp.
          </p>
          <Link href="/hotlines">
            <Button size="lg" variant="destructive" className="rounded-full shadow-lg shadow-destructive/20 px-8 gap-2">
              <PhoneCall className="w-5 h-5" />
              Xem danh bạ khẩn cấp 24/7
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
