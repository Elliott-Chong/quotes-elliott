import React from "react";
import axios from "axios";
import {
  BookmarkIcon as UnsavedBookmarkIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { BookmarkIcon as SavedBookmarkIcon } from "@heroicons/react/solid";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import loading_datas from "../loading_data";
import { useGlobalContext } from "../context";
import Link from "next/link";
import { db } from "../firebase";
import { getDoc, doc, setDoc, collection, addDoc } from "firebase/firestore";

export default function Home() {
  const loading_data = loading_datas[Math.floor(Math.random() * 1)];

  const { state, dispatch } = useGlobalContext();
  const { user } = state;
  React.useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "set_user", payload: user });
      } else {
        dispatch({ type: "clear_user" });
      }
    });
  }, []);
  const [quote, setQuote] = React.useState(null);
  React.useEffect(() => {
    const fetchQuote = async () => {
      const response = await axios.get("https://api.quotable.io/random");
      setQuote(response.data);
      setSaved(false);
    };
    const inter = setInterval(() => {
      fetchQuote();
    }, 7000);
    return () => clearInterval(inter);
  }, []);
  const [saved, setSaved] = React.useState(false);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", response.user.uid.toString());
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        console.log("registering new user");
        await setDoc(doc(db, "users", response.user.uid.toString()), {
          email: response.user.email,
          name: response.user.displayName,
          photo_url: response.user.photoURL,
        });
      }
      dispatch({ type: "set_user", payload: response.user });
    } catch (error) {
      console.log(error);
    }
  };

  const saveQuote = async () => {
    setSaved(true);
    console.log(quote.content, quote.author);
    await addDoc(collection(db, "saved_quotes"), {
      user_id: user.id.toString(),
      quote: quote.content,
      author: quote.author,
    });
  };

  return (
    <main className="min-h-screen bg-slate-800 flex flex-col justify-center items-center md:px-[25vw] px-[5vw]">
      <div className="flex flex-col gap-4 md:gap-8 items-start">
        <div className="p-10 bg-white shadow-2xl flex flex-col gap-4 ring-1">
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
                  saveQuote();
                }}
                className="py-2 flex justify-center items-center px-4 text-base md:text-xl hover:-translate-y-1 text-white shadow-2xl border-2 hover:bg-white hover:text-slate-800 transition-all border-white font-dmserif"
              >
                {saved ? (
                  <SavedBookmarkIcon className="w-7" />
                ) : (
                  <UnsavedBookmarkIcon className="w-7" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  signOut(auth);
                }}
                className="py-2 flex justify-center items-center px-4 text-base md:text-xl hover:-translate-y-1 text-white shadow-2xl border-2 hover:bg-white hover:text-slate-800 transition-all border-white font-dmserif"
              >
                <LogoutIcon className="w-7" />
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
