"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { db, auth } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const HelpDesk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch tickets from Firestore
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const borrowerId = auth.currentUser?.uid;
        if (!borrowerId) {
          throw new Error("User is not authenticated.");
        }

        const ticketCollectionRef = collection(db, "loan_requests");
        const ticketsQuery = query(ticketCollectionRef, where("borrowerId", "==", borrowerId));
        const querySnapshot = await getDocs(ticketsQuery);
        const fetchedTickets = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setErrorMessage("Failed to load loan requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

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
          {loading ? (
            <p>Loading loan requests...</p>
          ) : errorMessage ? (
            <p className="text-red-600">{errorMessage}</p>
          ) : tickets.length === 0 ? (
            <p>No loan requests found.</p>
          ) : (
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