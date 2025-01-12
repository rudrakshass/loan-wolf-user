"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Search,
  MailQuestion,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { db } from "@/lib/firebase/config"; // assuming Firebase config is properly set
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";

const HelpDesk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const faqItems = [
    {
      question: "How do I apply for a loan?",
      answer: "To apply for a loan, navigate to the 'Request' section, post your request, and wait for lenders to submit offers."
    },
    {
      question: "What are the interest rates?",
      answer: "Interest rates are decided by the lender. You can view the interest rate when reviewing the loan offer."
    },
    {
      question: "How long does approval take?",
      answer: "Depends on the lender. Once you receive an offer, you can review and accept or reject it."
    }
  ];

  // Fetching tickets when component mounts
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketCollection = collection(db, "helpdesk_borrower");
        const q = query(ticketCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedTickets = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Add ticket to Firestore
      const ticketRef = collection(db, "helpdesk_borrower");
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
      fetchTickets();
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setErrorMessage("There was an error submitting your ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Help & Support</h2>
      </div>

      {/* Search and Quick Actions */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for help articles..."
          className="pl-10 h-12 bg-[#353369]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Actions */}
            {/* FAQ Section and Support Ticket Form */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-[#605ea1]">
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

        <Card className="bg-[#605ea1]">
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

      {/* Recent Tickets */}
      <Card className="bg-[#605ea1]">
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
                      <p className="text-sm text-muted-foreground">
                        Ticket ID: {ticket.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {ticket.status}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Created At: {new Date(ticket.createdAt.seconds * 1000).toLocaleString()}
                    </p>
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
