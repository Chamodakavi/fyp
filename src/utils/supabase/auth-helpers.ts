import { createClient } from "./createClient";

export async function handleGoogleLogin() {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline',
      },
    },
  });

  if (error) throw error;
}