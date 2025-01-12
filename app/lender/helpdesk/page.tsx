"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Search,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { addDoc, collection, getDocs, orderBy, query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: {
    seconds: number;
  };
}

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

const HelpDesk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketCollection = collection(db, "helpdesk_lender");
        const q = query(ticketCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedTickets = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Ticket[];
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setErrorMessage("Failed to fetch tickets. Please try again later.");
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchTickets();
  }, []);

  // Handle ticket submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Add ticket to Firestore
      const ticketRef = collection(db, "helpdesk_lender");
      await addDoc(ticketRef, {
        subject,
        description,
        status: "Open",
        createdAt: new Date(),
      });

      setSuccessMessage("Your ticket has been submitted successfully!");
      setSubject('');
      setDescription('');
      // Fetch tickets again to update the list
      const fetchTickets = async () => {
        try {
          const ticketCollection = collection(db, "helpdesk_lender");
          const q = query(ticketCollection, orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const fetchedTickets = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Ticket[];
          setTickets(fetchedTickets);
        } catch (error) {
          console.error("Error fetching tickets:", error);
          setErrorMessage("Failed to fetch tickets. Please try again later.");
        } finally {
          setLoadingTickets(false);
        }
      };
      fetchTickets();
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setErrorMessage("There was an error submitting your ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-r min-h-screen from-[#181127] via-purple-700 to-purple-900">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  className="bg-[#353369]"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Describe your issue..."
                  className="min-h-[120px] bg-[#353369]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
            {successMessage && (
              <p className="mt-4 text-green-600">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="mt-4 text-red-600">{errorMessage}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className='bg-[#605EA1]'>
        <CardHeader>
          <CardTitle>Your Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTickets ? (
            <p>Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p>No tickets found.</p>
          ) : (
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
                    <p className="text-sm text-muted-foreground">Updated {new Date(ticket.createdAt.seconds * 1000).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpDesk;