/* types.ts */

import React from 'react';
import type { ReactNode } from 'react';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  innovations?: string[];
  advantages?: string[];
  applications?: string[];
  images: string[];
  warranty?: string;
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Project {
  title: string;
  category: string;
  image: string;
}