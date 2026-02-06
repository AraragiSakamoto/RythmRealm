import { supabase } from './supabaseClient';

export const BeatModel = {
  // Save beat to cloud
  async saveBeat(userId, beatData) {
    const { data, error } = await supabase
      .from('saved_beats')
      .insert({
        user_id: userId,
        name: beatData.name,
        grid: beatData.grid,
        tempo: beatData.tempo,
        instruments: beatData.activeInstrumentIds,
        instrument_config: beatData.instrumentConfig,
        is_public: beatData.isPublic || false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's saved beats
  async getUserBeats(userId) {
    const { data, error } = await supabase
      .from('saved_beats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get public beats (for beat library)
  async getPublicBeats(limit = 50) {
    const { data, error } = await supabase
      .from('saved_beats')
      .select(`
        *,
        profiles (
          username
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Delete a beat
  async deleteBeat(beatId, userId) {
    const { error } = await supabase
      .from('saved_beats')
      .delete()
      .eq('id', beatId)
      .eq('user_id', userId);

    if (error) throw error;
  }
};
