import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;

export async function runSupabaseDiagnostic() {
  const result = {
    urlLoaded: Boolean(supabaseUrl),
    keyLoaded: Boolean(supabasePublishableKey),
    urlLooksCorrect: Boolean(
      supabaseUrl && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(supabaseUrl)
    ),
    apiReachable: false,
    subjectsReadable: false,
    status: null,
    subjectCount: null,
    error: null,
  };

  if (!supabaseUrl || !supabasePublishableKey) {
    result.error = "One or both VITE_SUPABASE_* environment variables are missing from the production build.";
    return result;
  }

  try {
    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/subjects?select=id,name&order=name.asc`,
      {
        method: "GET",
        headers: {
          apikey: supabasePublishableKey,
          Authorization: `Bearer ${supabasePublishableKey}`,
          Accept: "application/json",
        },
      }
    );

    result.status = response.status;
    result.apiReachable = true;

    const text = await response.text();

    if (!response.ok) {
      result.error = text || `Supabase returned HTTP ${response.status}.`;
      return result;
    }

    try {
      const data = JSON.parse(text);
      result.subjectsReadable = Array.isArray(data);
      result.subjectCount = Array.isArray(data) ? data.length : null;
    } catch {
      result.error = "Supabase responded, but the response was not valid JSON.";
    }
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : String(error);
  }

  return result;
}
