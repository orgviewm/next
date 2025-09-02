import { supabaseAdmin } from "./supabase-admin";

export const runtime = "nodejs";

interface ProfileData {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  provider_account_id: string;
}

export async function upsertProfile(data: ProfileData) {
  const { email, name, image, provider, provider_account_id } = data;

  // First, try to find existing profile by email or provider combination
  const { data: existingProfile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .or(
      `email.ilike.${email},and(provider.eq.${provider},provider_account_id.eq.${provider_account_id})`,
    )
    .single();

  if (existingProfile) {
    // Update existing profile
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        name: name || existingProfile.name,
        image: image || existingProfile.image,
        last_login_at: new Date().toISOString(),
      })
      .eq("id", existingProfile.id);

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    return existingProfile;
  } else {
    // Create new profile
    const { data: newProfile, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        email,
        name,
        image,
        provider,
        provider_account_id,
        last_login_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }

    return newProfile;
  }
}
