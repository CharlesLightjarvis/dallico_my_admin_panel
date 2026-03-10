export interface ModelltestModule {
  id: string;
  module_id: string;
  audio_url: string | null;
  is_active: boolean;
  module: {
    id: string;
    name: string;
    duration: number;
  };
}
