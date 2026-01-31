import { Loading } from "@/components/ui/Loading";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}
