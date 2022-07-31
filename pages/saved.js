import React from "react";
import { db } from "../firebase";
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";

function SavedPage() {
  let [quotes, setQuotes] = React.useState([]);
  React.useEffect(() => {
    return onSnapshot(collection(db, "saved_quotes"), (snapshot) => {
      snapshot.docs.forEach(async (docu) => {
        let quote = { id: docu.id, ...docu.data() };
        if (quote.user) {
          let user_ref = doc(db, "/user/hxEpbuursAXnvQhNh2Pkk9IRguq1");
          let user_data = await getDoc(user_ref);
          console.log("exists?", user_data.exists());
          console.log("user_data", user_data.data());
          if (user_data.exists()) {
            quote.user = { id: user_data.id, ...user_data.data() };
          }
        }
        setQuotes((quotes) => [...quotes, quote]);
      });
    });
  }, []);
  React.useEffect(() => {
    console.log(quotes);
  }, [quotes]);
  return <div></div>;
}

export default SavedPage;
