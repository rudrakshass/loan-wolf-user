"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const recentLoans = [
  {
    id: 1,
    borrower: "John Doe",
    amount: "$5,000",
    status: "Pending",
    date: "2024-03-20",
  },
  {
    id: 2,
    borrower: "Jane Smith",
    amount: "$10,000",
    status: "Approved",
    date: "2024-03-19",
  },
  {
    id: 3,
    borrower: "Mike Johnson",
    amount: "$7,500",
    status: "Funded",
    date: "2024-03-18",
  },
  {
    id: 4,
    borrower: "Sarah Wilson",
    amount: "$15,000",
    status: "Pending",
    date: "2024-03-17",
  },
];

export function RecentLoans() {
  return (
    <div className="space-y-8">
      {recentLoans.map((loan) => (
        <div key={loan.id} className="flex items-center px-6">
          <Avatar className="h-9 w-9" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{loan.borrower}</p>
            <p className="text-sm text-muted-foreground">
              {loan.amount} - {loan.date}
            </p>
          </div>
          <div className="ml-auto">
            <Badge color={loan.status === "Pending" ? "yellow" : loan.status === "Approved" ? "green" : "blue"}>
              {loan.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}