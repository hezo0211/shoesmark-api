import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JsonCollection } from 'src/shared/JsonCollection';
import { JsonEntity } from 'src/shared/JsonEntity';
import { CreateWatchDto } from './dtos/bodies/createShoes.dto';
import { WatchParamDto } from './dtos/params/watchParam.dto';
import { GetWatchDto } from './dtos/queries/getWatch.dto';
import { WatchService } from './watch.service';
import * as fs from 'fs';
import { Express } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Watch } from './entities/watch.entity';
import { Brand } from '../brand/entities/brand.entity';
import { JsonAction } from 'src/shared/JsonAction';
import { EditWatchDto } from './dtos/bodies/editShoes.dto';
import { isDefined } from 'class-validator';
import { Category } from '../category/entities/category.entity';
import { DeleteManyWatchDto } from './dtos/bodies/deleteManyShoes.dto';
import { GetRelatedDto } from './dtos/queries/getRelated.dto';

@ApiTags('Watch')
@Controller('watch')
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @Get()
  async getShoes(@Query() getShoesDto: GetWatchDto) {
    const { limit, offset, ids, ...rest } = getShoesDto;
    const data = await this.watchService.findAll({
      limit,
      offset,
      ids,
      ...rest,
    });
    return new JsonCollection(data[0])
      .setLimit(limit)
      .setOffset(offset)
      .setTotal(data[1]);
  }
  @Get('related')
  async getRelated(@Query() getRelated: GetRelatedDto) {
    const data = await this.watchService.related(
      getRelated.watchId,
      getRelated.limit,
      getRelated.offset,
    );
    return new JsonCollection(data[0])
      .setLimit(getRelated.limit)
      .setOffset(getRelated.offset)
      .setTotal(data[1]);
  }
  @Get(':id')
  async getWatchById(@Param() watchParamDto: WatchParamDto) {
    const data = await this.watchService.findById(watchParamDto.id);
    return new JsonEntity(data);
  }
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('watchImage'))
  async createWatch(
    @Body() createWatchDto: CreateWatchDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileType = file.mimetype.match(/^.*\/(.*)/i)[1];
    const newPath = file.path + '.' + fileType;
    fs.renameSync(file.path, newPath);

    const watch = plainToInstance(Watch, createWatchDto);

    const brand = new Brand();
    brand.brandId = createWatchDto.brandId;
    watch.brand = brand;

    watch.watchImage = newPath.replace('\\', '/');

    watch.categories = createWatchDto.categories.map((categoryId) =>
      plainToInstance(Category, { categoryId: categoryId }),
    );

    await this.watchService.update(watch);
    return new JsonEntity(instanceToPlain(watch));
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('watchImage'))
  async editWatch(
    @Param() watchParamDto: WatchParamDto,
    @Body() editWatchDto: EditWatchDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let watch = await this.watchService.findById(watchParamDto.id);
    watch = plainToInstance(Watch, { ...watch, ...editWatchDto });

    const brand = new Brand();
    brand.brandId = editWatchDto.brandId;
    watch.brand = brand;

    watch.categories = editWatchDto.categories.map((categoryId) =>
      plainToInstance(Category, { categoryId: categoryId }),
    );

    if (isDefined(file)) {
      const fileType = file.mimetype.match(/^.*\/(.*)/i)[1];
      const newPath = file.path + '.' + fileType;
      fs.renameSync(file.path, newPath);

      watch.watchImage = newPath.replace('\\', '/');
    }
    await this.watchService.update(watch);
    return new JsonEntity(watch);
  }

  @Delete(':id')
  async deleteWatch(@Param() watchParamDto: WatchParamDto) {
    await this.watchService.deleteById(watchParamDto.id);
    return new JsonAction();
  }

  @Delete()
  async deleteManyWatch(@Body() deleteManyWatchDto: DeleteManyWatchDto) {
    await this.watchService.deleteMany(deleteManyWatchDto.ids);
    return new JsonAction();
  }
}
