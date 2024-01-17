'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Неизвестная ошибка';

  return <p className="text-red-500 text-xl">{message}</p>;
};

const ErrorPage = () => {
  return (
    <div className="flex justify-center items-center">
      <Suspense>
        <ErrorContent />
      </Suspense>
    </div>
  );
};

export default ErrorPage;
