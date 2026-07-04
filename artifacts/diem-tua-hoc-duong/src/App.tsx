import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import Chat from "@/pages/chat";
import Resources from "@/pages/resources";
import ResourceDetail from "@/pages/resource-detail";
import Mood from "@/pages/mood";
import Hotlines from "@/pages/hotlines";
import FAQ from "@/pages/faq";
import MusicPage from "@/pages/music";
import VocabularyPage from "@/pages/vocabulary";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chat" component={Chat} />
        <Route path="/resources" component={Resources} />
        <Route path="/resources/:id" component={ResourceDetail} />
        <Route path="/mood" component={Mood} />
        <Route path="/hotlines" component={Hotlines} />
        <Route path="/faq" component={FAQ} />
        <Route path="/music" component={MusicPage} />
        <Route path="/vocabulary" component={VocabularyPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
