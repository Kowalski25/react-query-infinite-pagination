import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchItems } from './api/items';
import './App.css';

function App() {
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['items'],
      queryFn: fetchItems,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return status === 'pending' ? (
    <div>
      <p className='loadingIndicator'>Loading items...</p>
    </div>
  ) : status === 'error' ? (
    <div>{error?.message}</div>
  ) : (
    <div>
      {data.pages.map((page) => {
        return (
          <div key={page.currentPage}>
            {page.data.map((item) => {
              return (
                <div key={item.id} className='item'>
                  {item.name}
                </div>
              );
            })}
          </div>
        );
      })}

      <div ref={ref}>
        {isFetchingNextPage && (
          <p className='loadingIndicator'>Fetching more items...</p>
        )}
      </div>
    </div>
  );
}

export default App;
