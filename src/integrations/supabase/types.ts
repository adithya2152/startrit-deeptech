export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      answer_votes: {
        Row: {
          answer_id: string
          created_at: string
          id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          answer_id: string
          created_at?: string
          id?: string
          user_id: string
          vote_type: string
        }
        Update: {
          answer_id?: string
          created_at?: string
          id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_votes_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "doubt_answers"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          blog_id: string | null
          bookmark_type: string
          created_at: string | null
          developer_id: string | null
          id: string
          post_id: string | null
          project_id: string | null
          task_id: string | null
          user_id: string
        }
        Insert: {
          blog_id?: string | null
          bookmark_type: string
          created_at?: string | null
          developer_id?: string | null
          id?: string
          post_id?: string | null
          project_id?: string | null
          task_id?: string | null
          user_id: string
        }
        Update: {
          blog_id?: string | null
          bookmark_type?: string
          created_at?: string | null
          developer_id?: string | null
          id?: string
          post_id?: string | null
          project_id?: string | null
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          participant_1: string
          participant_2: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1: string
          participant_2: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1?: string
          participant_2?: string
          updated_at?: string
        }
        Relationships: []
      }
      doubt_answers: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string
          doubt_id: string
          downvotes: number | null
          id: string
          updated_at: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string
          doubt_id: string
          downvotes?: number | null
          id?: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string
          doubt_id?: string
          downvotes?: number | null
          id?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doubt_answers_doubt_id_fkey"
            columns: ["doubt_id"]
            isOneToOne: false
            referencedRelation: "doubts"
            referencedColumns: ["id"]
          },
        ]
      }
      doubts: {
        Row: {
          attachments: string[] | null
          created_at: string
          description: string
          domain: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string
          description: string
          domain?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          description?: string
          domain?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          giver_id: string | null
          id: string
          is_anonymous: boolean | null
          message: string
          project_id: string | null
          rating: number
          receiver_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          giver_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          message: string
          project_id?: string | null
          rating: number
          receiver_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          giver_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string
          project_id?: string | null
          rating?: number
          receiver_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile_credentials: {
        Row: {
          created_at: string | null
          credential_id: string | null
          credential_link: string | null
          description: string | null
          does_not_expire: boolean | null
          expiry_date: string | null
          id: string
          issue_date: string
          organization: string
          profile_id: string | null
          proof_image_url: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          credential_id?: string | null
          credential_link?: string | null
          description?: string | null
          does_not_expire?: boolean | null
          expiry_date?: string | null
          id?: string
          issue_date: string
          organization: string
          profile_id?: string | null
          proof_image_url?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          credential_id?: string | null
          credential_link?: string | null
          description?: string | null
          does_not_expire?: boolean | null
          expiry_date?: string | null
          id?: string
          issue_date?: string
          organization?: string
          profile_id?: string | null
          proof_image_url?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_credentials_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_education: {
        Row: {
          created_at: string | null
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string
          id: string
          is_current: boolean | null
          profile_id: string | null
          school: string
          start_date: string
        }
        Insert: {
          created_at?: string | null
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study: string
          id?: string
          is_current?: boolean | null
          profile_id?: string | null
          school: string
          start_date: string
        }
        Update: {
          created_at?: string | null
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string
          id?: string
          is_current?: boolean | null
          profile_id?: string | null
          school?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_experience: {
        Row: {
          company: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          profile_id: string | null
          start_date: string
          title: string
        }
        Insert: {
          company: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          profile_id?: string | null
          start_date: string
          title: string
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          profile_id?: string | null
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_experience_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_languages: {
        Row: {
          created_at: string | null
          id: string
          language_name: string
          proficiency: string
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language_name: string
          proficiency: string
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language_name?: string
          proficiency?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_languages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_payment_methods: {
        Row: {
          card_cvv: string | null
          card_expiry: string | null
          card_number: string | null
          cardholder_name: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          method_type: string
          paypal_email: string | null
          profile_id: string | null
          stripe_email: string | null
          upi_id: string | null
        }
        Insert: {
          card_cvv?: string | null
          card_expiry?: string | null
          card_number?: string | null
          cardholder_name?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          method_type: string
          paypal_email?: string | null
          profile_id?: string | null
          stripe_email?: string | null
          upi_id?: string | null
        }
        Update: {
          card_cvv?: string | null
          card_expiry?: string | null
          card_number?: string | null
          cardholder_name?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          method_type?: string
          paypal_email?: string | null
          profile_id?: string | null
          stripe_email?: string | null
          upi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_payment_methods_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          profile_id: string | null
          skill_names: string[]
          subdomain: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          profile_id?: string | null
          skill_names: string[]
          subdomain?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          profile_id?: string | null
          skill_names?: string[]
          subdomain?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_social_links: {
        Row: {
          created_at: string | null
          github: string | null
          id: string
          linkedin: string | null
          other_links: string[] | null
          profile_id: string | null
          twitter: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          other_links?: string[] | null
          profile_id?: string | null
          twitter?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          other_links?: string[] | null
          profile_id?: string | null
          twitter?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_social_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          id: string
          is_completed: boolean | null
          last_name: string | null
          profile_picture_url: string | null
          public_user_id: string | null
          setup_step: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_completed?: boolean | null
          last_name?: string | null
          profile_picture_url?: string | null
          public_user_id?: string | null
          setup_step?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_completed?: boolean | null
          last_name?: string | null
          profile_picture_url?: string | null
          public_user_id?: string | null
          setup_step?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          description: string
          developer_id: string
          id: string
          project_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          description: string
          developer_id: string
          id?: string
          project_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          description?: string
          developer_id?: string
          id?: string
          project_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          developer_id: string | null
          id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          developer_id?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          developer_id?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string | null
          developer_id: string | null
          id: string
          message: string | null
          project_id: string | null
          quote_amount: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          developer_id?: string | null
          id?: string
          message?: string | null
          project_id?: string | null
          quote_amount: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          developer_id?: string | null
          id?: string
          message?: string | null
          project_id?: string | null
          quote_amount?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasklists: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: string
          tasklist_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          tasklist_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          tasklist_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_tasklist_id_fkey"
            columns: ["tasklist_id"]
            isOneToOne: false
            referencedRelation: "tasklists"
            referencedColumns: ["id"]
          },
        ]
      }
      update_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          update_id: string
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          update_id: string
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          update_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "update_comments_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "project_updates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extract_gmail_prefix: {
        Args: { email_address: string }
        Returns: string
      }
      get_or_create_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
