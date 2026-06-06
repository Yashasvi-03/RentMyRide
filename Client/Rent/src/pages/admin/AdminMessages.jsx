

import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState({}); //  FIXED

  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  const fetchMessages = async () => {
    const res = await API.get("/admin/messages");
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendReply = async (id) => {
    try {
      await API.post(`/admin/reply/${id}`, { reply: reply[id] });

      toast.success("Reply sent ");

      //  clear only that message reply
      setReply((prev) => ({ ...prev, [id]: "" }));

      fetchMessages();
    } catch {
      toast.error("Failed");
    }
  };

  // PAGINATION
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const currentMessages = sortedMessages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(messages.length / messagesPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Messages</h2>

      {currentMessages.map((m) => (
        <div key={m._id} className="bg-white p-4 rounded mb-4 shadow">
          <p>
            <b>{m.name}</b> ({m.email})
          </p>

          <p className="text-gray-600">{m.message}</p>

          {/*  SHOW REPLY */}
          {m.replied && (
            <div className="mt-2 bg-green-100 p-2 rounded">
              <p className="text-green-700 text-sm font-semibold">
                Admin Reply:
              </p>
              <p className="text-gray-700 text-sm">{m.reply}</p>
            </div>
          )}

          {/*  REPLY BOX */}
          {!m.replied && (
            <>
              <textarea
                placeholder="Reply..."
                className="w-full border p-2 mt-2"
                value={reply[m._id] || ""}
                onChange={(e) =>
                  setReply({ ...reply, [m._id]: e.target.value })
                }
              />

              <button
                onClick={() => sendReply(m._id)}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
              >
                Send Reply
              </button>
            </>
          )}
        </div>
      ))}

      {/*  PAGINATION */}
      {messages.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;
