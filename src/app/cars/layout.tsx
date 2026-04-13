import React from 'react';
import { FC } from 'react';

interface IProps {
  children: React.ReactNode;
}

const CarsLayout: FC<IProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default CarsLayout;
