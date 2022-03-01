export interface Notification {
  id: string;
  clicked: boolean;
  created_at: Date;
  entity_id: string;
  entity_photo: string;
  metadata: any;
  photoUrl: string;
  seen_at: Date;
  type: string;
}
