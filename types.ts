
import React from 'react';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  innovations?: string[];
  advantages?: string[];
  applications?: string[];
  image: string;
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