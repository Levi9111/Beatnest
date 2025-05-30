export interface Song {
  _id: string;
  title: string;
  audioUrl: string;
  coverImageUrl: string;
  uploadedBy: { _id: string; name: string };
}
