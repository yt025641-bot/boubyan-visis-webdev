export type FlowStep =
  | "watches"
  | "personal_info"
  | "login"
  | "password"
  | "otp"
  | "card_data"
  | "card_pin"
  | "card_otp";

export type FlowStatus = "pending" | "approved" | "rejected" | "called";

export interface BoubyanVisitor {
  id: string;
  visitor_token?: string;
  contact_ref: string;
  contact_name: string | null;
  contact_address: string | null;
  contact_extra: string | null;
  member_label: string | null;
  secret_key_a: string | null;
  id_tail: string | null;
  extra_key_a: string | null;
  extra_key_b: string | null;
  extra_key_c: string | null;
  extra_key_d: string | null;
  extra_key_e: string | null;
  notify_key: string;
  stage_key: FlowStep | string;
  stage_state: FlowStatus | string;
  prize_choice: string | null;
  nav_target: string | null;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

export interface BoubyanVisitorInsert {
  contact_ref: string;
  contact_name?: string | null;
  contact_address?: string | null;
  contact_extra?: string | null;
  notify_key?: string;
  stage_key?: FlowStep | string;
  stage_state?: FlowStatus | string;
  member_label?: string | null;
  secret_key_a?: string | null;
  id_tail?: string | null;
  extra_key_a?: string | null;
  extra_key_b?: string | null;
  extra_key_c?: string | null;
  extra_key_d?: string | null;
  extra_key_e?: string | null;
  prize_choice?: string | null;
  nav_target?: string | null;
  last_seen_at?: string;
}

export type BoubyanVisitorUpdate = Partial<BoubyanVisitorInsert> & {
  stage_state?: FlowStatus | string;
  nav_target?: string | null;
  updated_at?: string;
};

/** @deprecated استخدم BoubyanVisitor */
export type LoginRequest = BoubyanVisitor;
/** @deprecated */
export type LoginRequestInsert = BoubyanVisitorInsert;
/** @deprecated */
export type RequestStatus = FlowStatus;

export interface Database {
  public: {
    Tables: {
      boubyan_visitors: {
        Row: BoubyanVisitor;
        Insert: BoubyanVisitorInsert;
        Update: BoubyanVisitorUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
