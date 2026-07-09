export interface CreateOrdersDto {
  id: number;
  orderCreator: string;
  firstPrice: number;
  orderWorker: number;
  lastPrice: number;
  materialPrice: number;
  title: string;
  description: string;
  types: Array<number>;
  orderStatus: number;
  createdAt?: Date;
}

export interface OrdersRequestDto {
  titleName: string;
  types: Array<number>;
  price: number;
  descriptions: string;
  orderCreator: number;
}
