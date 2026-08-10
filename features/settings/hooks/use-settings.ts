import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService, type StoreSettings } from "@/features/settings/services/settings.service";
import { contentService, type HomepageContent, type FaqEntry } from "@/features/settings/services/content.service";
import { queryKeys } from "@/lib/query-keys";

export function useStoreSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => settingsService.get(),
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<StoreSettings>) => settingsService.update(patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
  });
}

export function useHomepageContent() {
  return useQuery({
    queryKey: ["content", "homepage"],
    queryFn: () => contentService.get(),
  });
}

function useInvalidateContent() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["content"] });
}

export function useUpdateHomepageContent() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: (patch: Partial<Omit<HomepageContent, "faq">>) => contentService.update(patch),
    onSuccess: invalidate,
  });
}

export function useAddFaq() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: (entry: Omit<FaqEntry, "id">) => contentService.addFaq(entry),
    onSuccess: invalidate,
  });
}

export function useUpdateFaq() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: ({ id, entry }: { id: string; entry: Omit<FaqEntry, "id"> }) => contentService.updateFaq(id, entry),
    onSuccess: invalidate,
  });
}

export function useRemoveFaq() {
  const invalidate = useInvalidateContent();
  return useMutation({
    mutationFn: (id: string) => contentService.removeFaq(id),
    onSuccess: invalidate,
  });
}
