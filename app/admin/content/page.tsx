"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useHomepageContent,
  useUpdateHomepageContent,
  useAddFaq,
  useUpdateFaq,
  useRemoveFaq,
} from "@/features/settings/hooks/use-settings";
import type { FaqEntry } from "@/features/settings/services/content.service";

export default function AdminContentPage() {
  const { data: content, isLoading } = useHomepageContent();
  const updateContent = useUpdateHomepageContent();
  const addFaq = useAddFaq();
  const updateFaq = useUpdateFaq();
  const removeFaq = useRemoveFaq();

  const [heroForm, setHeroForm] = useState({ announcementText: "", heroHeadline: "", heroSubtext: "", heroBadgeText: "" });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqDraft, setFaqDraft] = useState({ question: "", answer: "" });
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  useEffect(() => {
    if (content) {
      setHeroForm({
        announcementText: content.announcementText,
        heroHeadline: content.heroHeadline,
        heroSubtext: content.heroSubtext,
        heroBadgeText: content.heroBadgeText,
      });
    }
  }, [content]);

  function saveHero() {
    updateContent.mutate(heroForm, { onSuccess: () => toast.success("Homepage content updated") });
  }

  function startEditFaq(entry: FaqEntry) {
    setEditingFaqId(entry.id);
    setFaqDraft({ question: entry.question, answer: entry.answer });
    setIsAddingFaq(false);
  }

  function startAddFaq() {
    setEditingFaqId(null);
    setFaqDraft({ question: "", answer: "" });
    setIsAddingFaq(true);
  }

  function saveFaq() {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) return;
    if (editingFaqId) {
      updateFaq.mutate(
        { id: editingFaqId, entry: faqDraft },
        { onSuccess: () => { toast.success("FAQ updated"); setEditingFaqId(null); } }
      );
    } else {
      addFaq.mutate(faqDraft, {
        onSuccess: () => { toast.success("FAQ added"); setIsAddingFaq(false); setFaqDraft({ question: "", answer: "" }); },
      });
    }
  }

  if (isLoading || !content) return <div className="h-64 animate-pulse rounded-lg bg-secondary" />;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
        <p className="text-sm text-muted-foreground">Manage homepage copy and FAQ without touching code</p>
      </div>

      <section className="space-y-4 rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Announcement Bar</h2>
        <div className="space-y-1.5">
          <Label>Text</Label>
          <Input value={heroForm.announcementText} onChange={(e) => setHeroForm({ ...heroForm, announcementText: e.target.value })} />
        </div>

        <Separator />

        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Hero Section</h2>
        <div className="space-y-1.5">
          <Label>Badge Text</Label>
          <Input value={heroForm.heroBadgeText} onChange={(e) => setHeroForm({ ...heroForm, heroBadgeText: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Headline</Label>
          <Textarea value={heroForm.heroHeadline} onChange={(e) => setHeroForm({ ...heroForm, heroHeadline: e.target.value })} rows={2} />
        </div>
        <div className="space-y-1.5">
          <Label>Subtext</Label>
          <Textarea value={heroForm.heroSubtext} onChange={(e) => setHeroForm({ ...heroForm, heroSubtext: e.target.value })} rows={2} />
        </div>

        <Button onClick={saveHero} loading={updateContent.isPending}>
          Save Hero Content
        </Button>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">FAQ</h2>
          <Button size="sm" variant="outline" onClick={startAddFaq}>
            <Plus className="size-3.5" /> Add FAQ
          </Button>
        </div>

        {isAddingFaq && (
          <Card>
            <CardContent className="space-y-3 p-4">
              <Input placeholder="Question" value={faqDraft.question} onChange={(e) => setFaqDraft({ ...faqDraft, question: e.target.value })} />
              <Textarea placeholder="Answer" value={faqDraft.answer} onChange={(e) => setFaqDraft({ ...faqDraft, answer: e.target.value })} rows={2} />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveFaq} loading={addFaq.isPending}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingFaq(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {content.faq.map((entry) =>
            editingFaqId === entry.id ? (
              <Card key={entry.id}>
                <CardContent className="space-y-3 p-4">
                  <Input value={faqDraft.question} onChange={(e) => setFaqDraft({ ...faqDraft, question: e.target.value })} />
                  <Textarea value={faqDraft.answer} onChange={(e) => setFaqDraft({ ...faqDraft, answer: e.target.value })} rows={2} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveFaq} loading={updateFaq.isPending}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingFaqId(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card key={entry.id}>
                <CardContent className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-medium">{entry.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{entry.answer}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" className="size-8" onClick={() => startEditFaq(entry)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => removeFaq.mutate(entry.id, { onSuccess: () => toast.success("FAQ removed") })}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </section>
    </div>
  );
}
