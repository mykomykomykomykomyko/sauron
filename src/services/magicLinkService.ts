
import { supabase } from "@/integrations/supabase/client";

export interface MagicLinkRequest {
  email: string;
  redirectTo?: string;
}

export const sendMagicLink = async ({ email, redirectTo }: MagicLinkRequest) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Only allow existing users to sign in
      emailRedirectTo: redirectTo || `${window.location.origin}/dashboard`,
    },
  });

  if (error) throw error;
  return data;
};

export const createUserWithMagicLink = async ({ email, redirectTo }: MagicLinkRequest) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // Allow creating new users
      emailRedirectTo: redirectTo || `${window.location.origin}/dashboard`,
    },
  });

  if (error) throw error;
  return data;
};

export const verifyOtp = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) throw error;
  return data;
};
