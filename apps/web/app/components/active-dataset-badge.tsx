"use client";

import { useEffect, useState } from "react";
import { getActiveDatasetLabel } from "../../lib/dev-seed-profiles";

type ActiveDatasetBadgeProps = {
  className?: string;
};

export default function ActiveDatasetBadge({ className = "" }: ActiveDatasetBadgeProps) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(getActiveDatasetLabel());
  }, []);

  if (!label) {
    return null;
  }

  return <div className={className}>{label}</div>;
}
