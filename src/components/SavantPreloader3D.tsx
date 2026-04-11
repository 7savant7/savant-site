import React from 'react';
import Preloader from './Preloader';

type Props = {
  onComplete?: () => void;
};

export default function SavantPreloader3D({ onComplete }: Props) {
  return <Preloader onComplete={onComplete} />;
}
