export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      post: {
        Row: {
          comments: number[] | null
          created_at: string
          created_by: number
          id: number
          likes: number | null
          photo: string | null
          prompt: string | null
        }
        Insert: {
          comments?: number[] | null
          created_at?: string
          created_by: number
          id?: number
          likes?: number | null
          photo?: string | null
          prompt?: string | null
        }
        Update: {
          comments?: number[] | null
          created_at?: string
          created_by?: number
          id?: number
          likes?: number | null
          photo?: string | null
          prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          avatar: string | null
          created_at: string
          email: string | null
          id: number
          name: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
