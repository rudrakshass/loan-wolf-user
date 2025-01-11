"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Search,
  MailQuestion,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const faqItems = [
  {
    question: "How do I apply for a loan?",
    answer: "To apply for a loan, navigate to the 'Apply' section and fill out the required information. We'll review your application within 24 hours."
  },
  {
    question: "What are the interest rates?",
    answer: "Interest rates vary based on loan amount, duration, and credit score. Typical rates range from 5% to 15% APR."
  },
  {
    question: "How long does approval take?",
    answer: "Most applications are reviewed within 24-48 hours. You'll receive an email notification once a decision has been made."
  }
];

const tickets = [
  {
    id: "T-1234",
    subject: "Loan Application Status",
    status: "Open",
    updated: "2 hours ago"
  },
  {
    id: "T-1235",
    subject: "Payment Confirmation",
    status: "Closed",
    updated: "1 day ago"
  },
  {
    id: "T-1236",
    subject: "Payment Confirmation",
    status: "Closed",
    updated: "1 day ago"
  },
  {
    id: "T-1237",
    subject: "Account Verification",
    status: "Open",
    updated: "3 hours ago"
  },
  {
    id: "T-1238",
    subject: "Loan Repayment",
    status: "Closed",
    updated: "2 days ago"
  },
  {
    id: "T-1239",
    subject: "Interest Rate Inquiry",
    status: "Open",
    updated: "5 hours ago"
  },
  {
    id: "T-1240",
    subject: "Document Submission",
    status: "Closed",
    updated: "3 days ago"
  },
  {
    id: "T-1241",
    subject: "Loan Extension Request",
    status: "Open",
    updated: "6 hours ago"
  }
];

const HelpDesk = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8 space-y-8 bg-gradient-to-r h-screen from-[#181127] via-purple-700 to-purple-900">
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold tracking-tight">History</h2>
      </div>
      <Card className='bg-[#605EA1] h-[83%] overflow-hidden pb-5'>
        <CardHeader>
          <CardTitle>All Your Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 overflow-y-auto h-[80vh] scrollbar-hide">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {ticket.status === "Open" ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">Ticket ID: {ticket.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{ticket.status}</p>
                  <p className="text-sm text-muted-foreground">Updated {ticket.updated}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpDesk;