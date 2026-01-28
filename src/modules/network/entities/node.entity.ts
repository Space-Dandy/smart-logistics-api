import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Network } from './network.entity';

@Entity('nodes')
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nodeId: string;

  @ManyToOne(() => Network, (network) => network.nodes, { onDelete: 'CASCADE' })
  network: Network;
}
