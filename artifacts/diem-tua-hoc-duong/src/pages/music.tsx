import { useState, useRef } from "react";
import { Music, Play, Pause, SkipForward, SkipBack, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Track {
  id: number;
  title: string;
  artist: string;
  category: string;
  youtubeId: string;
  duration: string;
  description: string;
}

const tracks: Track[] = [
  { id: 1, title: "Lofi Study Beats", artist: "ChilledCow", category: "Học tập", youtubeId: "jfKfPfyJRdk", duration: "Livetream", description: "Nhạc lo-fi nhẹ nhàng giúp tập trung học bài" },
  { id: 2, title: "Piano Relaxing Music", artist: "RelaxingRecords", category: "Thư giãn", youtubeId: "FjHGZj2IjBk", duration: "3 giờ", description: "Nhạc piano nhẹ nhàng giúp tâm trí thư giãn hoàn toàn" },
  { id: 3, title: "Nature Sounds & Soft Music", artist: "NatureSound", category: "Thiền", youtubeId: "eKFTSSKCzWA", duration: "8 giờ", description: "Tiếng thiên nhiên kết hợp nhạc nền giúp tĩnh tâm" },
  { id: 4, title: "Calm Piano for Sleep", artist: "Soothing Relaxation", category: "Ngủ ngon", youtubeId: "1ZYbU82GVz4", duration: "3 giờ", description: "Nhạc piano êm dịu giúp dễ vào giấc ngủ" },
  { id: 5, title: "Study Music - Alpha Waves", artist: "Greenred Productions", category: "Học tập", youtubeId: "WPni755-Krg", duration: "3 giờ", description: "Sóng alpha kích thích não bộ tập trung và ghi nhớ tốt hơn" },
  { id: 6, title: "Soft Jazz for Relaxation", artist: "Jazz Radio", category: "Thư giãn", youtubeId: "Dx5qFachd3A", duration: "2 giờ", description: "Jazz nhẹ nhàng tạo không khí ấm cúng và thư thái" },
  { id: 7, title: "Rain Sounds for Sleep", artist: "Relaxing Sounds", category: "Ngủ ngon", youtubeId: "mPZkdNFkNps", duration: "10 giờ", description: "Tiếng mưa nhẹ giúp giảm lo âu và dễ ngủ hơn" },
  { id: 8, title: "Meditation Music", artist: "PowerThoughts Meditation", category: "Thiền", youtubeId: "lFcSrYw-ARY", duration: "1 giờ", description: "Nhạc thiền định 432Hz giúp cân bằng tâm trí" },
  { id: 9, title: "Acoustic Guitar Chill", artist: "Chill Guitar", category: "Thư giãn", youtubeId: "dMXlZ4y7OK4", duration: "2 giờ", description: "Guitar acoustic nhẹ nhàng, ấm áp và bình yên" },
  { id: 10, title: "Focus Flow - Deep Work", artist: "Musiclab Collective", category: "Học tập", youtubeId: "o1dK3N3_rCQ", duration: "1 giờ", description: "Nhạc nền giúp vào trạng thái tập trung sâu (deep work)" },
];

const categories = ["Tất cả", "Học tập", "Thư giãn", "Thiền", "Ngủ ngon"];

const categoryColors: Record<string, string> = {
  "Học tập": "bg-blue-100 text-blue-700 border-blue-200",
  "Thư giãn": "bg-green-100 text-green-700 border-green-200",
  "Thiền": "bg-purple-100 text-purple-700 border-purple-200",
  "Ngủ ngon": "bg-indigo-100 text-indigo-700 border-indigo-200",
};

export default function MusicPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const filtered = selectedCategory === "Tất cả"
    ? tracks
    : tracks.filter((t) => t.category === selectedCategory);

  const currentIndex = currentTrack ? tracks.findIndex((t) => t.id === currentTrack.id) : -1;

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  const playNext = () => {
    if (currentIndex < tracks.length - 1) setCurrentTrack(tracks[currentIndex + 1]);
    else setCurrentTrack(tracks[0]);
  };

  const playPrev = () => {
    if (currentIndex > 0) setCurrentTrack(tracks[currentIndex - 1]);
    else setCurrentTrack(tracks[tracks.length - 1]);
  };

  const youtubeUrl = currentTrack
    ? `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&loop=1&playlist=${currentTrack.youtubeId}&controls=1&rel=0&modestbranding=1`
    : "";

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 pb-8 border-b border-border/40">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold font-serif mb-3 text-foreground">Nhạc Thư Giãn</h1>
          <p className="text-muted-foreground text-lg">
            Âm nhạc nhẹ nhàng giúp bạn thư giãn, tập trung học bài và cân bằng tâm trí.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Now Playing */}
        {currentTrack ? (
          <div className="mb-8 bg-card border border-primary/20 rounded-2xl overflow-hidden shadow-md">
            <div className="bg-primary/5 px-6 py-3 border-b border-border/40">
              <p className="text-sm font-medium text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block"></span>
                Đang phát
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-0">
              {/* YouTube Embed */}
              <div className="aspect-video bg-black">
                <iframe
                  ref={iframeRef}
                  key={currentTrack.youtubeId}
                  src={youtubeUrl}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full"
                  title={currentTrack.title}
                />
              </div>
              {/* Track Info & Controls */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <Badge className={`text-xs mb-3 border ${categoryColors[currentTrack.category] || ""}`}>
                    {currentTrack.category}
                  </Badge>
                  <h2 className="text-xl font-bold text-foreground mb-1">{currentTrack.title}</h2>
                  <p className="text-muted-foreground text-sm mb-1">{currentTrack.artist}</p>
                  <p className="text-muted-foreground/70 text-xs mb-4">{currentTrack.duration}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{currentTrack.description}</p>
                </div>
                <div className="mt-6 space-y-4">
                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={playPrev}>
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="w-12 h-12 rounded-full shadow-md"
                      onClick={() => setCurrentTrack(null)}
                    >
                      <Pause className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={playNext}>
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>
                  {/* Open in YouTube */}
                  <a
                    href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Mở trên YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-card border border-border/50 rounded-2xl p-8 text-center text-muted-foreground">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-base">Chọn một bản nhạc bên dưới để bắt đầu</p>
            <p className="text-sm mt-1 opacity-70">Âm nhạc giúp tâm trí thư giãn và tập trung tốt hơn</p>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
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

        {/* Track List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((track) => {
            const isPlaying = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex items-start gap-4 ${
                  isPlaying
                    ? "border-primary/40 bg-primary/5 shadow-md"
                    : "border-border/50 bg-card hover:border-primary/30 hover:shadow-sm hover:bg-primary/3"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={`https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                    isPlaying ? "opacity-100 bg-black/40" : "opacity-0 group-hover:opacity-100 bg-black/40"
                  }`}>
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold text-sm truncate ${isPlaying ? "text-primary" : "text-foreground"}`}>
                      {track.title}
                    </h3>
                    <Badge className={`text-[10px] flex-shrink-0 border ${categoryColors[track.category] || ""}`}>
                      {track.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{track.duration}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{track.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-10 text-center bg-muted/30 border border-border/50 rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">
            Mẹo nhỏ: Nghe nhạc không lời khi học tập hiệu quả hơn nhạc có lời.
            Thử danh mục <span className="text-primary font-medium">Học tập</span> khi ôn bài nhé!
          </p>
        </div>
      </div>
    </div>
  );
}
