import React from "react";
import { Badge } from "./Badge";

interface ConditionBadgeProps {
  condition: "grade-a" | "grade-b" | "grade-c" | string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({
  condition,
  size = "sm",
  showLabel = true,
}) => {
  let variant: "default" | "success" | "warning" | "error" | "info" = "default";

  if (condition === "grade-a") variant = "success";
  else if (condition === "grade-b") variant = "info";
  else if (condition === "grade-c") variant = "warning";

  return (
    <Badge
      variant={variant}
      size={size}
      className={`uppercase ${size === "md" ? "text-sm px-3 py-1" : ""}`}
    >
      {showLabel ? condition.replace("-", " ") : condition.split("-")[1] || "—"}
    </Badge>
  );
};
