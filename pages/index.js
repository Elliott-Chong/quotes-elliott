import React from "react";
import axios from "axios";
import { BookmarkIcon } from "@heroicons/react/outline";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import loading_datas from "../loading_data";
import { useGlobalContext } from "../context";
import Link from "next/link";

export default function Home() {
  const loading_data = loading_datas[Math.floor(Math.random() * 1)];

  const { state, dispatch } = useGlobalContext();
  const { user } = state;
  React.useEffect(() => {
    let yes = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "set_user", payload: user });
      }
    });
    return yes;
  }, []);
  const [quote, setQuote] = React.useState(null);
  React.useEffect(() => {
    const fetchQuote = async () => {
      const response = await axios.get("https://api.quotable.io/random");
      setQuote(response.data);
    };
    const inter = setInterval(() => {
      fetchQuote();
    }, 7000);
    return () => clearInterval(inter);
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      dispatch({ type: "set_user", payload: response.user });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-800 flex flex-col justify-center items-center md:px-[25vw] px-[5vw]">
      <div className="flex flex-col gap-4 md:gap-8 items-start">
        <div className="p-10 bg-slate-300 shadow-2xl flex flex-col gap-4 ring-1">
          <h1 className="font-dmserif text-2xl md:text-4xl ">
            {quote ? quote.content : loading_data.content}
          </h1>
          <span className="font-dmserif text-xl md:text-2xl font-[400]">
            - {quote ? quote.author : loading_data.author}
          </span>
        </div>
        <div className="flex gap-4">
          {!user ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                signInWithGoogle();
              }}
              className="py-2 flex justify-center items-center px-4 text-base md:text-xl hover:-translate-y-1 text-white shadow-2xl border-2 hover:bg-white hover:text-slate-800 transition-all border-white font-dmserif"
            >
              Sign in
            </button>
          ) : (
            <>
              <Link href="/saved">
                <a className="py-2 flex justify-center items-center px-4 text-base md:text-xl hover:-translate-y-1 text-white shadow-2xl border-2 hover:bg-white hover:text-slate-800 transition-all border-white font-dmserif">
                  {user?.displayName}
                </a>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="py-2 flex justify-center items-center px-4 text-base md:text-xl hover:-translate-y-1 text-white shadow-2xl border-2 hover:bg-white hover:text-slate-800 transition-all border-white font-dmserif"
              >
                <BookmarkIcon className="w-7" />
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
