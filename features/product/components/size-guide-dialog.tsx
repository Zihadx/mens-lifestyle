"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SIZE_CHART = [
  { size: "S", chest: "36–38", length: "27", shoulder: "17" },
  { size: "M", chest: "39–41", length: "28", shoulder: "18" },
  { size: "L", chest: "42–44", length: "29", shoulder: "19" },
  { size: "XL", chest: "45–47", length: "30", shoulder: "20" },
  { size: "XXL", chest: "48–50", length: "31", shoulder: "21" },
  { size: "3XL", chest: "51–53", length: "32", shoulder: "22" },
];

interface SizeGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SizeGuideDialog({ open, onOpenChange }: SizeGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">All measurements in inches. Measured flat, garment laid on a table.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Chest</TableHead>
              <TableHead>Length</TableHead>
              <TableHead>Shoulder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SIZE_CHART.map((row) => (
              <TableRow key={row.size}>
                <TableCell className="font-medium">{row.size}</TableCell>
                <TableCell>{row.chest}</TableCell>
                <TableCell>{row.length}</TableCell>
                <TableCell>{row.shoulder}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
