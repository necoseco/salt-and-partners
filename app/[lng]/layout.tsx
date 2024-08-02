import ScrollToTop from '@/components/ScrollToTop';
import 'node_modules/react-modal-video/css/modal-video.css';
import '@/styles/global.css';
import { draftMode } from 'next/headers';
import { CustomColorDocument, SiteLocale } from '@/graphql/generated';
import getAvailableLocales from '@/app/i18n/settings';
import CustomColor from '@/components/Common/CustomColor';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { performRequest } from '../lib/datocms';
import type { Metadata } from 'next';

type Params = {
  children: React.ReactNode;
  params: {
    lng: SiteLocale;
  };
};

export async function generateStaticParams() {
  const languages = await getAvailableLocales();
  return languages.map((language) => {
    return { params: { lng: language } };
  });
}

const GENERAL_CONTENT_QUERY = `
  query TagQuery {
    site: _site {
      favicon: faviconMetaTags {
        ...metaTagsFragment
      }
      globalSeo {
        siteName
        facebookPageUrl
        titleSuffix
        twitterAccount
      }
    }
  }
  fragment metaTagsFragment on Tag {
    attributes
    content
    tag
  }
`;

async function getSiteData() {
  const { site } = await performRequest({ query: GENERAL_CONTENT_QUERY });
  // console.log(site)
  return site;
}

export const metadata: Metadata = (await getSiteData()) ? {
  title: (await getSiteData()).globalSeo.titleSuffix,
  icons: (await getSiteData()).favicon.map((item:any) => ({
    rel: item.attributes.rel,
    type: item.attributes.type,
    sizes: item.attributes.sizes,
    url: item.attributes.href,
  })),
  description: "Welcome to Salt & Partners - Global Expertise, Local Excellence: Your Legal Partners Across Borders",
  metadataBase: new URL("https://saltandpartners.com")
} : {};

export default async function RootLayout({
  children,
  params: { lng },
}: Params) {
  const { isEnabled } = draftMode();
  const data = await queryDatoCMS(CustomColorDocument, {}, isEnabled);
  return (
    <>
      <CustomColor
        r={data.layout?.mainColor.red || 74}
        g={data.layout?.mainColor.green || 247}
        b={data.layout?.mainColor.blue || 108}
      />
      {children}
      <ScrollToTop lng={lng} isDraft={isEnabled} />
    </>
  );
}
