"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterPanel, type FilterValues } from "@/features/product/components/filter-panel";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUI, setFilterDrawerOpen } from "@/store/slices/ui-slice";

interface FilterDrawerProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
  resultCount: number;
}

export function FilterDrawer({ values, onChange, onClear, resultCount }: FilterDrawerProps) {
  const dispatch = useAppDispatch();
  const { isFilterDrawerOpen } = useAppSelector(selectUI);

  return (
    <Sheet open={isFilterDrawerOpen} onOpenChange={(open) => dispatch(setFilterDrawerOpen(open))}>
      <SheetContent side="left" className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5">
          <FilterPanel values={values} onChange={onChange} onClear={onClear} />
        </div>
        <SheetFooter className="border-t border-border p-5">
          <Button className="w-full" onClick={() => dispatch(setFilterDrawerOpen(false))}>
            Show {resultCount} results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
