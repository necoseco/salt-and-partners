'use client';

import { useState } from 'react';
import { buildClient } from '@datocms/cma-client-browser';
import { useSiteSearch } from 'react-datocms';
import { Search } from 'lucide-react';

const client = buildClient({ apiToken: '03761afbd164312c009595ecee3715' });

export default function Searchbar() {
    const [query, setQuery] = useState<string>('');
    const { state, error, data } = useSiteSearch({
        client,
        initialState: { locale: 'en' },
        buildTriggerId: '32368',
        resultsPerPage: 5,
        highlightMatch: (text, key, context) =>
            context === 'title' ? (
                <strong key={key}>{text}</strong>
            ) : (
                <mark key={key}>{text}</mark>
            ),
    });

    // console.log(data)
    return (
        <div className='w-full'>

            <form
                onSubmit={(e: { preventDefault: () => void; }) => {
                    e.preventDefault();
                    state.setQuery(query);
                }}
            >
                <div
                    // onClick={() => toggleCommand()}
                    className="hover:ring-primary-300 flex h-10 w-full flex-row items-center gap-2 truncate rounded-xl border border-slate-300 pl-2 pr-2 text-left text-sm text-slate-500 outline-none hover:ring-2  dark:border-slate-700 dark:text-slate-100 "
                >
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='w-full h-full border-none focus:outline-none'
                    />
                    <button type='submit'>
                        <Search size={16} className="flex-none" />
                    </button>
                    {/* <span className="flex-1">Search Docs...</span> */}
                    {/* <kbd className="rounded-xl border border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:border-slate-500 dark:bg-slate-700 dark:text-white">
                    CTRL + K
                </kbd> */}

                </div>
            </form>
            {!data && !error && <p>Loading...</p>}
            {data && (
                <>
                    {data.pageResults.map((result) => (
                        <div key={result.id}>
                            <a href={result.url}>{result.title}</a>
                            <div>{result.bodyExcerpt}</div>
                            <div>{result.url}</div>
                        </div>
                    ))}
                    {/* <p>Total results: {data.totalResults}</p> */}
                </>
            )}
        </div>
    )
}