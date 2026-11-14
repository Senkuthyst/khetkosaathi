export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      user_profiles: {
        Row: {
          country: string
          created_at: string
          current_latitude: number | null
          current_location_name: string | null
          current_longitude: number | null
          district: string | null
          email: string | null
          full_name: string
          id: string
          municipality: string | null
          phone_number: string | null
          preferred_language: string
          profile_photo: string | null
          province: string | null
          updated_at: string
          ward_number: string | null
        }
        Insert: {
          country?: string
          created_at?: string
          current_latitude?: number | null
          current_location_name?: string | null
          current_longitude?: number | null
          district?: string | null
          email?: string | null
          full_name: string
          id: string
          municipality?: string | null
          phone_number?: string | null
          preferred_language?: string
          profile_photo?: string | null
          province?: string | null
          updated_at?: string
          ward_number?: string | null
        }
        Update: {
          country?: string
          created_at?: string
          current_latitude?: number | null
          current_location_name?: string | null
          current_longitude?: number | null
          district?: string | null
          email?: string | null
          full_name?: string
          id?: string
          municipality?: string | null
          phone_number?: string | null
          preferred_language?: string
          profile_photo?: string | null
          province?: string | null
          updated_at?: string
          ward_number?: string | null
        }
        Relationships: []
      }
      farm_fields: {
        Row: {
          area_m2: number
          area_unit: string
          boundary: Json
          created_at: string
          crop_type: string
          crop_variety: string | null
          district: string | null
          elevation: number | null
          field_name: string
          id: string
          irrigation_type: string
          is_primary: boolean
          latitude: number
          longitude: number
          municipality: string | null
          planting_date: string
          province: string | null
          soil_type: string | null
          updated_at: string
          user_id: string
          ward_number: string | null
        }
        Insert: {
          area_m2: number
          area_unit?: string
          boundary: Json
          created_at?: string
          crop_type: string
          crop_variety?: string | null
          district?: string | null
          elevation?: number | null
          field_name: string
          id?: string
          irrigation_type?: string
          is_primary?: boolean
          latitude: number
          longitude: number
          municipality?: string | null
          planting_date: string
          province?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id: string
          ward_number?: string | null
        }
        Update: {
          area_m2?: number
          area_unit?: string
          boundary?: Json
          created_at?: string
          crop_type?: string
          crop_variety?: string | null
          district?: string | null
          elevation?: number | null
          field_name?: string
          id?: string
          irrigation_type?: string
          is_primary?: boolean
          latitude?: number
          longitude?: number
          municipality?: string | null
          planting_date?: string
          province?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id?: string
          ward_number?: string | null
        }
        Relationships: []
      }
      farm_plots: {
        Row: {
          area_m2: number
          boundary: Json
          created_at: string
          device_hash: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          area_m2: number
          boundary: Json
          created_at?: string
          device_hash: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          area_m2?: number
          boundary?: Json
          created_at?: string
          device_hash?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      field_inspections: {
        Row: {
          device_hash: string
          field_id: string
          id: string
          note: string
          observed_at: string
          outcome: string
          photo: string | null
        }
        Insert: {
          device_hash: string
          field_id: string
          id?: string
          note: string
          observed_at?: string
          outcome: string
          photo?: string | null
        }
        Update: {
          device_hash?: string
          field_id?: string
          id?: string
          note?: string
          observed_at?: string
          outcome?: string
          photo?: string | null
        }
        Relationships: []
      }
      information_reports: {
        Row: {
          card_id: string
          created_at: string
          details: string
          id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          details: string
          id?: string
        }
        Update: {
          card_id?: string
          created_at?: string
          details?: string
          id?: string
        }
        Relationships: []
      }
      earth_observations: {
        Row: {
          created_at: string
          device_hash: string
          field_id: string
          id: string
          observation_end: string
          observation_start: string
          processing_version: string
          product_id: string
          product_version: string
          provenance_metadata: Json
          quality_flags: string[]
          quality_status: string
          retrieval_timestamp: string
          source_name: string
          spatial_extraction_method: string
          spatial_resolution: string
          temporal_resolution: string
          unit: string
          valid_spatial_coverage: string | null
          value: number | null
          variable_name: string
        }
        Insert: {
          created_at?: string
          device_hash: string
          field_id: string
          id?: string
          observation_end: string
          observation_start: string
          processing_version?: string
          product_id: string
          product_version?: string
          provenance_metadata?: Json
          quality_flags?: string[]
          quality_status: string
          retrieval_timestamp?: string
          source_name: string
          spatial_extraction_method?: string
          spatial_resolution: string
          temporal_resolution?: string
          unit: string
          valid_spatial_coverage?: string | null
          value?: number | null
          variable_name: string
        }
        Update: {
          created_at?: string
          device_hash?: string
          field_id?: string
          id?: string
          observation_end?: string
          observation_start?: string
          processing_version?: string
          product_id?: string
          product_version?: string
          provenance_metadata?: Json
          quality_flags?: string[]
          quality_status?: string
          retrieval_timestamp?: string
          source_name?: string
          spatial_extraction_method?: string
          spatial_resolution?: string
          temporal_resolution?: string
          unit?: string
          valid_spatial_coverage?: string | null
          value?: number | null
          variable_name?: string
        }
        Relationships: []
      }
      earth_ingestion_runs: {
        Row: {
          date_end: string | null
          date_start: string | null
          device_hash: string
          error_message: string | null
          field_id: string
          id: string
          parameters: string[]
          records_ingested: number
          retrieved_at: string
          source_name: string
          status: string
        }
        Insert: {
          date_end?: string | null
          date_start?: string | null
          device_hash: string
          error_message?: string | null
          field_id: string
          id?: string
          parameters?: string[]
          records_ingested?: number
          retrieved_at?: string
          source_name: string
          status: string
        }
        Update: {
          date_end?: string | null
          date_start?: string | null
          device_hash?: string
          error_message?: string | null
          field_id?: string
          id?: string
          parameters?: string[]
          records_ingested?: number
          retrieved_at?: string
          source_name?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_farm_plot: {
        Args: { device_token: string }
        Returns: {
          area_m2: number
          boundary: Json
          created_at: string
          id: string
          name: string
        }[]
      }
      list_inspections: {
        Args: { device_token: string; target_field: string }
        Returns: {
          date: string
          id: string
          note: string
          outcome: string
          photo: string
        }[]
      }
      save_farm_plot: {
        Args: {
          device_token: string
          plot_area: number
          plot_boundary: Json
          plot_name: string
        }
        Returns: string
      }
      save_inspection: {
        Args: {
          device_token: string
          entry_note: string
          entry_outcome: string
          entry_photo: string
          target_field: string
        }
        Returns: string
      }
      get_earth_observations: {
        Args: {
          device_token: string
          target_field: string
          end_date?: string | null
          start_date?: string | null
          target_source?: string | null
        }
        Returns: {
          field_id: string
          id: string
          observation_end: string
          observation_start: string
          product_id: string
          provenance_metadata: Json
          quality_status: string
          source_name: string
          spatial_resolution: string
          unit: string
          value: number | null
          variable_name: string
        }[]
      }
      save_earth_observations: {
        Args: {
          device_token: string
          obs_records: Json
          target_field: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
