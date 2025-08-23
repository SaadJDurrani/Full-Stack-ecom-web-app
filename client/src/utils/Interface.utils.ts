import type { ReactNode } from "react";

export interface ProductProps {
  id: string;
  title: string;
  description:string;
  image: string;
  price: number;
  category: string;
  stock:string;
}
export type TCartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type TSignup ={
  name:string;
  email:string;
  password:string
}
export type TSignupForm ={
  name:string;
  email:string;
  password:string
  confirmPassword:string
}

export type TLogin={
  email:string,
  password:string
}




export type CartItem = {
  id: string;         // cart_items.id
  cart_id?: string;
  product_id: string;
  quantity: number;
  title?: string;     // joined from products
  image?: string;
  price?: number;
};

export type GuardProp = {
  children: ReactNode;
};

export interface TUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TOrder {
  id: string;
  user_id: string;
  total: number;
  status: string;
}


export interface DecodedToken {
  exp: number;
  role?: string;
}