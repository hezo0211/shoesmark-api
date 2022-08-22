import { Exclude, Expose } from 'class-transformer';
import { Watch } from 'src/api/watch/entities/watch.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';

@Exclude()
@Entity()
export class OrderDetail {
  @Expose()
  @PrimaryColumn('uuid')
  orderId: string;

  @Expose()
  @PrimaryColumn('uuid')
  watchId: string;

  @Expose()
  @ManyToOne(() => Order, (order) => order.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'orderId',
  })
  order: Order;

  @Expose()
  @ManyToOne(() => Watch)
  @JoinColumn({
    name: 'watchId',
  })
  watch: Watch;

  @Expose()
  @Column()
  quantity: number;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Expose()
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  sale: number;
}
