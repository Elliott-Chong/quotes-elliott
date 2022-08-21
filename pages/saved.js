import React from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { useGlobalContext } from "../context";
import Router from "next/router";

function SavedPage() {
  const { state } = useGlobalContext();
  const { user } = state;
  const [quotes, setQuotes] = React.useState([]);
  React.useEffect(() => {
    const fetchQuotes = async () => {
      const all_quotes = [];
      const saved_quotes_ref = collection(db, "saved_quotes");
      const q = query(saved_quotes_ref, where("user_id", "==", user.id));
      const queried_quotes = await getDocs(q);
      queried_quotes.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        all_quotes.push(doc.data());
      });
      setQuotes(
        all_quotes.map((q) => {
          return { content: q.quote, author: q.author };
        })
      );
    };
    if (!user) {
      Router.push("/");
    } else {
      fetchQuotes();
    }
  }, []);
  React.useEffect(() => {
    console.log(quotes);
  }, [quotes]);
  return (
    <main className="min-h-screen bg-slate-800 p-10">
      <h1 className="font-dmserif text-white text-2xl md:text-4xl">
        Your saved quotes
      </h1>
      <section className="mt-4 flex flex-col gap-4">
        {quotes.map((quote, idx) => {
          return (
            <div
              key={idx}
              className="p-6 bg-white shadow-4xl flex flex-col gap-4 ring-1"
            >
              <h1 className="font-dmserif text-2xl md:text-4xl ">
                {quote.content}
              </h1>
              <span className="font-dmserif text-xl md:text-2xl font-[400]">
                - {quote.author}
              </span>
            </div>
          );
        })}
      </section>
      <button
        onClick={(e) => {
          e.preventDefault();
          Router.push("/");
        }}
        className="py-2 flex justify-center mt-5 items-center px-4 text-base md:text-xl hover:-translate-y-1 text-white shadow-2xl border-2 hover:bg-white hover:text-slate-800 transition-all border-white font-dmserif"
      >
        <ChevronLeftIcon className="w-7" />
      </button>
    </main>
  );
}

export default SavedPage;
