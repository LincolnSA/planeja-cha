interface GuestsSummaryProps {
  confirmed: number;
  total: number;
  totalPeople: number;
}

export function GuestsSummary({
  confirmed,
  total,
  totalPeople,
}: GuestsSummaryProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-muted-foreground">
          Total de pessoas:{" "}
          <span className="font-medium text-orange-600">{totalPeople}</span>{" "}
          (convidados + acompanhantes)
        </p>
      </div>
    </div>
  );
}

