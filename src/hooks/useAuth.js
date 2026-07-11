import { useState, useEffect } from "react";

import { supabase } from "../services/supabase";



export function useAuth(showToast) {

  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);

  const [signingOut, setSigningOut] = useState(false);



  useEffect(() => {

    const checkSession = async () => {

      const { data } = await supabase.auth.getSession();

      if (data?.session) {

        setSession(data.session);

      }

      setLoading(false);

    };

    checkSession();



    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {

      setSession(s);

    });

    return () => subscription.unsubscribe();

  }, []);



  const signOut = async () => {

    if (signingOut) return;

    setSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {

      if (showToast) showToast("Failed to sign out. Please try again.", "error");

    } else {

      setSession(null);

    }

    setSigningOut(false);

  };



  return { session, loading, signOut, signingOut };

}

