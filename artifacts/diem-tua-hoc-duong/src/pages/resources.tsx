import { useListResources } from "@workspace/api-client-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Search, Filter } from "lucide-react";

const CATEGORIES = ["Tất cả", "Học tập", "Tâm lý", "Quan hệ xã hội", "Sức khỏe"];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  
  const queryParams = selectedCategory === "Tất cả" ? {} : { category: selectedCategory };
  const { data: resources, isLoading } = useListResources(queryParams);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold font-serif mb-4 text-foreground">Góc Tài Liệu</h1>
        <p className="text-lg text-muted-foreground">
          Thư viện kiến thức và kỹ năng mềm giúp bạn vượt qua những khó khăn trong học tập và cuộc sống.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <div className="flex items-center gap-2 text-muted-foreground mr-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Lọc theo:</span>
        </div>
        {CATEGORIES.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
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
        ) : resources && resources.length > 0 ? (
          resources.map((resource) => (
            <Link key={resource.id} href={`/resources/${resource.id}`} className="group block">
              <Card className="overflow-hidden h-full border-border/50 hover:shadow-md hover:border-primary/30 transition-all duration-300">
                {resource.imageUrl ? (
                  <div className="h-48 overflow-hidden bg-muted">
                    <img 
                      src={resource.imageUrl} 
                      alt={resource.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-primary/5 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary/20" />
                  </div>
                )}
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {resource.category}
                    </span>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Clock className="w-3 h-3" />
                      {resource.readMinutes} phút đọc
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-2">
                  <CardDescription className="line-clamp-3 text-sm text-muted-foreground">
                    {resource.summary}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border/50">
            <Search className="w-10 h-10 mb-4 text-muted-foreground/50" />
            <p>Không tìm thấy tài liệu nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
