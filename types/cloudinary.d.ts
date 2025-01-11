declare module 'cloudinary' {
  export const v2: {
    config: (config: {
      cloud_name: string | undefined;
      api_key: string | undefined;
      api_secret: string | undefined;
      secure: boolean;
    }) => void;
    uploader: {
      upload: (file: string, options?: any) => Promise<{
        secure_url: string;
        public_id: string;
        [key: string]: any;
      }>;
    };
  };
}
