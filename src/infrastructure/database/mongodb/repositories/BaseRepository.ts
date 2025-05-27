import { Model } from 'mongoose';
import { BaseEntity } from '../../../../domain/entities/BaseEntity';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(private readonly model: Model<any>) {}

  async create(entity: T): Promise<void> {
    const { id, ...rest } = entity as any;
    await this.model.create(rest);
  }

  async findAll(): Promise<T[]> {
    const documents = await this.model.find().exec();
    return documents.map((doc: any) =>
      new (this.getEntityClass())(
        ...this.mapDocumentToConstructorArgs(doc)
      )
    );
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).exec();
    if (!doc) return null;

    return new (this.getEntityClass())(
      ...this.mapDocumentToConstructorArgs(doc)
    );
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  protected abstract getEntityClass(): new (...args: any[]) => T;

  protected abstract mapDocumentToConstructorArgs(doc: any): any[];
}
