import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fdnilxpfuexaquddwiyp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbmlseHBmdWV4YXF1ZGR3aXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODY4MzAsImV4cCI6MjA2NDU2MjgzMH0.9O6rIlkdcGon6gHGCN2I2jXAreP-iXZXBoJDMSH5It0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);