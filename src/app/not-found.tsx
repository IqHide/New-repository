'use client';

import { Button, Card, CardBody } from '@heroui/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center py-12 px-6">
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-blue-500 mb-2">404</h1>
          </div>

          <h2 className="text-2xl font-semibold mb-2 text-foreground">Страница не найдена</h2>

          <p className="text-default-500 mb-0">Похоже, что ты пидор (состоишь в BMW клубе)</p>
          <p className="text-default-500 mb-8">
            <Image
              src="/BMW-Logo.png"
              alt="BMW-Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
            Поэтому ты, как обычно, свернул не туда
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as={Link} color="primary" href="/" size="lg" className="font-semibold">
              Вернуться на главную
            </Button>

            <Button
              color="default"
              variant="flat"
              size="lg"
              onPress={() => router.back()}
              className="font-semibold"
            >
              Назад
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default NotFound;
