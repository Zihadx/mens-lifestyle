"use client";

import { toast } from "sonner";
import { MessageSquareText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { ReviewModerationCard } from "@/features/review/components/review-moderation-card";
import { useAllReviews, useModerateReview } from "@/features/review/hooks/use-reviews";

export default function AdminReviewsPage() {
  const { data: reviews = [], isLoading } = useAllReviews();
  const moderate = useModerateReview();

  const pending = reviews.filter((r) => r.status === "pending");
  const reported = reviews.filter((r) => r.status === "reported");
  const published = reviews.filter((r) => r.status === "published");

  function approve(id: string) {
    moderate.mutate({ id, status: "published" }, { onSuccess: () => toast.success("Review approved") });
  }
  function reject(id: string) {
    moderate.mutate({ id, status: "reported" }, { onSuccess: () => toast.success("Review removed from public view") });
  }

  function renderList(list: typeof reviews, emptyLabel: string) {
    if (isLoading) return <TableSkeleton rows={3} cols={1} />;
    if (list.length === 0) return <EmptyState icon={MessageSquareText} title={emptyLabel} />;
    return (
      <div className="space-y-3">
        {list.map((review) => (
          <ReviewModerationCard key={review.id} review={review} onApprove={approve} onReject={reject} isPending={moderate.isPending} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">Moderate customer reviews before they go live</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="reported">Reported ({reported.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({published.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">{renderList(pending, "No reviews awaiting approval")}</TabsContent>
        <TabsContent value="reported">{renderList(reported, "No reported reviews")}</TabsContent>
        <TabsContent value="published">{renderList(published, "No published reviews yet")}</TabsContent>
      </Tabs>
    </div>
  );
}
