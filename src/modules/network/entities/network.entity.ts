import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Edge } from './edge.entitity';
import { Node } from './node.entity';
@Entity('networks')
export class Network {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Node, (node) => node.network, { cascade: true })
  nodes: Node[];

  @OneToMany(() => Edge, (edge) => edge.network, { cascade: true })
  edges: Edge[];

  @CreateDateColumn()
  createdAt: Date;
}
