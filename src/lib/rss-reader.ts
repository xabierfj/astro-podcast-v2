import { FormattedDate, TitleBeautifier,Slugify } from "./utils";
import Parser from "rss-parser";
import podcastInfo from './podcast-info';

const parser = new Parser();
const feed = await parser.parseURL(podcastInfo.rssFeed);

export const episodes = feed.items.map((item) => {
  const mediaLink = item.enclosure as { url: string, type: string };
  const duration = item.itunes.duration;
  const image = item.itunes.image;
  const episodeSlug = Slugify(item.title ?? '');
  return {
    title: TitleBeautifier(item.title ?? ''),
    slug: episodeSlug,
    description: item.contentSnippet,
    guid: { text: item.guid },
    publishDate: FormattedDate(item.pubDate as string),
    enclosure: { url: mediaLink.url, type: mediaLink.type },
    duration: duration,
    image: image,
  };
});