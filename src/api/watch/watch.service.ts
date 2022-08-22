import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICRUDService } from 'src/shared/interfaces/ICRUDService.interface';
import { IFindAllOptions } from 'src/shared/interfaces/IFindAllOptions.interface';
import { Brackets, In, Repository } from 'typeorm';
import { Watch } from './entities/watch.entity';

class WatchFindAllOptions implements IFindAllOptions {
  limit: number;
  offset: number;
  ids: string[];
  watchName?: string;
  categoryIds?: string[];
  SKU?: string;
  price?: {
    from: number;
    to?: number;
  };
}

@Injectable()
export class WatchService implements ICRUDService<Watch> {
  constructor(
    @InjectRepository(Watch)
    private readonly watchRepository: Repository<Watch>,
  ) {}
  async findById(id: string): Promise<Watch> {
    return await this.watchRepository.findOne({
      where: { watchId: id },
      relations: { brand: true, categories: true },
    });
  }
  async findAll(options: WatchFindAllOptions): Promise<[Watch[], number]> {
    const query = this.watchRepository.createQueryBuilder('watch');
    query
      .leftJoinAndSelect('watch.brand', 'brand')
      .leftJoinAndSelect('watch.categories', 'categories')
      .skip(options.offset)
      .take(options.limit);
    if (options.ids) query.andWhereInIds(options.ids);
    if (options.watchName)
      query.andWhere('watch.watchName ILIKE :name', {
        name: `%${options.watchName}%`,
      });
    if (options.categoryIds)
      query.andWhere('categories.categoryId IN (:...categoryIds)', {
        categoryIds: options.categoryIds,
      });
    if (options.price) {
      query.andWhere('watch.price >= :fromPrice', {
        fromPrice: options.price.from,
      });
      if (options.price.to)
        query.andWhere('watch.price <= :toPrice', {
          toPrice: options.price.to,
        });
    }
    if (options.SKU)
      query.andWhere('watch.SKU ILIKE :SKU', { SKU: `%${options.SKU}%` });
    return await query.getManyAndCount();
  }
  async update(value: Watch): Promise<Watch> {
    await this.watchRepository.save(value);
    return value;
  }
  async deleteById(id: string): Promise<void> {
    await this.watchRepository.delete({ watchId: id });
  }
  async deleteMany(ids: string[]): Promise<void> {
    await this.watchRepository.delete({ watchId: In(ids) });
  }
  getRepository(): Repository<Watch> {
    return this.watchRepository;
  }
  async addQuantity(id: string, quantity: number): Promise<void> {
    await this.watchRepository.update(
      { watchId: id },
      { quantity: () => `quantity + ${quantity}` },
    );
  }
  async related(
    id: string,
    limit: number,
    offset: number,
  ): Promise<[Watch[], number]> {
    const watch = await this.findById(id);
    const query = this.watchRepository
      .createQueryBuilder('watch')
      .leftJoinAndSelect('watch.brand', 'brand')
      .leftJoinAndSelect('watch.categories', 'categories');
    query.andWhere(
      new Brackets((qb) => {
        if (watch.categories.length > 0)
          qb.where('categories.categoryId IN (:...categoryIds)', {
            categoryIds: watch.categories.map(
              (category) => category.categoryId,
            ),
          });
        if (watch.brand)
          qb.orWhere('brand.brandId  = :brandId', {
            brandId: watch.brand.brandId,
          });
        return qb;
      }),
    );
    query.andWhere('watch.watchId <> :watchId', { watchId: id });
    query.skip(offset).take(limit);

    return await query.getManyAndCount();
  }
}
