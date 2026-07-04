import { useParams } from "wouter";
import { useGetResource, getGetResourceQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id, 10);
  
  const { data: resource, isLoading, isError } = useGetResource(resourceId, { 
    query: { enabled: !isNaN(resourceId), queryKey: getGetResourceQueryKey(resourceId) } 
  });

  if (isError || (!isLoading && !resource)) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy bài viết</h2>
        <p className="text-muted-foreground mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/resources">
          <Button>Về trang tài liệu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link href="/resources" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại thư viện
      </Link>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-12 w-full md:w-3/4" />
          <Skeleton className="h-6 w-full md:w-1/2" />
          <div className="aspect-video w-full rounded-2xl overflow-hidden mt-8">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="space-y-4 mt-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ) : resource && (
        <article className="animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
              {resource.category}
            </span>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <Clock className="w-4 h-4" />
              {resource.readMinutes} phút đọc
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              {new Date(resource.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-serif mb-6 leading-tight text-foreground">
            {resource.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
            {resource.summary}
          </p>

          {resource.imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-border/50">
              <img 
                src={resource.imageUrl} 
                alt={resource.title} 
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-a:text-primary max-w-none text-foreground/90">
            {/* If content is HTML, dangerouslySetInnerHTML or use a markdown parser. Assuming simple text with newlines for now */}
            {resource.content?.split('\n').map((paragraph, i) => (
              paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
            ))}
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-2 items-center">
              <Tag className="w-5 h-5 text-muted-foreground mr-2" />
              {resource.tags.map(tag => (
                <span key={tag} className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      )}
    </div>
  );
}
