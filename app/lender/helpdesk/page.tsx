"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
    question: "How do I lend a loan?",
    answer: "You can go to the 'Browse' section and view the loan requests. You can then select a request and submit an offer."
  },
  {
    question: "What are the interest rates?",
    answer: "You can set the interest rate when submitting an offer. The borrower will then have the option to accept or reject your offer."
  },
  {
    question: "How long does approval take?",
    answer: "Depends on the borrower. Once you submit an offer, the borrower will review and accept or reject it."
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
  }
];

const HelpDesk = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8 space-y-8 bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900">
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold tracking-tight">Help & Support</h2>
      </div>

      {/* Search and Quick Actions */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles..."
            className="pl-10 h-12 bg-[#353369]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* FAQ Section */}
        <Card className='bg-[#605EA1]'>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-semibold">{item.question}</h4>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support Ticket Form */}
        <Card className='bg-[#605EA1]'>
          <CardHeader>
            <CardTitle>Submit a Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Input className="bg-[#353369]" placeholder="Subject" />
              </div>
              <div>
                <Textarea 
                  placeholder="Describe your issue..."
                  className="min-h-[120px] bg-[#353369]"
                />
              </div>
              <Button className="w-full">Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-[#605EA1]'>
        <CardHeader>
          <CardTitle>Your Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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