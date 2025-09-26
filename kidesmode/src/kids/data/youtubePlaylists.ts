export interface YouTubePlaylist {
  id: string;
  title: string;
  coverFallback: string;
}

export const YT_PLAYLISTS: YouTubePlaylist[] = [
  { 
    id: "PL3CC0DF43F5C8814F", 
    title: "قصص تعليمية 1", 
    coverFallback: "/placeholders/story-yt1.svg" 
  },
  { 
    id: "PLC26PqZoC0AkS5f-GnxIzYs1yiBK7c4wW", 
    title: "قصص تعليمية 2", 
    coverFallback: "/placeholders/story-yt2.svg" 
  }
];
