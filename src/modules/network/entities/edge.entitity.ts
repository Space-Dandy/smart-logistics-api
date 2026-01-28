import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Network } from './network.entity';

@Entity('edges')
export class Edge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @ManyToOne(() => Network, (network) => network.edges, { onDelete: 'CASCADE' })
  network: Network;
}
