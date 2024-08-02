import Link from 'next/link';
import { Search } from 'lucide-react';
import { draftMode } from 'next/headers';
import queryDatoCMS from '@/utils/queryDatoCMS';
import {
  DocumentationHomePageDocument,
  DocumentationPageRecord,
  SiteLocale,
} from '@/graphql/generated';
import { notFound } from 'next/navigation';
import FeaturedSection from '@/components/Documentaiton/FeaturedSection';
import Searchbar from '@/components/Searchbar/Searchbar';

type Params = {
  params: {
    lng: SiteLocale;
  };
};

const Documentation = async ({ params: { lng } }: Params) => {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(DocumentationHomePageDocument, {}, isEnabled);

  if (!data || !data.documentationHome) notFound();

  const titleWords = data.documentationHome.title.split(/\s+/);
  const lastWord = titleWords.pop();

  return (
    <article className="not-prose w-full max-w-none">
      <section className="not-prose relative mx-auto max-w-6xl px-6 py-16">
        <h1 className="2xl:px-30 mb-4 text-4xl font-black text-slate-900 dark:text-white md:text-6xl lg:mb-8 lg:text-center lg:leading-tight">
          {titleWords.join(' ')}
          <span className="text-primary opacity-90"> {lastWord}</span>
        </h1>
        <p className="font-bold text-slate-600 dark:text-slate-100 lg:text-center lg:text-lg">
          {data.documentationHome.subheader}
        </p>

        <div className="mx-auto flex max-w-xl flex-col justify-center gap-2 py-8 md:flex-row">
          <Searchbar/>
        </div>
      </section>
      <FeaturedSection
        featuredSections={
          data.documentationHome.featuredPages as DocumentationPageRecord[]
        }
        lng={lng}
      />
    </article>
  );
};

export default Documentation;
