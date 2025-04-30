import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { version } from 'os';

@Controller({
  path: 'my-list',
  version: '1',
})
export class MyListController {
  constructor() {
    // Constructor logic here
  }

  @Get()
  getList() {
    return 'This is the list';
  }

  @Post()
  addItem(item: string) {
    return `Item ${item} added to the list`;
  }

  @Delete('/item/:itemId')
  removeItem(@Param('itemId') itemId: string) {
    return `Item ${itemId} removed from the list`;
  }
}
