// src/tv-shows/tv-show.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { TVShowRepository } from './tv-show.repository';
import { TVShow, TVShowDocument } from './schema/tv-show.schema';

@Injectable()
export class TVShowService {
  constructor(private readonly tvShowRepository: TVShowRepository) {}

  async createTVShow(tvShowData: Partial<TVShow>): Promise<TVShow> {
    return this.tvShowRepository.create(tvShowData);
  }

  async getAllTVShows(): Promise<TVShowDocument[]> {
    return this.tvShowRepository.findAll();
  }

  async getTVShowById(id: string): Promise<TVShowDocument> {
    const tvShow = await this.tvShowRepository.findById(id);
    if (!tvShow) {
      throw new NotFoundException(`TV Show with ID ${id} not found`);
    }
    return tvShow;
  }

  async updateTVShow(
    id: string,
    updateData: Partial<TVShow>,
  ): Promise<TVShowDocument> {
    const updated = await this.tvShowRepository.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundException(`TV Show with ID ${id} not found`);
    }
    return updated;
  }

  async deleteTVShow(id: string): Promise<void> {
    const tvShow = await this.tvShowRepository.findById(id);
    if (!tvShow) {
      throw new NotFoundException(`TV Show with ID ${id} not found`);
    }
    await this.tvShowRepository.deleteById(id);
  }
}
