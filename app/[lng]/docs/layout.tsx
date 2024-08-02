import '@/styles/global.css';
import { draftMode } from 'next/headers';
import {
  DocumentationPageRecord,
  DocumentationSidebarDocument,
  SiteLocale,
} from '@/graphql/generated';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Image from 'next/image';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { notFound } from 'next/navigation';
import DocumentationSidebarItem from '@/components/Documentaiton/DocumentationSidebarItem';
import Searchbar from '@/components/Searchbar/Searchbar';
import Header from '@/components/Header';
import HeaderRenderer from '@/components/Header/HeaderRenderer';

type Params = {
  children: React.ReactNode;
  params: {
    lng: SiteLocale;
  };
};

export default async function RootLayout({
  children,
  params: { lng },
}: Params) {
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(DocumentationSidebarDocument, {}, isEnabled);

  if (!data || !data.allDocumentationPages.length || !data.documentationHome)
    notFound();

  return (
    <div>

      <div className="fixed z-50 hidden w-1/4 flex-col justify-between border-e bg-white lg:flex h-full overflow-y-scroll">
        <div className="px-4 py-6">
          <div className="w-60 max-w-full px-4 xl:mr-12">
            <Link
              href={'/' + lng + '/home'}
              className={`header-logo block w-full`}
            >
              <Image
                src={data.documentationHome.logo.url}
                alt="logo"
                width={data.documentationHome.logo.width || 140}
                height={data.documentationHome.logo.height || 30}
                className="w-full dark:hidden"
              />
            </Link>
          </div>
          <div className="mx-auto flex max-w-xl flex-col justify-center gap-2 pt-8 md:flex-row">
            <Searchbar />
          </div>
          <ul className="mt-6 space-y-1">
            {data.allDocumentationPages.map((page) => {
              return (
                <DocumentationSidebarItem
                  key={page.id}
                  page={page as DocumentationPageRecord}
                  lng={lng}
                />
              );
            })}
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 z-40 border-b border-t border-gray-100 bg-white p-8">
          <div>
            <p className="text-sm">{data.documentationHome.footerText}</p>
          </div>
        </div>
      </div>
      <HeaderRenderer lng={lng} isDraft={isEnabled} docs={true} />
      <div className="ml-0 lg:ml-[25%] ">{children}</div>
    </div>
  );
}
