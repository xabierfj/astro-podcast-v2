export type Host = {
  name: string;
  img: string;
  bluesky: string;
}

export type PodcastInfo = {
  title: string; 
  description: string;
  hosts: Array<Host>;
  platforms: {
    spotify: string;
    ivox: string;
    kofi: string;
    bluesky: string;
    instagram: string;
  };
  rssFeed: string;
}

export const podcastInfo = (config: PodcastInfo) => config;

export default podcastInfo({
  title:'Proletario y Parasito',
  description:'El podcast que no predijeron los Simpsons. Si eres de los que todo te sale a pedir de Milhouse, este es tu podcast.',
  hosts: [
    {
      name: 'Carlos Noroeste',
      img: "/carlos.webp",
      bluesky: 'https://bsky.app/profile/carlosnoroeste.bsky.social',
    },
    {
      name: 'Alberto Graupera',
      img: "/alberto.webp",
      bluesky: 'https://bsky.app/profile/albertograupera.bsky.social',
    }
  ],
  platforms: {
    spotify: 'https://open.spotify.com/show/5Ktro3IjduD1HTe13yq2k1',
    ivox: 'https://www.ivoox.com/podcast-proletario-parasito_sq_f11573515_1.html',
    kofi: 'https://ko-fi.com/proletarioyparasito',
    bluesky: 'https://bsky.app/profile/pyppodcast.bsky.social',
    instagram: 'https://www.instagram.com/proletarioyparasitopodcast/'
  },
  rssFeed: 'https://anchor.fm/s/fae337f8/podcast/rss'
});