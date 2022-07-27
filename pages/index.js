import React from "react";
import axios from "axios";

export default function Home() {
  const [quote, setQuote] = React.useState(null);
  React.useEffect(() => {
    const fetchQuotes = async () => {
      const response = await axios.get("https://api.quotable.io/random");
      setQuote(response.data);
    };
    const inter = setInterval(() => {
      fetchQuotes();
    }, 7000);
    return () => clearInterval(inter);
  }, []);
  return (
    <main className="min-h-screen bg-slate-800 grid place-items-center">
      <div className="p-10 bg-slate-300 shadow-2xl flex flex-col gap-4 md:max-w-[70vw] max-w-[90vw] ring-1">
        <h1 className="font-dmserif text-2xl md:text-4xl ">{quote?.content}</h1>
        <span className="font-dmserif text-xl md:text-2xl font-[400]">
          - {quote?.author}
        </span>
      </div>
    </main>
  );
}
