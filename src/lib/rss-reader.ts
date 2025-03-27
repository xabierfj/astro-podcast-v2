import { Truncate, FormattedDate } from "./utils";
import Parser from "rss-parser";
import podcastInfo from './podcast-info';

const parser = new Parser();
const feed = await parser.parseURL(podcastInfo.rssFeed);

export const episodes = feed.items.map((item) => {
  const mediaLink = item.enclosure as { url: string, type: string };
  const duration = item.itunes.duration;
  const image = item.itunes.image;
  const episodeSlug = item.title;
  return {
    title: item.title,
    slug: episodeSlug,
    description: Truncate(item.contentSnippet, 260),
    guid: { text: item.guid },
    publishDate: FormattedDate(item.pubDate as string),
    enclosure: { url: mediaLink.url, type: mediaLink.type },
    duration: duration,
    image: image,
  };
});