import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import "./App.css";
import Loader from "../Loader";
import Auth from "../Auth/Auth";
import { auth } from '../../Firebase/Firebase';
import Main from "../Main/Main";

const App = () => {

  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    setLoading(true);
    //this function listens to login/logout in the application
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState(true);
      }else{
        setAuthState(false);
      }
      setLoading(false);
    });
  }, [])

  return (
    <div className="w-screen h-screen px-2 py-2 secondaryBGColor">
      <div className="w-full px-2 h-full rounded-2xl flex justify-center overflow-auto primaryBGColor background">
        {loading ? (
          <Loader />
        ) : authState ? (
          <Main />
        ) : (
          <Auth />
        )}
      </div>
    </div>
  );
};

export default App;
